'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const settings = fs.readFileSync(path.join(__dirname, '..', 'src', 'settings.js'), 'utf8');
const ui = fs.readFileSync(path.join(__dirname, '..', 'src', 'ui.js'), 'utf8');

test('PRISMA uses the locked eight-slot contract with Crimson', () => {
  assert.match(settings, /uiTheme: \['ember', 'midnight', 'glacier', 'contrast', 'verdant', 'pride', 'crimson', 'prisma'\]/u);
  assert.doesNotMatch(ui, /"name":"Twitch"/u);
  for (const token of ['#100814', '#a843b6', '#6853c9', '#2e98a5']) assert.match(ui, new RegExp(token, 'u'));
});
