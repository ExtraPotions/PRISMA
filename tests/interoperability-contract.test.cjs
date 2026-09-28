'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('PRISMA delegates its suite interoperability metadata to Core', () => {
  const source = read('src/main.js');
  const suiteStart = source.indexOf('registerSuiteProduct?.({');
  const presentationStart = source.indexOf('registerPresentationProvider?.({');
  const diagnosticsStart = source.indexOf('registerDiagnosticsProduct');
  assert.ok(suiteStart >= 0);
  assert.ok(presentationStart > suiteStart);
  assert.ok(diagnosticsStart > presentationStart);
  const suiteBlock = source.slice(suiteStart, presentationStart);
  const presentationBlock = source.slice(presentationStart, diagnosticsStart);
  assert.ok(suiteBlock.includes("productId: 'prisma'"));
  assert.ok(suiteBlock.includes('productVersion: EXP.VERSION'));
  assert.doesNotMatch(suiteBlock, /capabilities\s*:/u);
  assert.ok(presentationBlock.includes("productId: 'prisma'"));
  assert.doesNotMatch(presentationBlock, /phases\s*:/u);
});

test('generated PRISMA userscript carries the delegated interoperability registration', () => {
  const built = read('prisma.user.js');
  const suiteStart = built.indexOf('registerSuiteProduct?.({');
  const presentationStart = built.indexOf('registerPresentationProvider?.({');
  assert.ok(suiteStart >= 0);
  assert.ok(presentationStart > suiteStart);
  assert.ok(built.slice(suiteStart, presentationStart).includes("productId: 'prisma'"));
});

test('PRISMA uses the shared presentation contract at its existing engine gate', () => {
  const engine = read('src/engine.js');
  assert.ok(engine.includes("globalThis.ExtraPotionsCore?.isPresentationSuppressed?.(node?.parentElement)"));
});
