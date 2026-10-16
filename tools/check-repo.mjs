#!/usr/bin/env node
// Repository checks for maintainers and CI. Zero dependencies, Node 18 or newer.
//   node tools/check-repo.mjs
// 1. Every shipped page passes the page checker.
// 2. The gallery's <style> and <script> blocks are byte-identical to the template's.
// 3. Every relative path a skill file names in backticks exists, so a moved file cannot break a skill silently.
// 4. The plugin and marketplace manifests parse and agree on the plugin name, and the template's generator mark matches the plugin version.
// 5. hooks/hooks.json parses and the scripts it runs exist.
// 6. merge.html's combine() gives the right order, Kendall's W and contested flag on a fixture.
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
// every example page under skills/*/examples ships and is published on the site, so each one is checked
const htmlUnder = (d) => (existsSync(at(d)) ? readdirSync(at(d), { recursive: true }).map(String).filter((n) => n.endsWith('.html')).map((n) => `${d}/${n.replace(/\\/g, '/')}`) : []);
const examples = readdirSync(at('skills')).flatMap((s) => htmlUnder(`skills/${s}/examples`)).sort();
const sitePages = ['docs/index.html', 'docs/roadmap.html', 'docs/examples.html'];
const pages = [
  'skills/html-explainer/assets/template.html',
  'skills/html-explainer/assets/gallery.html',
  ...examples,
  ...sitePages,
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
// the public site shows the current design, so its pages and every published example carry the template's blocks too (a page may add its own after them)
for (const page of [...sitePages, ...examples].filter((p) => existsSync(at(p)))) {
  const s = readFileSync(at(page), 'utf8');
  for (const tag of ['style', 'script']) {
    if (block(tpl, tag) === block(s, tag)) ok(`${page} <${tag}> matches the template`);
    else bad(`${page} <${tag}> differs from the template; paste the template's first <${tag}> block into it`);
  }
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
  // the template's generator mark is the version stamp that upgrade.mjs reads, so it moves with the plugin version
  const mark = /<meta name="generator" content="html-explainer ([^"]*)">/.exec(tpl)?.[1];
  if (mark === plugin.version) ok(`template generator mark: html-explainer ${mark}`);
  else bad(`template generator mark is ${mark ? `"html-explainer ${mark}"` : 'missing'} but plugin.json version is ${plugin.version}; bump both together`);
} catch (e) { bad(`manifests do not parse: ${e.message}`); }

// 5. hooks: the file parses and every script it runs exists, so a moved script cannot turn the hooks into silent no-ops
try {
  const hooks = JSON.parse(readFileSync(at('hooks/hooks.json'), 'utf8')).hooks || {};
  const commands = Object.values(hooks).flat().flatMap((g) => g.hooks || []).map((h) => [h.command, ...(h.args || [])].join(' '));
  const missing = [...new Set(commands.flatMap((c) => [...c.matchAll(/\$\{CLAUDE_PLUGIN_ROOT\}\/([\w./-]+)/g)].map((m) => m[1])))].filter((p) => !existsSync(at(p)));
  if (!commands.length) bad('hooks/hooks.json defines no hook commands');
  else if (missing.length) bad(`hooks/hooks.json runs ${missing.join(', ')}, which does not exist`);
  else ok(`hooks: ${commands.length} commands in ${Object.keys(hooks).join(', ')}`);
} catch (e) { bad(`hooks/hooks.json does not parse: ${e.message}`); }

// 6. the combined ranking in merge.html: the arithmetic sits between two markers and runs here on a fixture, because a wrong mean place,
// order or Kendall's W would ship without anyone noticing. Four readers rank items A to F (places per reader, in reader order).
try {
  const merge = readFileSync(at('skills/explainer-gather/assets/merge.html'), 'utf8');
  const a = merge.indexOf('/* combine:start */'), z = merge.indexOf('/* combine:end */');
  if (a < 0 || z < a) throw new Error('the /* combine:start */ and /* combine:end */ markers are missing or out of order');
  const combine = new Function(`'use strict';${merge.slice(a, z)}\nreturn combine;`)();
  const places = { A: [1, 1, 3, 1], B: [3, 2, 5, 3], C: [2, 3, 1, 2], D: [4, 4, 4, 5], E: [5, 5, 6, 6], F: [6, 6, 2, 4] };
  const res = combine([0, 1, 2, 3].map((r) => Object.keys(places).sort((x, y) => places[x][r] - places[y][r])));
  const got = `order ${res.rows.map((r) => r.key).join('')}, W ${res.W?.toFixed(3)} (${res.level}, named ${res.named}), contested ${res.rows.filter((r) => r.contested).map((r) => r.key).join('') || 'none'}`;
  if (got === 'order ACBDFE, W 0.679 (strong, named true), contested F') ok(`merge.html combine(): ${got}`);
  else bad(`merge.html combine() is wrong on the 4-reader fixture: got ${got}; expected order ACBDFE, W 0.679 (strong, named true), contested F`);
} catch (e) { bad(`merge.html combine() could not run: ${e.message}`); }

console.log(problems.length ? `\n${problems.length} problem(s)` : '\nall checks passed');
process.exit(problems.length ? 1 : 0);
