'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const script=fs.readFileSync(path.join(__dirname,'../prisma.user.js'),'utf8');
test('live preview uses actual highlight styles on light and dark surfaces',async t=>{const browser=await chromium.launch();t.after(()=>browser.close());const page=await browser.newPage();await page.route('**/*',r=>r.fulfill({body:'<html><body><main>The bisexual community.</main></body></html>',contentType:'text/html'}));await page.goto('https://fixture.test/');await page.addScriptTag({content:script});await page.locator('#exp-prisma-root .launcher').click();await page.locator('#exp-prisma-root [data-section="appearance"]').click();await page.locator('#exp-prisma-root').getByRole('tab',{name:'Style',exact:true}).click();
 assert.equal(await page.locator('[data-prisma-preview] .exp-prisma-hit').count(),2);
 for(const style of ['underline','soft-fill','gradient']){await page.locator('#exp-prisma-root select[aria-label="Style"]').selectOption(style);const rows=await page.locator('[data-prisma-preview] .exp-prisma-hit').evaluateAll(nodes=>nodes.map(n=>({style:n.dataset.style,underline:getComputedStyle(n).textDecorationLine,fill:getComputedStyle(n).backgroundColor})));assert.ok(rows.every(r=>r.style===style));if(style==='underline')assert.ok(rows.every(r=>r.underline.includes('underline')));if(style==='soft-fill')assert.ok(rows.every(r=>r.fill!=='rgba(0, 0, 0, 0)'));}
 await page.locator('#exp-prisma-root select[aria-label="Style"]').selectOption('gradient');
 await page.locator('#exp-prisma-root [aria-label="Animation"]').click();
 assert.ok((await page.locator('[data-prisma-preview] .exp-prisma-hit').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).animationName))).every(n=>n!=='none'));
 await page.emulateMedia({reducedMotion:'reduce'});
 assert.ok((await page.locator('[data-prisma-preview] .exp-prisma-hit').evaluateAll(ns=>ns.map(n=>getComputedStyle(n).animationName))).every(n=>n==='none'));
 assert.equal(await page.locator('main').innerText(),'The bisexual community.');assert.equal(await page.locator('main .exp-prisma-hit').count(),1);
});
