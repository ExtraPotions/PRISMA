'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function load(){const context={EXP:{},ExtraPotionsCore:{cloneSettings:value=>JSON.parse(JSON.stringify(value))},location:{hostname:'test.example'}};vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../vendor/exp-core/exp-core.js'),'utf8').match(/const ExtraPotionsTools = \(\(\) => \{[\s\S]*?\n\}\)\(\);/)[0]+';ExtraPotionsCore.createSettingsRecovery=ExtraPotionsTools.createSettingsRecovery;',context);for(const file of ['catalog-data.js','catalog.js','matcher.js','settings.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src',file),'utf8'),context);return context.EXP;}
test('romantic recognition is opt-in, persists through export, and does not fall back inside combined labels',()=>{
 const exp=load();const defaults=exp.Settings.load();
 assert.equal(defaults.includeRomantic,false);
 const text='Biromantic orientation, aromantic asexual, and bisexual pride.';
 const ids=settings=>Array.from(exp.Matcher.find(text,settings).eligible,hit=>hit.identity.id);
 assert.deepEqual(ids(defaults),['bisexual']);
 assert.ok(exp.Catalog.get('biromantic').definition);
 exp.Settings.update({includeRomantic:true});
 assert.deepEqual(ids(exp.Settings.snapshot()),['biromantic','aroace','bisexual']);
 assert.equal(exp.Settings.prepareImport(exp.Settings.exportData()).includeRomantic,true);
 assert.equal(exp.Settings.validate({includeRomantic:'true'}).includeRomantic,false);
 exp.Settings.update({includeRomantic:false});
 assert.deepEqual(ids(exp.Settings.snapshot()),['bisexual']);
});
test('Wikipedia verification cannot be inferred merely from another public definition source',()=>{
 const exp=load();
 assert.equal(exp.Catalog.get('bisexual').verification.status,'wikipedia');
 assert.ok(exp.Catalog.get('bisexual').verification.sources.every(url=>new URL(url).hostname.endsWith('wikipedia.org')));
 assert.equal(exp.Catalog.get('transine').verification.status,'unverified');
});
test('Romantic identities switch updates current-page matches, survives reload, and leaves definitions available',async t=>{
 const {chromium}=require('playwright');const browser=await chromium.launch();t.after(()=>browser.close());const page=await browser.newPage();
 await page.addInitScript({content:fs.readFileSync(path.join(__dirname,'../prisma.user.js'),'utf8')});
 await page.route('https://romantic.test/**',route=>route.fulfill({contentType:'text/html; charset=utf-8',body:'<!doctype html><p>Biromantic orientation and bisexual pride.</p>'}));
 await page.goto('https://romantic.test/');await page.waitForSelector('[data-identity="bisexual"]');
 assert.equal(await page.locator('[data-identity="biromantic"]').count(),0);
 const root=page.locator('#exp-prisma-root');await root.locator('.launcher').click();await root.locator('[data-section="tools"]').click();
 const toggle=root.getByRole('switch',{name:'Romantic identities',exact:true});
 assert.equal(await toggle.getAttribute('aria-checked'),'false');await toggle.click();await page.waitForSelector('[data-identity="biromantic"]');
 await page.reload();await page.waitForSelector('[data-identity="biromantic"]');
 await root.locator('.launcher').click();await root.locator('[data-section="tools"]').click();await toggle.click();
 await page.waitForFunction(()=>!document.querySelector('[data-identity="biromantic"]'));
 await root.getByLabel('Search identity catalog').fill('biromantic');await root.getByRole('button',{name:'Details',exact:true}).click();
 assert.match(await root.locator('.catalog-detail:not([hidden])').textContent(),/Romantic attraction/);
 assert.equal(await root.locator('input[type="checkbox"]').count(),0);
 await root.getByLabel('Search identity catalog').fill('bisexual');await root.getByRole('button',{name:'Details',exact:true}).click();
 assert.match(await root.locator('.definition-verification').textContent(),/✓ Verified/);
});
