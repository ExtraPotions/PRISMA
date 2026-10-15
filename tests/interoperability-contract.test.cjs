'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('PRISMA delegates suite and presentation metadata to Core diagnostics bootstrap', () => {
  const source = read('src/main.js');
  assert.match(source, /registerDiagnosticsProduct\('prisma'/);
  assert.doesNotMatch(source, /registerSuiteProduct\?\./u);
  assert.doesNotMatch(source, /registerPresentationProvider\?\./u);
});

test('generated PRISMA userscript keeps the same Core-owned interoperability bootstrap', () => {
  const built = read('prisma.user.js');
  assert.match(built, /registerDiagnosticsProduct\(['"]prisma['"]/);
  assert.doesNotMatch(built, /registerSuiteProduct\?\./u);
  assert.doesNotMatch(built, /registerPresentationProvider\?\./u);
});

test('PRISMA honors shared presentation suppression before matching text', () => {
  const engine = read('src/engine.js');
  assert.ok(engine.includes("ExtraPotionsCore.isPresentationSuppressed(node?.parentElement)"));
});

test('PRISMA reaches Core through the bundle-local binding, never an unassigned global', () => {
  for (const file of fs.readdirSync(path.join(root, 'src')).filter((name) => name.endsWith('.js'))) {
    assert.doesNotMatch(read(`src/${file}`), /globalThis\.ExtraPotionsCore/u, file);
  }
});


test('PRISMA publishes compact non-identifying suite state', () => {
  const engine = read('src/engine.js');
  assert.match(engine, /ExtraPotionsCore\.publishSuiteState\('prisma', 'prisma\.state-changed'/u);
  assert.match(engine, /status:\s*value\.status/u);
  assert.match(engine, /total:\s*value\.total/u);
  assert.match(engine, /temporarilyHidden/u);
  const block = engine.slice(engine.indexOf("publishSuiteState('prisma'"), engine.indexOf('});', engine.indexOf("publishSuiteState('prisma'")) + 3);
  assert.doesNotMatch(block, /identityId|termId|matches|text|summary/u);
});


test('PRISMA rescans out-of-band WARD presentation changes without duplicating phased batches', () => {
  const source = read('src/main.js');
  assert.ok(source.includes('ExtraPotionsCore.observePresentationState((event, root) =>'));
  assert.ok(source.includes("event.source !== 'ward' || event.phase"));
  assert.ok(source.includes('scheduler.schedule(root)'));
  assert.ok(source.includes("{ source: 'ward' }"));
  assert.ok(source.includes('presentationCleanup?.()'));
});
