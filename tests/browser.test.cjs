'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const script = fs.readFileSync(path.resolve(__dirname, '..', 'prisma.user.js'), 'utf8');
const catalog = JSON.parse(script.match(/EXP\.CatalogData = (\[[\s\S]*?\n\]);\n/)[1]);

test('PRISMA does not mount a launcher inside an iframe', async (t) => {
  const browser = await chromium.launch({ headless: true }); t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><body><iframe srcdoc="<!doctype html><html><body><p>Embedded</p></body></html>"></iframe></body></html>');
  const frame = page.frames().find((candidate) => candidate !== page.mainFrame());
  await frame.evaluate(() => { const values = new Map(); window.GM_getValue = (key, fallback) => values.has(key) ? values.get(key) : fallback; window.GM_setValue = (key, value) => values.set(key, value); window.GM_xmlhttpRequest = () => {}; });
  await frame.addScriptTag({ content: script });
  await page.waitForTimeout(100);
  assert.equal(await frame.locator('#exp-prisma-root').count(), 0);
});

test('GM_addElement cannot leak menu CSS onto the page', async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage({ viewport: { width: 1100, height: 800 } });
  await page.addInitScript(() => {
    window.GM_getValue = (_key, fallback) => fallback;
    window.GM_setValue = () => {};
    window.GM_xmlhttpRequest = () => {};
    const dump = (css) => {
      const node = document.createElement('style');
      node.dataset.gmLeak = '1';
      node.textContent = css;
      (document.head || document.documentElement).append(node);
      return node;
    };
    window.GM_addStyle = dump;
    window.GM_addElement = (_parent, _tag, attrs) => dump(attrs?.textContent || '');
  });
  await page.setContent('<!doctype html><html><body style="margin:0;background:#123456;color:#111"><header id="site-header" style="background:#abc;color:#111">Site header</header><button id="site-button" style="background:#def;color:#111">Site button</button></body></html>');
  await page.addScriptTag({ content: script });
  await page.waitForSelector('#exp-prisma-root', { state: 'attached' });
  const facts = await page.evaluate(() => {
    const leaked = [...document.querySelectorAll('style')].filter((node) => node.getRootNode() === document && /\.launcher\{/.test(node.textContent || ''));
    const host = document.getElementById('exp-prisma-root');
    const box = host.getBoundingClientRect();
    return {
      leaked: leaked.length,
      headerBg: getComputedStyle(document.getElementById('site-header')).backgroundColor,
      buttonBg: getComputedStyle(document.getElementById('site-button')).backgroundColor,
      bodyBg: getComputedStyle(document.body).backgroundColor,
      hostBg: getComputedStyle(host).backgroundColor,
      hostW: Math.round(box.width),
      hostH: Math.round(box.height),
    };
  });
  assert.equal(facts.leaked, 0, JSON.stringify(facts));
  assert.equal(facts.headerBg, 'rgb(170, 187, 204)');
  assert.equal(facts.buttonBg, 'rgb(221, 238, 255)');
  assert.equal(facts.bodyBg, 'rgb(18, 52, 86)');
  assert.equal(facts.hostBg, 'rgba(0, 0, 0, 0)');
  assert.equal(facts.hostW, 0);
  assert.equal(facts.hostH, 0);
});

async function fixture(html) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.addInitScript({ content: script });
  await page.route('https://fixture.test/**', (route) => route.fulfill({ status: 200, contentType: 'text/html', body: html }));
  await page.goto('https://fixture.test/page');
  await page.waitForSelector('.exp-prisma-hit');
  return { browser, page };
}
const hitData = (page) => page.locator('.exp-prisma-hit').evaluateAll((nodes) => nodes.map((node) => ({ text: node.textContent, identity: node.dataset.identity, style: node.dataset.style })));

test('menu palette recolors the shell and narrow rows do not create nested scrollers', async (t) => {
  const { browser, page } = await fixture('<main>The LGBTQ community celebrates bisexual pride.</main>');
  t.after(() => browser.close());
  const root = page.locator('#exp-prisma-root');
  const facts = await root.evaluate((node) => {
    const shadow = node.shadowRoot;
    shadow.querySelector('.launcher').click();
    shadow.querySelector('[data-route="look"]').click();
    const panel = shadow.querySelector('.panel');
    const before = getComputedStyle(panel).backgroundColor;
    shadow.querySelector('.exp-theme-swatch[aria-label="Midnight"]').click();
    const body = shadow.querySelector('.fl-tool-body:not([hidden])');
    const rows = [...body.querySelectorAll('.row')];
    return {
      before,
      after: getComputedStyle(panel).backgroundColor,
      border: getComputedStyle(panel).borderTopWidth,
      overflow: getComputedStyle(body).overflow,
      maxHeight: getComputedStyle(body).maxHeight,
      minLabelWidth: Math.min(...rows.map((row) => row.firstElementChild.getBoundingClientRect().width)),
      groupColumns: [...body.querySelectorAll('.group')].map((group) => getComputedStyle(group).gridTemplateColumns),
      swatches: [...shadow.querySelectorAll('.exp-theme-swatch')].map((item) => item.getAttribute('aria-label')),
    };
  });
  assert.notEqual(facts.after, facts.before);
  assert.equal(facts.border, '1px');
  assert.equal(facts.overflow, 'visible');
  assert.equal(facts.maxHeight, 'none');
  assert.ok(facts.minLabelWidth >= 76, JSON.stringify(facts));
  assert.ok(facts.groupColumns.every((value) => value.trim().split(/\s+/).length === 1), JSON.stringify(facts));
  assert.deepEqual(facts.swatches, ['Ember', 'Midnight', 'Glacier', 'High contrast', 'Verdant', 'Pride', 'Crimson', 'PRISMA gem']);
});

test('version and update-complete cards show the concise current changelog', async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.addInitScript({ content: `localStorage.setItem('exp:v3:prisma:last-version-v2','3.0.22');\n${script}` });
  await page.route('https://fixture.test/**', (route) => route.fulfill({ status:200, contentType:'text/html', body:'<!doctype html><html><body><main>bisexual identity</main></body></html>' }));
  await page.goto('https://fixture.test/page');
  await page.waitForSelector('#exp-prisma-root', { state:'attached' });
  const facts = await page.locator('#exp-prisma-root').evaluate((host) => {
    const root=host.shadowRoot;
    const notices=[...root.querySelectorAll('.update-notice')];
    const completed=notices[0];
    root.querySelector('.version').click();
    const current=notices[1];
    const read=(node)=>({title:node.querySelector('.update-title')?.textContent||'',bullets:[...node.querySelectorAll('li')].map((item)=>item.textContent.trim()),visible:!node.hidden});
    return {completed:read(completed),current:read(current)};
  });
  assert.equal(facts.completed.title,'PRISMA Updated');
  assert.equal(facts.completed.visible,true);
  assert.ok(facts.completed.bullets.length>=2&&facts.completed.bullets.length<=4,JSON.stringify(facts));
  assert.equal(facts.current.title,'PRISMA Changelog');
  assert.equal(facts.current.visible,true);
  assert.deepEqual(facts.current.bullets,facts.completed.bullets);
});

test('Pride theme applies a distinct palette, muted rainbow accents, and persists', async (t) => {
  const { browser, page } = await fixture('<main>The LGBTQ community celebrates bisexual pride.</main>');
  t.after(() => browser.close());
  const pride = await page.locator('#exp-prisma-root').evaluate((host) => {
    const root = host.shadowRoot;
    root.querySelector('.launcher').click();
    root.querySelector('[data-route="look"]').click();
    const panel = root.querySelector('.panel');
    const before = {
      bg: getComputedStyle(panel).backgroundColor,
      accent: getComputedStyle(host).getPropertyValue('--accent').trim(),
      uiTheme: host.dataset.uiTheme,
    };
    root.querySelector('.exp-theme-swatch[aria-label="Pride"]').click();
    const divider = root.querySelector('.header-divider');
    const activeRoute = root.querySelector('.route[aria-current="page"]');
    const checkedSwitch = root.querySelector('.switch[aria-checked="true"]');
    const after = {
      bg: getComputedStyle(panel).backgroundColor,
      panel: getComputedStyle(root.querySelector('.tool-panel')).backgroundColor,
      accent: getComputedStyle(host).getPropertyValue('--accent').trim(),
      uiTheme: host.dataset.uiTheme,
      swatchOn: root.querySelector('.exp-theme-swatch.is-on')?.getAttribute('aria-label'),
      divider: getComputedStyle(divider).backgroundImage,
      activeRoute: activeRoute ? getComputedStyle(activeRoute).backgroundImage : 'none',
      checkedSwitch: checkedSwitch ? getComputedStyle(checkedSwitch).backgroundImage : 'none',
    };
    return { before, after };
  });
  assert.equal(pride.after.uiTheme, 'pride');
  assert.equal(pride.after.swatchOn, 'Pride');
  assert.equal(pride.after.accent, '#c34f7d');
  assert.notEqual(pride.after.bg, pride.before.bg);
  assert.notEqual(pride.after.bg, 'rgb(16, 8, 20)');
  assert.equal(pride.after.bg, 'rgb(16, 10, 18)');
  assert.equal(pride.after.panel, 'rgb(29, 18, 34)');
  const rainbowTargets = [pride.after.divider, pride.after.activeRoute];
  assert.ok(rainbowTargets.some((value) => /linear-gradient/.test(value)), JSON.stringify(pride.after));
  assert.doesNotMatch(pride.after.checkedSwitch, /linear-gradient/);
  assert.match(pride.after.divider, /rgb\(200,\s*78,\s*102\)|#c84e66/i);
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.exp-prisma-hit');
  const persisted = await page.locator('#exp-prisma-root').evaluate((host) => ({
    uiTheme: host.dataset.uiTheme,
    accent: getComputedStyle(host).getPropertyValue('--accent').trim(),
    bg: getComputedStyle(host.shadowRoot.querySelector('.panel')).backgroundColor,
  }));
  assert.equal(persisted.uiTheme, 'pride');
  assert.equal(persisted.accent, '#c34f7d');
  assert.equal(persisted.bg, 'rgb(16, 10, 18)');
});

test('explicit terms and supported aliases match while negative ambiguity is blocked', async () => {
  const { browser, page } = await fixture('<main>The LGBTQ community celebrates bisexual pride. They describe demi as an LGBTQ identity. MLM marketing company.</main>');
  try {
    const hits = await hitData(page);
    assert.ok(hits.some(({ text, identity }) => text === 'bisexual' && identity === 'bisexual'));
    assert.ok(hits.some(({ text, identity }) => text === 'demi' && identity === 'demisexual'));
    assert.ok(!hits.some(({ text }) => text === 'MLM'));
  } finally { await browser.close(); }
});

test('all 124 reviewed terms resolve to their catalog identity with supporting context', async () => {
  const rows = catalog.flatMap((identity) => identity.words.map((term, index) => `<p data-key="${identity.id}-${index}">${term} · LGBTQ identity community</p>`)).join('');
  const { browser, page } = await fixture(`<main>${rows}</main>`);
  try {
    const missing = await page.evaluate((items) => items.flatMap((identity) => identity.words.map((term, index) => ({ identity: identity.id, key: `${identity.id}-${index}`, term }))).filter(({ identity, key }) => !document.querySelector(`[data-key="${key}"] .exp-prisma-hit[data-identity="${identity}"]`)), catalog);
    assert.deepEqual(missing, []);
  } finally { await browser.close(); }
});

test('ambiguous terms stay unrendered without supporting context', async () => {
  const terms = ['queer', 'gay', 'mlm', 'wlw', 'demi', 'cupio', 'fray', 'lithro', 'akoi', 'androgynous', 'omni', 'abro', 'multi', 'qpr', 'butch', 'femme', 'questioning'];
  const { browser, page } = await fixture(`<main><p>bisexual</p>${terms.map((term) => `<p data-ambiguous="${term}">${term}</p>`).join('')}</main>`);
  try {
    for (const term of terms) assert.equal(await page.locator(`[data-ambiguous="${term}"] .exp-prisma-hit`).count(), 0, term);
  } finally { await browser.close(); }
});

test('dynamic text joins the same rendered page set without duplicate wrappers', async () => {
  const { browser, page } = await fixture('<main id="content">A pansexual person.</main>');
  try {
    await page.evaluate(() => { const p = document.createElement('p'); p.textContent = 'The aromantic community.'; document.querySelector('#content').append(p); });
    await page.waitForFunction(() => document.querySelectorAll('.exp-prisma-hit').length === 2);
    assert.deepEqual((await hitData(page)).map(({ identity }) => identity).sort(), ['aromantic', 'pansexual']);
    assert.equal(await page.locator('.exp-prisma-hit .exp-prisma-hit').count(), 0);
  } finally { await browser.close(); }
});

test('character-data edits are observed without duplicating existing matches', async () => {
  const { browser, page } = await fixture('<main id="content">bisexual</main>');
  try {
    await page.evaluate(() => { document.querySelector('#content').firstChild.nodeValue = 'aromantic'; });
    await page.waitForFunction(() => document.querySelector('.exp-prisma-hit')?.dataset.identity === 'aromantic');
    assert.deepEqual((await hitData(page)).map(({ identity }) => identity).sort(), ['aromantic', 'bisexual']);
  } finally { await browser.close(); }
});

test('renderer controls change style without changing the match count', async () => {
  const { browser, page } = await fixture('<main>bisexual and pansexual</main>');
  try {
    const before = await page.locator('.exp-prisma-hit').count();
    await page.locator('#exp-prisma-root').evaluate((host) => { const root=host.shadowRoot;root.querySelector('.launcher').click();root.querySelector('[data-route="style"]').click(); });
    await page.locator('#exp-prisma-root').evaluate((host) => { const select = host.shadowRoot.querySelector('select[aria-label="Style"]'); select.value = 'underline'; select.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForFunction(() => [...document.querySelectorAll('.exp-prisma-hit')].every((node) => node.dataset.style === 'underline'));
    const underline = await page.locator('.exp-prisma-hit').first().evaluate((node) => {
      const style = getComputedStyle(node);
      return { backgroundImage: style.backgroundImage, backgroundSize: style.backgroundSize, decoration: style.textDecorationLine };
    });
    assert.match(underline.backgroundImage, /linear-gradient/);
    assert.match(underline.backgroundSize, /px/);
    assert.match(underline.decoration, /underline/);
    await page.locator('#exp-prisma-root').evaluate((host) => { const select = host.shadowRoot.querySelector('select[aria-label="Style"]'); select.value = 'soft-fill'; select.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForFunction(() => [...document.querySelectorAll('.exp-prisma-hit')].every((node) => node.dataset.style === 'soft-fill'));
    const fill = await page.locator('.exp-prisma-hit').first().evaluate((node) => {
      const style = getComputedStyle(node);
      return { backgroundColor: style.backgroundColor, paddingInlineStart: style.paddingInlineStart };
    });
    assert.match(fill.backgroundColor, /^rgba?\(/);
    assert.notEqual(fill.backgroundColor, 'rgba(0, 0, 0, 0)');
    assert.notEqual(fill.paddingInlineStart, '0px');
    assert.equal(await page.locator('.exp-prisma-hit').count(), before);
  } finally { await browser.close(); }
});

test('underline and soft fill resist hostile site CSS', async () => {
  const hostile = '<style>span{background:none!important;background-image:none!important;text-decoration:none!important;box-shadow:none!important;padding:0!important}</style><main>The bisexual community.</main>';
  const { browser, page } = await fixture(hostile);
  try {
    await page.locator('#exp-prisma-root').evaluate((host) => {
      const root = host.shadowRoot;
      root.querySelector('.launcher').click();
      root.querySelector('[data-route="style"]').click();
    });
    const setStyle = async (value) => {
      await page.locator('#exp-prisma-root').evaluate((host, next) => {
        const select = host.shadowRoot.querySelector('select[aria-label="Style"]');
        select.value = next;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
      await page.waitForFunction((next) => [...document.querySelectorAll('.exp-prisma-hit')].every((node) => node.dataset.style === next), value);
      return page.locator('.exp-prisma-hit').first().evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          backgroundColor: style.backgroundColor,
          backgroundImage: style.backgroundImage,
          backgroundSize: style.backgroundSize,
          boxShadow: style.boxShadow,
          decoration: style.textDecorationLine,
          paddingInlineStart: style.paddingInlineStart,
        };
      });
    };
    const underline = await setStyle('underline');
    assert.match(underline.backgroundImage, /linear-gradient/);
    assert.match(underline.backgroundSize, /px/);
    assert.match(underline.decoration, /underline/);
    assert.notEqual(underline.boxShadow, 'none');
    const fill = await setStyle('soft-fill');
    assert.notEqual(fill.backgroundColor, 'rgba(0, 0, 0, 0)');
    assert.equal(fill.backgroundImage, 'none');
    assert.notEqual(fill.paddingInlineStart, '0px');
  } finally { await browser.close(); }
});

test('underline and soft fill retain target-level rendering without the managed page stylesheet', async () => {
  const { browser, page } = await fixture('<main>The bisexual community.</main>');
  try {
    await page.evaluate(() => {
      for (const node of document.querySelectorAll('style[data-exp-prisma-style]')) node.remove();
      try { document.adoptedStyleSheets = []; } catch {}
    });
    await page.locator('#exp-prisma-root').evaluate((host) => {
      const root = host.shadowRoot;
      root.querySelector('.launcher').click();
      root.querySelector('[data-route="style"]').click();
    });
    const setStyle = async (value) => {
      await page.locator('#exp-prisma-root').evaluate((host, next) => {
        const select = host.shadowRoot.querySelector('select[aria-label="Style"]');
        select.value = next;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
      await page.waitForFunction((next) => [...document.querySelectorAll('.exp-prisma-hit')].every((node) => node.dataset.style === next), value);
      return page.locator('.exp-prisma-hit').first().evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          backgroundColor: style.backgroundColor,
          backgroundImage: style.backgroundImage,
          decoration: style.textDecorationLine,
          paddingInlineStart: style.paddingInlineStart,
        };
      });
    };
    const underline = await setStyle('underline');
    assert.match(underline.backgroundImage, /linear-gradient/);
    assert.match(underline.decoration, /underline/);
    const fill = await setStyle('soft-fill');
    assert.notEqual(fill.backgroundColor, 'rgba(0, 0, 0, 0)');
    assert.equal(fill.backgroundImage, 'none');
    assert.notEqual(fill.paddingInlineStart, '0px');
  } finally { await browser.close(); }
});

test('site exclusion and Safe Mode fully restore page text', async () => {
  const { browser, page } = await fixture('<main>bisexual</main>');
  try {
    await page.locator('#exp-prisma-root').evaluate((host) => { host.shadowRoot.querySelector('.launcher').click(); host.shadowRoot.querySelector('[data-route="sites"]').click(); host.shadowRoot.querySelector('button[role="switch"][aria-label="Enable on this site"]').click(); });
    await page.waitForFunction(() => document.querySelectorAll('.exp-prisma-hit').length === 0);
    assert.equal(await page.locator('body > main').textContent(), 'bisexual');
  } finally { await browser.close(); }
});

test('global and site identity switches affect the same matcher', async () => {
  const { browser, page } = await fixture('<main>bisexual pansexual</main>');
  try {
    await page.locator('#exp-prisma-root').evaluate((host) => { const root = host.shadowRoot; root.querySelector('.launcher').click(); root.querySelector('[data-route="tools"]').click(); if(root.querySelectorAll('.identity-list .identity').length!==3)throw new Error('Identity catalog must show three defaults');const search=root.querySelector('.search');search.value='Bisexual';search.dispatchEvent(new Event('input',{bubbles:true}));root.querySelector('button[aria-label="Enable Bisexual"]').click(); });
    await page.waitForFunction(() => !document.querySelector('.exp-prisma-hit[data-identity="bisexual"]'));
    assert.equal(await page.locator('.exp-prisma-hit[data-identity="pansexual"]').count(), 1);
    await page.locator('#exp-prisma-root').evaluate((host) => { const root = host.shadowRoot; root.querySelector('[data-route="sites"]').click(); root.querySelector('button[role="switch"][aria-label="Use site overrides"]').click(); const search=root.querySelector('input[aria-label="Search site identity overrides"]'); search.value='Pansexual'; search.dispatchEvent(new Event('input',{bubbles:true})); const select = root.querySelector('select[aria-label="Pansexual"]'); select.value = 'off'; select.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForFunction(() => document.querySelectorAll('.exp-prisma-hit').length === 0);
  } finally { await browser.close(); }
});

test('Safe Mode restores the page and can recover through the menu', async () => {
  const { browser, page } = await fixture('<main>bisexual</main>');
  try {
    await page.locator('#exp-prisma-root').evaluate((host) => { host.shadowRoot.querySelector('.launcher').click(); host.shadowRoot.querySelector('[data-route="system"]').click(); host.shadowRoot.querySelector('button[role="switch"][aria-label="Safe Mode"]').click(); });
    await page.waitForFunction(() => document.querySelectorAll('.exp-prisma-hit').length === 0);
    await page.locator('#exp-prisma-root').evaluate((host) => host.shadowRoot.querySelector('button[role="switch"][aria-label="Safe Mode"]').click());
    await page.waitForFunction(() => document.querySelectorAll('.exp-prisma-hit').length === 1);
  } finally { await browser.close(); }
});

test('SPA navigation replaces the route-scoped match set', async () => {
  const { browser, page } = await fixture('<main id="content">bisexual</main>');
  try {
    await page.evaluate(() => { document.querySelector('#content').textContent = 'pansexual'; history.pushState({}, '', '/next'); });
    await page.waitForFunction(() => document.querySelector('.exp-prisma-hit')?.dataset.identity === 'pansexual');
    assert.deepEqual((await hitData(page)).map(({ identity }) => identity), ['pansexual']);
  } finally { await browser.close(); }
});

test('launcher uses the borderless PRISMA artwork URL', async () => {
  const { browser, page } = await fixture('<main>bisexual</main>');
  try {
    const badge = await page.locator('#exp-prisma-root').evaluate((host) => { const launcher = host.shadowRoot.querySelector('.launcher'); const image = launcher.querySelector('img'); const rect = launcher.getBoundingClientRect(); return { width: rect.width, height: rect.height, src: image.src, naturalWidth: image.naturalWidth, naturalHeight: image.naturalHeight, radius: getComputedStyle(launcher).borderRadius }; });
    assert.deepEqual({ width: badge.width, height: badge.height, naturalWidth: badge.naturalWidth, naturalHeight: badge.naturalHeight }, { width: 48, height: 48, naturalWidth: 1024, naturalHeight: 1024 });
    assert.equal(badge.src, 'https://raw.githubusercontent.com/ExtraPotions/PRISMA/main/assets/prisma-launcher.svg');
    assert.equal(badge.radius, '10px');
    const chrome = await page.locator('#exp-prisma-root').evaluate((host) => { const root=host.shadowRoot;return {button:root.querySelector('.launcher').getBoundingClientRect().width,hasRing:Boolean(root.querySelector('.launcher-ring')),icon:root.querySelector('.launcher-icon').getBoundingClientRect().width}; });
    assert.deepEqual(chrome,{button:48,hasRing:false,icon:40});
  } finally { await browser.close(); }
});

test('page view retains match count without identity summary or match list', async () => {
  const { browser, page } = await fixture('<main>bisexual bisexual pansexual</main>');
  try {
    const result = await page.locator('#exp-prisma-root').evaluate((host) => { host.shadowRoot.querySelector('.launcher').click(); host.shadowRoot.querySelector('[data-route="page"]').click(); const root = host.shadowRoot; const countRow = [...root.querySelectorAll('.row')].find((node) => node.querySelector('.label')?.textContent === 'Match count'); return { matches: root.querySelectorAll('.match-list .match').length, summary: [...root.querySelectorAll('.summary-row')].map((node) => node.textContent), count: countRow.querySelector('output').textContent }; });
    assert.equal(result.matches, 0);
    assert.equal(result.count, '3');
    assert.deepEqual(result.summary, []);
  } finally { await browser.close(); }
});

test('temporary hide preserves the page set and reload-persistent settings', async () => {
  const { browser, page } = await fixture('<main>bisexual pansexual</main>');
  try {
    const result = await page.locator('#exp-prisma-root').evaluate((host) => { const root = host.shadowRoot; root.querySelector('.launcher').click(); root.querySelector('[data-route="page"]').click(); root.querySelector('button[role="switch"][aria-label="Temporarily Hide Highlights"]').click(); const countRow = [...root.querySelectorAll('.row')].find((node) => node.querySelector('.label')?.textContent === 'Match count'); return { list: root.querySelectorAll('.match-list .match').length, count: countRow.querySelector('output').textContent }; });
    assert.deepEqual(result, { list: 0, count: '2' });
    assert.equal(await page.locator('.exp-prisma-hit[data-hidden="1"]').count(), 2);
  } finally { await browser.close(); }
});

test('dialog traps focus and Escape restores focus to the launcher', async () => {
  const { browser, page } = await fixture('<main>bisexual</main>');
  try {
    await page.locator('#exp-prisma-root').evaluate((host) => host.shadowRoot.querySelector('.launcher').click());
    const first = await page.locator('#exp-prisma-root').evaluate((host) => host.shadowRoot.activeElement.classList.contains('panel'));
    await page.keyboard.press('Shift+Tab');
    const wrapped = await page.locator('#exp-prisma-root').evaluate((host) => host.shadowRoot.activeElement?.textContent || '');
    await page.keyboard.press('Escape');
    const result = await page.locator('#exp-prisma-root').evaluate((host) => { const root = host.shadowRoot; const launcher = root.querySelector('.launcher'); return { expanded: launcher.getAttribute('aria-expanded'), focusReturned: root.activeElement === launcher }; });
    assert.equal(first, true);
    assert.ok(wrapped.length > 0);
    assert.equal(result.expanded, 'false');
    assert.equal(result.focusReturned, true);
  } finally { await browser.close(); }
});

test('reference-led compact dock keeps one expandable section open', async () => {
  const { browser, page } = await fixture('<main>bisexual pansexual</main>');
  try {
    const initial = await page.locator('#exp-prisma-root').evaluate((host) => {
      const root = host.shadowRoot;
      root.querySelector('.launcher').click();
      const dock = root.querySelector('.panel');
      return {
        width: dock.getBoundingClientRect().width,
        sections: root.querySelectorAll('.tool-panel').length,
        visibleBodies: [...root.querySelectorAll('.route-body')].filter((body) => !body.hidden).length,
        openRoute: root.querySelector('.route[aria-expanded="true"]')?.textContent,
        headerBadge: root.querySelector('.header-badge')?.getBoundingClientRect().width,
      };
    });
    assert.equal(initial.width, 260);
    assert.deepEqual(initial, { ...initial, sections: 6, visibleBodies: 0, openRoute: undefined, headerBadge: 38 });
    const changed = await page.locator('#exp-prisma-root').evaluate((host) => {
      const root = host.shadowRoot;
      root.querySelector('[data-route="page"]').click();
      return {
        visibleBodies: [...root.querySelectorAll('.route-body')].filter((body) => !body.hidden).length,
        openRoute: root.querySelector('.route[aria-expanded="true"] .fl-tool-title')?.textContent,
        currentRoute: root.querySelector('.route[aria-current="page"] .fl-tool-title')?.textContent,
        nested: root.querySelectorAll('.route-body:not([hidden]) details').length,
      };
    });
    assert.deepEqual(changed, { visibleBodies: 1, openRoute: 'Highlights', currentRoute: 'Highlights', nested: 0 });
    const reopened = await page.locator('#exp-prisma-root').evaluate((host) => {
      const root=host.shadowRoot;root.querySelector('.launcher').click();root.querySelector('.launcher').click();
      return { visibleBodies:[...root.querySelectorAll('.route-body')].filter((body)=>!body.hidden).length, marker:root.querySelector('.route.last-opened .fl-tool-title')?.textContent };
    });
    assert.deepEqual(reopened,{visibleBodies:0,marker:'Highlights'});
  } finally { await browser.close(); }
});

test('menu CSS stays in the shadow root when constructable sheets are unavailable', async (t) => {
  const browser = await chromium.launch({ headless: true }); t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><body><main>The bisexual community.</main></body></html>');
  await page.evaluate(() => {
    const values = new Map();
    window.GM_getValue = (key, fallback) => values.has(key) ? values.get(key) : fallback;
    window.GM_setValue = (key, value) => values.set(key, structuredClone(value));
    window.GM_xmlhttpRequest = () => {};
    window.__gmStyleAdds = 0;
    window.CSSStyleSheet = undefined;
    window.GM_addElement = (parent, tag, attributes = {}) => {
      const node = document.createElement(tag);
      if (attributes.textContent !== undefined) node.textContent = attributes.textContent;
      parent.append(node);
      if (tag === 'style') window.__gmStyleAdds += 1;
      return node;
    };
  });
  await page.addScriptTag({ content: script });
  await page.waitForSelector('#exp-prisma-root', { state: 'attached' });
  const result = await page.evaluate(() => {
    const host = document.querySelector('#exp-prisma-root');
    const launcher = host.shadowRoot.querySelector('.launcher');
    const leaked = [...document.querySelectorAll('style')].filter((node) => node.getRootNode() === document && /\.launcher\{/.test(node.textContent || ''));
    return { calls: window.__gmStyleAdds, root: Boolean(host), leaked: leaked.length, width: getComputedStyle(launcher).width };
  });
  assert.equal(result.root, true);
  assert.equal(result.leaked, 0, JSON.stringify(result));
  assert.equal(result.width, '48px');
  assert.ok(result.calls < 5, JSON.stringify(result));
});

test('PRISMA paints launcher chrome when the page forbids inline style tags', async (t) => {
  const browser = await chromium.launch({ headless: true }); t.after(() => browser.close());
  const page = await browser.newPage();
  await page.setContent('<!doctype html><html><head><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; img-src data:; style-src scryfall.com *.scryfall.com"></head><body><main>The bisexual community.</main></body></html>');
  await page.evaluate(() => {
    const values = new Map();
    window.GM_getValue = (key, fallback) => values.has(key) ? values.get(key) : fallback;
    window.GM_setValue = (key, value) => values.set(key, structuredClone(value));
    window.GM_xmlhttpRequest = () => {};
  });
  await page.evaluate(new Function(script));
  await page.waitForSelector('#exp-prisma-root', { state: 'attached' });
  const painted = await page.locator('#exp-prisma-root').evaluate((host) => {
    const launcher = host.shadowRoot.querySelector('.launcher');
    const style = getComputedStyle(launcher);
    return { width: style.width, radius: style.borderRadius, position: style.position };
  });
  assert.equal(painted.width, '48px');
  assert.equal(painted.radius, '10px');
  assert.equal(painted.position, 'fixed');
});

test('menu routes use accurate labels and scoped section contents', async (t) => {
  const { browser, page } = await fixture('<main>bisexual pansexual</main>');
  t.after(() => browser.close());
  const facts = await page.locator('#exp-prisma-root').evaluate((host) => {
    const root = host.shadowRoot;
    root.querySelector('.launcher').click();
    const labels = [...root.querySelectorAll('.nav button.route')].map((button) => button.querySelector('.fl-tool-title')?.textContent);
    const subtitle = root.querySelector('.subtitle')?.textContent || '';
    const openRoute = (label) => {
      [...root.querySelectorAll('.nav button.route')].find((button) => button.querySelector('.fl-tool-title')?.textContent === label).click();
      const body = root.querySelector('.route-body:not([hidden])');
      return [...body.querySelectorAll('h3')].map((heading) => heading.textContent.trim());
    };
    return {
      labels,
      subtitle,
      highlights: openRoute('Highlights'),
      style: openRoute('Highlight Style'),
      appearance: openRoute('Appearance'),
      language: openRoute('Language'),
      sites: openRoute('Sites'),
      settings: openRoute('System'),
    };
  });
  assert.deepEqual(facts.labels, ['Highlights', 'Highlight Style', 'Appearance', 'Language', 'Sites', 'System']);
  assert.equal(facts.subtitle, 'Your self-identity. Recognized.');
  assert.deepEqual(facts.highlights, ['Highlights']);
  assert.deepEqual(facts.style, ['Highlight style']);
  assert.deepEqual(facts.appearance, ['Appearance', 'Accessibility']);
  assert.deepEqual(facts.language, ['Identity Catalog', 'Context Engine']);
  assert.deepEqual(facts.sites, ['Current Site']);
  assert.deepEqual(facts.settings, ['Diagnostics', 'Menu & Data']);
});

test('README screenshots exist at stable docs paths', () => {
  const root = path.resolve(__dirname, '..');
  const expected = [
    'menu-overview.png',
    'highlights-menu.png',
    'appearance-menu.png',
    'language-menu.png',
    'settings-menu.png',
  ];
  for (const name of expected) {
    const file = path.join(root, 'docs', 'screenshots', name);
    assert.ok(fs.existsSync(file), `missing screenshot ${name}`);
    assert.ok(fs.statSync(file).size > 1024, `screenshot too small ${name}`);
  }
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.doesNotMatch(readme, /^## Menu$/m);
  assert.match(readme, /^## Screenshots$/m);
  for (const name of expected) assert.match(readme, new RegExp(`docs/screenshots/${name.replace('.', '\\.')}`));
});

test('launcher omits the retired helper tooltip', async (t) => {
  const { browser, page } = await fixture('<main>The LGBTQ community celebrates bisexual pride.</main>');
  t.after(() => browser.close());
  const root = page.locator('#exp-prisma-root');
  const result = await root.evaluate((host) => {
    const launcher = host.shadowRoot.querySelector('.launcher');
    const styles = [...host.shadowRoot.querySelectorAll('style')].map((node) => node.textContent).join('\n');
    return { hasCss: styles.includes('.launcher.tip-below::before'), help: launcher.dataset.help || '' };
  });
  assert.deepEqual(result, { hasCss: false, help: '' });
});

test('route headers do not carry restated helper tips', async (t) => {
  const { browser, page } = await fixture('<main>The LGBTQ community celebrates bisexual pride.</main>');
  t.after(() => browser.close());
  const root = page.locator('#exp-prisma-root');
  const tips = await root.evaluate((host) => {
    const shadow = host.shadowRoot;
    shadow.querySelector('.launcher').click();
    shadow.querySelector('[data-route="look"]')?.click();
    return {
      headers: [...shadow.querySelectorAll('.fl-tool-header')].map((node) => ({
        tip: node.dataset.tip || '',
        hasTooltip: node.classList.contains('has-tooltip'),
      })),
      rows: [...shadow.querySelectorAll('.row, .theme-row')].map((node) => ({
        tip: node.dataset.tip || '',
        hasTooltip: node.classList.contains('has-tooltip'),
      })),
    };
  });
  assert.ok(tips.headers.length >= 4);
  assert.ok(tips.headers.every((item) => !item.tip && !item.hasTooltip), JSON.stringify(tips.headers));
  assert.ok(tips.rows.length > 0);
  assert.ok(tips.rows.every((item) => !item.tip && !item.hasTooltip), JSON.stringify(tips.rows));
});
