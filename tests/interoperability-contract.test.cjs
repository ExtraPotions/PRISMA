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
  assert.match(built, /registerDiagnosticsProduct\('prisma'/);
  assert.doesNotMatch(built, /registerSuiteProduct\?\./u);
  assert.doesNotMatch(built, /registerPresentationProvider\?\./u);
});

test('PRISMA honors shared presentation suppression before matching text', () => {
  const engine = read('src/engine.js');
  assert.ok(engine.includes("globalThis.ExtraPotionsCore?.isPresentationSuppressed?.(node?.parentElement)"));
});
