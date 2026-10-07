'use strict';
const test = require('node:test'), assert = require('node:assert/strict');
const fs = require('node:fs'), path = require('node:path'), vm = require('node:vm');
function runtime() {
  const context = vm.createContext({ EXP: {}, ExtraPotionsCore: { cloneSettings: value => JSON.parse(JSON.stringify(value)) }, location: { hostname: 'example.test' } });
  vm.runInContext("globalThis.normalizations = 0; const original = String.prototype.normalize; String.prototype.normalize = function (...args) { normalizations++; return original.apply(this, args); };", context);
  for (const file of ['catalog-data.js', 'catalog.js', 'settings.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../src', file), 'utf8'), context);
  return context;
}
test('catalog and settings load defer every normalization and index', () => {
  const context = runtime(); const exp = context.EXP;
  exp.Settings.load(); exp.Settings.update({ disabledIdentities: ['bisexual'], siteOverrides: { 'example.test': { identityOverrides: { pansexual: 'off' } } } });
  assert.equal(context.normalizations, 0);
  assert.equal(exp.Catalog.status().state, 'deferred'); assert.equal(exp.Catalog.status().valid, null);
  assert.equal(context.normalizations, 0); assert.equal(exp.Catalog.status().initializations, 0);
});
test('eligible catalog access initializes exactly once', () => {
  const context = runtime(), catalog = context.EXP.Catalog;
  assert.equal(context.normalizations, 0); assert.equal(catalog.get('bisexual').id, 'bisexual');
  const count = context.normalizations; assert.ok(count > 0); assert.equal(catalog.status().initializations, 1);
  catalog.search('pride'); catalog.review('flag'); catalog.has('pansexual'); catalog.ensureInitialized();
  assert.equal(catalog.status().initializations, 1);
});
