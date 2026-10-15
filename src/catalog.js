EXP.Catalog = (() => {
  const ambiguous = new Set(['queer', 'gay', 'mlm', 'wlw', 'demi', 'cupio', 'fray', 'lithro', 'akoi', 'androgynous', 'omni', 'abro', 'multi', 'qpr', 'butch', 'femme', 'questioning']);
  const inclusiveAllowed = new Set(['queer', 'gay', 'wlw', 'butch', 'femme', 'questioning']);
  const acronym = new Set(['mlm', 'wlw', 'qpr']);
  const positiveWords = Object.freeze(['identity', 'identities', 'identifies', 'orientation', 'sexuality', 'gender', 'pride', 'flag', 'community', 'lgbt', 'lgbtq', 'lgbtqia', 'asexual', 'aromantic', 'trans', 'nonbinary']);
  const negativeByTerm = Object.freeze({
    mlm: ['marketing', 'sales', 'scheme', 'company', 'business'], qpr: ['quarterly', 'progress review', 'report'], demi: ['lovato', 'moore', 'god'],
    fray: ['edge', 'edges', 'fabric', 'rope', 'battle'], omni: ['channel', 'hotel', 'resort', 'broadcast'], multi: ['factor', 'purpose', 'player', 'color', 'million'],
    gay: ['gale'], questioning: ['witness', 'suspect', 'police']
  });
  const normalize = (value) => String(value).normalize('NFKC').toLocaleLowerCase('en-US');
  const slug = (value) => normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let initialized, initializations = 0, rawIds;
  function hasRaw(id) { rawIds ||= new Set(EXP.CatalogData.map(item => item.id)); return rawIds.has(id); }
  function ensureInitialized() {
    if (initialized) return initialized;
    const identities = EXP.CatalogData.map((source) => {
      const terms = source.words.map((text, index) => {
        const normalized = normalize(text);
        const requiresIdentityContext = (source.contextTerms || []).some(value => normalize(value) === normalized);
        const isAmbiguous = ambiguous.has(normalized) || requiresIdentityContext;
        return Object.freeze({
          id: `${source.id}:${slug(text) || index}`,
          text,
          normalized,
          kind: isAmbiguous ? 'shorthand' : index === 0 ? 'canonical' : /[\s/-]/.test(text) ? 'explicit-phrase' : 'alias',
          casePolicy: acronym.has(normalized) ? 'acronym-preferred' : 'insensitive',
          contextRuleId: isAmbiguous ? `context:${normalized}` : 'context:none',
          decisionFloor: isAmbiguous ? 'supported' : 'explicit',
          requiresIdentityContext,
          allowInclusive: inclusiveAllowed.has(normalized),
          negatives: Object.freeze(negativeByTerm[normalized] || [])
        });
      });
      return Object.freeze({ id: source.id, label: source.label, colors: Object.freeze([...source.colors]), terms: Object.freeze(terms), definition: source.definition || '', definitionStatus: source.definitionStatus || 'pending', recognitionNote: source.recognitionNote || '', romantic: source.romantic === true, verification: Object.freeze({status: source.verification?.status || 'unverified', sources: Object.freeze([...(source.verification?.sources || [])])}), category: source.category || 'Community term', sources: Object.freeze([...(source.sources || [])]), flag: Object.freeze({ ...source.flag, sources: Object.freeze([...(source.flag?.sources || [])]) }), defaultEnabled: true });
    });
    const byId = new Map(identities.map((item) => [item.id, item]));
    const termMap = new Map();
    for (const identity of identities) for (const term of identity.terms) {
      if (!termMap.has(term.normalized)) termMap.set(term.normalized, []);
      termMap.get(term.normalized).push(Object.freeze({ identity, term }));
    }
    const collisions = [...termMap].filter(([, records]) => new Set(records.map(({ identity }) => identity.id)).size > 1).map(([term, records]) => Object.freeze({ term, identities: Object.freeze(records.map(({ identity }) => identity.id)) }));
    const invalid = [];
    if (!identities.length || identities.some(identity => !identity.terms.length)) invalid.push('CATALOG_EMPTY');
    if (byId.size !== identities.length) invalid.push('CATALOG_DUPLICATE_ID');
    if (identities.some((identity) => !/^[a-z][a-z0-9-]+$/.test(identity.id) || (!identity.colors.length && identity.flag.status !== 'unverified') || identity.colors.some((color) => !/^#[0-9a-f]{6}$/i.test(color)) || identity.sources.some(url => !/^https:\/\//.test(url)))) invalid.push('CATALOG_SCHEMA');
    if (identities.some(identity => [...identity.flag.sources, identity.flag.source].filter(Boolean).some(url => !/^https:\/\//.test(url)) || (identity.flag.status === 'verified' && (!identity.flag.source || !identity.flag.variant)))) invalid.push('CATALOG_FLAG_REFERENCE');
    if (collisions.length) invalid.push('CATALOG_TERM_COLLISION');
    initialized = Object.freeze({ identities: Object.freeze(identities), byId, termMap, collisions: Object.freeze(collisions), invalid: Object.freeze(invalid) });
    initializations += 1;
    return initialized;
  }
  const search = (query = '') => { const { identities } = ensureInitialized(); const needle = normalize(query.trim()); return identities.filter((identity) => !needle || normalize(identity.label).includes(needle) || normalize(identity.definition).includes(needle) || identity.terms.some((term) => term.normalized.includes(needle))); };
  const evidenceGaps = identity => ({definition:identity.definitionStatus!=='public-reference',flag:identity.flag.reviewStatus!=='documented',palette:identity.flag.status!=='verified'});
  const review = (kind='any') => ensureInitialized().identities.filter(identity=>{const gaps=evidenceGaps(identity);return kind==='any'?Object.values(gaps).some(Boolean):Boolean(gaps[kind]);});
  const status = () => {
    if (!initialized) return Object.freeze({ state: 'deferred', valid: null, errors: Object.freeze([]), identities: 0, terms: 0, collisions: 0, initializations });
    const { invalid, identities, termMap, collisions } = initialized;
    return Object.freeze({ state: 'initialized', valid: invalid.length === 0, errors: invalid, identities: identities.length, terms: [...termMap.values()].reduce((n, items) => n + items.length, 0), collisions: collisions.length, initializations });
  };
  return Object.freeze({ ensureInitialized, hasRaw, get identities() { return ensureInitialized().identities; }, evidenceGaps, review, get termMap() { return ensureInitialized().termMap; }, get collisions() { return ensureInitialized().collisions; }, positiveWords, normalize, has: id => ensureInitialized().byId.has(id), get: id => ensureInitialized().byId.get(id), search, status });
})();
