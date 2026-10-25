EXP.Settings = (() => {
  const PREFIX = 'exp:v3:prisma';
  const SCHEMA = 1;
  const memory = new Map();
  const defaults = Object.freeze({
    schema: SCHEMA,
    enabled: true,
    style: 'gradient',
    intensity: 'balanced',
    animation: false,
    animationStyle: 'pulse',
    labels: false,
    matcherMode: 'balanced',
    ambiguityProtection: true,
    surroundingContext: true,
    includeRomantic: false,
    disabledIdentities: [],
    reducedMotion: 'system',
    highContrast: false,
    nonColorIndicator: 'underline',
    screenReaderBehavior: 'original-text',
    safeMode: false,
    shortcut: '',
    launcherPosition: 'automatic-end-bottom',
    uiTheme: 'prisma',
    menuAutoClose: true,
    menuNotifications: true,
    updateNotifications: true,
    siteOverrides: {},
    ignoredPhrases: [],
    sensitiveSiteOptIns: [],
    exclusions: []
  });
  let state;
  const listeners = new Set();
  const key = (name) => `${PREFIX}:${name}`;
  let storageError='',invalidSaved,unsaved=false,readFailed=false;
  const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
  function managerWrite(storageKey,value) {
    if(typeof GM_setValue!=='function'||typeof GM_getValue!=='function')throw Error('Manager storage is unavailable. Changes are temporary.');
    GM_setValue(storageKey,ExtraPotionsCore.cloneSettings(value));
    if(!same(GM_getValue(storageKey,undefined),value))throw Error('Settings were not saved. Retry saving.');
  }
  function pageCopy(storageKey){try{return localStorage.getItem(storageKey);}catch{return null;}}
  // Preserve the exact legacy bytes in isolated storage before removing a page-readable copy.
  function archivePageCopy(storageKey) {
    const text=pageCopy(storageKey);if(text===null)return;
    const backup=key('page-settings-backup:'+encodeURIComponent(location.origin||location.hostname));
    const previous=typeof GM_getValue==='function'?GM_getValue(backup,[]):[];
    const copies=Array.isArray(previous)?previous:[];
    managerWrite(backup,copies.includes(text)?copies:[...copies,text]);
    localStorage.removeItem(storageKey);
  }
  function rawRead(name) {
    if(ExtraPotionsCore.productDataResetting?.('prisma'))return undefined;
    const storageKey=key(name);
    if(unsaved&&memory.has(storageKey))return memory.get(storageKey);
    readFailed=false;
    try {
      if(typeof GM_getValue==='function'){
        const value=GM_getValue(storageKey,undefined);
        if(value!==undefined)return value;
      }
      const text=pageCopy(storageKey);
      return text===null?memory.get(storageKey):JSON.parse(text);
    } catch {readFailed=true;storageError='Saved data could not be read. Reload or export before retrying.';return memory.get(storageKey);}
  }
  function rawWrite(name,value) {
    if(ExtraPotionsCore.productDataResetting?.('prisma'))return false;
    const storageKey=key(name);memory.set(storageKey,ExtraPotionsCore.cloneSettings(value));
    try {managerWrite(storageKey,value);unsaved=false;storageError='';
      try{archivePageCopy(storageKey);}catch{storageError='Settings saved. A legacy page copy could not be archived.';}
      return true;
    }catch{unsaved=true;storageError='Settings are temporary. Storage is unavailable; retry saving.';return false;}
  }
  const isHost = (value) => typeof value === 'string' && value.length > 0 && value.length <= 253 && !/[/?#\s]/.test(value);
  const uniqueStrings = (value, maximum = 500) => Array.isArray(value) ? [...new Set(value.filter((item) => typeof item === 'string'))].slice(0, maximum) : [];
  function validate(candidate) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw Object.assign(new Error('Settings must be an object'), { code: 'SETTINGS_TYPE' });
    const next = ExtraPotionsCore.cloneSettings(defaults);
	const themeAliases = { warm: 'ember', discord: 'glacier', pine: 'verdant', obsidian: 'contrast' };
	const normalizedUiTheme = themeAliases[candidate.uiTheme] || candidate.uiTheme;
    for (const name of ['enabled', 'animation', 'labels', 'ambiguityProtection', 'surroundingContext', 'includeRomantic', 'highContrast', 'safeMode', 'updateNotifications', 'menuAutoClose', 'menuNotifications']) if (typeof candidate[name] === 'boolean') next[name] = candidate[name];
    const enums = {
      animationStyle: ['pulse', 'shimmer', 'glow'],
      style: ['gradient', 'underline', 'soft-fill'], intensity: ['subtle', 'balanced', 'vivid'], matcherMode: ['strict', 'balanced', 'inclusive'],
      reducedMotion: ['system', 'reduce', 'allow'], nonColorIndicator: ['underline', 'outline', 'off'],
      screenReaderBehavior: ['original-text', 'announce-on-focus'], launcherPosition: ['automatic-end-bottom', 'end-top', 'end-bottom', 'start-top', 'start-bottom'], uiTheme: ['ember', 'midnight', 'glacier', 'contrast', 'verdant', 'pride', 'crimson', 'prisma']
    };
    for (const [name, values] of Object.entries(enums)) {
	  const value = name === 'uiTheme' ? normalizedUiTheme : candidate[name];
	  if (values.includes(value)) next[name] = value;
	}
    next.disabledIdentities = uniqueStrings(candidate.disabledIdentities).filter((id) => EXP.Catalog?.hasRaw(id) ?? /^[a-z][a-z0-9-]+$/.test(id));
    next.ignoredPhrases=uniqueStrings(candidate.ignoredPhrases,200).filter(v=>v.trim()&&v.length<=200).map(v=>v.trim());
    next.sensitiveSiteOptIns = EXP.SitePolicy?.validateOptIns(candidate.sensitiveSiteOptIns) || [];
    next.exclusions = uniqueStrings(candidate.exclusions).filter(isHost);
    if (typeof candidate.shortcut === 'string' && candidate.shortcut.length <= 40) next.shortcut = candidate.shortcut;
    if (candidate.siteOverrides && typeof candidate.siteOverrides === 'object' && !Array.isArray(candidate.siteOverrides)) {
      for (const [host, value] of Object.entries(candidate.siteOverrides)) {
        if (!isHost(host) || !value || typeof value !== 'object' || Array.isArray(value)) continue;
        const site = {};
        site.ignoredPhrases=uniqueStrings(value.ignoredPhrases,200).filter(v=>v.trim()&&v.length<=200).map(v=>v.trim());
        if (['strict', 'balanced', 'inclusive'].includes(value.matcherMode)) site.matcherMode = value.matcherMode;
        if (typeof value.ambiguityProtection === 'boolean') site.ambiguityProtection = value.ambiguityProtection;
        if (typeof value.surroundingContext === 'boolean') site.surroundingContext = value.surroundingContext;
        if (value.identityOverrides && typeof value.identityOverrides === 'object' && !Array.isArray(value.identityOverrides)) {
          site.identityOverrides = Object.fromEntries(Object.entries(value.identityOverrides).filter(([id, mode]) => (EXP.Catalog?.hasRaw(id) ?? true) && ['on', 'off'].includes(mode)));
        }
        next.siteOverrides[host] = site;
      }
    }
    return next;
  }
  function load() {
    const stored = rawRead('settings');
    if(unsaved&&state)return snapshot();
    try{state = validate(stored ?? defaults);invalidSaved=undefined;}
    catch{invalidSaved=ExtraPotionsCore.cloneSettings(stored);state=ExtraPotionsCore.cloneSettings(defaults);state.safeMode=true;storageError='Saved settings need recovery. Original data is preserved.';return snapshot();}
    if(readFailed){state.safeMode=true;return snapshot();}
    rawWrite('settings', state);
    return snapshot();
  }
  function snapshot() { return ExtraPotionsCore.cloneSettings(state || defaults); }
  function diagnosticSnapshot(value = snapshot()) {
    const { ignoredPhrases, siteOverrides, disabledIdentities, exclusions, sensitiveSiteOptIns, ...settings } = value;
    return { ...settings, ignoredPhraseCount: ignoredPhrases.length, siteOverrideCount: Object.keys(siteOverrides).length, disabledIdentityCount: disabledIdentities.length, exclusionCount: exclusions.length, sensitiveSiteOptInCount: sensitiveSiteOptIns.length };
  }
  function replace(value,reason='replace') {
    if(ExtraPotionsCore.productDataResetting?.('prisma'))return snapshot();
    if(readFailed){storageError='Saved data is unreadable. Retry before changing settings.';return snapshot();}
    const next=validate(value);
    if(invalidSaved!==undefined){
      try{managerWrite(key('recovery:'+Date.now()),invalidSaved);}catch{storageError='Original data could not be backed up. Retry recovery.';return snapshot();}
    }
    state=next;invalidSaved=undefined;rawWrite('settings',next);
    for(const listener of listeners)listener(snapshot(),reason);return snapshot();
  }
  function storageStatus(){return {error:storageError,unsaved,recovery:invalidSaved!==undefined};}
  function recoveryData(){return {product:'prisma',saved:invalidSaved===undefined?rawRead('settings'):ExtraPotionsCore.cloneSettings(invalidSaved)};}
  function retrySave(){if(readFailed){rawRead('settings');if(readFailed)return snapshot();storageError='';return load();}if(invalidSaved!==undefined)return replace({...defaults,safeMode:true},'recover-settings');rawWrite('settings',snapshot());for(const listener of listeners)listener(snapshot(),'retry-save');return snapshot();}
  function update(patch, reason = 'update') { return replace({ ...snapshot(), ...patch }, reason); }
  function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  function effective(host = location.hostname) {
    const current = snapshot();
    const site = current.siteOverrides[host] || {};
    const disabled = new Set(current.disabledIdentities);
    for (const [id, mode] of Object.entries(site.identityOverrides || {})) { if (mode === 'off') disabled.add(id); else disabled.delete(id); }
    const sensitiveBlocked = Boolean(EXP.SitePolicy?.blocked(host, current));
    return { ...current, ...site, ignoredPhrases:[...current.ignoredPhrases,...(site.ignoredPhrases||[])], disabledIdentities: [...disabled], sensitiveBlocked, excluded: current.exclusions.includes(host) || sensitiveBlocked };
  }
  function exportData() { return { product: 'prisma', generation: 3, schema: SCHEMA, settings: snapshot() }; }
  function prepareImport(payload) {
    if (!payload || payload.product !== 'prisma' || payload.generation !== 3 || payload.schema !== SCHEMA) throw Object.assign(new Error('This is not a supported PRISMA export'), { code: 'IMPORT_SCHEMA' });
    return validate(payload.settings);
  }
  function resetAll() {
    ExtraPotionsCore.clearProductData('prisma');
    memory.clear();storageError='';invalidSaved=undefined;unsaved=false;state = ExtraPotionsCore.cloneSettings(defaults);
    for (const listener of listeners) listener(snapshot(), 'product-reset');
    return snapshot();
  }
  return Object.freeze({storageStatus,recoveryData,retrySave,resetAll, PREFIX, SCHEMA, defaults, validate, load, snapshot, diagnosticSnapshot, replace, update, subscribe, effective, exportData, prepareImport, hasStored: () => rawRead('settings') !== undefined });
})();
