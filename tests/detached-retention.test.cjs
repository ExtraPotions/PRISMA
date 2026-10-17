'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {loadSource}=require('./load-source.cjs');

test('removed highlighted cards can be collected without changing settings',async t=>{
  const browser=await chromium.launch();t.after(()=>browser.close());
  const page=await browser.newPage();
  await page.route('**/*',route=>route.request().isNavigationRequest()?route.fulfill({contentType:'text/html',body:'<!doctype html><html><body><main id="feed"></main></body></html>'}):route.abort());
  await page.addInitScript(()=>{window.GM_getValue=(_key,fallback)=>fallback;window.GM_setValue=()=>{};window.GM_xmlhttpRequest=()=>({abort(){}});window.GM_registerMenuCommand=()=>{};});
  await page.goto('https://example.com/');await page.addScriptTag({content:loadSource()});
  await page.evaluate(()=>{const feed=document.getElementById('feed');for(let n=0;n<20;n++){const card=document.createElement('p');card.textContent='bisexual and pansexual';feed.append(card);}window.cardRefs=[...feed.children].map(card=>new WeakRef(card));});
  await page.waitForFunction(()=>document.querySelectorAll('#feed .exp-prisma-hit').length===40);
  await page.evaluate(()=>document.getElementById('feed').replaceChildren());
  await page.waitForTimeout(500);
  const cdp=await page.context().newCDPSession(page);await cdp.send('HeapProfiler.collectGarbage');
  assert.equal(await page.evaluate(()=>cardRefs.filter(ref=>ref.deref()).length),0);
});
