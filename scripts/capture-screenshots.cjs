'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs', 'screenshots');
const script = fs.readFileSync(path.join(root, 'prisma.user.js'), 'utf8');
const fixture = '<!doctype html><style>body{margin:0;padding:48px;background:#eef1f7;color:#151827;font:18px/1.65 system-ui}main{max-width:760px;margin:auto;padding:42px;border-radius:18px;background:white;box-shadow:0 18px 60px #17305b22}</style><main><h1>Community guide</h1><p>The bisexual and pansexual communities are represented here.</p><p>An aromantic identity resource was added dynamically.</p></main>';

const MENU_SHOTS = [
  { label: 'Highlights', file: 'highlights-menu.png' },
  { label: 'Appearance', file: 'appearance-menu.png' },
  { label: 'Language', file: 'language-menu.png' },
  { label: 'Settings', file: 'settings-menu.png' },
];

let page;

async function capturePanel(fileName) {
  const handle = await page.evaluateHandle(() => document.querySelector('#exp-prisma-root').shadowRoot.querySelector('.panel'));
  await handle.asElement().screenshot({ path: path.join(output, fileName) });
  await handle.dispose();
}

async function setRoute(label) {
  await page.locator('#exp-prisma-root').evaluate((host, routeLabel) => {
    const root = host.shadowRoot;
    if (root.querySelector('.launcher').getAttribute('aria-expanded') !== 'true') root.querySelector('.launcher').click();
    for (const route of root.querySelectorAll('.nav button.route')) {
      const open = route.textContent === routeLabel;
      if (open !== (route.getAttribute('aria-expanded') === 'true')) route.click();
    }
  }, label);
}

(async () => {
  fs.mkdirSync(output, { recursive: true });
  for (const stale of fs.readdirSync(output).filter((name) => name.endsWith('.png'))) {
    fs.unlinkSync(path.join(output, stale));
  }
  const browser = await chromium.launch({ headless: true });
  page = await browser.newPage({ viewport: { width: 1440, height: 2400 }, deviceScaleFactor: 2 });
  await page.addInitScript({ content: script });
  await page.route('https://screenshot.test/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: fixture }));
  await page.goto('https://screenshot.test/page');
  await page.waitForSelector('#exp-prisma-root', { state: 'attached' });

  await page.locator('#exp-prisma-root').evaluate((host) => {
    const root = host.shadowRoot;
    if (root.querySelector('.launcher').getAttribute('aria-expanded') !== 'true') root.querySelector('.launcher').click();
    const settings = [...root.querySelectorAll('.nav button.route')].find((button) => button.textContent === 'Settings');
    if (settings.getAttribute('aria-expanded') !== 'true') settings.click();
    const width = [...root.querySelectorAll('select')].find((item) => item.getAttribute('aria-label') === 'Panel + menu width');
    if (!width) throw new Error('Missing Panel + menu width control');
    width.value = 'full';
    width.dispatchEvent(new Event('change', { bubbles: true }));
    const autoClose = root.querySelector('[role="switch"][aria-label="Auto-close menu"]');
    if (autoClose?.getAttribute('aria-checked') === 'true') autoClose.click();
    settings.click();
    const toast = root.querySelector('.toast');
    if (toast) toast.hidden = true;
  });
  await page.waitForTimeout(120);
  await capturePanel('menu-overview.png');

  for (const shot of MENU_SHOTS) {
    await setRoute(shot.label);
    await page.waitForTimeout(180);
    await capturePanel(shot.file);
  }

  await browser.close();
  console.log(`Screenshots written to ${output}`);
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
