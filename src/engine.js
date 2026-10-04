EXP.Engine = (() => {
  const matches = new Map();
  const listeners = new Set();
  const metrics = { scans: 0, batches: 0, nodes: 0, candidates: 0, rendered: 0, detached: 0, lastDurationMs: 0 };
  const decisions = { 'eligible-explicit': 0, 'eligible-supported': 0, 'review-ambiguous': 0, 'blocked-negative': 0 };
  let routeEpoch = 1;
  let sequence = 0;
  let currentIndex = -1;
  let temporarilyHidden = false;
  let settings = null;
  let active = false;
  let currentHref = location.href;
  const recovery=ExtraPotionsCore.createRecoveryGuard();
  function guardedScan(run,force=false) {
    if(ExtraPotionsCore.suiteSitePaused())return false;
    const effective=EXP.Settings.effective();
    if(!active||!effective.enabled||effective.safeMode||effective.excluded)return run();
    if(!force&&recovery.snapshot('scan',currentHref).suspended)return false;
    try {const result=run();recovery.succeeded('scan',currentHref);return result;}
    catch(error){if(force)throw error;recovery.failed('scan',currentHref);EXP.Core.safeError(error,'prisma.scan');notify();return false;}
  }
  function retry(){return recovery.retry('scan',currentHref,()=>{const value=EXP.Settings.effective();if(!active||!value.enabled||value.safeMode||value.excluded||ExtraPotionsCore.suiteSitePaused())return false;return guardedScan(()=>rebuildUnprotected('retry'),true);});}
  const ignoredSelector = ['script', 'style', 'noscript', 'template', 'textarea', 'input', 'select', 'option', 'button', 'pre', 'code', '[contenteditable]', '[inert]', '[hidden]', '[aria-hidden="true"]', '[data-exp-owned="1"]'].join(',');
  const notify = () => {
    const value = snapshot();
    globalThis.ExtraPotionsCore?.publishSuiteState?.('prisma', 'prisma.state-changed', {
      status: value.status,
      total: value.total,
      temporarilyHidden: Boolean(value.temporarilyHidden),
    });
    for (const listener of listeners) listener(value);
  };
  const isIgnored = (node) => Boolean(
    node?.parentElement?.closest(ignoredSelector) ||
    globalThis.ExtraPotionsCore?.isPresentationSuppressed?.(node?.parentElement)
  );
  function resetDecisionCounts() { for (const key of Object.keys(decisions)) decisions[key] = 0; }
  function addDecisions(value) { for (const [key, count] of Object.entries(value)) decisions[key] += count; }
  function createRecord(candidate, element) {
    const record = Object.freeze({
      matchId: `r${routeEpoch}-m${++sequence}`,
      identityId: candidate.identity.id,
      termId: candidate.term.id,
      decisionBand: candidate.decisionBand,
      ruleIds: candidate.ruleIds,
      routeEpoch,
      element
    });
    matches.set(record.matchId, record);
    return record;
  }
  function processText(node) {
    if (!node?.isConnected || !node.nodeValue?.trim() || isIgnored(node)) return;
    metrics.nodes += 1;
    const result = EXP.Matcher.find(node.nodeValue, settings);
    addDecisions(result.decisions);
    metrics.candidates += Object.values(result.decisions).reduce((sum, value) => sum + value, 0);
    if (result.eligible.length) {
      const records = EXP.Renderer.wrap(node, result.eligible, settings, createRecord);
      metrics.rendered += records.length;
    }
  }
  function collectRoots(root) {
    const roots = [root];
    const base = root?.querySelectorAll ? root : null;
    if (base) for (const element of base.querySelectorAll('*')) if (element.shadowRoot) roots.push(element.shadowRoot);
    return roots;
  }
  function scanRoot(root) {
    if (!root?.isConnected && !(root instanceof ShadowRoot)) return;
    for (const scan of collectRoots(root)) {
      EXP.Renderer.ensureStyle(scan.getRootNode ? scan.getRootNode() : document);
      if (scan.nodeType === Node.TEXT_NODE) processText(scan);
      else {
        const walker = document.createTreeWalker(scan, NodeFilter.SHOW_TEXT, { acceptNode: (node) => isIgnored(node) || !node.nodeValue?.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT });
        const nodes = [];
        let node;
        while ((node = walker.nextNode())) nodes.push(node);
        for (const text of nodes) processText(text);
      }
    }
  }
  function prune() {
    for (const [id, record] of matches) if (!record.element.isConnected) { matches.delete(id); metrics.detached += 1; }
    if (currentIndex >= matches.size) currentIndex = matches.size - 1;
  }
  function canRun(value = settings) { return active && value?.enabled && !value.safeMode && !value.excluded && EXP.Catalog.status().valid; }
  function processBatch(roots) {return guardedScan(()=>processBatchUnprotected(roots));}
  function processBatchUnprotected(roots) {
    if (location.href !== currentHref) { navigation(); return; }
    const started = performance.now();
    metrics.batches += 1;
    prune();
    if (!canRun()) { notify(); return; }
    for (const root of roots) scanRoot(root);
    metrics.lastDurationMs = Math.round((performance.now() - started) * 10) / 10;
    notify();
  }
  function rebuild(reason = 'rebuild') {return guardedScan(()=>rebuildUnprotected(reason));}
  function rebuildUnprotected(reason = 'rebuild') {
    const started = performance.now();
    EXP.Renderer.clear();
    matches.clear();
    currentIndex = -1;
    sequence = 0;
    resetDecisionCounts();
    metrics.nodes = 0; metrics.candidates = 0; metrics.rendered = 0;
    EXP.Matcher.reset();
    settings = EXP.Settings.effective();
    EXP.Renderer.setHidden(temporarilyHidden);
    if (canRun() && document.body) scanRoot(document.body);
    metrics.scans += 1;
    metrics.lastDurationMs = Math.round((performance.now() - started) * 10) / 10;
    notify();
    return reason;
  }
  function navigation() { recovery.clearContext(currentHref);currentHref = location.href; routeEpoch += 1; temporarilyHidden = false; rebuild('navigation'); }
  function ordered() { prune(); return [...matches.values()].sort((left, right) => { if (left.element === right.element) return 0; return left.element.compareDocumentPosition(right.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1; }); }
  function navigate(delta) {
    const list = ordered();
    if (!list.length) return null;
    currentIndex = (currentIndex + delta + list.length) % list.length;
    const record = list[currentIndex];
    EXP.Renderer.focus(record);
    notify();
    return { record, position: currentIndex + 1, total: list.length };
  }
  function navigateTo(matchId) {
    const list = ordered();
    const index = list.findIndex((record) => record.matchId === matchId);
    if (index < 0) return null;
    currentIndex = index;
    EXP.Renderer.focus(list[index]);
    notify();
    return { record: list[index], position: index + 1, total: list.length };
  }
  function explain(matchId) {
    const record = matches.get(matchId);
    if (!record?.element?.isConnected) return null;
    const identity = EXP.Catalog.get(record.identityId);
    if (!identity) return null;
    const term = identity.terms.find(item => item.id === record.termId);
    return Object.freeze({ matchId:record.matchId, text:record.element.textContent || '', identity, term, decisionBand:record.decisionBand, ruleIds:[...record.ruleIds], routeEpoch:record.routeEpoch });
  }
  function summary() { const totals = {}; for (const record of matches.values()) totals[record.identityId] = (totals[record.identityId] || 0) + 1; return totals; }
  function snapshot(options = {}) {
    prune();
    const state = settings || EXP.Settings.effective();
    return Object.freeze({
      status: !EXP.Catalog.status().valid ? 'catalog-invalid' : state.safeMode ? 'safe-mode' : state.excluded ? 'excluded' : !state.enabled ? 'disabled' : active ? 'ready' : 'stopped',
      recovery:recovery.snapshot('scan',currentHref),routeEpoch, total: matches.size, summary: summary(), decisions: { ...decisions }, metrics: { ...metrics }, currentIndex,
      temporarilyHidden, matches: ordered().map((record) => ({ matchId: record.matchId, identityId: record.identityId, ...(options.includeMatchText ? { text: record.element.textContent || '' } : {}) }))
    });
  }
  function setTemporaryHidden(value) { temporarilyHidden = Boolean(value); EXP.Renderer.setHidden(temporarilyHidden); notify(); }
  function start() { active = true; settings = EXP.Settings.effective(); rebuild('start'); }
  function stop() { active = false; EXP.Renderer.clear(); matches.clear(); notify(); }
  function cleanup() { stop(); EXP.Renderer.cleanup(); listeners.clear(); }
  return Object.freeze({ retry, start, stop, cleanup, rebuild, navigation, processBatch, snapshot, explain, navigateNext: () => navigate(1), navigatePrevious: () => navigate(-1), navigateTo, setTemporaryHidden, highlightAll: () => setTemporaryHidden(false), subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); } });
})();
