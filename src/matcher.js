EXP.Matcher = (() => {
  const escape = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const wordLike = /[\p{L}\p{N}\p{M}_]/u;
  let cacheKey = '';
  let expression = null;
  let lookup = new Map();
  const counts = () => ({ 'eligible-explicit': 0, 'eligible-supported': 0, 'review-ambiguous': 0, 'blocked-negative': 0 });
  function compile(settings) {
    const disabled = new Set(settings.disabledIdentities || []);
    const key = [...disabled].sort().join('|');
    if (key === cacheKey && expression) return;
    cacheKey = key;
    lookup = new Map();
    for (const [term, records] of EXP.Catalog.termMap) {
      const enabled = records.filter(({ identity }) => !disabled.has(identity.id));
      if (enabled.length) lookup.set(term, enabled);
    }
    const alternatives = [...lookup.keys()].sort((left, right) => right.length - left.length).map(escape);
    expression = alternatives.length ? new RegExp(alternatives.join('|'), 'giu') : null;
  }
  function boundary(text, start, end) {
    const before = start > 0 ? text[start - 1] : '';
    const after = end < text.length ? text[end] : '';
    return (!before || !wordLike.test(before)) && (!after || !wordLike.test(after));
  }
  function evaluate(record, sourceText, start, end, settings) {
    const { term } = record;
    if (term.decisionFloor === 'explicit') return { band: 'eligible-explicit', rules: ['TERM_EXPLICIT'] };
    const windowStart = Math.max(0, start - 96);
    const windowEnd = Math.min(sourceText.length, end + 96);
    const context = EXP.Catalog.normalize(`${sourceText.slice(windowStart, start)} ${sourceText.slice(end, windowEnd)}`);
    const hasPositive = settings.surroundingContext && EXP.Catalog.positiveWords.some((word) => context.includes(word));
    const hasNegative = settings.ambiguityProtection && term.negatives.some((word) => context.includes(word));
    if (hasNegative) return { band: 'blocked-negative', rules: [term.contextRuleId, 'NEGATIVE_CONTEXT'] };
    if (hasPositive) return { band: 'eligible-supported', rules: [term.contextRuleId, 'POSITIVE_CONTEXT'] };
    if (settings.matcherMode === 'inclusive' && term.allowInclusive) return { band: 'eligible-supported', rules: [term.contextRuleId, 'INCLUSIVE_OPT_IN'] };
    return { band: 'review-ambiguous', rules: [term.contextRuleId, settings.surroundingContext ? 'SUPPORT_MISSING' : 'CONTEXT_DISABLED'] };
  }
  function find(text, settings) {
    compile(settings);
    const decisions = counts();
    if (!expression || !text) return { eligible: [], decisions };
    expression.lastIndex = 0;
    const eligible = [];
    for (const match of text.matchAll(expression)) {
      const start = match.index;
      const end = start + match[0].length;
      if (!boundary(text, start, end)) continue;
      const records = lookup.get(EXP.Catalog.normalize(match[0])) || [];
      if (records.length !== 1) { decisions['blocked-negative'] += 1; continue; }
      const result = evaluate(records[0], text, start, end, settings);
      decisions[result.band] += 1;
      const allowed = result.band === 'eligible-explicit' || result.band === 'eligible-supported';
      if (allowed && (settings.matcherMode !== 'strict' || result.band === 'eligible-explicit')) eligible.push(Object.freeze({ ...records[0], start, end, source: match[0], decisionBand: result.band, ruleIds: Object.freeze(result.rules) }));
    }
    return { eligible, decisions };
  }
  return Object.freeze({ find, reset: () => { cacheKey = ''; expression = null; lookup = new Map(); } });
})();
