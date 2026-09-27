'use strict';
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
function load(){const context={EXP:{}};for(const file of ['catalog-data.js','catalog.js','matcher.js'])vm.runInNewContext(fs.readFileSync(path.join(__dirname,'../src',file),'utf8'),context);return context.EXP;}
const settings={matcherMode:'balanced',disabledIdentities:[],surroundingContext:true,ambiguityProtection:true,includeRomantic:true};
test('expanded catalog validates and exposes sourced definitions with separate categories',()=>{
 const exp=load();assert.equal(exp.Catalog.status().valid,true,JSON.stringify(exp.Catalog.status()));
 assert.equal(exp.Catalog.get('intersex').category,'Sex characteristics');
 assert.match(exp.Catalog.get('two-spirit').definition,/Indigenous/);
 assert.equal(exp.Catalog.get('graygender').sources[0],'https://www.healthline.com/health/different-genders');
 assert.equal(exp.Catalog.get('graygender').flag.status,'unverified');
});
test('new phrases use the most specific entry and preserve legacy settings IDs',()=>{
 const exp=load();for(const [phrase,id]of [['trans woman','trans-woman'],['cis man','cis-man'],['demiman','demiboy'],['demiwoman','demigirl'],['gender fluid','genderfluid'],['graygender','graygender'],['androsexual','androsexual'],['biromantic','biromantic']]){
   assert.deepEqual(Array.from(exp.Matcher.find(phrase,settings).eligible,x=>x.identity.id),[id],phrase);
 }
 assert.equal(exp.Matcher.find('demiman',{...settings,disabledIdentities:['demiboy']}).eligible.length,0);
});
test('common words and profile abbreviations do not match ordinary prose',()=>{
 const exp=load();
 for(const text of ['The man carried a bag.','The female connector fits.','A boy and a girl entered.','unlabeled boxes','NB: check the report','M F B W IS TG TV TM DW GF','gender-neutral bathroom','Müllerian duct anatomy','Wolffian ducts','identity theft involving the man'])assert.equal(exp.Matcher.find(text,settings).eligible.length,0,text);
 for(const text of ['My gender identity is man.','The female identity label.','An unlabeled sexual orientation.'])assert.ok(exp.Matcher.find(text,settings).eligible.length,text);
});
test('flag palettes distinguish verified colors from an unverified neutral treatment',()=>{
 const exp=load();assert.deepEqual(Array.from(exp.Catalog.get('asexual').colors),['#000000','#A3A3A3','#FFFFFF','#800080']);
 assert.equal(exp.Catalog.get('asexual').flag.status,'verified');
 assert.deepEqual(Array.from(exp.Catalog.get('graygender').colors),[]);
 assert.ok(exp.Catalog.search('weak').some(x=>x.id==='graygender'));
});

test('all original catalog IDs and aliases remain available to existing preferences',()=>{
 const exp=load();const baseline=require('./fixtures/catalog-v3.0.32.json');
 for(const old of baseline){const current=exp.Catalog.get(old.id);assert.ok(current,old.id);for(const word of old.words)assert.ok(current.terms.some(term=>term.text===word),`${old.id}: ${word}`);}
});

test('new neutral entries remain readable in every style and Details exposes sources',async t=>{
 const {chromium}=require('playwright');const browser=await chromium.launch();t.after(()=>browser.close());
 const page=await browser.newPage({viewport:{width:1100,height:1100}});
 const script=fs.readFileSync(path.join(__dirname,'../prisma.user.js'),'utf8');
 await page.addInitScript({content:script});
 await page.route('https://catalog.test/**',route=>route.fulfill({contentType:'text/html; charset=utf-8',body:'<!doctype html><style>body{background:#17202a;color:#eee}</style><main><p>Graygender identity and asexual orientation.</p></main>'}));
 await page.goto('https://catalog.test/');await page.waitForSelector('.exp-prisma-hit');
 const root=page.locator('#exp-prisma-root');await root.locator('.launcher').click();
 await root.locator('[data-section="style"]').click();
 for(const style of ['gradient','underline','soft-fill']){
   await page.getByLabel('Style',{exact:true}).selectOption(style);
   const facts=await page.locator('[data-identity="graygender"]').evaluate(node=>({style:node.dataset.style,palette:node.dataset.palette,color:getComputedStyle(node).color,text:getComputedStyle(node).webkitTextFillColor,line:getComputedStyle(node).textDecorationLine}));
   assert.equal(facts.style,'underline');assert.equal(facts.palette,'neutral');assert.equal(facts.color,'rgb(238, 238, 238)');assert.notEqual(facts.text,'rgba(0, 0, 0, 0)');assert.equal(facts.line,'underline');
 }
 await root.locator('[data-section="tools"]').click();
 await page.getByLabel('Search identity catalog').fill('graygender');
 await root.getByRole('button',{name:'Details',exact:true}).click();
 const detail=root.locator('.catalog-detail:not([hidden])');
 assert.match(await detail.textContent(),/weak or ambivalent/);
 assert.match(await detail.textContent(),/neutral underline/);
 assert.equal(await detail.getByRole('link',{name:'Definition source: www.healthline.com',exact:true}).getAttribute('href'),'https://www.healthline.com/health/different-genders');
 assert.equal(await detail.getByRole('link',{name:'Flag source: lgbtqia.fandom.com',exact:true}).getAttribute('href'),'https://lgbtqia.fandom.com/wiki/Graygender');
 await page.getByLabel('Search identity catalog').fill('');
 const first=await root.locator('.identity-list .label').allTextContents();
 await root.getByRole('button',{name:'Next results',exact:true}).click();
 assert.notDeepEqual(await root.locator('.identity-list .label').allTextContents(),first);
 await root.getByRole('button',{name:'Previous results',exact:true}).click();
 assert.deepEqual(await root.locator('.identity-list .label').allTextContents(),first);
});

test('catalog references use only reviewed public domains and disclose missing references',()=>{
 const exp=load();const allowed=new Set([
 'www.healthline.com','en.wikipedia.org','de.wikipedia.org','es.wikipedia.org','en.wiktionary.org','lgbtqia.fandom.com','commons.wikimedia.org',
 'beyond-mogai-pride-flags.tumblr.com','bi.org','biaroace.tumblr.com','c4ss.org','cejce.berkeley.edu','csd-deutschland.de','cupidpride.wordpress.com','gend3r.com','gender.fandom.com','gilbertbaker.com','interactadvocates.org','lgbt.fandom.com','lgbtqidentity.wikitide.org','marybaldwin.edu','medlineplus.gov','mogailabel.fandom.com','morgancarpenter.com','neuroqueer.fandom.com','new.lgbtqia.wiki','nonbinary.wiki','pflag.org','pride-color-schemes.tumblr.com','prideflag.fandom.com','progress.gay','queer-community.fandom.com','queer-dictionary.crd.co','queerdom.fandom.com','queerplus.wikioasis.org','salmacian.org','unece.org','www.accessmhct.com','www.aromanticism.org','www.bloomingtonpridemn.org','www.colorado.edu','www.dictionary.com','www.freedressing.org','www.fugues.com','www.lgbtqnation.com','www.onwa.ca','www.phila.gov','www.reddit.com','www.schwulesmuseum.de','www.uwgb.edu','www.wpi.edu','youthrex.com'
 ]);
 for(const item of exp.Catalog.identities){
   for(const url of [...item.sources,...item.flag.sources,...item.verification.sources,item.flag.source].filter(Boolean))assert.ok(allowed.has(new URL(url).hostname)||url==='https://www.deviantart.com/pride-flags/art/Polyromantic-1-607943635',url);
   if(item.definition&&!item.sources.length)assert.equal(item.definitionStatus,'public-reference-pending',item.id);
 }
});
