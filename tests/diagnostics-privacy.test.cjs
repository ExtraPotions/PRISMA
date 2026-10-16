'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

test('diagnostics omit saved phrases, hosts and identity choices without changing exports', () => {
  const context = vm.createContext({ EXP: {}, location: { hostname: 'example.test' }, ExtraPotionsCore: { cloneSettings: value => JSON.parse(JSON.stringify(value)) } });
  vm.runInContext(fs.readFileSync(path.join(__dirname, '../src/settings.js'), 'utf8'), context);
  const settings = context.EXP.Settings;
  settings.load();
  settings.update({
    ignoredPhrases: ['private global phrase'],
    disabledIdentities: ['lesbian'],
    exclusions: ['private.example'],
    siteOverrides: { 'private.example': { ignoredPhrases: ['private site phrase'], identityOverrides: { lesbian: 'off' } } },
    safeMode: true,
  });
  const original = JSON.stringify(settings.exportData());
  const result = settings.diagnosticSnapshot();
  const serialized = JSON.stringify(result);
  for (const privateValue of ['private global phrase', 'private site phrase', 'private.example', 'lesbian']) assert.ok(!serialized.includes(privateValue), privateValue);
  assert.equal(result.ignoredPhraseCount, 1);
  assert.equal(result.siteOverrideCount, 1);
  assert.equal(result.disabledIdentityCount, 1);
  assert.equal(result.exclusionCount, 1);
  assert.equal(result.safeMode, true);
  assert.equal(settings.diagnosticSnapshot(settings.defaults).ignoredPhraseCount, 0);
  assert.equal(JSON.stringify(settings.exportData()), original);
  assert.ok(original.includes('private global phrase'));
});

test('the diagnostic report uses the sanitized settings snapshot', () => {
  const ui = fs.readFileSync(path.join(__dirname, '../src/ui.js'), 'utf8');
  const report = ui.slice(ui.indexOf('  function diagnosticReport()'), ui.indexOf('\n', ui.indexOf('  function diagnosticReport()')));
  assert.match(report, /settings: EXP\.Settings\.diagnosticSnapshot\(\)/);
  assert.doesNotMatch(report, /exportData\(/);
  assert.match(ui, /issueSettings:\(\)=>\(\{current:EXP\.Settings\.diagnosticSnapshot\(\),defaults:EXP\.Settings\.diagnosticSnapshot\(EXP\.Settings\.defaults\)\}\)/);
});
