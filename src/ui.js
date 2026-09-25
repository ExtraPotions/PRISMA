EXP.UI = (() => {
  const BADGE_DATA = '__EXP_PRISMA_BADGE_DATA__';
  const LAUNCHER_DATA = '__EXP_PRISMA_LAUNCHER_DATA__';
  const routeNames = Object.freeze([['page', 'Highlights'], ['style', 'Highlight Style'], ['look', 'Appearance'], ['tools', 'Language'], ['sites', 'Sites'], ['menu', 'Settings']]);
  let host, shadow, launcher, panel, nav, workspace, live, toast, chrome, toastTimer, updateTimer, updateCard, currentRoute = '', lastRoute = '', open = false, engineState, importDraft = null, launcherCleanup, unsubscribe;
  const UI_THEMES = ExtraPotionsCore.themes({"id":"prisma","name":"PRISMA gem","swatch":"linear-gradient(135deg,#100814 0 38%,#a843b6 38% 69%,#2e98a5 69% 100%)","canvas":"#100814","surface":"#211029","primary":"#a843b6","companion":"#6853c9","counterpoint":"#2e98a5","interactive":"#c05bca","bg":"#100814","panel":"#211029","line":"#4a2e55","text":"#eadcf0","muted":"#ad96b5","accent":"#a843b6","accent2":"#c05bca","skin":"linear-gradient(135deg,#a843b6 0%,#6853c9 52%,#2e98a5 100%)","skinVertical":"linear-gradient(180deg,#a843b6 0%,#6853c9 52%,#2e98a5 100%)"});
  const el = (tag, attrs = {}, text) => { const node = document.createElement(tag); for (const [name, value] of Object.entries(attrs)) { if (name === 'class') node.className = value; else node.setAttribute(name, value); } if (text !== undefined) node.textContent = text; return node; };
  function positionFloating(node) {
    const pr=panel?.getBoundingClientRect(), lr=launcher?.getBoundingClientRect();
    if(!node||!lr)return;
    const h=node.offsetHeight||190, anchor=open&&pr?.height?pr.top:lr.top;
    node.style.right=Math.max(12,innerWidth-(open&&pr?.width?pr.right:lr.right))+'px';
    node.style.top=Math.max(8,anchor-h-8)+'px'; node.style.bottom='auto';
  }
  function makeNotice() {
    const notice=el('div',{class:'update-notice',hidden:true});
    notice.innerHTML='<button type="button" class="update-dismiss" aria-label="Dismiss">×</button><div class="update-head"><div><div class="update-kicker"></div><div class="update-title"></div></div><div class="update-version"></div></div><div class="update-text"></div><ul class="update-list"></ul><div class="update-footer"><a class="update-release" href="https://github.com/ExtraPotions/PRISMA/releases" target="_blank" rel="noopener noreferrer">GitHub Release</a><a class="update-action" href="https://raw.githubusercontent.com/ExtraPotions/PRISMA/main/prisma.user.js" target="_blank" rel="noopener noreferrer">Install Update</a></div>';
    return notice;
  }
  function showNotice(node,{kicker,title,version=EXP.VERSION,text='',details=[],available=false},auto=false){
    node.querySelector('.update-kicker').textContent=kicker;node.querySelector('.update-title').textContent=title;node.querySelector('.update-version').textContent=`v${version}`;node.querySelector('.update-text').textContent=text;
    const list=node.querySelector('.update-list');list.replaceChildren(...details.slice(0,4).map(x=>el('li',{},x)));list.hidden=!details.length;node.querySelector('.update-action').hidden=!available;node.hidden=false;requestAnimationFrame(()=>positionFloating(node));if(auto){clearTimeout(updateTimer);updateTimer=setTimeout(()=>{node.hidden=true;},30000);}
  }
  function updateNotice(){const notice=makeNotice();notice.querySelector('.update-dismiss').addEventListener('click',()=>notice.hidden=true);return notice;}
  function hideUpdateCard(){clearTimeout(updateTimer);updateTimer=null;if(updateCard)updateCard.hidden=true;chrome?.layout();}
  function showUpdateCard(result={},complete=false,previous=''){const fallback=['A newer PRISMA build is available.','Install the latest userscript for the newest fixes and improvements.'];const details=complete?EXP.ReleaseNotes.current():(Array.isArray(result.details)&&result.details.length?result.details:fallback);showNotice(updateCard,{kicker:complete?'Update Complete':'Update Available',title:complete?'PRISMA Updated':'New PRISMA Version Available',version:complete?EXP.VERSION:result.latest,text:complete?`Updated from v${previous} to v${EXP.VERSION}.`:`v${result.latest} is ready to install.`,details,available:!complete},true);}
  const button = (label, action, className = 'action') => { const node = el('button', { type: 'button', class: className }, label); node.addEventListener('click', action); return node; };
  const announce = (message, kind = 'status') => { if (live) { live.textContent = message; live.dataset.kind = kind; } if (!toast || !EXP.Settings.snapshot().menuNotifications) return; toast.textContent=message;toast.hidden=false;toast.style.top=`${Math.max(8,(launcher?.getBoundingClientRect().top||60)-48)}px`;clearTimeout(toastTimer);toastTimer=setTimeout(()=>{if(toast)toast.hidden=true;},3000); };
  function group(title) { const node = el('section', { class: 'group' }); node.append(el('h3', {}, title)); return node; }
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
    section.append(switchControl('Identity labels', 'Available by pointer and keyboard focus when enabled.', state.labels, (labels) => update({ labels }, 'labels')));
    return section;
  }
  function renderLook() {
    const state = EXP.Settings.snapshot(); const section = group('Appearance', 'Menu palette and accessibility stay separate from identity colors.');
    section.append(themeSwatches(state.uiTheme, (uiTheme) => { applyUiTheme(uiTheme); update({ uiTheme }, 'ui-theme'); }));
    const a11y = group('Accessibility', 'Non-color and spoken behavior remain independent from identity colors.');
    a11y.append(selectControl('Reduced motion', 'Follow system, always reduce, or allow configured animation.', state.reducedMotion, [['system', 'Follow system'], ['reduce', 'Reduce'], ['allow', 'Allow']], (reducedMotion) => update({ reducedMotion }, 'reduced-motion')));
    a11y.append(switchControl('High contrast', 'Uses a strong local outline and system colors where required.', state.highContrast, (highContrast) => update({ highContrast }, 'high-contrast')));
    a11y.append(selectControl('Non-color indicator', 'Visible even when hue differences are unavailable.', state.nonColorIndicator, [['underline', 'Underline'], ['outline', 'Outline'], ['off', 'Off']], (nonColorIndicator) => update({ nonColorIndicator }, 'non-color-indicator')));
    a11y.append(selectControl('Screen-reader behavior', 'Original text is the quiet default; announcements occur only on explicit navigation.', state.screenReaderBehavior, [['original-text', 'Original text'], ['announce-on-focus', 'Announce on focus']], (screenReaderBehavior) => update({ screenReaderBehavior }, 'screen-reader-behavior')));
    const fragment = document.createDocumentFragment(); fragment.append(section, a11y); return fragment;
  }
  function identityRow(identity, state) {
    const enabled = !state.disabledIdentities.includes(identity.id); const item = el('div', { class: 'identity' }); const copy = el('div', { class: 'copy' }); copy.append(el('span', { class: 'label' }, identity.label), el('span', { class: 'help' }, `${identity.terms.length} recognition term${identity.terms.length === 1 ? '' : 's'}`)); item.append(copy);
    const details = button('Details', () => { const terms = identity.terms.map((term) => term.text).join(', '); announce(`${identity.label}: ${terms}`); }, 'compact');
    const control = el('button', { type: 'button', class: 'switch', role: 'switch', 'aria-checked': String(enabled), 'aria-label': `Enable ${identity.label}` }); control.append(el('span', { 'aria-hidden': 'true' })); control.addEventListener('click', () => { const disabled = new Set(EXP.Settings.snapshot().disabledIdentities); if (enabled) disabled.add(identity.id); else disabled.delete(identity.id); update({ disabledIdentities: [...disabled] }, 'identity-toggle'); });
    const actions = el('div', { class: 'identity-actions' }); actions.style.cssText='display:flex;align-items:center;gap:6px'; actions.append(control, details); item.append(actions); return item;
  }
  function renderIdentities() {
    const state = EXP.Settings.snapshot(); const section = group('Identity Catalog', `${EXP.Catalog.identities.length} reviewed source identities. Context rules remain active for ambiguous terms.`); const search = el('input', { type: 'search', class: 'search', placeholder: 'Search identities and aliases', 'aria-label': 'Search identity catalog' }); const list = el('div', { class: 'identity-list' });
    const paint = () => { const query=search.value.trim(); const results=EXP.Catalog.search(query); list.replaceChildren(...results.slice(0,3).map((identity) => identityRow(identity, state))); if (!list.childElementCount) list.append(el('p', { class: 'empty' }, 'No identities match this search.')); };
    search.addEventListener('input', paint); paint(); section.append(search, list);
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
    const state = EXP.Settings.snapshot(); const catalog = EXP.Catalog.status(); const section = group('Diagnostics', 'Page, technical, console, and plugin details; captured locally.');
    section.append(EXP.Diagnostics.createDiagnosticsControls(diagnosticReport, announce));
    section.append(switchControl('Safe Mode', 'Immediately restores the page and keeps this recovery menu available.', state.safeMode, (safeMode) => update({ safeMode }, 'safe-mode')));
    section.append(actionRow('Rescan page', 'Rebuilds one clean route-scoped match set.', () => { EXP.Engine.rebuild('manual-rescan'); announce('Page rescanned.'); }, 'Rescan'));
    return section;
  }
  function renderSettings() {
    const state = EXP.Settings.snapshot(); const section = group('Settings', 'PRISMA stores schema-1 settings locally and reads no predecessor storage.');
    section.append(selectControl('Panel + menu width', 'Matches Dropper’s Full, Compact, and Narrow sizing.', state.menuWidth, [['full','Full'],['compact','Compact'],['narrow','Narrow']], (menuWidth) => update({ menuWidth }, 'menu-width')));
    section.append(switchControl('Auto-close menu', 'Closes after 15 seconds without interaction.', state.menuAutoClose, (menuAutoClose) => update({ menuAutoClose }, 'menu-auto-close')));
    section.append(switchControl('Menu notifications', 'Shows short local status toasts.', state.menuNotifications, (menuNotifications) => update({ menuNotifications }, 'menu-notifications')));
    section.append(switchControl('Update notifications', 'Off by default. Opt-in checks request release metadata only.', state.updateNotifications, (updateNotifications) => { update({ updateNotifications }, 'update-notifications'); if (updateNotifications) EXP.Updates.check(true).then((result) => announce(result.available ? `Version ${result.latest} is available.` : result.state === 'failed' ? 'Update check failed quietly.' : 'PRISMA is up to date.')); }));
    const transfer = el('div', { class: 'button-grid' }); transfer.append(button('Export settings', () => download('prisma-v3-settings.json', JSON.stringify(EXP.Settings.exportData(), null, 2))));
    const importRow = row('Import PRISMA settings', 'Validation creates a draft. Apply commits atomically; Cancel changes nothing.'); const file = el('input', { type: 'file', accept: 'application/json,.json', 'aria-label': 'Import PRISMA settings' }); file.addEventListener('change', async () => { try { importDraft = EXP.Settings.prepareImport(JSON.parse(await file.files[0].text())); render(); announce('Import validated. Review and apply or cancel.'); } catch (error) { importDraft = null; announce(error.message, 'error'); } }); file.hidden = true; transfer.append(button('Import settings', () => file.click()), file); section.append(transfer);
    if (importDraft) { const actions = el('div', { class: 'button-grid' }); actions.append(button('Cancel import', () => { importDraft = null; render(); announce('Import cancelled.'); }, 'secondary'), button('Apply import', () => { EXP.Settings.replace(importDraft, 'import'); importDraft = null; render(); announce('Imported settings applied.'); }, 'primary')); section.append(actions); }
    section.append(actionRow('Reset PRISMA', 'Resets PRISMA V3 only. Other products are untouched.', () => { if (!confirm('Reset all PRISMA V3 settings?')) return; EXP.Settings.replace(EXP.Settings.defaults, 'product-reset'); render(); announce('PRISMA reset complete.'); }, 'Reset'));
    const fragment = document.createDocumentFragment(); fragment.append(renderAdvanced(), section); return fragment;
  }
  const routeRenderers = { page: renderPage, style: renderHighlightStyle, look: renderLook, tools: renderTools, sites: renderSites, menu: renderSettings };
  function render() {
    if (!nav) return;
    engineState = EXP.Engine.snapshot({ includeMatchText: false });
    for (const item of nav.querySelectorAll(':scope > .tool-panel > .route')) {
      const active = item.dataset.route === currentRoute;
      if (active) lastRoute = currentRoute;
      item.classList.toggle('last-opened', item.dataset.route === lastRoute);
      const body = item.parentElement.querySelector('.route-body');
      item.setAttribute('aria-current', active ? 'page' : 'false');
      item.setAttribute('aria-expanded', String(active));
      body.hidden = !active;
      if (active) { workspace = body; body.replaceChildren(routeRenderers[currentRoute]()); }
    }
    panel.dataset.route = currentRoute || 'collapsed'; chrome?.update();
  }
  function setOpen(value, focus = true) { open = Boolean(value); panel.hidden = !open; launcher.setAttribute('aria-expanded', String(open)); chrome?.state(open); if (open) { currentRoute='';render(); if (focus) EXP.Core.focusMenuSurface(panel); } else if (focus) launcher.focus(); }
  function bindKeys(event) {
    if (EXP.Settings.snapshot().shortcut && event.altKey && `Alt+${event.key.toUpperCase()}` === EXP.Settings.snapshot().shortcut.toUpperCase()) { event.preventDefault(); setOpen(!open); }
    if (!open) return;
    if (event.key === 'Escape') { event.preventDefault(); if (importDraft) { importDraft = null; render(); announce('Import draft cancelled.'); } else setOpen(false); return; }
    if (event.key === 'Tab') {
      const focusable = [...panel.querySelectorAll('button:not(:disabled),select:not(:disabled),input:not(:disabled),summary,[tabindex]:not([tabindex="-1"])')].filter((node) => !node.hidden && node.getClientRects().length);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable.at(-1), active = shadow.activeElement;
      if (active === panel) { event.preventDefault(); (event.shiftKey ? last : first).focus(); }
      else if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    }
  }
  function outsidePointer(event) { if (open && !event.composedPath().includes(host) && !importDraft) setOpen(false); }
  function init() {
    if (window.top !== window.self || host) return;
    host = el('div', { id: 'exp-prisma-root', 'data-exp-owned': '1' }); shadow = host.attachShadow({ mode: 'open' });
    const styleCss = '';
    launcher = el('button', { type: 'button', class: 'launcher', 'aria-label': 'Open PRISMA', 'aria-expanded': 'false', 'data-help': 'Drag To Move · Click To Open PRISMA' }); launcher.append(el('img',{class:'launcher-icon',src:LAUNCHER_DATA,alt:''})); launcher.addEventListener('click', () => setOpen(!open));
    panel = el('aside', { class: 'panel', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'PRISMA settings' }); panel.hidden = true;
    const head = el('header', { class: 'head' }); const brand = el('div', { class: 'header-brand' }); brand.append(el('img', { class: 'header-badge', src: BADGE_DATA, alt: '' })); const copy = el('div', { class: 'header-copy' }); const title = el('div', { class: 'title-row' }); const changelog = updateNotice(); title.append(el('h2', {}, 'PRISMA'), button(`v${EXP.VERSION}`, () => { if(changelog.hidden) showNotice(changelog,{kicker:"What's New",title:'PRISMA Changelog',version:EXP.VERSION,text:`What's new in v${EXP.VERSION}.`,details:EXP.ReleaseNotes.current(),available:false}); else changelog.hidden=true; chrome?.layout(); }, 'version')); copy.append(title, el('div', { class: 'subtitle' }, 'Your self-identity. Recognized.')); brand.append(copy); head.append(brand, button('×', () => setOpen(false), 'close'));
    live = el('p', { class: 'live', role: 'status', 'aria-live': 'polite' }); nav = el('nav', { class: 'nav', 'aria-label': 'PRISMA sections' });
    for (const [id, name] of routeNames) { const section = el('section', { class: 'tool-panel' }); const item = button(name, () => { currentRoute = currentRoute===id?'':id; render(); }, 'route'); item.dataset.route = id; item.setAttribute('aria-controls', `exp-prisma-route-${id}`); const body = el('div', { class: 'route-body', id: `exp-prisma-route-${id}` }); body.hidden = true; section.append(item, body); nav.append(section); }
    panel.append(head, el('div', { class: 'header-divider' }), live, nav);updateCard=makeNotice();toast=el('div',{class:'toast'});toast.hidden=true;EXP.Core.injectStyle(shadow,styleCss,{expPrismaUi:'1'});shadow.append(panel, updateCard, changelog, launcher,toast); (document.body || document.documentElement).append(host);
    applyUiTheme(EXP.Settings.snapshot().uiTheme);try{const key='exp:v3:prisma:last-version-v2',prev=localStorage.getItem(key);if(prev&&prev!==EXP.VERSION)showUpdateCard({},true,prev);localStorage.setItem(key,EXP.VERSION);}catch{}if(EXP.Settings.snapshot().updateNotifications)EXP.Updates.check(false).then(r=>{if(r.available)showUpdateCard(r);});launcherCleanup = EXP.Core.registerLauncher(host, { productId: 'prisma', priority: 40 });chrome=EXP.MenuChrome.create({id:'prisma',host,shadow,launcher,panel,getSettings:()=>EXP.Settings.snapshot(),setOpen,shortcutKey:'p'}); unsubscribe = EXP.Engine.subscribe((value) => { engineState = value; if (open && ['page', 'tools', 'menu'].includes(currentRoute)) render(); }); addEventListener('keydown', bindKeys); document.addEventListener('pointerdown', outsidePointer, true); render();
  }
  function cleanup() { removeEventListener('keydown', bindKeys); document.removeEventListener('pointerdown', outsidePointer, true); unsubscribe?.(); launcherCleanup?.();chrome?.destroy();clearTimeout(toastTimer);clearTimeout(updateTimer); host?.remove(); host = shadow = launcher = panel = nav = workspace = live = toast = chrome = null; }
  return Object.freeze({ init, cleanup, open: () => setOpen(true), refresh: render });
})();
