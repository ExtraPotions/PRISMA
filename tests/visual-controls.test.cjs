'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
// Opens the current inline settings group without collapsing an already-open disclosure.
async function openSubmenu(scope,label){
 const aliases={Style:'Highlight style',Menu:'Menu Preferences',Transfer:'Settings transfer',Effects:'Effects & integrations',Profiles:'Profiles & sites',Page:'Page tools',Retailers:'Retailer modules',Review:'Protection review',Activity:'Page activity',Playback:'Playback options',Alerts:'Notifications',Patterns:'Advanced Amazon',Tools:'Page tools'};
 if(label==='Overview')return;
 const shortcut=scope.locator('[data-exp-menu-shortcut="'+label.toLowerCase()+'"]');if(await shortcut.count()){await shortcut.click();return;}
 const summary=scope.locator('summary:visible').filter({hasText:new RegExp('^'+(aliases[label]||label)+'(?: .*)?'+'$')}).first();
 await summary.waitFor();if(!await summary.evaluate(n=>n.parentElement.open))await summary.click();
}
const script = fs.readFileSync(path.join(__dirname, '../prisma.user.js'), 'utf8');

async function fixture(t, css = '') {
  const browser = await chromium.launch(); t.after(() => browser.close());
  const page = await browser.newPage();
  await page.route('https://fixture.test/**', route => route.fulfill({ contentType:'text/html', body:`<style>${css}</style><main id="content">The bisexual community.</main>` }));
  await page.addInitScript({content:script}); await page.goto('https://fixture.test/page');
  await page.waitForSelector('.exp-prisma-hit');
  await page.locator('#exp-prisma-root .launcher').click();
  await page.locator('#exp-prisma-root [data-exp-section-tab="appearance"]').click();
  await openSubmenu(page.locator('#exp-prisma-root'),'Style');
  return page;
}
async function style(page, value) {
  await page.locator('#exp-prisma-root select[aria-label="Style"]').selectOption(value);
  await page.waitForFunction(value => document.querySelector('.exp-prisma-hit')?.dataset.style === value, value);
}
test('gradient survives portal dark-mode background inheritance and late theme changes', async t => {
  // A light portal theme: on a dark one the Bisexual palette is unreadable and becomes an underline (highlight-contrast.test.cjs).
  const page = await fixture(t, 'html{background:#f4f4f6;color:#16161c} html.dark main :not(.notheme):not(a){background:inherit!important;color:inherit!important}');
  await page.evaluate(()=>document.documentElement.classList.add('dark'));
  const visual=await page.locator('.exp-prisma-hit[data-match-id]').evaluate(node=>{const s=getComputedStyle(node);return {image:s.backgroundImage,clip:s.backgroundClip,fill:s.webkitTextFillColor};});
  assert.match(visual.image,/linear-gradient/);
  assert.equal(visual.clip,'text');
  await page.emulateMedia({forcedColors:'active'});
  assert.notEqual(await page.locator('.exp-prisma-hit[data-match-id]').evaluate(node=>getComputedStyle(node).webkitTextFillColor),'rgba(0, 0, 0, 0)');
});
test('underline and fill remain visible against text-clipping site CSS', async t => {
  const page = await fixture(t, 'main{color:rgb(30,30,30)} #content span{background-clip:text!important;-webkit-text-fill-color:transparent!important;color:transparent!important}');
  for (const value of ['underline','soft-fill']) {
    await style(page, value);
    const visual = await page.locator('.exp-prisma-hit[data-match-id]').evaluate(node => {
      const css = getComputedStyle(node);return { clip:css.backgroundClip, fill:css.webkitTextFillColor, color:css.color };
    });
    assert.equal(visual.clip, 'border-box');
    assert.equal(visual.fill, 'rgb(30, 30, 30)');
    assert.equal(visual.color, 'rgb(30, 30, 30)');
  }
});
test('animation has a changing rendered effect for every style and respects motion settings', async t => {
  const page = await fixture(t);
  await page.locator('#exp-prisma-root [aria-label="Animation"]').click();
  for (const value of ['gradient','underline','soft-fill']) {
    await style(page,value);
    const changed = await page.locator('.exp-prisma-hit[data-match-id]').evaluate(node => {
      const animation=node.getAnimations()[0]; if(!animation)return false;
      animation.pause(); animation.currentTime=0;
      const before=getComputedStyle(node).opacity;
      animation.currentTime=2500;
      return getComputedStyle(node).opacity !== before;
    });
    assert.equal(changed,true,`${value} must visibly animate`);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.exp-prisma-hit[data-match-id]').evaluate(node=>getComputedStyle(node).animationName),'none');
  await openSubmenu(page.locator('#exp-prisma-root'),'Overview');
  await page.locator('#exp-prisma-root select[aria-label="Reduce motion"]').selectOption('allow');
  assert.notEqual(await page.locator('.exp-prisma-hit[data-match-id]').evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.locator('#exp-prisma-root select[aria-label="Reduce motion"]').selectOption('reduce');
  assert.equal(await page.locator('.exp-prisma-hit[data-match-id]').evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.locator('#exp-prisma-root select[aria-label="Reduce motion"]').selectOption('allow');
  await openSubmenu(page.locator('#exp-prisma-root'),'Style');
  await page.locator('#exp-prisma-root [aria-label="Animation"]').click();
  assert.equal(await page.locator('.exp-prisma-hit[data-match-id]').evaluate(node=>getComputedStyle(node).animationName),'none');
});
test('animation choices visibly differ, persist, and stop for reduced motion', async t => {
  const page = await fixture(t);
  await page.locator('#exp-prisma-root [aria-label="Animation"]').click();
  for (const [choice,property] of [['pulse','opacity'],['shimmer','filter'],['glow','textShadow']]) {
    await page.getByLabel('Animation style',{exact:true}).selectOption(choice);
    for (const visualStyle of ['gradient','underline','soft-fill']) {
      await style(page,visualStyle);
      const result=await page.locator('.exp-prisma-hit[data-match-id]').evaluate((node,property)=>{
        const a=node.getAnimations()[0]; if(!a)return null;
        a.pause();a.currentTime=0;const before=getComputedStyle(node)[property];
        a.currentTime=2500;return {before,after:getComputedStyle(node)[property],name:getComputedStyle(node).animationName};
      },property);
      assert.ok(result);assert.equal(result.name,`exp-prisma-${choice}`);assert.notEqual(result.before,result.after,choice+' '+visualStyle);
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('.exp-prisma-hit[data-match-id]').evaluate(n=>getComputedStyle(n).animationName),'none');
    await page.emulateMedia({reducedMotion:'no-preference'});
  }
  await page.reload();await page.waitForSelector('.exp-prisma-hit');
  assert.equal(await page.locator('.exp-prisma-hit[data-match-id]').getAttribute('data-animation'),'glow');
  await page.emulateMedia({forcedColors:'active'});
  assert.equal(await page.locator('.exp-prisma-hit[data-match-id]').evaluate(n=>getComputedStyle(n).animationName),'none');
});
