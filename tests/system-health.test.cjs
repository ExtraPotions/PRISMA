'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),files=['core.js','catalog-data.js','catalog.js','settings.js','matcher.js','renderer.js','engine.js'];
const runtime=fs.readFileSync(path.join(root,'vendor/exp-core/exp-core.js'),'utf8')+'\nconst EXP={};'+files.map(f=>fs.readFileSync(path.join(root,'src',f),'utf8')).join('\n')+';window.EXP=EXP;';
test('repeated scanning errors suspend PRISMA without counting pages with no matches',async t=>{const browser=await chromium.launch();t.after(()=>browser.close());const page=await browser.newPage();await page.route('**/*',r=>r.fulfill({body:'<html><body><p>bisexual</p></body></html>',contentType:'text/html'}));await page.goto('https://example.test/');await page.addScriptTag({content:runtime});
 const data=await page.evaluate(async()=>{EXP.Settings.load();const original=EXP.Matcher;let calls=0;EXP.Matcher={...original,find(){calls++;throw Error('fixture');}};EXP.Engine.start();EXP.Engine.processBatch([document.body]);EXP.Engine.processBatch([document.body]);const before=calls;EXP.Engine.processBatch([document.body]);const held=EXP.Engine.snapshot().recovery;EXP.Matcher=original;await EXP.Engine.retry();return{held,before,after:calls,recovered:EXP.Engine.snapshot().recovery};});
 assert.equal(data.held.suspended,true);assert.equal(data.after,data.before);assert.equal(data.recovered.suspended,false);
});
