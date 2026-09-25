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
    labels: false,
    matcherMode: 'balanced',
    ambiguityProtection: true,
    surroundingContext: true,
    disabledIdentities: [],
    reducedMotion: 'system',
    highContrast: false,
    nonColorIndicator: 'underline',
    screenReaderBehavior: 'original-text',
    safeMode: false,
    shortcut: '',
    launcherPosition: 'automatic-end-bottom',
    menuWidth: 'compact',
    uiTheme: 'prisma',
    menuAutoClose: true,
    menuNotifications: true,
    updateNotifications: false,
    siteOverrides: {},
    exclusions: []
  });
  let state;
  const listeners = new Set();
  const key = (name) => `${PREFIX}:${name}`;
  function rawRead(name) {
    const storageKey = key(name);
    try {
      if (typeof GM_getValue === 'function') {
        const value = GM_getValue(storageKey, undefined);
        if (value !== undefined) return value;
      }
    } catch {}
    try {
      const value = localStorage.getItem(storageKey);
      if (value !== null) {
        const parsed = JSON.parse(value);
        memory.set(storageKey, parsed);
        try { if (typeof GM_setValue === 'function') GM_setValue(storageKey, parsed); } catch {}
        return parsed;
      }
    } catch {}
    return memory.get(storageKey);
  }
  function rawWrite(name, value) {
    const storageKey = key(name);
    memory.set(storageKey, value);
    try { if (typeof GM_setValue === 'function') GM_setValue(storageKey, value); } catch {}
    try { localStorage.setItem(storageKey, JSON.stringify(value)); } catch {}
  }
  const isHost = (value) => typeof value === 'string' && value.length > 0 && value.length <= 253 && !/[/?#\s]/.test(value);
  const uniqueStrings = (value, maximum = 500) => Array.isArray(value) ? [...new Set(value.filter((item) => typeof item === 'string'))].slice(0, maximum) : [];
  function validate(candidate) {
    if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) throw Object.assign(new Error('Settings must be an object'), { code: 'SETTINGS_TYPE' });
    const next = structuredClone(defaults);
	const themeAliases = { warm: 'ember', discord: 'glacier', pine: 'verdant', obsidian: 'contrast' };
	const normalizedUiTheme = themeAliases[candidate.uiTheme] || candidate.uiTheme;
    for (const name of ['enabled', 'animation', 'labels', 'ambiguityProtection', 'surroundingContext', 'highContrast', 'safeMode', 'updateNotifications', 'menuAutoClose', 'menuNotifications']) if (typeof candidate[name] === 'boolean') next[name] = candidate[name];
    const enums = {
      style: ['gradient', 'underline', 'soft-fill'], intensity: ['subtle', 'balanced', 'vivid'], matcherMode: ['strict', 'balanced', 'inclusive'],
      reducedMotion: ['system', 'reduce', 'allow'], nonColorIndicator: ['underline', 'outline', 'off'],
      screenReaderBehavior: ['original-text', 'announce-on-focus'], launcherPosition: ['automatic-end-bottom', 'end-top', 'end-bottom', 'start-top', 'start-bottom'], menuWidth: ['full', 'compact', 'narrow'], uiTheme: ['ember', 'midnight', 'glacier', 'contrast', 'verdant', 'pride', 'crimson', 'prisma']
    };
    for (const [name, values] of Object.entries(enums)) {
	  const value = name === 'uiTheme' ? normalizedUiTheme : candidate[name];
	  if (values.includes(value)) next[name] = value;
	}
    next.disabledIdentities = uniqueStrings(candidate.disabledIdentities).filter((id) => EXP.Catalog?.has(id) ?? /^[a-z][a-z0-9-]+$/.test(id));
    next.exclusions = uniqueStrings(candidate.exclusions).filter(isHost);
    if (typeof candidate.shortcut === 'string' && candidate.shortcut.length <= 40) next.shortcut = candidate.shortcut;
    if (candidate.siteOverrides && typeof candidate.siteOverrides === 'object' && !Array.isArray(candidate.siteOverrides)) {
      for (const [host, value] of Object.entries(candidate.siteOverrides)) {
        if (!isHost(host) || !value || typeof value !== 'object' || Array.isArray(value)) continue;
        const site = {};
        if (['strict', 'balanced', 'inclusive'].includes(value.matcherMode)) site.matcherMode = value.matcherMode;
        if (typeof value.ambiguityProtection === 'boolean') site.ambiguityProtection = value.ambiguityProtection;
        if (typeof value.surroundingContext === 'boolean') site.surroundingContext = value.surroundingContext;
        if (value.identityOverrides && typeof value.identityOverrides === 'object' && !Array.isArray(value.identityOverrides)) {
          site.identityOverrides = Object.fromEntries(Object.entries(value.identityOverrides).filter(([id, mode]) => (EXP.Catalog?.has(id) ?? true) && ['on', 'off'].includes(mode)));
        }
        next.siteOverrides[host] = site;
      }
    }
    return next;
  }
  function load() {
    const stored = rawRead('settings');
    state = validate(stored || defaults);
    rawWrite('settings', state);
    return snapshot();
  }
  function snapshot() { return structuredClone(state || defaults); }
  function replace(value, reason = 'replace') { const next = validate(value); rawWrite('settings', next); state = next; for (const listener of listeners) listener(snapshot(), reason); return snapshot(); }
  function update(patch, reason = 'update') { return replace({ ...snapshot(), ...patch }, reason); }
  function subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); }
  function effective(host = location.hostname) {
    const current = snapshot();
    const site = current.siteOverrides[host] || {};
    const disabled = new Set(current.disabledIdentities);
    for (const [id, mode] of Object.entries(site.identityOverrides || {})) { if (mode === 'off') disabled.add(id); else disabled.delete(id); }
    return { ...current, ...site, disabledIdentities: [...disabled], excluded: current.exclusions.includes(host) };
  }
  function exportData() { return { product: 'prisma', generation: 3, schema: SCHEMA, settings: snapshot() }; }
  function prepareImport(payload) {
    if (!payload || payload.product !== 'prisma' || payload.generation !== 3 || payload.schema !== SCHEMA) throw Object.assign(new Error('This is not a supported PRISMA V3 export'), { code: 'IMPORT_SCHEMA' });
    return validate(payload.settings);
  }
  return Object.freeze({ PREFIX, SCHEMA, defaults, validate, load, snapshot, replace, update, subscribe, effective, exportData, prepareImport, hasStored: () => rawRead('settings') !== undefined });
})();
