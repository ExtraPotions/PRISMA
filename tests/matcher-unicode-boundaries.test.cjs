'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = vm.createContext({ EXP: {} });
for (const name of ['catalog-data.js', 'catalog.js', 'matcher.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../src', name), 'utf8'), context);
const settings = { disabledIdentities: [], matcherMode: 'balanced', ignoredPhrases: [] };

test('letters, numbers and combining marks block matches on either Unicode boundary', () => {
  for (const adjacent of ['A', '1', '_', '\u0301', '\u{10400}', '\u{1D7D8}', '\u{1D165}']) {
    for (const text of [adjacent + 'lesbian', 'lesbian' + adjacent]) assert.equal(context.EXP.Matcher.find(text, settings).eligible.length, 0, text);
  }
});

test('emoji, punctuation, whitespace and string edges remain valid boundaries', () => {
  for (const text of ['lesbian', '(lesbian)', '\nlesbian\n', '\u{1F600}lesbian\u{1F600}', 'a lesbian person']) assert.equal(context.EXP.Matcher.find(text, settings).eligible.length, 1, text);
});
