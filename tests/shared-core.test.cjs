'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const script = fs.readFileSync(process.env.PRISMA_TEST_SCRIPT || path.resolve(__dirname, '../prisma.user.js'), 'utf8');

async function fixture(t, prefix = '', exposeLifecycle = false) {
  const browser = await chromium.launch();
  t.after(() => browser.close());
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript({ content: prefix + (exposeLifecycle ? require('./load-source.cjs').loadSource().replace('EXP.App.start();', 'window.testPrisma = EXP; EXP.App.start();') : script) });
  await page.route('https://fixture.test/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><style>::backdrop{background:white!important;opacity:1!important;display:block!important}body{background:#17202a;color:#eee}main{min-height:3000px}</style><main><p>bisexual identity</p><button id="site-action">Site action</button></main>' }));
  await page.goto('https://fixture.test/');
  await page.waitForSelector('.exp-prisma-hit');
  return { page, errors };
}

test('startup and saved settings do not depend on native cross-realm cloning', async t => {
  const { page, errors } = await fixture(t, "window.structuredClone=()=>{throw Error('Native clone returned a foreign realm');};", true);
  await page.evaluate(() => window.testPrisma.Settings.update({ animation: true, animationStyle: 'glow', includeRomantic: true }));
  const state = await page.evaluate(() => ({ settings: window.testPrisma.Settings.snapshot(), lifecycle: window.testPrisma.App.lifecycle.state }));
  assert.equal(state.lifecycle, 'enabled');
  assert.equal(state.settings.animationStyle, 'glow');
  assert.equal(state.settings.includeRomantic, true);
  assert.equal(await page.locator('#exp-prisma-root .launcher').isVisible(), true);
  assert.deepEqual(errors, []);
});

test('document-start launcher cannot paint a hostile full-page backdrop', async t => {
  const { page, errors } = await fixture(t);
  const result = await page.locator('#exp-prisma-root').evaluate(host => {
    const backdrop = getComputedStyle(host, '::backdrop');
    return { display: backdrop.display, background: getComputedStyle(document.body).backgroundColor, popover: host.matches(':popover-open') };
  });
  assert.equal(result.popover, true);
  assert.equal(result.display, 'none');
  assert.equal(result.background, 'rgb(23, 32, 42)');
  await page.locator('#site-action').click();
  await page.evaluate(() => {
    scrollTo(0, 2400);
    const paragraph = document.createElement('p');
    paragraph.id = 'late-content';
    paragraph.textContent = 'transgender identity';
    document.querySelector('main').append(paragraph);
  });
  await page.waitForSelector('#late-content .exp-prisma-hit');
  assert.equal(await page.locator('.exp-prisma-hit .exp-prisma-hit').count(), 0);
  assert.equal(await page.locator('body').evaluate(node => getComputedStyle(node).backgroundColor), result.background);
  assert.deepEqual(errors, []);
});

test('schema-1 preferences survive the rebuild and lifecycle cleanup restores the page', async t => {
  const settings = { schema: 1, style: 'soft-fill', intensity: 'subtle', menuWidth: 'narrow', uiTheme: 'crimson', menuAutoClose: false, updateNotifications: false, disabledIdentities: ['pansexual'] };
  const { page, errors } = await fixture(t, `localStorage.setItem('exp:v3:prisma:settings', ${JSON.stringify(JSON.stringify(settings))});`, true);
  const state = await page.evaluate(() => ({
    settings: window.testPrisma.Settings.snapshot(),
    version: window.testPrisma.Updates.CURRENT_VERSION,
    core: document.getElementById('exp-prisma-root').dataset.coreVersion,
    lifecycle: window.testPrisma.App.lifecycle.state,
    style: document.querySelector('.exp-prisma-hit').dataset.style,
  }));
  for (const [key, value] of Object.entries(settings)) if (key !== 'menuWidth') assert.deepEqual(state.settings[key], value);
  assert.equal(Object.hasOwn(state.settings, 'menuWidth'), false, 'obsolete width preference is removed without resetting other settings');
  assert.equal(state.version, require('../package.json').version);
  const pinnedCore = fs.readFileSync(path.resolve(__dirname, '../vendor/exp-core/PIN'), 'utf8').trim().replace(/^v/, '');
  assert.equal(state.core, pinnedCore);
  assert.equal(state.lifecycle, 'enabled');
  assert.equal(state.style, 'soft-fill');
  await page.evaluate(async () => { await window.testPrisma.App.lifecycle.disable(); });
  assert.equal(await page.locator('.exp-prisma-hit').count(), 0);
  await page.evaluate(async () => { await window.testPrisma.App.lifecycle.enable(); });
  assert.equal(await page.locator('.exp-prisma-hit').count(), 1);
  await page.evaluate(async () => { await window.testPrisma.App.lifecycle.cleanup(); await window.testPrisma.App.lifecycle.cleanup(); });
  assert.equal(await page.locator('#exp-prisma-root').count(), 0);
  assert.equal(await page.locator('.exp-prisma-hit').count(), 0);
  assert.equal(await page.locator('main p').textContent(), 'bisexual identity');
  await page.evaluate(() => { document.querySelector('main p').textContent = 'transgender identity'; });
  await page.waitForTimeout(80);
  assert.equal(await page.locator('.exp-prisma-hit').count(), 0);
  assert.deepEqual(errors, []);
});

test('Escape cancels an import draft before closing the shared menu', async t => {
  const { page } = await fixture(t);
  await page.keyboard.press('Alt+Shift+P');
  assert.equal(await page.locator('#exp-prisma-root .panel').isVisible(), true);
  await page.locator('#exp-prisma-root [data-exp-section-tab="advanced"]').click();
  await page.locator('#exp-prisma-root').getByRole('tab',{name:'Transfer',exact:true}).click();
  await page.getByLabel('Import PRISMA settings', { exact: true }).setInputFiles({
    name: 'settings.json', mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify({ product: 'prisma', generation: 3, schema: 1, settings: { style: 'underline' } })),
  });
  await page.getByRole('button', { name: 'Apply import', exact: true }).waitFor();
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('button', { name: 'Apply import', exact: true }).count(), 0);
  assert.equal(await page.locator('#exp-prisma-root .panel').isVisible(), true);
  assert.equal(await page.locator('.exp-prisma-hit').getAttribute('data-style'), 'gradient');
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#exp-prisma-root .panel').isVisible(), false);
});

test('bundled core matches the pinned exp-core release', () => {
  const crypto = require('node:crypto');
  const bundle = fs.readFileSync(path.resolve(__dirname, '../vendor/exp-core/exp-core.js'));
  const manifest = require('../vendor/exp-core/manifest.json');
  const pin = fs.readFileSync(path.resolve(__dirname, '../vendor/exp-core/PIN'), 'utf8').trim();
  assert.equal(crypto.createHash('sha256').update(bundle).digest('hex'), manifest.bundleSha256);
  assert.equal(`v${manifest.coreVersion}`, pin);
  assert.ok(manifest.source && typeof manifest.source === 'object');
});

test('current changelog uses shared menu geometry at every width', async t => {
  const { page } = await fixture(t);
  await page.locator('#exp-prisma-root .launcher').click();
  for (const width of ['full']) {
    await page.locator('#exp-prisma-root .version').click();
    await page.waitForTimeout(80);
    const bounds = await page.locator('#exp-prisma-root').evaluate(host => {
      const panel = host.shadowRoot.querySelector('.panel').getBoundingClientRect();
      const card = host.shadowRoot.querySelector('.update-notice');
      const rect = card.getBoundingClientRect();
      return { panel: { x: panel.x, y: panel.y, right: panel.right, bottom: panel.bottom, width: panel.width }, card: { x: rect.x, y: rect.y, right: rect.right, bottom: rect.bottom, width: rect.width }, viewport: { width: innerWidth, height: innerHeight }, kind: card.dataset.noticeKind };
    });
    assert.equal(bounds.kind, 'current');
    assert.ok(Math.abs(bounds.panel.width - bounds.card.width) < 2, JSON.stringify(bounds));
    // The fixture menu is too tall for the notice to fit above it, so Core (placeNotice) must put it beside the menu:
    // on its left, 8px away, with its bottom edge lined up with the menu's bottom (launchers are anchored at the bottom).
    assert.ok(Math.abs(bounds.panel.x - bounds.card.right - 8) <= 2, JSON.stringify(bounds));
    assert.ok(Math.abs(bounds.panel.bottom - bounds.card.bottom) <= 2, JSON.stringify(bounds));
    assert.ok(bounds.card.bottom > bounds.panel.y, 'notice is beside the menu, not above it: ' + JSON.stringify(bounds));
    assert.ok(bounds.card.x >= 0 && bounds.card.y >= 0 && bounds.card.right <= bounds.viewport.width && bounds.card.bottom <= bounds.viewport.height, JSON.stringify(bounds));
    await page.locator('#exp-prisma-root .update-dismiss').click();
  }
});

test('PRISMA provides its donation control and configured destination',async t=>{const {page}=await fixture(t);await page.locator('#exp-prisma-root .launcher').click();await page.getByRole('button',{name:'Support PRISMA',exact:true}).click();const link=page.getByRole('link',{name:'Open Ko-fi'});assert.equal(await link.isVisible(),true);assert.equal(await link.getAttribute('href'),'https://ko-fi.com/expdare');});
