#!/usr/bin/env node
// Repository checks for maintainers and CI. Zero dependencies, Node 18 or newer.
//   node tools/check-repo.mjs
// 1. Every shipped page passes the page checker.
// 2. The gallery's <style> and <script> blocks are byte-identical to the template's.
// 3. Every relative path a skill file names in backticks exists, so a moved file cannot break a skill silently.
// 4. The plugin and marketplace manifests parse and agree on the plugin name.
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const at = (...p) => join(root, ...p);
const rel = (p) => relative(root, p).replaceAll('\\', '/');
const problems = [];
const ok = (msg) => console.log(`ok    ${msg}`);
const bad = (msg) => { problems.push(msg); console.log(`FAIL  ${msg}`); };

// 1. pages
const checker = at('skills/html-explainer/scripts/check.mjs');
const pages = [
  'skills/html-explainer/assets/template.html',
  'skills/html-explainer/assets/gallery.html',
  'skills/html-explainer/examples/playbook.html',
  'skills/explainer-gather/examples/ballot.html',
  'docs/index.html',
  'docs/roadmap.html',
].filter((p) => existsSync(at(p)));
for (const page of pages) {
  try { execFileSync(process.execPath, [checker, at(page)], { stdio: 'pipe' }); ok(`check.mjs ${page}`); }
  catch (e) { bad(`check.mjs ${page}\n${String(e.stdout || '').trim()}`); }
}

// 2. gallery in sync with the template
const block = (s, tag) => { const a = s.indexOf(`<${tag}>`); return a < 0 ? null : s.slice(a, s.indexOf(`</${tag}>`, a)); };
const tpl = readFileSync(at('skills/html-explainer/assets/template.html'), 'utf8');
const gal = readFileSync(at('skills/html-explainer/assets/gallery.html'), 'utf8');
for (const tag of ['style', 'script']) {
  if (block(tpl, tag) && block(tpl, tag) === block(gal, tag)) ok(`gallery <${tag}> matches the template`);
  else bad(`gallery <${tag}> differs from the template; paste the template's block into the gallery`);
}

// 3. relative paths named in skill files
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const PATH = /`((?:\.\.\/)+[\w./-]+|(?:assets|references|scripts|examples)\/[\w./-]+)`/g;
let named = 0;
for (const file of walk(at('skills')).filter((f) => f.endsWith('.md'))) {
  for (const [, p] of readFileSync(file, 'utf8').matchAll(PATH)) {
    named++;
    if (!existsSync(resolve(dirname(file), p))) bad(`${rel(file)} names \`${p}\`, which does not exist`);
  }
}
ok(`${named} relative paths named in skill files checked`);

// 4. manifests
try {
  const plugin = JSON.parse(readFileSync(at('.claude-plugin/plugin.json'), 'utf8'));
  const market = JSON.parse(readFileSync(at('.claude-plugin/marketplace.json'), 'utf8'));
  if (!/^\d+\.\d+\.\d+$/.test(plugin.version || '')) bad(`plugin.json version "${plugin.version}" is not x.y.z`);
  if (!market.plugins?.some((p) => p.name === plugin.name)) bad(`marketplace.json lists no plugin named "${plugin.name}"`);
  for (const s of plugin.skills || []) if (!existsSync(at(s, 'SKILL.md'))) bad(`plugin.json skill ${s} has no SKILL.md`);
  ok(`manifests: ${plugin.name} ${plugin.version}`);
} catch (e) { bad(`manifests do not parse: ${e.message}`); }

console.log(problems.length ? `\n${problems.length} problem(s)` : '\nall checks passed');
process.exit(problems.length ? 1 : 0);
