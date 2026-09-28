'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const script = fs.readFileSync(path.join(__dirname, '../prisma.user.js'), 'utf8');

async function fixture(t, css = '') {
  const browser = await chromium.launch(); t.after(() => browser.close());
  const page = await browser.newPage();
  await page.route('https://fixture.test/**', route => route.fulfill({ contentType:'text/html', body:`<style>${css}</style><main id="content">The bisexual community.</main>` }));
  await page.addInitScript({content:script}); await page.goto('https://fixture.test/page');
  await page.waitForSelector('.exp-prisma-hit');
  await page.locator('#exp-prisma-root .launcher').click();
  await page.locator('#exp-prisma-root [data-section="appearance"]').click();
  await page.locator('#exp-prisma-root details').filter({hasText:'Highlight style'}).locator('summary').click();
  return page;
}
async function style(page, value) {
  await page.locator('#exp-prisma-root select[aria-label="Style"]').selectOption(value);
  await page.waitForFunction(value => document.querySelector('.exp-prisma-hit')?.dataset.style === value, value);
}
test('gradient survives portal dark-mode background inheritance and late theme changes', async t => {
  const page = await fixture(t, 'html{background:#101418;color:#eaecf0} html.dark main :not(.notheme):not(a){background:inherit!important;color:inherit!important}');
  await page.evaluate(()=>document.documentElement.classList.add('dark'));
  const visual=await page.locator('.exp-prisma-hit').evaluate(node=>{const s=getComputedStyle(node);return {image:s.backgroundImage,clip:s.backgroundClip,fill:s.webkitTextFillColor};});
  assert.match(visual.image,/linear-gradient/);
  assert.equal(visual.clip,'text');
  await page.emulateMedia({forcedColors:'active'});
  assert.notEqual(await page.locator('.exp-prisma-hit').evaluate(node=>getComputedStyle(node).webkitTextFillColor),'rgba(0, 0, 0, 0)');
});
test('underline and fill remain visible against text-clipping site CSS', async t => {
  const page = await fixture(t, 'main{color:rgb(30,30,30)} #content span{background-clip:text!important;-webkit-text-fill-color:transparent!important;color:transparent!important}');
  for (const value of ['underline','soft-fill']) {
    await style(page, value);
    const visual = await page.locator('.exp-prisma-hit').evaluate(node => {
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
    const changed = await page.locator('.exp-prisma-hit').evaluate(node => {
      const animation=node.getAnimations()[0]; if(!animation)return false;
      animation.pause(); animation.currentTime=0;
      const before=getComputedStyle(node).opacity;
      animation.currentTime=2500;
      return getComputedStyle(node).opacity !== before;
    });
    assert.equal(changed,true,`${value} must visibly animate`);
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await page.locator('.exp-prisma-hit').evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.locator('#exp-prisma-root select[aria-label="Reduce motion"]').selectOption('allow');
  assert.notEqual(await page.locator('.exp-prisma-hit').evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.locator('#exp-prisma-root select[aria-label="Reduce motion"]').selectOption('reduce');
  assert.equal(await page.locator('.exp-prisma-hit').evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.locator('#exp-prisma-root select[aria-label="Reduce motion"]').selectOption('allow');
  const styleDetails = page.locator('#exp-prisma-root details').filter({hasText:'Highlight style'}); if (!(await styleDetails.getAttribute('open'))) await styleDetails.locator('summary').click();
  await page.locator('#exp-prisma-root [aria-label="Animation"]').click();
  assert.equal(await page.locator('.exp-prisma-hit').evaluate(node=>getComputedStyle(node).animationName),'none');
});
test('animation choices visibly differ, persist, and stop for reduced motion', async t => {
  const page = await fixture(t);
  await page.locator('#exp-prisma-root [aria-label="Animation"]').click();
  for (const [choice,property] of [['pulse','opacity'],['shimmer','filter'],['glow','textShadow']]) {
    await page.getByLabel('Animation style',{exact:true}).selectOption(choice);
    for (const visualStyle of ['gradient','underline','soft-fill']) {
      await style(page,visualStyle);
      const result=await page.locator('.exp-prisma-hit').evaluate((node,property)=>{
        const a=node.getAnimations()[0]; if(!a)return null;
        a.pause();a.currentTime=0;const before=getComputedStyle(node)[property];
        a.currentTime=2500;return {before,after:getComputedStyle(node)[property],name:getComputedStyle(node).animationName};
      },property);
      assert.ok(result);assert.equal(result.name,`exp-prisma-${choice}`);assert.notEqual(result.before,result.after,choice+' '+visualStyle);
    }
    await page.emulateMedia({reducedMotion:'reduce'});
    assert.equal(await page.locator('.exp-prisma-hit').evaluate(n=>getComputedStyle(n).animationName),'none');
    await page.emulateMedia({reducedMotion:'no-preference'});
  }
  await page.reload();await page.waitForSelector('.exp-prisma-hit');
  assert.equal(await page.locator('.exp-prisma-hit').getAttribute('data-animation'),'glow');
  await page.emulateMedia({forcedColors:'active'});
  assert.equal(await page.locator('.exp-prisma-hit').evaluate(n=>getComputedStyle(n).animationName),'none');
});
