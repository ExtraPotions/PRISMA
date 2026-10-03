'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const output = path.join(root, 'docs', 'screenshots');
const script = fs.readFileSync(path.join(root, 'prisma.user.js'), 'utf8');
const fixture = '<!doctype html><style>body{margin:0;padding:48px;background:#eef1f7;color:#151827;font:18px/1.65 system-ui}main{max-width:760px;margin:auto;padding:42px;border-radius:18px;background:white;box-shadow:0 18px 60px #17305b22}</style><main><h1>Community guide</h1><p>The bisexual and pansexual communities are represented here.</p><p>An aromantic identity resource was added dynamically.</p></main>';

const HOST = '#exp-prisma-root';
const DOCK = '[data-exp-part="dock"]';

async function action(page, name, value) {
  return page.locator(HOST).evaluate((host, [step, target]) => {
    const shadow = host.shadowRoot;
    const submenu = (label) => [...shadow.querySelectorAll('details')].find((item) => item.querySelector(':scope > summary')?.textContent.trim().startsWith(label));
    if (step === 'open-menu') {
      if (!shadow.querySelector('[data-exp-part="dock"]').classList.contains('fl-rail-open')) shadow.querySelector('.launcher').click();
    } else if (step === 'section') {
      for (const header of shadow.querySelectorAll('.fl-tool-header')) {
        const wanted = (header.dataset.route || header.dataset.section || header.dataset.panel) === target;
        if (wanted !== (header.getAttribute('aria-expanded') === 'true')) header.click();
      }
    } else if (step === 'submenu') {
      const item = submenu(target);
      if (!item) throw new Error(`Missing submenu: ${target}`);
      item.open = true;
    } else if (step === 'hide-toast') {
      for (const toast of shadow.querySelectorAll('.toast')) toast.hidden = true;
    }
  }, [name, value]).catch((error) => { throw error; });
}

(async () => {
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'prisma-shots-'));
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
    await page.addInitScript({ content: script });
    await page.route('https://screenshot.test/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: fixture }));
    await page.goto('https://screenshot.test/page');
    await page.waitForSelector(HOST, { state: 'attached' });
    await page.waitForTimeout(400);

    const dock = page.locator(HOST).locator(DOCK);
    const shot = (name, target) => (target || dock).screenshot({ path: path.join(work, name) });
    const settle = () => page.waitForTimeout(220);

    await shot('current-fixture.png', page);
    await action(page, 'open-menu');
    await settle();
    await action(page, 'section', '');
    await action(page, 'hide-toast');
    await settle();
    await shot('menu-overview.png');

    await action(page, 'section', 'page');
    await settle();
    await shot('highlights-menu.png');
    await shot('highlights-demo.png', page);

    await action(page, 'section', 'appearance');
    await settle();
    await action(page, 'submenu', 'Highlight style');
    await settle();
    await shot('appearance-menu.png');

    await action(page, 'section', 'advanced');
    await settle();
    await action(page, 'submenu', 'Language');
    await settle();
    await page.locator(HOST).locator('input[type=search], input[aria-label*="earch"]').first().fill('bisexual');
    await settle();
    await shot('language-menu.png');
    await shot('language.png');

    await action(page, 'section', 'system');
    await settle();
    await action(page, 'submenu', 'Settings');
    await settle();
    await shot('settings-menu.png');

    fs.mkdirSync(output, { recursive: true });
    const names = fs.readdirSync(work).filter((name) => name.endsWith('.png'));
    for (const name of names) fs.copyFileSync(path.join(work, name), path.join(output, name));
    console.log(`Captured ${names.length} screenshots in ${path.relative(root, output)}/`);
  } finally {
    await browser.close();
    fs.rmSync(work, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
