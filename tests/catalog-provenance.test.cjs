'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
function catalog() {
  const context = { EXP: {} };
  for (const file of ['catalog-data.js', 'catalog.js']) vm.runInNewContext(fs.readFileSync(path.join(root, 'src', file), 'utf8'), context);
  return context.EXP.Catalog;
}
test('every catalog entry has an individual definition and flag review without gaps', () => {
  const data = catalog();
  const review = JSON.parse(fs.readFileSync(path.join(root, 'docs/catalog-review.json'), 'utf8'));
  assert.equal(review.entries.length, data.identities.length);
  assert.equal(new Set(review.entries.map(entry => entry.id)).size, data.identities.length);
  for (const item of data.identities) {
    const record = review.entries.find(entry => entry.id === item.id);
    assert.ok(record, item.id);
    assert.ok(record.definitionEvidence, item.id + ' definition evidence or limitation');
    assert.ok(record.flagEvidence, item.id + ' flag evidence or limitation');
    assert.ok(['documented', 'unresolved'].includes(item.flag.reviewStatus), item.id);
    if (item.flag.reviewStatus === 'documented') assert.ok(item.flag.sources.length && item.flag.variant, item.id);
    else assert.ok(item.flag.note, item.id);
    if (item.definitionStatus === 'public-reference') assert.ok(item.definition && item.sources.length, item.id);
    if (item.flag.status === 'verified') assert.ok(item.flag.source && item.flag.variant && item.colors.length, item.id);
  }
});
test('creator-specified intersex colors preserve background and emblem order', () => {
  const item = catalog().get('intersex');
  assert.deepEqual(Array.from(item.colors), ['#FFD800', '#7902AA']);
  assert.equal(item.flag.source, 'https://morgancarpenter.com/intersex-flag/');
  assert.equal(item.flag.status, 'verified');
  assert.match(item.flag.variant, /Morgan Carpenter/);
});
test('broader recognition groups disclose the difference from the selected flag identity', () => {
  const data = catalog();
  assert.match(data.get('gay').recognitionNote, /not exact synonyms/);
  assert.match(data.get('lesbian').recognitionNote, /broader than lesbian/);
  assert.match(data.get('demimasc').recognitionNote, /not always interchangeable/);
});
