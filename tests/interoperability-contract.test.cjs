'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('PRISMA declares its suite interoperability capabilities', () => {
  const source = read('src/main.js');
  assert.ok(source.includes('registerSuiteProduct?.({'));
  assert.ok(source.includes('text.identity-detection'));
  assert.ok(source.includes('text.identity-highlighting'));
  assert.ok(source.includes('identity.catalog'));
});

test('generated PRISMA userscript carries the same suite declaration', () => {
  const built = read('prisma.user.js');
  assert.ok(built.includes("productId: 'prisma'"));
  assert.ok(built.includes('text.identity-detection'));
});

test('PRISMA declares its presentation interoperability phase', () => {
  const source = read('src/main.js');
  assert.ok(source.includes('registerPresentationProvider?.({'));
  assert.ok(source.includes("productId: 'prisma'"));
  assert.ok(source.includes('"annotate"'));
});

test('PRISMA uses the shared presentation contract at its existing engine gate', () => {
  const engine = read('src/engine.js');
  assert.ok(engine.includes("isPresentationSuppressed?.(node?.parentElement)"));
});
