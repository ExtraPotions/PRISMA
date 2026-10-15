'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const script = fs.readFileSync(path.resolve(__dirname, '..', 'prisma.user.js'), 'utf8');

test('Highlights tab carries exactly one primary action, Next Match, and the header shows health status', async (t) => {
  const browser = await chromium.launch({ headless: true }); t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  await page.addInitScript(() => {
    const values = new Map();
    window.GM_getValue = (key, fallback) => values.has(key) ? values.get(key) : fallback;
    window.GM_setValue = (key, value) => values.set(key, structuredClone(value));
    window.GM_xmlhttpRequest = () => {};
  });
  await page.route('https://menu.test/**', (route) => route.fulfill({ contentType: 'text/html', body: '<!doctype html><main>bisexual pansexual</main>' }));
  await page.goto('https://menu.test/');
  await page.addScriptTag({ content: script });
  await page.waitForSelector('#exp-prisma-root', { state: 'attached' });
  const host = page.locator('#exp-prisma-root');
  await host.locator('.launcher').click();
  assert.equal(await host.locator('[data-exp-primary="1"]').count(), 1);
  assert.equal((await host.locator('[data-exp-primary="1"]').textContent()).trim(), 'Next Match');
  assert.equal(await host.locator('[data-exp-menu-status="1"]').count(), 1);
});
