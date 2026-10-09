'use strict';

// Regenerates the README screenshots from the built userscript against a local sample page.
//   npm run screenshots
// Images are captured into a temporary folder first, so a failed run never leaves docs/screenshots half updated.

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs', 'screenshots');
const HOST = '#exp-prisma-root';

const samplePage = '<!doctype html><meta charset="utf-8"><title>Community guide</title><body style="margin:0;font:18px/1.65 system-ui;background:#eef1f7;color:#151827"><main style="max-width:430px;margin:36px;padding:30px 34px;background:#fff;border-radius:16px;box-shadow:0 18px 60px #17305b22"><h1 style="margin-top:0">Community guide</h1><p>The bisexual and pansexual communities are represented here.</p><p>An aromantic identity resource was added recently.</p></main></body>';

function gmStub() {
  const values = new Map();
  window.GM_getValue = (key, fallback) => (values.has(key) ? values.get(key) : fallback);
  window.GM_setValue = (key, value) => values.set(key, value);
  window.GM_deleteValue = (key) => values.delete(key);
  window.GM_listValues = () => [...values.keys()];
  window.GM_addValueChangeListener = () => 1;
  window.GM_registerMenuCommand = () => {};
  window.GM_xmlhttpRequest = (options) => { queueMicrotask(() => options.onerror?.({ status: 0 })); return { abort() {} }; };
}

// Use Playwright's bundled Chromium when installed, otherwise the system Edge.
const launch = () => chromium.launch().catch(() => chromium.launch({ channel: 'msedge' }));

async function openSection(page, section, tab) {
  const host = page.locator(HOST);
  const header = host.locator('.fl-tool-header').filter({ hasText: section });
  if (await header.getAttribute('aria-expanded') !== 'true') await header.click();
  if (tab) await host.getByRole('tab', { name: tab, exact: true }).click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(300);
}

(async () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'prisma-shots-'));
  const browser = await launch();
  const files = ['highlights-demo.png', 'appearance.png'];
  try {
    const page = await browser.newPage({ viewport: { width: 900, height: 640 }, deviceScaleFactor: 2 });
    await page.addInitScript(gmStub);
    await page.route('**/*', (route) => {
      const asset = route.request().url().match(/raw\.githubusercontent\.com\/ExtraPotions\/PRISMA\/main\/(assets\/.+)$/);
      if (asset) return route.fulfill({ path: path.join(root, asset[1]) });
      if (route.request().isNavigationRequest()) return route.fulfill({ status: 200, contentType: 'text/html', body: samplePage });
      return route.abort();
    });
    await page.goto('https://sample.test/guide');
    await page.addScriptTag({ content: fs.readFileSync(path.join(root, 'prisma.user.js'), 'utf8') });
    const host = page.locator(HOST);
    await host.locator('[data-exp-part="launcher"]').click();
    await page.waitForTimeout(400);

    // The sample page with live highlights next to the open Highlights menu.
    await openSection(page, 'Highlights');
    await page.screenshot({ path: path.join(work, files[0]) });

    await page.setViewportSize({ width: 900, height: 1400 });
    await openSection(page, 'Appearance', 'Style');
    await host.locator('[data-exp-part="dock"]').screenshot({ path: path.join(work, files[1]) });

    fs.mkdirSync(output, { recursive: true });
    for (const file of files) fs.copyFileSync(path.join(work, file), path.join(output, file));
  } finally {
    await browser.close();
    fs.rmSync(work, { recursive: true, force: true });
  }
  console.log(`Captured ${files.length} PRISMA screenshots in ${path.relative(root, output)}/`);
})().catch((error) => { console.error(error); process.exit(1); });
