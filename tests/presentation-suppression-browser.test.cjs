'use strict';
// WARD runs in its own userscript sandbox and reaches PRISMA only through the DOM: the
// data-exp-presentation-state attribute and the exp-core:presentation-state event its Core emits.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');
const script = fs.readFileSync(path.resolve(__dirname, '..', 'prisma.user.js'), 'utf8');

const html = `<main id="content">
  <p id="shown">A bisexual person.</p>
  <div id="warded" data-exp-presentation-state='{"ward":{"visibility":"hide"}}'><p>A pansexual person.</p></div>
  <div id="dimmed" data-exp-presentation-state='{"ward":{"visibility":"dim"}}'><p>An asexual person.</p></div>
</main>`;

async function fixture(t) {
  const browser = await chromium.launch({ headless: true }); t.after(() => browser.close());
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript({ content: script });
  await page.route('https://fixture.test/**', (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await page.route('https://raw.githubusercontent.com/ExtraPotions/PRISMA/main/assets/prisma-launcher.svg', (route) => route.fulfill({ contentType: 'image/svg+xml', body: fs.readFileSync(path.resolve(__dirname, '../assets/prisma-launcher.svg'), 'utf8') }));
  await page.goto('https://fixture.test/page');
  await page.waitForSelector('#shown .exp-prisma-hit');
  return { page, errors };
}

const hits = (page, selector) => page.locator(`${selector} .exp-prisma-hit`).count();

test('PRISMA leaves text inside WARD-hidden content unhighlighted, on load and in later batches', async (t) => {
  const { page, errors } = await fixture(t);
  assert.equal(await page.evaluate(() => typeof globalThis.ExtraPotionsCore), 'undefined');
  assert.equal(await hits(page, '#warded'), 0, 'hidden content stays untouched on the first scan');
  assert.equal(await hits(page, '#dimmed'), 1, 'dimmed content is still visible and still highlighted');

  await page.evaluate(() => {
    const late = document.createElement('p'); late.id = 'late-warded'; late.textContent = 'The pansexual community.';
    document.querySelector('#warded').append(late);
    const control = document.createElement('p'); control.id = 'late-shown'; control.textContent = 'The pansexual community.';
    document.querySelector('#content').append(control);
  });
  await page.waitForSelector('#late-shown .exp-prisma-hit');
  assert.equal(await hits(page, '#warded'), 0, 'content added under hidden content stays untouched');
  assert.deepEqual(errors, []);
});

test('PRISMA rescans content when WARD lifts its hide state', async (t) => {
  const { page, errors } = await fixture(t);
  assert.equal(await hits(page, '#warded'), 0);
  await page.evaluate(() => {
    const node = document.querySelector('#warded');
    node.removeAttribute('data-exp-presentation-state');
    node.dispatchEvent(new CustomEvent('exp-core:presentation-state', {
      bubbles: true,
      composed: true,
      detail: JSON.stringify({ protocol: 'exp-presentation-state-v1', source: 'ward', channels: [], phase: null, at: Date.now() }),
    }));
  });
  await page.waitForSelector('#warded .exp-prisma-hit', { timeout: 3000 });
  assert.deepEqual(errors, []);
});

// Core delivers page batches in chunks, so WARD can hide a card after PRISMA highlighted it in an
// earlier chunk. Hidden matches stay out of the count and the next/previous order until revealed.
test('matches inside content WARD hides later drop out of the count until it is revealed', async (t) => {
  const { page, errors } = await fixture(t);
  const total = () => page.evaluate(() => JSON.parse(document.querySelector('meta[data-exp-suite-state-product="prisma"][data-exp-suite-state-type="prisma.state-changed"]')?.dataset.expSuiteStatePayload || '{}').total);
  await page.waitForFunction(() => document.querySelector('meta[data-exp-suite-state-product="prisma"]'));
  const before = await total();
  assert.equal(await hits(page, '#shown'), 1);
  const ward = (state) => page.evaluate((state) => {
    const node = document.querySelector('#shown');
    if (state) node.setAttribute('data-exp-presentation-state', JSON.stringify({ ward: { visibility: state } }));
    else node.removeAttribute('data-exp-presentation-state');
    node.dispatchEvent(new CustomEvent('exp-core:presentation-state', { bubbles: true, composed: true, detail: JSON.stringify({ protocol: 'exp-presentation-state-v1', source: 'ward', channels: state ? ['visibility'] : [], phase: state ? 'visibility' : null, at: Date.now() }) }));
    node.append(document.createTextNode(' '));
  }, state);
  await ward('hide');
  await page.waitForFunction((before) => JSON.parse(document.querySelector('meta[data-exp-suite-state-product="prisma"][data-exp-suite-state-type="prisma.state-changed"]').dataset.expSuiteStatePayload).total === before - 1, before, { timeout: 3000 });
  await ward(null);
  await page.waitForFunction((before) => JSON.parse(document.querySelector('meta[data-exp-suite-state-product="prisma"][data-exp-suite-state-type="prisma.state-changed"]').dataset.expSuiteStatePayload).total === before, before, { timeout: 3000 });
  assert.equal(await total(), before);
  assert.deepEqual(errors, []);
});
