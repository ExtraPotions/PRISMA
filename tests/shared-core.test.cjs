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
  await page.addInitScript({ content: prefix + (exposeLifecycle ? script.replace('EXP.App.start();', 'window.testPrisma = EXP; EXP.App.start();') : script) });
  await page.route('https://fixture.test/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><style>::backdrop{background:white!important;opacity:1!important;display:block!important}body{background:#17202a;color:#eee}main{min-height:3000px}</style><main><p>bisexual identity</p><button id="site-action">Site action</button></main>' }));
  await page.goto('https://fixture.test/');
  await page.waitForSelector('.exp-prisma-hit');
  return { page, errors };
}

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
  for (const [key, value] of Object.entries(settings)) assert.deepEqual(state.settings[key], value);
  assert.equal(state.version, require('../package.json').version);
  assert.equal(state.core, '3.3.4');
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
  await page.locator('#exp-prisma-root [data-section="system"]').click();
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

test('bundled core is the verified 3.3.4 artifact derived from Dropper 3.3.2', () => {
  const crypto = require('node:crypto');
  const bundle = fs.readFileSync(path.resolve(__dirname, '../vendor/exp-core/exp-core.js'));
  const manifest = require('../vendor/exp-core/manifest.json');
  assert.equal(crypto.createHash('sha256').update(bundle).digest('hex'), '9f4f4e8769054b9c7f69e3cc5b8c0c2c5dcf44bee3135e51ec94ac4215119259');
  assert.equal(manifest.coreVersion, '3.3.4');
  assert.equal(manifest.source.sourceVersion, '3.3.2');
});

test('current changelog uses shared menu geometry at every width', async t => {
  const { page } = await fixture(t);
  await page.locator('#exp-prisma-root .launcher').click();
  for (const width of ['full', 'compact', 'narrow']) {
    await page.locator('#exp-prisma-root [data-section="system"]').click();
    await page.getByLabel('Panel + menu width', { exact: true }).selectOption(width);
    await page.locator('#exp-prisma-root [data-section="system"]').click();
    await page.locator('#exp-prisma-root .version').click();
    await page.waitForTimeout(80);
    const bounds = await page.locator('#exp-prisma-root').evaluate(host => {
      const panel = host.shadowRoot.querySelector('.panel').getBoundingClientRect();
      const card = host.shadowRoot.querySelector('.update-notice');
      const rect = card.getBoundingClientRect();
      return { panel: { x: panel.x, y: panel.y, width: panel.width }, card: { x: rect.x, bottom: rect.bottom, width: rect.width }, kind: card.dataset.noticeKind };
    });
    assert.equal(bounds.kind, 'current');
    assert.ok(Math.abs(bounds.panel.width - bounds.card.width) < 2, JSON.stringify(bounds));
    assert.ok(Math.abs(bounds.panel.x - bounds.card.x) < 2, JSON.stringify(bounds));
    assert.ok(bounds.card.bottom <= bounds.panel.y, JSON.stringify(bounds));
    await page.locator('#exp-prisma-root .update-dismiss').click();
  }
});
