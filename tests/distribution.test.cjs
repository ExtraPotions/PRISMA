'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const source = fs.readFileSync(path.join(root, 'prisma.user.js'), 'utf8');
const bytes = Buffer.byteLength(source, 'utf8');

test('distribution metadata and privacy boundaries are present', () => {
  assert.match(source, /@name\s+PRISMA/);
  assert.match(source, new RegExp(`@version\\s+${pkg.version.replaceAll('.', '\\.')}`));
  assert.deepEqual(Buffer.from(source.match(/^\/\/ @icon\s+data:image\/svg\+xml;base64,(.+)$/m)[1], 'base64'), fs.readFileSync(path.join(root, 'assets', 'prisma.svg')));
  assert.match(source, /@homepageURL\s+https:\/\/github\.com\/ExtraPotions\/PRISMA/);
  assert.match(source, /@supportURL\s+https:\/\/github\.com\/ExtraPotions\/PRISMA\/issues/);
  assert.match(source, /@updateURL\s+https:\/\/github\.com\/ExtraPotions\/PRISMA\/releases\/latest\/download\/prisma\.user\.js/);
  assert.match(source, /api\.github\.com\/repos\/ExtraPotions\/PRISMA\/releases\/latest/);
  assert.doesNotMatch(source, /vivid-prism-heron/);
  assert.match(source, /exp:v3:prisma/);
  assert.doesNotMatch(source, /@require\s+/);
  assert.doesNotMatch(source, /@resource\s+/);
  assert.doesNotMatch(source, /@grant\s+GM_getResourceText/);
  assert.match(source, /@grant\s+unsafeWindow/);
  assert.match(source, /createDiagnosticsReport\('PRISMA'/);
  assert.match(source, /adoptedStyleSheets/);
  assert.match(source, /EXP\.App\.start\(\)/);
});

test('canonical install artifact is a direct full userscript within size bounds', () => {
  assert.ok(bytes >= 100 * 1024, `expected at least 100 KiB, got ${bytes} bytes`);
  assert.ok(bytes <= 400 * 1024, `expected at most 400 KiB, got ${bytes} bytes`);
  assert.match(source, /EXP\.CatalogData = \[/);
});

test('current and completed update notices use concise concrete release notes', () => {
  const releaseNotes = fs.readFileSync(path.join(root, 'src', 'release-notes.js'), 'utf8');
  const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'release.yml'), 'utf8');
  assert.match(source, /EXP\.ReleaseNotes = \(\(\) => \{/);
  assert.match(source, /details:EXP\.ReleaseNotes\.current\(\)/);
  assert.match(source, /complete\?EXP\.ReleaseNotes\.current\(\)/);
  assert.match(source, /function releaseDetails\(body\)/);
  assert.doesNotMatch(source, /Current PRISMA release notes\./);
  assert.match(releaseNotes, new RegExp(`'${pkg.version.replaceAll('.', '\\.')}'`));
  assert.match(workflow, /--notes-file release-notes\.md/);
  assert.doesNotMatch(workflow, /--generate-notes/);
});

test('catalog retains the reviewed source baseline', () => {
  const catalog = JSON.parse(source.match(/EXP\.CatalogData = (\[[\s\S]*?\n\]);\n/)[1]);
  assert.equal(catalog.length, 59);
  assert.equal(catalog.reduce((sum, identity) => sum + identity.words.length, 0), 124);
  assert.equal(new Set(catalog.map(({ id }) => id)).size, 59);
});

test('no checkbox input is introduced', () => {
  assert.doesNotMatch(source, /type=["']checkbox["']/i);
  assert.match(source, /role:\s*'switch'/);
});

test('toggle switches use matte theme surfaces instead of gradient ON fills', () => {
  assert.match(source, /applyMatteToggleChrome/);
  assert.match(source, /color-mix\(in srgb,\s*var\(--theme-bg\) 84%,\s*var\(--theme-panel\) 16%\)/);
  assert.doesNotMatch(source, /background:linear-gradient\(90deg,#b94fc5,#36acd1\)/);
  assert.doesNotMatch(source, /\.switch\[aria-checked="true"\]\{border-color:transparent!important;background:var\(--pride-rainbow\)!important\}/);
});

test('underline and soft-fill highlights have target-level important fallbacks', () => {
  assert.match(source, /setProperty\('background-image', `linear-gradient\(\$\{primary\},\$\{primary\}\)`, 'important'\)/);
  assert.match(source, /setProperty\('text-decoration-line', 'underline', 'important'\)/);
  assert.match(source, /setProperty\('background-color', softFill, 'important'\)/);
  assert.match(source, /setProperty\('padding-inline', '\.08em', 'important'\)/);
});

test('canonical badge and borderless launcher mark are embedded separately', () => {
  const badge = fs.readFileSync(path.join(root, 'assets', 'prisma.svg'));
  const launcher = fs.readFileSync(path.join(root, 'assets', 'prisma-launcher.svg'));
  assert.equal(crypto.createHash('sha256').update(badge).digest('hex'), '58914247a119063190cbb6bdedb06936ccb896fc674563f137d89f2aa4c71697');
  assert.equal(crypto.createHash('sha256').update(launcher).digest('hex'), 'ea79b746630d42b88161c806aeb459003a4d745276f009c2a895aa76217b354a');
  assert.match(source, /\[data-exp-part="launcher"\]\{[^}]*width:48px!important;[^}]*height:48px!important/u);
  assert.match(source, /\[data-exp-part="launcher"\] \.launcher-icon\{width:40px!important;height:40px!important\}/u);
  assert.match(source, /\.header-icon \.menu-icon\{width:38px!important;height:38px!important\}/u);
  assert.ok(source.includes(`data:image/svg+xml;base64,${badge.toString('base64')}`));
  assert.ok(source.includes(`data:image/svg+xml;base64,${launcher.toString('base64')}`));
  assert.ok((source.match(/data:image\/svg\+xml;base64,/g)?.length || 0) >= 2);
  assert.doesNotMatch(launcher.toString('utf8'), /<rect\b/u);
  assert.doesNotMatch(fs.readFileSync(path.join(root, 'src', 'ui.js'), 'utf8'), /<svg class="launcher-ring"/u);
  assert.match(source, /launcher\.replaceChildren\(mark\)/u);
});

test('approved badge derivatives have exact pixel dimensions', () => {
  for (const size of [128, 48, 32]) {
    const png = fs.readFileSync(path.join(root, 'assets', `prisma-${size}.png`));
    assert.equal(png.subarray(1, 4).toString(), 'PNG');
    assert.equal(png.readUInt32BE(16), size);
    assert.equal(png.readUInt32BE(20), size);
  }
});
