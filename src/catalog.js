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
  const identities = EXP.CatalogData.map((source) => {
    const terms = source.words.map((text, index) => {
      const normalized = normalize(text);
      const isAmbiguous = ambiguous.has(normalized);
      return Object.freeze({
        id: `${source.id}:${slug(text) || index}`,
        text,
        normalized,
        kind: isAmbiguous ? 'shorthand' : index === 0 ? 'canonical' : /[\s/-]/.test(text) ? 'explicit-phrase' : 'alias',
        casePolicy: acronym.has(normalized) ? 'acronym-preferred' : 'insensitive',
        contextRuleId: isAmbiguous ? `context:${normalized}` : 'context:none',
        decisionFloor: isAmbiguous ? 'supported' : 'explicit',
        allowInclusive: inclusiveAllowed.has(normalized),
        negatives: Object.freeze(negativeByTerm[normalized] || [])
      });
    });
    return Object.freeze({ id: source.id, label: source.label, colors: Object.freeze([...source.colors]), terms: Object.freeze(terms), defaultEnabled: true });
  });
  const byId = new Map(identities.map((item) => [item.id, item]));
  const termMap = new Map();
  for (const identity of identities) for (const term of identity.terms) {
    if (!termMap.has(term.normalized)) termMap.set(term.normalized, []);
    termMap.get(term.normalized).push(Object.freeze({ identity, term }));
  }
  const collisions = [...termMap].filter(([, records]) => new Set(records.map(({ identity }) => identity.id)).size > 1).map(([term, records]) => Object.freeze({ term, identities: Object.freeze(records.map(({ identity }) => identity.id)) }));
  const invalid = [];
  if (identities.length !== 59) invalid.push('CATALOG_IDENTITY_COUNT');
  if (identities.reduce((total, identity) => total + identity.terms.length, 0) !== 124) invalid.push('CATALOG_TERM_COUNT');
  if (byId.size !== identities.length) invalid.push('CATALOG_DUPLICATE_ID');
  if (identities.some((identity) => !/^[a-z][a-z0-9-]+$/.test(identity.id) || !identity.colors.length || identity.colors.some((color) => !/^#[0-9a-f]{6}$/i.test(color)))) invalid.push('CATALOG_SCHEMA');
  if (collisions.length) invalid.push('CATALOG_TERM_COLLISION');
  const search = (query = '') => { const needle = normalize(query.trim()); return identities.filter((identity) => !needle || normalize(identity.label).includes(needle) || identity.terms.some((term) => term.normalized.includes(needle))); };
  const status = () => Object.freeze({ valid: invalid.length === 0, errors: Object.freeze([...invalid]), identities: identities.length, terms: [...termMap.values()].reduce((n, items) => n + items.length, 0), collisions: collisions.length });
  return Object.freeze({ identities: Object.freeze(identities), termMap, collisions: Object.freeze(collisions), positiveWords, normalize, has: (id) => byId.has(id), get: (id) => byId.get(id), search, status });
})();
