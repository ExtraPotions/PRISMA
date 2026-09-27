EXP.UI = (() => {
  const ICON_URL = 'https://raw.githubusercontent.com/ExtraPotions/PRISMA/main/assets/prisma-launcher.svg';
  const routeNames = Object.freeze([['page', 'Highlights'], ['style', 'Highlight Style'], ['look', 'Appearance'], ['tools', 'Language'], ['sites', 'Sites'], ['system', 'System']]);
  let host, shadow, launcher, panel, live, toast, product, noticeController, toastTimer, updateCard, engineState, importDraft = null, unsubscribe;
  const PRODUCT_THEME = {"id":"prisma","name":"PRISMA gem","swatch":"linear-gradient(135deg,#100814 0 38%,#a843b6 38% 69%,#2e98a5 69% 100%)","canvas":"#100814","surface":"#211029","primary":"#a843b6","companion":"#6853c9","counterpoint":"#2e98a5","interactive":"#c05bca","bg":"#100814","panel":"#211029","line":"#4a2e55","text":"#eadcf0","muted":"#ad96b5","accent":"#a843b6","accent2":"#c05bca","skin":"linear-gradient(135deg,#a843b6 0%,#6853c9 52%,#2e98a5 100%)","skinVertical":"linear-gradient(180deg,#a843b6 0%,#6853c9 52%,#2e98a5 100%)"};
  const UI_THEMES = ExtraPotionsCore.themes(PRODUCT_THEME);
  const el = (tag, attrs = {}, text) => { const node = document.createElement(tag); for (const [name, value] of Object.entries(attrs)) { if (name === 'class') node.className = value; else node.setAttribute(name, value); } if (text !== undefined) node.textContent = text; return node; };
  function showNotice(node, {kicker,title,version=EXP.VERSION,text='',details=[],available=false}) {
    noticeController?.show({kicker,title,version,text,details,showAction:available,kind:available?'available':kicker==='Update Complete'?'complete':'current'});
  }
  function hideUpdateCard() { noticeController?.hide(); }
  function showUpdateCard(result={},complete=false,previous=''){const version=complete?EXP.VERSION:result.latest;if(!complete&&!EXP.Core.claimNotice('prisma',`available:${version}`))return;const fallback=['A newer PRISMA build is available.','Install the latest userscript for the newest fixes and improvements.'];const details=complete?EXP.ReleaseNotes.current():(Array.isArray(result.details)&&result.details.length?result.details:fallback);showNotice(updateCard,{kicker:complete?'Update Complete':'Update Available',title:complete?'PRISMA Updated':'New PRISMA Version Available',version,text:complete?`Updated from v${previous} to v${EXP.VERSION}.`:`v${result.latest} is ready to install.`,details,available:!complete},true);}
  const button = (label, action, className = 'action') => { const node = el('button', { type: 'button', class: className }, label); node.addEventListener('click', action); return node; };
  const announce = (message, kind = 'status') => { if (live) { live.textContent = message; live.dataset.kind = kind; } if (!toast || !EXP.Settings.snapshot().menuNotifications) return; toast.textContent=message;toast.hidden=false;toast.style.top=`${Math.max(8,(launcher?.getBoundingClientRect().top||60)-48)}px`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{if(toast)toast.hidden=true;},3000); };
  function group(title) { const node = el('section', { class: 'group' }); if (title) node.append(el('h3', {}, title)); return node; }
  function row(label, help = '') { const node = el('div', { class: 'row' }); const copy = el('div', { class: 'copy' }); copy.append(el('span', { class: 'label' }, label)); node.append(copy); return node; }
  function switchControl(label, help, value, change, disabled = false) { const node = row(label, help); const control = el('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(Boolean(value)), 'aria-label': label }); control.disabled = disabled; control.append(el('span', { 'aria-hidden': 'true' })); control.addEventListener('click', () => { const next = control.getAttribute('aria-checked') !== 'true'; control.setAttribute('aria-checked', String(next)); change(next); }); node.append(control); return node; }
  function selectControl(label, help, value, choices, change, disabled = false) { const node = row(label, help); const select = el('select', { 'aria-label': label }); select.disabled = disabled; for (const [id, name] of choices) { const option = el('option', { value: id }, name); option.selected = id === value; select.append(option); } select.addEventListener('change', () => change(select.value)); node.append(select); return node; }
  function actionRow(label, help, action, actionLabel = label, disabled = false) { const node = row(label, help); const control = button(actionLabel, action); if (['Reset','Reset site','Restore'].includes(actionLabel)) control.classList.add('warn'); control.disabled = disabled; node.append(control); return node; }
  function statusRow(label, help, value = '') { const node = row(label, help); if (value) node.append(el('output', { class: 'status-value' }, value)); return node; }
  const PRIDE_RAINBOW = 'linear-gradient(90deg,#c97b83,#d29a70,#d0c07d,#70a886,#7091b6,#a27ba9)';
  function applyUiTheme(id) { ExtraPotionsCore.applyTheme(host, id, UI_THEMES); }
  function themeSwatches(value, change) { const wrap=el('div',{class:'theme-row'});wrap.append(el('span',{class:'label'},'Menu theme'));const dots=el('div');const core=ExtraPotionsCore;const mount=core?.createThemeSwatches||((options)=>{dots.className='exp-theme-swatches';dots.setAttribute('role','radiogroup');for(const theme of options.themes){const dot=el('button',{type:'button',class:`exp-theme-swatch${theme.id===options.value?' is-on':''}`,'aria-label':theme.name,'aria-pressed':String(theme.id===options.value),title:theme.name});dot.style.background=theme.swatch;dot.addEventListener('click',()=>options.onChange(theme.id));dots.append(dot);}return{setValue(){},destroy(){}};});mount({container:dots,themes:UI_THEMES,value,onChange:change});wrap.append(dots);return wrap; }
  function update(patch, reason) { const next = EXP.Settings.update(patch, reason); render(); return next; }
  function download(name, text) { const url = URL.createObjectURL(new Blob([text], { type: 'application/json' })); const link = el('a', { href: url, download: name }); link.click(); setTimeout(() => URL.revokeObjectURL(url), 0); }

  function renderHighlightStyle() {
    const state = EXP.Settings.snapshot(); const section = group('Highlight style', 'Visual controls change the renderer without widening the matcher.');
    section.append(selectControl('Style', 'Uses the same eligible match set.', state.style, [['gradient', 'Gradient'], ['underline', 'Underline'], ['soft-fill', 'Soft Fill']], (style) => update({ style }, 'style')));
    section.append(selectControl('Intensity', 'Changes rendering only.', state.intensity, [['subtle', 'Subtle'], ['balanced', 'Balanced'], ['vivid', 'Vivid']], (intensity) => update({ intensity }, 'intensity')));
    section.append(switchControl('Animation', 'Disabled whenever reduced motion is active.', state.animation, (animation) => update({ animation }, 'animation')));
    section.append(selectControl('Animation style', '', state.animationStyle, [['pulse', 'Pulse'], ['shimmer', 'Shimmer'], ['glow', 'Glow']], (animationStyle) => update({ animationStyle }, 'animation-style'), !state.animation));
    section.append(switchControl('Identity labels', 'Available by pointer and keyboard focus when enabled.', state.labels, (labels) => update({ labels }, 'labels')));
    return section;
  }
  function renderLook() {
    const state = EXP.Settings.snapshot(); const section = group('Appearance', 'Menu palette and accessibility stay separate from identity colors.');
    section.append(themeSwatches(state.uiTheme, (uiTheme) => { applyUiTheme(uiTheme); update({ uiTheme }, 'ui-theme'); }));
    const a11y = group('Accessibility', 'Non-color and spoken behavior remain independent from identity colors.');
    a11y.append(selectControl('Reduce motion', 'Follow system, always reduce, or allow configured animation.', state.reducedMotion, [['system', 'Follow system'], ['reduce', 'Reduce'], ['allow', 'Allow']], (reducedMotion) => update({ reducedMotion }, 'reduced-motion')));
    a11y.append(switchControl('High contrast', 'Uses a strong local outline and system colors where required.', state.highContrast, (highContrast) => update({ highContrast }, 'high-contrast')));
    a11y.append(selectControl('Non-color indicator', 'Visible even when hue differences are unavailable.', state.nonColorIndicator, [['underline', 'Underline'], ['outline', 'Outline'], ['off', 'Off']], (nonColorIndicator) => update({ nonColorIndicator }, 'non-color-indicator')));
    a11y.append(selectControl('Screen-reader behavior', 'Original text is the quiet default; announcements occur only on explicit navigation.', state.screenReaderBehavior, [['original-text', 'Original text'], ['announce-on-focus', 'Announce on focus']], (screenReaderBehavior) => update({ screenReaderBehavior }, 'screen-reader-behavior')));
    const fragment = document.createDocumentFragment(); fragment.append(section, a11y); return fragment;
  }
  function identityRow(identity, state) {
    const enabled = !state.disabledIdentities.includes(identity.id); const item = el('div', { class: 'identity' }); const copy = el('div', { class: 'copy' }); copy.append(el('span', { class: 'label' }, identity.label), el('span', { class: 'help' }, `${identity.terms.length} recognition term${identity.terms.length === 1 ? '' : 's'}`)); item.append(copy);
    const detail = el('div', { class: 'catalog-detail', id: `prisma-detail-${identity.id}`, hidden: true });
    if (identity.verification.status !== 'unverified') copy.querySelector('.label').append(el('span', { role: 'img', 'aria-label': 'Verified entry', title: identity.verification.status === 'wikipedia' ? 'Verified under the Wikipedia-listed rule' : 'Verified by a peer-reviewed source' }, ' ✓'));
    detail.append(el('strong', {}, identity.category), el('p', {}, identity.definition || 'Definition review pending for this inherited entry.'), el('p', {}, `Recognizes: ${identity.terms.map(term => term.text).join(', ')}`));
    if (identity.definitionStatus === 'public-reference-pending') detail.append(el('p', {}, 'Public reference review pending.'));
    if (identity.recognitionNote) detail.append(el('p', {}, identity.recognitionNote));
    const verified = identity.verification.status !== 'unverified';
    detail.append(el('p', { class: 'definition-verification' }, verified ? `✓ Verified — ${identity.verification.status === 'wikipedia' ? 'Wikipedia-listed' : 'peer-reviewed source'}` : 'Unverified — no Wikipedia or peer-reviewed reference confirmed.'));
    if (identity.romantic) detail.append(el('p', {}, state.includeRomantic ? 'Romantic identity recognition is on.' : 'Romantic identity recognition is off. Enable Romantic identities to highlight this entry.'));
    if (identity.colors.length) {
      const preview = el('div', { class: 'catalog-palette', role: 'img', 'aria-label': `${identity.label} highlight palette: ${identity.colors.join(', ')}` });
      const stops = identity.colors.flatMap((color, index) => [`${color} ${index / identity.colors.length * 100}%`, `${color} ${(index + 1) / identity.colors.length * 100}%`]);
      preview.style.backgroundImage = `linear-gradient(90deg,${stops.join(',')})`;
      detail.append(preview, el('p', {}, `${identity.flag.status === 'verified' ? 'Verified palette' : 'Inherited palette'}: ${identity.colors.join(', ')}. Palette preview, not a complete flag drawing.`));
    } else detail.append(el('p', {}, 'Flag colors await verification. This term uses a neutral underline.'));
    if (identity.flag.variant) detail.append(el('p', {}, `Flag design: ${identity.flag.variant}`));
    if (identity.flag.note) detail.append(el('p', {}, identity.flag.note));
    if (identity.flag.reviewStatus === 'unresolved') detail.append(el('p', {}, 'A public flag reference has not been confirmed.'));
    for (const url of [...new Set(identity.sources)]) detail.append(el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, `Definition source: ${new URL(url).hostname}`));
    for (const url of [...new Set([...(identity.flag.sources || []), identity.flag.source].filter(Boolean))]) detail.append(el('a', { href: url, target: '_blank', rel: 'noopener noreferrer' }, `Flag source: ${new URL(url).hostname}`));
    const details = button('Details', () => { detail.hidden = !detail.hidden; details.setAttribute('aria-expanded', String(!detail.hidden)); product?.refresh(); }, 'compact');
    details.setAttribute('aria-expanded', 'false'); details.setAttribute('aria-controls', detail.id);
    const control = el('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(enabled), 'aria-label': `Enable ${identity.label}` }); control.append(el('span', { 'aria-hidden': 'true' })); control.addEventListener('click', () => { const disabled = new Set(EXP.Settings.snapshot().disabledIdentities); if (enabled) disabled.add(identity.id); else disabled.delete(identity.id); update({ disabledIdentities: [...disabled] }, 'identity-toggle'); });
    const actions = el('div', { class: 'identity-actions' }); actions.style.cssText='display:flex;align-items:center;gap:6px'; actions.append(control, details); item.append(actions); const wrapper = el('div', { class: 'catalog-entry' }); wrapper.append(item, detail); return wrapper;
  }
  function renderIdentities() {
    const state = EXP.Settings.snapshot(); const section = group('Identity Catalog', `${EXP.Catalog.identities.length} reviewed source identities. Context rules remain active for ambiguous terms.`); const search = el('input', { type: 'search', class: 'search', placeholder: 'Search identities and aliases', 'aria-label': 'Search identity catalog' }); const list = el('div', { class: 'identity-list' });
    let offset = 0;
    let reviewFilter = 'all';
    const pagination = el('div', { class: 'button-grid' });
    const count = el('p', { class: 'catalog-results', role: 'status' });
    section.append(switchControl('Romantic identities', '', state.includeRomantic, (includeRomantic) => update({ includeRomantic }, 'romantic-identities')));
    section.append(el('p', {}, 'Include romantic and combined aroace labels in page highlighting. Definitions stay available in this catalog.'));
    section.append(el('p', {}, 'Check marks indicate Wikipedia or peer-reviewed source support.'));
    const reviewSummary=EXP.Catalog.review;
    section.append(el('p',{},reviewSummary('definition').length+' definitions, '+reviewSummary('flag').length+' flag references, and '+reviewSummary('palette').length+' exact palettes still need evidence. These counts overlap.'));
    section.append(selectControl('Evidence review','',reviewFilter,[['all','All entries'],['definition','Definition reference needed'],['flag','Flag reference needed'],['palette','Exact palette not verified']],value=>{reviewFilter=value;offset=0;paint();}));
    const previous = button('Previous results', () => { offset = Math.max(0, offset - 3); paint(); });
    const next = button('Next results', () => { offset += 3; paint(); });
    pagination.append(previous, next);
    const paint = () => {
      const results = EXP.Catalog.search(search.value.trim()).filter(identity=>reviewFilter==='all'||EXP.Catalog.evidenceGaps(identity)[reviewFilter]);
      offset = Math.min(offset, Math.max(0, Math.floor((results.length - 1) / 3) * 3));
      list.replaceChildren(...results.slice(offset, offset + 3).map(identity => identityRow(identity, state)));
      if (!list.childElementCount) list.append(el('p', { class: 'empty' }, 'No identities match this search.'));
      count.textContent = results.length ? `${offset + 1}–${Math.min(offset + 3, results.length)} of ${results.length} entries` : '0 entries';
      previous.disabled = offset === 0; next.disabled = offset + 3 >= results.length;
      pagination.hidden = results.length <= 3; product?.refresh();
    };
    search.addEventListener('input', () => { offset = 0; paint(); }); paint(); section.append(search, list, count, pagination);
    section.append(actionRow('Restore catalog defaults', 'Enables all reviewed identities without changing context protection.', () => { update({ disabledIdentities: [] }, 'identity-defaults'); announce('Catalog defaults restored.'); }, 'Restore'));
    return section;
  }
  function renderContext() {
    const state = EXP.Settings.snapshot(); const section = group('Context Engine', 'Confidence is a deterministic rule band, never a probability.');
    section.append(selectControl('Matching mode', 'Strict accepts explicit terms; Balanced also accepts supported aliases; Inclusive permits explicitly reviewed opt-ins.', state.matcherMode, [['strict', 'Strict'], ['balanced', 'Balanced'], ['inclusive', 'Inclusive']], (matcherMode) => update({ matcherMode }, 'matcher-mode')));
    section.append(switchControl('Ambiguity Protection', 'Blocks tested competing meanings. Hard collisions remain blocked.', state.ambiguityProtection, (ambiguityProtection) => update({ ambiguityProtection }, 'ambiguity-protection')));
    section.append(switchControl('Surrounding context', 'Required-context terms fail closed when this is off.', state.surroundingContext, (surroundingContext) => update({ surroundingContext }, 'surrounding-context')));
    const d = engineState.decisions;
    section.append(statusRow('Eligible explicit', 'Exact or uniquely scoped terms.', String(d['eligible-explicit'])));
    section.append(statusRow('Eligible supported', 'Ambiguous terms with required local context.', String(d['eligible-supported'])));
    section.append(statusRow('Review ambiguous', 'Plausible terms withheld for missing support.', String(d['review-ambiguous'])));
    section.append(statusRow('Blocked negative', 'Negative context, collision, or safety rule.', String(d['blocked-negative'])));
    return section;
  }
  function renderPage() {
    const state = EXP.Settings.snapshot(); const section = group('Highlights', 'Every count and navigation action comes from one route-scoped match set.');
    section.append(switchControl('Enable PRISMA', 'Stop and fully restore PRISMA highlights while retaining settings.', state.enabled, (enabled) => update({ enabled }, 'enablement')));
    section.append(statusRow('Current-page status', `Route epoch ${engineState.routeEpoch}`, engineState.status));
    section.append(statusRow('Match count', 'Eligible current-page records.', String(engineState.total)));
    const controls = el('div', { class: 'button-grid' }); controls.append(button('Previous Match', () => { const result = EXP.Engine.navigatePrevious(); announce(result ? `Match ${result.position} of ${result.total}.` : 'No match to navigate.'); }), button('Next Match', () => { const result = EXP.Engine.navigateNext(); announce(result ? `Match ${result.position} of ${result.total}.` : 'No match to navigate.'); }), button('Highlight All', () => { EXP.Engine.highlightAll(); announce('All eligible highlights are visible.'); })); section.append(controls);
    const corrections=el('details',{class:'local-correction-card'});corrections.append(el('summary',{},'Correct an unwanted match'));
    const phrase=el('input',{'aria-label':'Phrase to leave unchanged',maxlength:'200',placeholder:'Exact phrase or short context'});
    corrections.append(phrase,button('Ignore phrase on this site',()=>{const text=phrase.value.trim();if(!text)return;const state=EXP.Settings.snapshot(),site={...(state.siteOverrides[location.hostname]||{})};site.ignoredPhrases=[...new Set([...(site.ignoredPhrases||[]),text])];update({siteOverrides:{...state.siteOverrides,[location.hostname]:site}},'local-correction');announce('Text containing this phrase will be left unchanged on this site.');}));
    for(const text of state.ignoredPhrases||[])corrections.append(button('Remove global exception: '+text,()=>update({ignoredPhrases:state.ignoredPhrases.filter(v=>v!==text)},'remove-correction')));
    for(const text of state.siteOverrides[location.hostname]?.ignoredPhrases||[])corrections.append(button('Remove site exception: '+text,()=>{const site={...state.siteOverrides[location.hostname]};site.ignoredPhrases=site.ignoredPhrases.filter(v=>v!==text);update({siteOverrides:{...state.siteOverrides,[location.hostname]:site}},'remove-correction');}));
    corrections.append(el('p',{},'Corrections stay on this device. Matching text nodes are left unchanged; nothing is submitted to a server.'));section.append(corrections);
    section.append(switchControl('Temporarily Hide Highlights', 'Session-only; matching and counts remain active.', engineState.temporarilyHidden, (value) => EXP.Engine.setTemporaryHidden(value)));
    return section;
  }
  function renderSites() {
    const state = EXP.Settings.snapshot(); const effective = EXP.Settings.effective(); const site = state.siteOverrides[location.hostname] || {}; const section = group('Current Site', location.hostname || 'Local document');
    section.append(switchControl('Enable on this site', 'Exclusion stops work and restores wrappers for this origin.', !effective.excluded, (enabled) => { const exclusions = state.exclusions.filter((host) => host !== location.hostname); if (!enabled) exclusions.push(location.hostname); update({ exclusions }, 'site-exclusion'); }));
    section.append(switchControl('Use site overrides', 'Creates or removes a current-origin override layer.', Boolean(state.siteOverrides[location.hostname]), (enabled) => { const siteOverrides = { ...state.siteOverrides }; if (enabled) siteOverrides[location.hostname] = { matcherMode: state.matcherMode }; else delete siteOverrides[location.hostname]; update({ siteOverrides }, 'site-override-layer'); }));
    section.append(selectControl('Matching mode override', 'Inherit or override the current origin.', site.matcherMode || 'inherit', [['inherit', 'Inherit global'], ['strict', 'Strict'], ['balanced', 'Balanced'], ['inclusive', 'Inclusive']], (matcherMode) => { const siteOverrides = { ...state.siteOverrides, [location.hostname]: { ...site } }; if (matcherMode === 'inherit') delete siteOverrides[location.hostname].matcherMode; else siteOverrides[location.hostname].matcherMode = matcherMode; update({ siteOverrides }, 'site-matcher-mode'); }, !state.siteOverrides[location.hostname]));
    const overrideGroup = el('div', { class: 'site-identities' });
    overrideGroup.append(el('span', { class: 'label' }, 'Identity overrides'));
    const overrideSearch = el('input', { type: 'search', class: 'search', placeholder: 'Search site identity overrides', 'aria-label': 'Search site identity overrides' }); const overrideList = el('div', { class: 'identity-list' });
    const paintOverrides = () => { overrideList.replaceChildren(...EXP.Catalog.search(overrideSearch.value).slice(0,3).map((identity) => { const value = site.identityOverrides?.[identity.id] || 'inherit'; return selectControl(identity.label, 'Current-origin behavior.', value, [['inherit', 'Inherit'], ['on', 'On'], ['off', 'Off']], (mode) => { const current = EXP.Settings.snapshot(); const siteOverrides = { ...current.siteOverrides, [location.hostname]: { ...(current.siteOverrides[location.hostname] || {}) } }; const identityOverrides = { ...(siteOverrides[location.hostname].identityOverrides || {}) }; if (mode === 'inherit') delete identityOverrides[identity.id]; else identityOverrides[identity.id] = mode; siteOverrides[location.hostname].identityOverrides = identityOverrides; update({ siteOverrides }, 'site-identity-override'); }, !state.siteOverrides[location.hostname]); })); if (!overrideList.childElementCount) overrideList.append(el('p', { class: 'empty' }, 'No identities match this search.')); };
    overrideSearch.addEventListener('input', paintOverrides); paintOverrides(); overrideGroup.append(overrideSearch, overrideList); section.append(overrideGroup);
    section.append(actionRow('Reset this site', 'Removes only this origin’s exclusion and overrides.', () => { const siteOverrides = { ...state.siteOverrides }; delete siteOverrides[location.hostname]; update({ siteOverrides, exclusions: state.exclusions.filter((host) => host !== location.hostname) }, 'site-reset'); announce('Current-site settings reset.'); }, 'Reset site'));
    return section;
  }
  function renderTools() { const fragment = document.createDocumentFragment(); fragment.append(renderIdentities(), renderContext()); return fragment; }
  function diagnosticReport() { const core = EXP.Core.diagnosticSnapshot(); return EXP.Diagnostics.createDiagnosticsReport('PRISMA', { host, settings: EXP.Settings.exportData(), updates: EXP.Updates.status(), product: { id: 'prisma', version: EXP.VERSION }, lifecycle: engineState.status, routeEpoch: engineState.routeEpoch, catalog: EXP.Catalog.status(), matches: { total: engineState.total, byIdentityId: engineState.summary, decisionBands: engineState.decisions }, processing: engineState.metrics, safeMode: EXP.Settings.snapshot().safeMode, core }); }
  function renderAdvanced() {
    const state = EXP.Settings.snapshot(); const catalog = EXP.Catalog.status(); const section = group();
    section.append(EXP.Diagnostics.createDiagnosticsControls(diagnosticReport, announce));
    section.append(switchControl('Safe Mode', 'Immediately restores the page and keeps this recovery menu available.', state.safeMode, (safeMode) => update({ safeMode }, 'safe-mode')));

    return section;
  }
  function renderSettings() {
    const state = EXP.Settings.snapshot(); const section = group();
    const preferences = ExtraPotionsCore.createDisclosure('Menu preferences');
    const data = ExtraPotionsCore.createDisclosure('Settings');
    data.open = Boolean(importDraft);
    data.append(actionRow('Rescan page', 'Rebuilds one clean route-scoped match set.', () => { EXP.Engine.rebuild('manual-rescan'); announce('Page rescanned.'); }, 'Rescan'));
    section.append(selectControl('Menu width', '', state.menuWidth, [['full','Full'],['compact','Compact'],['narrow','Narrow']], (menuWidth) => update({ menuWidth }, 'menu-width')));
    preferences.append(switchControl('Auto-close menu', 'Closes after 15 seconds without interaction.', state.menuAutoClose, (menuAutoClose) => update({ menuAutoClose }, 'menu-auto-close')));
    preferences.append(switchControl('Menu notifications', 'Shows short local status toasts.', state.menuNotifications, (menuNotifications) => update({ menuNotifications }, 'menu-notifications')));
    preferences.append(switchControl('Update notifications', 'Off by default. Opt-in checks request release metadata only.', state.updateNotifications, (updateNotifications) => { update({ updateNotifications }, 'update-notifications'); if (updateNotifications) EXP.Updates.check(true).then((result) => announce(result.available ? `Version ${result.latest} is available.` : result.state === 'failed' ? 'Update check failed quietly.' : 'PRISMA is up to date.')); }));
    const transfer = el('div', { class: 'button-grid' }); transfer.append(button('Export settings', () => download('prisma-v3-settings.json', JSON.stringify(EXP.Settings.exportData(), null, 2))));
    const importRow = row('Import PRISMA settings', 'Validation creates a draft. Apply commits atomically; Cancel changes nothing.'); const file = el('input', { type: 'file', accept: 'application/json,.json', 'aria-label': 'Import PRISMA settings' }); file.addEventListener('change', async () => { try { importDraft = EXP.Settings.prepareImport(JSON.parse(await file.files[0].text())); render(); announce('Import validated. Review and apply or cancel.'); } catch (error) { importDraft = null; announce(error.message, 'error'); } }); file.hidden = true; transfer.append(button('Import settings', () => file.click()), file); data.append(transfer);
    if (importDraft) { const actions = el('div', { class: 'button-grid' }); actions.append(button('Cancel import', () => { importDraft = null; render(); announce('Import cancelled.'); }, 'secondary'), button('Apply import', () => { EXP.Settings.replace(importDraft, 'import'); importDraft = null; render(); announce('Imported settings applied.'); }, 'primary')); data.append(actions); }
    data.append(actionRow('Reset PRISMA', 'Resets PRISMA V3 only. Other products are untouched.', () => { if (!confirm('Reset all PRISMA V3 settings?')) return; EXP.Settings.replace(EXP.Settings.defaults, 'product-reset'); render(); announce('PRISMA reset complete.'); }, 'Reset'));
    const fragment = document.createDocumentFragment(); fragment.append(section, renderAdvanced(), ExtraPotionsCore.createSystemGrid(preferences, data, ExtraPotionsCore.createCompatibilityControls())); return fragment;
  }
  const routeRenderers = { page: renderPage, style: renderHighlightStyle, look: renderLook, tools: renderTools, sites: renderSites, system: renderSettings };
  function render() {
    engineState = EXP.Engine.snapshot({ includeMatchText: false });
    product?.renderActive();
    product?.refresh();
  }
  function bindKeys(event) {
    const shortcut = EXP.Settings.snapshot().shortcut;
    const defaultShortcut = event.shiftKey && event.key.toLowerCase() === 'p';
    const savedShortcut = shortcut && !event.shiftKey && `Alt+${event.key.toUpperCase()}` === shortcut.toUpperCase();
    if (event.altKey && !event.repeat && !event.ctrlKey && !event.metaKey && (defaultShortcut || savedShortcut)) {
      event.preventDefault(); product?.toggle();
    }
    if (!product?.isOpen) return;
    if (event.key === 'Escape' && importDraft) {
      event.preventDefault(); event.stopImmediatePropagation();
      importDraft = null; render(); announce('Import draft cancelled.'); return;
    }
    if (event.key === 'Tab') {
      const focusable = [...panel.querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled),summary,[tabindex]:not([tabindex="-1"])')].filter(node => !node.hidden && node.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable.at(-1), active = shadow.activeElement;
      if (active === panel) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    }
  }
  function outsidePointer(event) { if (product?.isOpen && !event.composedPath().includes(host) && !importDraft) product.close(); }
  function init() {
    if (window.top !== window.self || host) return;
    engineState = EXP.Engine.snapshot({ includeMatchText: false });
    product = ExtraPotionsCore.createProduct({
      id: 'prisma', name: 'PRISMA', version: EXP.VERSION,
      subtitle: 'Your self-identity. Recognized.', artwork: ICON_URL,
      theme: PRODUCT_THEME, priority: 40,
      getSettings: () => EXP.Settings.snapshot(),
      onSettings: (next, reason) => update(next, reason),
      sections: routeNames.map(([id, label]) => ({ id, label, render: () => routeRenderers[id]() })),
    });
    ({ host, shadow, launcher, panel } = product);
    EXP.Core.injectStyle(shadow, '.catalog-detail{padding:8px;margin:4px 0 8px;border:1px solid var(--theme-line);border-radius:7px;background:var(--theme-bg);font-size:10px;line-height:1.45;overflow-wrap:anywhere}.catalog-detail[hidden]{display:none!important}.catalog-detail p{margin:6px 0}.catalog-detail a{display:block;color:var(--theme-accent2);margin-top:5px}.catalog-palette{height:20px;border:1px solid var(--theme-line);border-radius:4px}', { expPrismaCatalog: '1' });
    panel.classList.add('panel');
    panel.setAttribute('aria-modal', 'true');
    const nav = panel.querySelector('nav');
    nav.classList.add('nav');
    for (const item of nav.querySelectorAll('[data-section]')) {
      item.classList.add('route');
      const body = item.parentElement.querySelector('.route-body');
      body.id = `exp-prisma-route-${item.dataset.section}`;
      item.setAttribute('aria-controls', body.id);
    }
    const syncSectionState = () => {
      for (const item of nav.querySelectorAll('[data-section]')) item.setAttribute('aria-current', item.getAttribute('aria-expanded') === 'true' ? 'page' : 'false');
    };
    nav.addEventListener('click', syncSectionState);
    launcher.addEventListener('click', syncSectionState);
    live = el('p', { class: 'live', role: 'status', 'aria-live': 'polite' });
    panel.querySelector('nav').before(live);
    toast = el('div', { class: 'toast', role: 'status', 'aria-live': 'polite', hidden: true });
    (shadow.querySelector('.exp-core-theme') || shadow).append(toast);
    noticeController = ExtraPotionsCore.createProductNotice({
      host, shadow, panel, versionButton: product.versionButton,
      releaseUrl: 'https://github.com/ExtraPotions/PRISMA/releases',
      installUrl: 'https://github.com/ExtraPotions/PRISMA/releases/latest/download/prisma.user.js',
      onVersion: () => {
        if (updateCard?.hidden === false && updateCard.dataset.noticeKind === 'current') hideUpdateCard();
        else showNotice(updateCard, { kicker:'Current Version', title:'PRISMA Changelog', version:EXP.VERSION, text:`What's new in v${EXP.VERSION}.`, details:EXP.ReleaseNotes.current(), available:false });
      },
    });
    updateCard = noticeController.element;
    applyUiTheme(EXP.Settings.snapshot().uiTheme);
    const previous = EXP.Core.consumeVersionChange('prisma', EXP.VERSION, 'exp:v3:prisma:last-version-v2');
    if (previous) showUpdateCard({}, true, previous);
    if (EXP.Settings.snapshot().updateNotifications) EXP.Updates.check(false).then(result => { if (host && result.available) showUpdateCard(result); });
    unsubscribe = EXP.Engine.subscribe(value => {
      engineState = value;
      if (product?.isOpen && panel.querySelector('[data-section="page"][aria-expanded="true"],[data-section="system"][aria-expanded="true"]')) render();
    });
    document.addEventListener('keydown', bindKeys, true);
    document.addEventListener('pointerdown', outsidePointer, true);
    render();
  }
  function cleanup() {
    document.removeEventListener('keydown', bindKeys, true);
    document.removeEventListener('pointerdown', outsidePointer, true);
    unsubscribe?.(); clearTimeout(toastTimer); noticeController?.destroy(); product?.destroy();
    host = shadow = launcher = panel = live = toast = product = noticeController = updateCard = null;
    importDraft = null;
  }
  return Object.freeze({ init, cleanup, open: () => product?.open(), refresh: render });
})();
