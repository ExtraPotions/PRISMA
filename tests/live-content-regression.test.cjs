'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const modules = ['core.js', 'settings.js', 'catalog-data.js', 'catalog.js', 'matcher.js', 'renderer.js', 'engine.js'];
const runtime = `${fs.readFileSync(path.join(root, 'vendor/exp-core/exp-core.js'), 'utf8')}\nvar EXP={};${modules.map(name => fs.readFileSync(path.join(root, 'src', name), 'utf8')).join('\n')}`;
async function setup(t) {
  const browser = await chromium.launch(); t.after(() => browser.close());
  const page = await browser.newPage();
  await page.route('**/*', route => route.abort());
  await page.setContent('<!doctype html><html><body><p id="text">lesbian</p><x-outer></x-outer></body></html>');
  await page.addScriptTag({ content: runtime });
  return page;
}

test('edited highlight text is revalidated, recounted and explained with its new identity', async t => {
  const page = await setup(t);
  await page.evaluate(() => { EXP.Settings.load(); EXP.Engine.start(); document.querySelector('.exp-prisma-hit').firstChild.nodeValue = 'ordinary'; });
  await page.waitForFunction(() => EXP.Engine.snapshot().total === 0, null, { timeout: 2000 });
  assert.equal(await page.locator('.exp-prisma-hit').count(), 0);
  await page.evaluate(() => { document.querySelector('#text').textContent = 'lesbian'; EXP.Engine.processBatch([document.querySelector('#text')]); document.querySelector('.exp-prisma-hit').textContent = 'bisexual'; });
  await page.waitForFunction(() => document.querySelector('.exp-prisma-hit')?.dataset.identity === 'bisexual', null, { timeout: 2000 });
  assert.equal(await page.evaluate(() => EXP.Engine.snapshot().total), 1);
  assert.equal(await page.evaluate(() => EXP.Engine.explain(document.querySelector('.exp-prisma-hit').dataset.matchId).identity.id), 'bisexual');
  await page.evaluate(() => { const foreign = document.createElement('span'); foreign.id = 'foreign'; foreign.className = 'exp-prisma-hit'; foreign.innerHTML = '<b>Page-owned markup</b>'; document.body.append(foreign); foreign.firstChild.textContent = 'Updated page markup'; });
  await page.waitForTimeout(100);
  assert.equal(await page.locator('#foreign > b').textContent(), 'Updated page markup');
});

test('nested open shadow roots and later shadow content are scanned, then observers stop', async t => {
  const page = await setup(t);
  await page.evaluate(() => {
    const shadow = document.querySelector('x-outer').attachShadow({ mode: 'open' });
    shadow.innerHTML = '<p>lesbian</p><x-inner></x-inner>';
    shadow.querySelector('x-inner').attachShadow({ mode: 'open' }).innerHTML = '<p>bisexual</p>';
    EXP.Settings.load(); EXP.Engine.start();
  });
  assert.equal(await page.evaluate(() => EXP.Engine.snapshot().total), 3);
  await page.evaluate(() => { const p = document.createElement('p'); p.id = 'late'; p.textContent = 'lesbian'; document.querySelector('x-outer').shadowRoot.append(p); });
  await page.waitForFunction(() => EXP.Engine.snapshot().total === 4, null, { timeout: 2000 });
  await page.evaluate(() => EXP.Engine.stop());
  assert.equal(await page.locator('.exp-prisma-hit').count(), 0);
  await page.evaluate(() => { document.querySelector('x-outer').shadowRoot.querySelector('#late').textContent = 'bisexual'; });
  await page.waitForTimeout(100);
  assert.equal(await page.evaluate(() => EXP.Engine.snapshot().total), 0);
});
