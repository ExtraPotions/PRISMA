'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = relative => fs.readFileSync(path.join(root, relative), 'utf8');

test('PRISMA declares its suite interoperability capabilities', () => {
  const source = read('src/main.js');
  assert.match(source, /registerSuiteProduct\?\./u);
  for (const capability of ['text.identity-detection', 'text.identity-highlighting', 'identity.catalog']) {
    assert.match(source, new RegExp(capability.replace('.', '\\.')));
  }
});

test('generated PRISMA userscript carries the same suite declaration', () => {
  const built = read('prisma.user.js');
  assert.match(built, /productId:\s*'prisma'/u);
  assert.match(built, /text\.identity-highlighting/u);
});


test('PRISMA declares its presentation interoperability phase', () => {
  const source = read('src/main.js');
  assert.match(source, /registerPresentationProvider\\?\\./u);
  assert.match(source, /productId:\\s*'prisma'/u);
  assert.match(source, /'annotate'/u);
});


test('PRISMA honors shared presentation suppression before matching text', () => {
  const source = read('src/engine.js');
  assert.match(source, /isPresentationSuppressed\\?\\.\\(node\\?\\.parentElement\\)/u);
});
