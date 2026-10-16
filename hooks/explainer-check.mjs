#!/usr/bin/env node
// html-explainer hook for Claude Code. One script, three modes, read from the hook's JSON on stdin:
//   turn    UserPromptSubmit  record when this turn started
//   track   PostToolUse       remember explainer pages that Write, Edit or MultiEdit saved
//   stop    Stop              run the page checker on every page this turn touched; exit 2 on a FAIL so the agent fixes it
// A hook must never break a session: any error inside this script exits 0, and nothing here touches the network.
// State lives in os.tmpdir()/html-explainer-hooks/<session_id>.json. Zero dependencies, Node 18 or newer.
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, renameSync, rmdirSync, unlinkSync, writeSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const MAX_BLOCKS = 3; // Stop blocks at most this many times per turn, then lets the agent finish
const STATE_DIR = join(tmpdir(), 'html-explainer-hooks');
const CHECKER = resolve(dirname(fileURLToPath(import.meta.url)), '../skills/html-explainer/scripts/check.mjs');
const WIN = process.platform === 'win32';

const finish = (code, text) => {
  if (text) { // stderr is how a blocking hook speaks to Claude; write it synchronously so exit cannot cut it off
    const buf = Buffer.from(text + '\n');
    for (let off = 0, tries = 0; off < buf.length && tries < 1000; tries++) {
      try { off += writeSync(2, buf, off); } catch (e) { if (e.code !== 'EAGAIN') break; }
    }
  }
  process.exit(code);
};
process.on('uncaughtException', () => finish(0));

const readStdin = () => new Promise((done) => {
  if (process.stdin.isTTY) return done('');
  let s = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => { s += c; });
  process.stdin.on('end', () => done(s));
  process.stdin.on('error', () => done(s));
  setTimeout(() => done(s), 5000).unref();
});

// ---- paths: tools may send backslashes or Git Bash style /c/Users/...; hand back one absolute, native path
const absolute = (p, cwd) => {
  if (typeof p !== 'string' || !p) return null;
  const fix = (x) => (WIN ? x.replace(/^\/([a-zA-Z])(?=\/|$)/, '$1:') : x);
  return resolve(cwd ? fix(String(cwd)) : process.cwd(), fix(p));
};
const keyOf = (p) => (WIN ? p.toLowerCase() : p);
const isHtml = (p) => /\.html$/i.test(p);

// an explainer page: <html data-type="..."> and the answer bar or a ballot card (rule shared with skills/html-explainer/scripts/upgrade.mjs)
const looksLikeExplainer = (file) => {
  try {
    if (statSync(file).size > 8 * 1024 * 1024) return false;
    const s = readFileSync(file, 'utf8');
    // a body fragment that a build script will wrap in the template has no <style> yet: it is not a page, so it is not checked
    return /<html\b[^>]*\sdata-type\s*=/i.test(s) && (s.includes('class="answer"') || s.includes('class="ballot-card"')) && /<style[\s>]/i.test(s);
  } catch { return false; }
};

// a page made by a newer release than this plugin: this checker may not know its type or parts, so it leaves the page to that release
const PLUGIN_JSON = resolve(dirname(fileURLToPath(import.meta.url)), '../.claude-plugin/plugin.json');
const MINE = (() => { try { return JSON.parse(readFileSync(PLUGIN_JSON, 'utf8')).version || null; } catch { return null; } })();
const parts = (v) => String(v).split('.').map((n) => parseInt(n, 10) || 0);
const newer = (a, b) => { const x = parts(a), y = parts(b); for (let i = 0; i < 3; i++) if ((x[i] || 0) !== (y[i] || 0)) return (x[i] || 0) > (y[i] || 0); return false; };
const madeByNewer = (file) => {
  if (!MINE) return false;
  try {
    const m = /<meta\s+name="generator"\s+content="html-explainer\s+(\d+\.\d+\.\d+)"/i.exec(readFileSync(file, 'utf8'));
    return !!m && newer(m[1], MINE);
  } catch { return false; }
};

// ---- state: one JSON file per session, changed under a small lock because parallel tool calls fire PostToolUse together
const statePath = (sid) => join(STATE_DIR, String(sid).replace(/[^\w.-]/g, '_').slice(0, 120) + '.json');
const load = (sid) => { try { return JSON.parse(readFileSync(statePath(sid), 'utf8')); } catch { return {}; } };
const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
const mutate = (sid, change) => {
  mkdirSync(STATE_DIR, { recursive: true });
  const lock = statePath(sid) + '.lock';
  let held = false;
  for (let i = 0; i < 60 && !held; i++) {
    try { mkdirSync(lock); held = true; } catch (e) {
      try { if (Date.now() - statSync(lock).mtimeMs > 5000) rmdirSync(lock); } catch { /* released meanwhile */ }
      sleep(25);
    }
  }
  try { // after the wait, go on without the lock rather than ever blocking the session
    const state = load(sid);
    change(state);
    const tmp = `${statePath(sid)}.${process.pid}.tmp`;
    writeFileSync(tmp, JSON.stringify(state));
    try { renameSync(tmp, statePath(sid)); } catch { writeFileSync(statePath(sid), JSON.stringify(state)); }
  } finally { if (held) try { rmdirSync(lock); } catch { /* already gone */ } }
};
const sweep = () => { // forget sessions untouched for a week
  try { for (const n of readdirSync(STATE_DIR)) { const f = join(STATE_DIR, n); if (/\.json$/.test(n) && Date.now() - statSync(f).mtimeMs > 7 * 864e5) unlinkSync(f); } } catch { /* nothing to sweep */ }
};

// ---- pages a script wrote through Bash: untracked or changed .html files in the git repository around cwd, saved since the turn began
const gitPages = (cwd, since) => {
  const git = (args) => spawnSync('git', args, { cwd, encoding: 'utf8', timeout: 8000, windowsHide: true, maxBuffer: 32 * 1024 * 1024, stdio: ['ignore', 'pipe', 'ignore'], env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } });
  const top = git(['rev-parse', '--show-toplevel']);
  if (top.status !== 0 || !top.stdout.trim()) return [];
  const status = git(['-c', 'core.quotepath=off', 'status', '--porcelain', '-z', '--untracked-files=all', '--', ':(icase)*.html']);
  if (status.status !== 0) return [];
  const parts = status.stdout.split('\0'), found = [];
  for (let i = 0; i < parts.length; i++) {
    const e = parts[i];
    if (e.length < 4) continue;
    if (/[RC]/.test(e.slice(0, 2))) i++; // a rename or copy is followed by its old path
    const file = absolute(e.slice(3), top.stdout.trim());
    if (!file || !isHtml(file)) continue;
    try { if (statSync(file).isFile() && statSync(file).mtimeMs >= since) found.push(file); } catch { /* deleted */ }
  }
  return found;
};

// ---- the check: the plugin's own checker, FAIL lines only
const failsOf = (file) => {
  const r = spawnSync(process.execPath, [CHECKER, file, '--json'], { encoding: 'utf8', timeout: 20000, windowsHide: true, maxBuffer: 8 * 1024 * 1024 });
  try { return JSON.parse(r.stdout).fails || []; } catch { return []; } // the checker itself broke: say nothing
};

const modes = {
  turn(sid) {
    mutate(sid, (s) => { s.turnStart = Date.now(); s.blocks = 0; });
    sweep();
    return 0;
  },

  track(sid, input) {
    const file = absolute(input.tool_input?.file_path, input.cwd);
    if (!file || !isHtml(file) || !looksLikeExplainer(file)) return 0;
    mutate(sid, (s) => {
      s.files = (s.files || []).filter((f) => keyOf(f) !== keyOf(file));
      s.files.push(file);
    });
    return 0;
  },

  stop(sid, input) {
    const state = load(sid);
    if (!state.files?.length && !state.turnStart) return 0;
    if ((state.blocks || 0) >= MAX_BLOCKS) { // blocked enough for this turn: let the agent finish and do not nag again next turn
      if (state.files?.length) mutate(sid, (s) => { s.files = []; });
      return 0;
    }
    const seen = new Map();
    for (const f of state.files || []) seen.set(keyOf(f), f);
    if (state.turnStart) for (const f of gitPages(absolute(input.cwd || '.'), state.turnStart)) seen.set(keyOf(f), f);

    const failing = [], settled = new Set(); // settled: tracked pages that need no more watching (passed, deleted, no longer an explainer)
    for (const [k, file] of seen) {
      if (!isHtml(file) || !looksLikeExplainer(file) || madeByNewer(file)) { settled.add(k); continue; }
      const fails = failsOf(file);
      if (fails.length) failing.push({ file, fails }); else settled.add(k);
    }
    mutate(sid, (s) => {
      s.files = (s.files || []).filter((f) => !settled.has(keyOf(f)));
      if (failing.length) s.blocks = (s.blocks || 0) + 1;
    });
    if (!failing.length) return 0;

    const lines = [];
    for (const { file, fails } of failing) {
      lines.push(`html-explainer checker: ${file}`);
      for (const f of fails.slice(0, 15)) lines.push(`  FAIL  ${f}`);
      if (fails.length > 15) lines.push(`  ... and ${fails.length - 15} more FAIL lines`);
    }
    lines.push('Fix every FAIL, then save the page again. The checker runs again before you finish.');
    finish(2, lines.join('\n'));
  },
};

try {
  const run = modes[process.argv[2]];
  if (!run) finish(0);
  const input = JSON.parse(await readStdin());
  const sid = input?.session_id;
  if (!sid || typeof sid !== 'string') finish(0);
  finish(run(sid, input) || 0);
} catch {
  finish(0);
}
