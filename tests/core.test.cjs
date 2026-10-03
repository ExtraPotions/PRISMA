'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const coreSource = fs.readFileSync(path.resolve(__dirname, '../vendor/exp-core/exp-core.js'), 'utf8');

test('Core navigation has no unconditional polling loop', () => {
  const navigationBlock = coreSource.match(/function onNavigation[\s\S]*?(?=\n  function registerLauncher)/)?.[0] || '';
  assert.doesNotMatch(navigationBlock, /setInterval\s*\(/);
  const intervals = [...coreSource.matchAll(/setInterval\s*\(/g)];
  assert.equal(intervals.length, 1);
  assert.match(coreSource, /clearInterval\(timer\)/);
});

test('Core lifecycle is ordered and idempotent', async (t) => {
  const browser = await chromium.launch({ headless: true }); t.after(() => browser.close());
  const page = await browser.newPage(); await page.setContent('<html><body></body></html>');
  await page.addScriptTag({ content: `${coreSource};window.core=ExtraPotionsCore.createLifecycle();window.calls=[];` });
  const result = await page.evaluate(async () => { const product = core.register({ id: 'test-product', version: '1.0.0', capabilities: ['lifecycle'] }, { initialize: () => calls.push('initialize'), enable: () => calls.push('enable'), disable: () => calls.push('disable'), cleanup: () => calls.push('cleanup') }); await product.initialize(); await product.initialize(); await product.enable(); await product.enable(); await product.disable(); await product.cleanup(); await product.cleanup(); return { calls, state: product.state }; });
  assert.deepEqual(result, { calls: ['initialize', 'enable', 'disable', 'cleanup'], state: 'cleaned' });
});

test('Core rejects missing capabilities and negotiates versions', async (t) => {
  const browser = await chromium.launch({ headless: true }); t.after(() => browser.close());
  const page = await browser.newPage(); await page.setContent('<html><body></body></html>');
  await page.addScriptTag({ content: `${coreSource};window.core=ExtraPotionsCore.createLifecycle();` });
  const result = await page.evaluate(() => { let code; try { core.register({ id: 'bad', version: '1.0.0', capabilities: ['missing'] }, {}); } catch (error) { code = error.code; } return { code, newer: core.negotiate('4.0.0').selection, older: core.negotiate('2.9.9').selection, foreign: core.negotiate('9.0.0', 'foreign').compatible }; });
  assert.deepEqual(result, { code: 'CAPABILITY_MISSING', newer: 'peer-newer', older: 'local-newer', foreign: false });
});
