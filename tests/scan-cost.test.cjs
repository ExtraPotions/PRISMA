'use strict';
// Busy pages add large subtrees constantly. A scan must decide ignored content once per element,
// not walk every text node's ancestors (closest + presentation chain) again.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const script = fs.readFileSync(path.resolve(__dirname, '..', 'prisma.user.js'), 'utf8');

async function fixture(html) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.addInitScript({ content: script });
  await page.route('https://fixture.test/**', (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await page.route('https://raw.githubusercontent.com/ExtraPotions/PRISMA/main/assets/prisma-launcher.svg', route => route.fulfill({ contentType: 'image/svg+xml', body: fs.readFileSync(path.resolve(__dirname, '../assets/prisma-launcher.svg'), 'utf8') }));
  await page.goto('https://fixture.test/page');
  await page.waitForSelector('.exp-prisma-hit');
  return { browser, page };
}

test('a dynamic batch skips ignored subtrees without per-text ancestor walks', async () => {
  const { browser, page } = await fixture('<main id="content"><p>A bisexual person.</p></main>');
  try {
    const facts = await page.evaluate(async () => {
      const original = Element.prototype.closest;
      let closestCalls = 0;
      Element.prototype.closest = function (...args) { closestCalls += 1; return original.apply(this, args); };
      const section = document.createElement('section');
      let html = '';
      for (let index = 0; index < 200; index += 1) html += `<div><div><div><span>Filler text ${index}</span></div></div></div>`;
      html += '<p id="visible-hit">The pansexual community.</p>';
      html += '<code id="code-hit">pansexual</code>';
      html += '<div aria-hidden="true"><p id="hidden-hit">pansexual</p></div>';
      section.innerHTML = html;
      document.querySelector('#content').append(section);
      const deadline = performance.now() + 3000;
      while (!document.querySelector('#visible-hit .exp-prisma-hit') && performance.now() < deadline) await new Promise((resolve) => setTimeout(resolve, 25));
      Element.prototype.closest = original;
      return {
        closestCalls,
        visible: Boolean(document.querySelector('#visible-hit .exp-prisma-hit')),
        code: document.querySelectorAll('#code-hit .exp-prisma-hit').length,
        hidden: document.querySelectorAll('#hidden-hit .exp-prisma-hit').length,
      };
    });
    assert.equal(facts.visible, true, 'visible text in the batch is matched');
    assert.equal(facts.code, 0, 'code is still ignored');
    assert.equal(facts.hidden, 0, 'aria-hidden content is still ignored');
    assert.ok(facts.closestCalls <= 20, `ignored checks do not walk ancestors per text node (closest called ${facts.closestCalls} times for ~205 text nodes)`);
  } finally { await browser.close(); }
});
