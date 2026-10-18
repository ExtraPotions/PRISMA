'use strict';
// The 2026-10 review measured gradient highlights on a dark Wikipedia skin: purple 1.95:1, and the Bisexual preview's
// blue 1.80:1 on the dark card. A gradient that cannot be read keeps the site's text color and moves the palette to an underline.
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{chromium}=require('playwright');
// Opens the current inline settings group without collapsing an already-open disclosure.
async function openSubmenu(scope,label){
 const aliases={Style:'Highlight style',Menu:'Menu Preferences',Transfer:'Settings transfer',Effects:'Effects & integrations',Profiles:'Profiles & sites',Page:'Page tools',Retailers:'Retailer modules',Review:'Protection review',Activity:'Page activity',Playback:'Playback options',Alerts:'Notifications',Patterns:'Advanced Amazon',Tools:'Page tools'};
 if(label==='Overview')return;
 const shortcut=scope.locator('[data-exp-menu-shortcut="'+label.toLowerCase()+'"]');if(await shortcut.count()){await shortcut.click();return;}
 const summary=scope.locator('summary:visible').filter({hasText:new RegExp('^'+(aliases[label]||label)+'(?: .*)?'+'$')}).first();
 await summary.waitFor();if(!await summary.evaluate(n=>n.parentElement.open))await summary.click();
}
const script=fs.readFileSync(path.join(__dirname,'../prisma.user.js'),'utf8');
async function gradientPage(t,body){
  const browser=await chromium.launch();t.after(()=>browser.close());const page=await browser.newPage();
  await page.route('**/*',r=>r.fulfill({body:`<html><body style="${body}"><main>The bisexual community.</main></body></html>`,contentType:'text/html'}));
  await page.goto('https://fixture.test/');await page.addScriptTag({content:script});
  await page.locator('#exp-prisma-root .launcher').click();await page.locator('#exp-prisma-root [data-exp-section-tab="appearance"]').click();
  await openSubmenu(page.locator('#exp-prisma-root'),'Style');
  await page.locator('#exp-prisma-root select[aria-label="Style"]').selectOption('gradient');
  const read=n=>({fallback:n.dataset.contrastFallback||'0',fill:getComputedStyle(n).webkitTextFillColor,color:getComputedStyle(n).color,bar:getComputedStyle(n).backgroundImage});
  return {page,hit:await page.locator('main .exp-prisma-hit').evaluate(read),previews:await page.locator('[data-prisma-preview] .exp-prisma-hit').evaluateAll((nodes,source)=>nodes.map(new Function('return '+source)()),read.toString())};
}
test('a gradient that is unreadable on a dark page becomes an underline in the site text color',async t=>{
  const {hit,previews}=await gradientPage(t,'background:#1d090f;color:#eaeaea;font-size:14px');
  assert.equal(hit.fallback,'1','the dark-page highlight falls back: '+JSON.stringify(hit));
  assert.equal(hit.fill,'rgb(234, 234, 234)','the word keeps the site text color: '+JSON.stringify(hit));
  assert.match(hit.bar,/linear-gradient/,'the palette is still shown, as an underline: '+JSON.stringify(hit));
  assert.deepEqual(previews.map(p=>p.fallback),['0','1'],'the light preview keeps the gradient and the dark one falls back: '+JSON.stringify(previews));
});
test('a gradient that is readable on a light page stays a gradient',async t=>{
  const {hit}=await gradientPage(t,'background:#ffffff;color:#16161c;font-size:14px');
  assert.equal(hit.fallback,'0',JSON.stringify(hit));
  assert.equal(hit.fill,'rgba(0, 0, 0, 0)','the gradient still paints the word: '+JSON.stringify(hit));
});
test('a live gradient switches to readable fallback after darkening and returns to a gradient on light',async t=>{
  const {page,hit}=await gradientPage(t,'background:#ffffff;color:#16161c;font-size:14px');
  assert.equal(hit.fallback,'0',JSON.stringify(hit));
  const highlight=page.locator('main .exp-prisma-hit');
  await highlight.evaluate(n=>{n.dataset.contrastTest='original';});
  await page.evaluate(()=>{
    document.body.style.background='#1d090f';document.body.style.color='#eaeaea';
    document.documentElement.setAttribute('data-exp-shift','crimson');
  });
  await page.waitForFunction(()=>document.querySelector('main .exp-prisma-hit')?.dataset.contrastFallback==='1');
  const dark=await highlight.evaluate(n=>({fill:getComputedStyle(n).webkitTextFillColor,bar:getComputedStyle(n).backgroundImage,original:n.dataset.contrastTest}));
  assert.equal(dark.fill,'rgb(234, 234, 234)','the darkened word keeps readable site text: '+JSON.stringify(dark));
  assert.match(dark.bar,/linear-gradient/,'the palette moves to the underline: '+JSON.stringify(dark));
  assert.equal(dark.original,'original','the existing highlight is re-evaluated');
  await page.evaluate(()=>{
    document.body.style.background='#ffffff';document.body.style.color='#16161c';
    document.documentElement.removeAttribute('data-exp-shift');
  });
  await page.waitForFunction(()=>document.querySelector('main .exp-prisma-hit')?.dataset.contrastFallback==='0');
  assert.equal(await highlight.evaluate(n=>getComputedStyle(n).webkitTextFillColor),'rgba(0, 0, 0, 0)','the light page restores gradient text');
});
test('a page class change that leaves the colors alone does not rewrite any highlight',async t=>{
  const {page}=await gradientPage(t,'background:#ffffff;color:#16161c;font-size:14px');
  await page.evaluate(()=>{window.__rewrites=0;new MutationObserver(records=>{window.__rewrites+=records.length;}).observe(document.querySelector('main'),{attributes:true,subtree:true});});
  // Sites toggle classes like this on every scroll.
  for(let i=0;i<4;i++){await page.evaluate(i=>document.body.classList.toggle('scrolled',i%2===0),i);await page.waitForTimeout(300);}
  assert.equal(await page.evaluate(()=>window.__rewrites),0,'highlights are only rewritten when their readability changes');
});
