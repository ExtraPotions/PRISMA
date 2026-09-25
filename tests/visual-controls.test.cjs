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
  await page.locator('#exp-prisma-root [data-route="style"]').click();
  return page;
}
async function style(page, value) {
  await page.locator('#exp-prisma-root select[aria-label="Style"]').selectOption(value);
  await page.waitForFunction(value => document.querySelector('.exp-prisma-hit')?.dataset.style === value, value);
}
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
  await page.locator('#exp-prisma-root [data-route="look"]').click();
  await page.locator('#exp-prisma-root select[aria-label="Reduced motion"]').selectOption('allow');
  assert.notEqual(await page.locator('.exp-prisma-hit').evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.locator('#exp-prisma-root select[aria-label="Reduced motion"]').selectOption('reduce');
  assert.equal(await page.locator('.exp-prisma-hit').evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.locator('#exp-prisma-root select[aria-label="Reduced motion"]').selectOption('allow');
  await page.locator('#exp-prisma-root [data-route="style"]').click();
  await page.locator('#exp-prisma-root [aria-label="Animation"]').click();
  assert.equal(await page.locator('.exp-prisma-hit').evaluate(node=>getComputedStyle(node).animationName),'none');
});
