'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const script = fs.readFileSync(path.resolve(__dirname, '..', 'prisma.user.js'), 'utf8');
// Fixture inventory uses readable authored data; every browser below executes the install.
const catalogSource = fs.readFileSync(path.resolve(__dirname, '../src/catalog-data.js'), 'utf8').replace(/\r\n/g, '\n');
const catalog = JSON.parse(catalogSource.match(/EXP\.CatalogData = (\[[\s\S]*?\n\]);\n/)[1]);

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
  await page.addInitScript(() => { const key = 'exp:v3:prisma:settings'; if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ includeRomantic: true })); });
  await page.addInitScript({ content: script });
  await page.route('https://fixture.test/**', (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await page.route('https://raw.githubusercontent.com/ExtraPotions/PRISMA/main/assets/prisma-launcher.svg', route => route.fulfill({ contentType: 'image/svg+xml', body: fs.readFileSync(path.resolve(__dirname, '../assets/prisma-launcher.svg'), 'utf8') }));
  await page.goto('https://fixture.test/page');
  await page.waitForSelector('.exp-prisma-hit');
  return { browser, page };
}
const hitData = (page) => page.locator('.exp-prisma-hit[data-match-id]').evaluateAll((nodes) => nodes.map((node) => ({ text: node.textContent, identity: node.dataset.identity, style: node.dataset.style })));

test('version action reuses the update-complete card for the current changelog', async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();
  await page.addInitScript({ content: `localStorage.setItem('exp:v3:prisma:last-version-v2','3.0.31');\n${script}` });
  await page.route('https://fixture.test/**', (route) => route.fulfill({ status:200, contentType:'text/html', body:'<!doctype html><html><body><main>bisexual identity</main></body></html>' }));
  await page.goto('https://fixture.test/page');
  await page.waitForSelector('#exp-prisma-root', { state:'attached' });
  const facts = await page.locator('#exp-prisma-root').evaluate((host) => {
    const root=host.shadowRoot;
    const card=root.querySelector('.update-notice');
    const read=(node)=>({kind:node.dataset.noticeKind,title:node.querySelector('.update-title')?.textContent||'',version:node.querySelector('.update-version')?.textContent||'',bullets:[...node.querySelectorAll('li')].map((item)=>item.textContent.trim()),visible:!node.hidden});
    const completed=read(card);
    root.querySelector('.version').click();
    const current=read(card);
    return {completed,current,sameNode:card===root.querySelector('.update-notice')};
  });
  assert.equal(facts.sameNode,true);
  assert.equal(facts.completed.kind,'complete');
  assert.equal(facts.completed.title,'PRISMA Updated');
  assert.equal(facts.completed.visible,true);
  assert.ok(facts.completed.bullets.length>=2&&facts.completed.bullets.length<=4,JSON.stringify(facts));
  assert.equal(facts.current.kind,'current');
  assert.equal(facts.current.title,'PRISMA Changelog');
  assert.equal(facts.current.version,'v' + require('../package.json').version);
  assert.equal(facts.current.visible,true);
  assert.deepEqual(facts.current.bullets,facts.completed.bullets);
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

test('every reviewed term resolves to its catalog entry with supporting context', async () => {
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
    const before = await page.locator('main .exp-prisma-hit').count();
    await page.locator('#exp-prisma-root').evaluate((host) => { const root=host.shadowRoot;root.querySelector('.launcher').click();root.querySelector('[data-section="appearance"]').click(); [...root.querySelectorAll('details > summary')].find((item) => item.textContent.includes('Highlight style'))?.click(); });
    await page.locator('#exp-prisma-root').evaluate((host) => { const select = host.shadowRoot.querySelector('select[aria-label="Style"]'); select.value = 'underline'; select.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForFunction(() => [...document.querySelectorAll('.exp-prisma-hit')].every((node) => node.dataset.style === 'underline'));
    const underline = await page.locator('.exp-prisma-hit[data-match-id]').first().evaluate((node) => {
      const style = getComputedStyle(node);
      return { backgroundImage: style.backgroundImage, backgroundSize: style.backgroundSize, decoration: style.textDecorationLine };
    });
    assert.match(underline.backgroundImage, /linear-gradient/);
    assert.match(underline.backgroundSize, /px/);
    assert.match(underline.decoration, /underline/);
    await page.locator('#exp-prisma-root').evaluate((host) => { const select = host.shadowRoot.querySelector('select[aria-label="Style"]'); select.value = 'soft-fill'; select.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForFunction(() => [...document.querySelectorAll('.exp-prisma-hit')].every((node) => node.dataset.style === 'soft-fill'));
    const fill = await page.locator('.exp-prisma-hit[data-match-id]').first().evaluate((node) => {
      const style = getComputedStyle(node);
      return { backgroundColor: style.backgroundColor, paddingInlineStart: style.paddingInlineStart };
    });
    assert.match(fill.backgroundColor, /^rgba?\(/);
    assert.notEqual(fill.backgroundColor, 'rgba(0, 0, 0, 0)');
    assert.notEqual(fill.paddingInlineStart, '0px');
    assert.equal(await page.locator('main .exp-prisma-hit').count(), before);
  } finally { await browser.close(); }
});

test('underline and soft fill resist hostile site CSS', async () => {
  const hostile = '<style>span{background:none!important;background-image:none!important;text-decoration:none!important;box-shadow:none!important;padding:0!important}</style><main>The bisexual community.</main>';
  const { browser, page } = await fixture(hostile);
  try {
    await page.locator('#exp-prisma-root').evaluate((host) => {
      const root = host.shadowRoot;
      root.querySelector('.launcher').click();
      root.querySelector('[data-section="appearance"]').click(); [...root.querySelectorAll('details > summary')].find((item) => item.textContent.includes('Highlight style'))?.click();
    });
    const setStyle = async (value) => {
      await page.locator('#exp-prisma-root').evaluate((host, next) => {
        const select = host.shadowRoot.querySelector('select[aria-label="Style"]');
        select.value = next;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
      await page.waitForFunction((next) => [...document.querySelectorAll('.exp-prisma-hit')].every((node) => node.dataset.style === next), value);
      return page.locator('.exp-prisma-hit[data-match-id]').first().evaluate((node) => {
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
      root.querySelector('[data-section="appearance"]').click(); [...root.querySelectorAll('details > summary')].find((item) => item.textContent.includes('Highlight style'))?.click();
    });
    const setStyle = async (value) => {
      await page.locator('#exp-prisma-root').evaluate((host, next) => {
        const select = host.shadowRoot.querySelector('select[aria-label="Style"]');
        select.value = next;
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
      await page.waitForFunction((next) => [...document.querySelectorAll('.exp-prisma-hit')].every((node) => node.dataset.style === next), value);
      return page.locator('.exp-prisma-hit[data-match-id]').first().evaluate((node) => {
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
    await page.locator('#exp-prisma-root').evaluate((host) => { host.shadowRoot.querySelector('.launcher').click(); const root=host.shadowRoot; const advanced=root.querySelector('[data-section="advanced"]'); if(advanced.getAttribute('aria-expanded')!=='true') advanced.click(); [...root.querySelectorAll('details > summary')].find((item) => item.textContent.includes('Sites'))?.click(); host.shadowRoot.querySelector('button[role="switch"][aria-label="Enable on this site"]').click(); });
    await page.waitForFunction(() => document.querySelectorAll('.exp-prisma-hit').length === 0);
    assert.equal(await page.locator('body > main').textContent(), 'bisexual');
  } finally { await browser.close(); }
});

test('global and site identity switches affect the same matcher', async () => {
  const { browser, page } = await fixture('<main>bisexual pansexual</main>');
  try {
    await page.locator('#exp-prisma-root').evaluate((host) => { const root = host.shadowRoot; root.querySelector('.launcher').click(); const advanced=root.querySelector('[data-section="advanced"]'); if(advanced.getAttribute('aria-expanded')!=='true') advanced.click(); [...root.querySelectorAll('details > summary')].find((item) => item.textContent.includes('Language'))?.click(); if(root.querySelectorAll('.identity-list .identity').length!==3)throw new Error('Identity catalog must show three defaults');const search=root.querySelector('.search');search.value='Bisexual';search.dispatchEvent(new Event('input',{bubbles:true}));root.querySelector('button[aria-label="Enable Bisexual"]').click(); });
    await page.waitForFunction(() => !document.querySelector('.exp-prisma-hit[data-identity="bisexual"]'));
    assert.equal(await page.locator('.exp-prisma-hit[data-identity="pansexual"]').count(), 1);
    await page.locator('#exp-prisma-root').evaluate((host) => { const root = host.shadowRoot; const advanced=root.querySelector('[data-section="advanced"]'); if(advanced.getAttribute('aria-expanded')!=='true') advanced.click(); [...root.querySelectorAll('details > summary')].find((item) => item.textContent.includes('Sites'))?.click(); root.querySelector('button[role="switch"][aria-label="Use site overrides"]').click(); [...root.querySelectorAll('summary')].find(node => node.textContent === 'Identity overrides').click(); const search=root.querySelector('input[aria-label="Search site identity overrides"]'); search.value='Pansexual'; search.dispatchEvent(new Event('input',{bubbles:true})); const select = root.querySelector('select[aria-label="Pansexual"]'); select.value = 'off'; select.dispatchEvent(new Event('change', { bubbles: true })); });
    await page.waitForFunction(() => document.querySelectorAll('.exp-prisma-hit').length === 0);
  } finally { await browser.close(); }
});

test('Safe Mode restores the page and can recover through the menu', async () => {
  const { browser, page } = await fixture('<main>bisexual</main>');
  try {
    await page.locator('#exp-prisma-root').evaluate((host) => { host.shadowRoot.querySelector('.launcher').click(); host.shadowRoot.querySelector('[data-section="advanced"]').click(); [...host.shadowRoot.querySelectorAll('summary')].find(n=>n.textContent==='Page tools').click(); host.shadowRoot.querySelector('button[role="switch"][aria-label="Safe Mode"]').click(); });
    await page.waitForFunction(() => document.querySelectorAll('.exp-prisma-hit').length === 0);
    const pageTools=page.locator('#exp-prisma-root').getByRole('tab',{name:'Page',exact:true});if(!await pageTools.evaluate(n=>n.parentElement.open))await pageTools.click();
    await page.locator('#exp-prisma-root').getByRole('switch',{name:'Safe Mode',exact:true}).click();
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
    await page.waitForFunction(() => document.getElementById('exp-prisma-root')?.shadowRoot.querySelector('.launcher img')?.naturalWidth > 0);
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
    const result = await page.locator('#exp-prisma-root').evaluate((host) => { host.shadowRoot.querySelector('.launcher').click(); host.shadowRoot.querySelector('[data-section="page"]').click(); const root = host.shadowRoot; const countRow = [...root.querySelectorAll('.row')].find((node) => node.querySelector('.label')?.textContent === 'Match count'); return { matches: root.querySelectorAll('.match-list .match').length, summary: [...root.querySelectorAll('.summary-row')].map((node) => node.textContent), count: countRow.querySelector('output').textContent }; });
    assert.equal(result.matches, 0);
    assert.equal(result.count, '3');
    assert.deepEqual(result.summary, []);
  } finally { await browser.close(); }
});

test('temporary hide preserves the page set and reload-persistent settings', async () => {
  const { browser, page } = await fixture('<main>bisexual pansexual</main>');
  try {
    const result = await page.locator('#exp-prisma-root').evaluate((host) => { const root = host.shadowRoot; root.querySelector('.launcher').click(); root.querySelector('[data-section="page"]').click(); root.querySelector('button[role="switch"][aria-label="Temporarily Hide Highlights"]').click(); const countRow = [...root.querySelectorAll('.row')].find((node) => node.querySelector('.label')?.textContent === 'Match count'); return { list: root.querySelectorAll('.match-list .match').length, count: countRow.querySelector('output').textContent }; });
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
        headerBadge: root.querySelector('.header-icon .menu-icon')?.getBoundingClientRect().width,
      };
    });
    assert.equal(initial.width, 288);
    assert.deepEqual(initial, { ...initial, sections: 4, visibleBodies: 0, openRoute: undefined, headerBadge: 38 });
    const changed = await page.locator('#exp-prisma-root').evaluate((host) => {
      const root = host.shadowRoot;
      root.querySelector('[data-section="page"]').click();
      return {
        visibleBodies: [...root.querySelectorAll('.route-body')].filter((body) => !body.hidden).length,
        openRoute: root.querySelector('.route[aria-expanded="true"] .fl-tool-title')?.textContent,
        currentRoute: root.querySelector('.route[aria-current="page"] .fl-tool-title')?.textContent,
        nested: root.querySelectorAll('.route-body:not([hidden]) details').length,
      };
    });
    assert.deepEqual(changed, { visibleBodies: 1, openRoute: 'Highlights', currentRoute: 'Highlights', nested: 1 });
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

test('menu routes use simplified labels with scoped secondary disclosures', async (t) => {
  const { browser, page } = await fixture('<main>The LGBTQ community celebrates bisexual pride.</main>');
  t.after(() => browser.close());
  const facts = await page.locator('#exp-prisma-root').evaluate((host) => {
    const root = host.shadowRoot;
    root.querySelector('.launcher').click();
    const labels = [...root.querySelectorAll('.nav button.route .fl-tool-title')].map((node) => node.textContent.trim());
    const subtitle = root.querySelector('[data-exp-part="subtitle"]')?.textContent || '';
    const openRoute = (label) => {
      [...root.querySelectorAll('.nav button.route')].find((button) => button.querySelector('.fl-tool-title')?.textContent === label)?.click();
    };
    openRoute('Appearance');
    const appearance = [...root.querySelectorAll('.route-body:not([hidden]) h3')].map((heading) => heading.textContent.trim());
    const styleDisclosure = [...root.querySelectorAll('.route-body:not([hidden]) details')].find((item) => item.querySelector(':scope > summary')?.textContent.includes('Highlight style'));
    const styleCollapsed = Boolean(styleDisclosure && !styleDisclosure.open);
    openRoute('Advanced');
    const advancedDisclosures = [...root.querySelectorAll('.route-body:not([hidden]) details > summary')].map((item) => item.textContent.trim());
    openRoute('System');
    const systemVisible = Boolean(root.querySelector('.route-body:not([hidden])'));
    return { labels, subtitle, appearance, styleCollapsed, advancedDisclosures, systemVisible, systemItems:[...root.querySelectorAll('[data-exp-product-system] [data-exp-system-item]')].map(n=>n.dataset.expSystemItem), systemSafeModes:root.querySelectorAll('[data-exp-product-system] [aria-label="Safe Mode"]').length };
  });
  assert.deepEqual(facts.labels, ['Highlights', 'Appearance', 'Advanced', 'System']);
  assert.equal(facts.subtitle, 'Your self-identity. Recognized.');
  assert.deepEqual(facts.appearance, ['Accessibility', 'Highlight style']);
  assert.equal(facts.styleCollapsed, true);
  assert.ok(facts.advancedDisclosures.includes('Language'));
  assert.ok(facts.advancedDisclosures.includes('Sites'));
  assert.equal(facts.systemVisible, true);
  assert.deepEqual(facts.systemItems,['status','support','reset']);assert.equal(facts.systemSafeModes,0);
  assert.ok(facts.advancedDisclosures.includes('Page tools'));assert.ok(facts.advancedDisclosures.includes('Settings transfer'));
});

test('README screenshots exist at stable docs paths', () => {
  const root = path.resolve(__dirname, '..');
  const expected = ['highlights-demo.png', 'language.png'];
  for (const name of expected) {
    const file = path.join(root, 'docs', 'screenshots', name);
    assert.ok(fs.existsSync(file), `missing screenshot ${name}`);
    assert.ok(fs.statSync(file).size > 1024, `screenshot too small ${name}`);
  }
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.doesNotMatch(readme, /^## Menu$/m);
  assert.match(readme, /^## See it in action$/m);
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
    shadow.querySelector('[data-section="appearance"]')?.click();
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

test('sensitive installed page stays unchanged until exact-site opt-in',async t=>{
 const browser=await chromium.launch();t.after(()=>browser.close());const page=await browser.newPage();
 await page.route('**/*',r=>r.abort());
 await page.route('https://mail.google.com/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body><main>bisexual identity</main></body></html>'}));
 await page.goto('https://mail.google.com/');await page.evaluate(()=>{window.GM_getValue=(_k,d)=>d;window.GM_setValue=()=>{};window.GM_xmlhttpRequest=()=>{};});await page.addScriptTag({content:script});await page.waitForSelector('#exp-prisma-root',{state:'attached'});
 assert.equal(await page.locator('main .exp-prisma-hit').count(),0);
 const root=page.locator('#exp-prisma-root');await root.locator('.launcher').click();await root.locator('[data-section="advanced"]').click();await root.getByRole('tab',{name:'Sites',exact:true}).click();
 assert.equal(await root.getByRole('switch',{name:'Enable on this site',exact:true}).getAttribute('aria-checked'),'false');
 await root.getByRole('switch',{name:'Enable on this site',exact:true}).click();await page.waitForFunction(()=>document.querySelectorAll('.exp-prisma-hit').length===1);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('exp:v3:prisma:settings')).sensitiveSiteOptIns),['mail.google.com']);
 await root.getByRole('switch',{name:'Enable on this site',exact:true}).click();await page.waitForFunction(()=>!document.querySelector('.exp-prisma-hit'));
});

// Public diagnostics inspect the real minified install, not private source names.
for(const guard of ['sensitive','disabled','excluded','safe-mode','suite-paused']) {
 test('catalog remains deferred across recovery and ordinary menus ('+guard+')',async t=>{
  const browser=await chromium.launch();t.after(()=>browser.close());const page=await browser.newPage();
  await page.route('**/*',r=>r.abort());await page.route('https://mail.google.com/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body><main>bisexual identity</main></body></html>'}));
  await page.goto('https://mail.google.com/');await page.evaluate(guard=>{const settings={sensitiveSiteOptIns:guard==='sensitive'?[]:['mail.google.com'],enabled:guard!=='disabled',safeMode:guard==='safe-mode',exclusions:guard==='excluded'?['mail.google.com']:[]};localStorage.setItem('exp:v3:prisma:settings',JSON.stringify(settings));if(guard==='suite-paused')localStorage.setItem('exp:v3:suite-site-pause:mail.google.com','1');window.GM_getValue=(_k,d)=>d;window.GM_setValue=()=>{};window.GM_xmlhttpRequest=()=>{};},guard);
  page.setDefaultTimeout(5000);await page.addScriptTag({content:script});await page.waitForSelector('#exp-prisma-root',{state:'attached'});const root=page.locator('#exp-prisma-root');
  await root.locator('.launcher').click();
  const status=async()=>{await root.locator('[data-section="system"]').click();await root.getByRole('tab',{name:'Support',exact:true}).click();const show=root.getByRole('button',{name:'Show Diagnostics',exact:true});if(await show.count())await show.click();await root.locator('.diag').filter({hasText:'"catalog"'}).waitFor();const report=JSON.parse(await root.locator('.diag').textContent());return report.catalog;};
  assert.equal((await status()).state,'deferred');
  await root.locator('[data-section="appearance"]').click();await root.getByRole('tab',{name:'Style',exact:true}).click();
  await root.locator('[data-section="advanced"]').click();await root.getByRole('tab',{name:'Sites',exact:true}).click();
  assert.equal(await root.locator('.site-identities .identity-list .row').count(),0);
  assert.equal((await status()).initializations,0);
  await root.locator('[data-section="advanced"]').click();await root.getByRole('tab',{name:'Language',exact:true}).click();
  assert.equal((await status()).initializations,1);
  assert.equal(await page.locator('main .exp-prisma-hit').count(),0);
 });
}

test('PRISMA sensitive-site import discloses permissions before deliberate apply',async t=>{
 const browser=await chromium.launch();t.after(()=>browser.close());const page=await browser.newPage();
 await page.route('**/*',r=>r.abort());await page.route('https://mail.google.com/**',r=>r.fulfill({contentType:'text/html',body:'<!doctype html><html><body style="background:white;color:#111"><main>bisexual identity</main></body></html>'}));
 await page.goto('https://mail.google.com/');await page.evaluate(()=>{window.GM_getValue=(_k,d)=>d;window.GM_setValue=()=>{};window.GM_xmlhttpRequest=()=>{};});await page.addScriptTag({content:script});await page.waitForSelector('#exp-prisma-root',{state:'attached'});
 const root=page.locator('#exp-prisma-root');await root.locator('.launcher').click();await root.locator('[data-section="advanced"]').click();await root.getByRole('tab',{name:'Transfer',exact:true}).click();
 const file={name:'settings.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({product:'prisma',generation:3,schema:1,settings:{theme:'midnight',sensitiveSiteOptIns:['mail.google.com']}}))};
 await root.locator('input[type=file]').setInputFiles(file);await root.locator('.import-preview').waitFor();assert.match(await root.locator('.import-preview').textContent(),/exact hostnames.*mail.google.com/);
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('exp:v3:prisma:settings')).sensitiveSiteOptIns),[]);
 await root.getByRole('button',{name:'Cancel import',exact:true}).click();assert.equal(await root.locator('.import-preview').count(),0);
 await root.locator('input[type=file]').setInputFiles(file);await root.getByRole('button',{name:'Apply import',exact:true}).click();
 assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('exp:v3:prisma:settings')).sensitiveSiteOptIns),['mail.google.com']);
});
