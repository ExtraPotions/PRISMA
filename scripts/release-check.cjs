'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const script = fs.readFileSync(path.join(root, 'prisma.user.js'), 'utf8');
for (const asset of ['prisma-launcher.svg']) {
  if (!fs.existsSync(path.join(root, 'assets', asset))) throw new Error(`Missing PRISMA asset: ${asset}`);
}
const metadataVersion = script.match(/^\/\/ @version\s+(.+)$/m)?.[1].trim();
if (metadataVersion !== pkg.version) throw new Error(`Metadata version ${metadataVersion} does not match package ${pkg.version}.`);
for (const marker of ['@name         PRISMA', '@grant        GM_getValue', '@connect      api.github.com', 'exp:v3:prisma']) if (!script.includes(marker)) throw new Error(`Missing distribution marker: ${marker}`);
if (/data:image\//u.test(script)) throw new Error('Images must be referenced by URL instead of embedded data.');
if (/@resource\s+/m.test(script)) throw new Error('Direct-install userscript must not declare @resource entries.');
if (/@grant\s+GM_getResourceText/m.test(script)) throw new Error('Direct-install userscript must not grant GM_getResourceText.');
const bytes = Buffer.byteLength(script, 'utf8');
if (bytes < 100 * 1024 || bytes > 400 * 1024) throw new Error(`Direct-install userscript must be 100–400 KiB (got ${bytes} bytes).`);
if (/^\/\/ @require\s+/m.test(script)) throw new Error('Remote executable JavaScript dependency detected.');
execFileSync(process.execPath, [path.join(root, 'scripts', 'build.cjs'), '--check'], { stdio: 'inherit' });
const tests = fs.readdirSync(path.join(root, 'tests')).filter((name) => name.endsWith('.test.cjs')).map((name) => path.join(root, 'tests', name));
execFileSync(process.execPath, ['--test', ...tests], { stdio: 'inherit' });
console.log('Release check passed locally. No remote action was performed.');
