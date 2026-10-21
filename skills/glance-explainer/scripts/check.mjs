#!/usr/bin/env node
// glance-explainer checker. Zero dependencies. Usage: node check.mjs <file.html> [--json]
// Exit 0 when every hard rule passes, 1 otherwise. Warnings never fail the run.
// <html lang="en|ja" data-type="..."> picks the limits (words or characters) and the extra rules for that page type.
import { readFileSync, statSync } from 'node:fs';

const file = process.argv[2];
if (!file) { console.error('usage: node check.mjs <file.html> [--json]'); process.exit(2); }
const asJson = process.argv.includes('--json');
// Comments never count, and neither do script and textarea bodies: an atlas embeds whole source files as
// <script type="text/plain">, and the <svg> icons and class names inside them are code to read, not page markup.
// The tags themselves stay, so the external-script rule still sees every src.
const html = readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->/g, '').replace(/(<(script|textarea)\b[^>]*>)[\s\S]*?(<\/\2\s*>)/gi, '$1$3');
const fails = [], warns = [], info = {};
const fail = (m) => fails.push(m), warn = (m) => warns.push(m);

// ---- helpers
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
// a number with separators (1,250 or 3.5) counts as one word
const words = (s) => (strip(s).match(/[A-Za-z]+(?:[’'\-][A-Za-z]+)*|\d[\d,.]*\d|\d/g) || []).length;
// Japanese has no spaces: every character that is not a space or punctuation counts one
const chars = (s) => [...strip(s)].filter((c) => !/[\s\p{P}]/u.test(c)).length;
const count = (re) => (html.match(re) || []).length;
const hasClass = (tag, cls) => new RegExp(`<${tag}(?![\\w-])[^>]*class="[^"]*\\b${cls}\\b[^"]*"`, 'g');
const attr = (attrs, name) => (attrs.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`, 'i')) || [])[1];
const hasAttr = (attrs, name) => new RegExp(`(?:^|\\s)${name}(?=[\\s=/>]|$)`, 'i').test(attrs.replace(/"[^"]*"/g, '""'));
const VOID = /^(?:input|br|hr|img|meta|link)$/i;
// html between an open tag (ending at `from`) and its matching close tag, counting nested tags of the same name
const inner = (src, from, tag) => {
  const re = new RegExp(`<(/?)${tag}\\b[^>]*>`, 'gi'); re.lastIndex = from;
  let depth = 1, m;
  while ((m = re.exec(src))) {
    if (m[0].endsWith('/>')) continue;
    depth += m[1] ? -1 : 1;
    if (!depth) return src.slice(from, m.index);
  }
  return src.slice(from);
};
// the html without its folds. A fold may hold another details (a backlog theme), so each </details> is matched to its own open tag.
const unfold = (s) => {
  let out = '', i = 0, m; const re = /<details\b[^>]*>/gi;
  while ((m = re.exec(s))) {
    out += s.slice(i, m.index); i = m.index + m[0].length;
    i += inner(s, i, 'details').length; i += (/^<\/details\s*>/i.exec(s.slice(i)) || [''])[0].length; re.lastIndex = i;
  }
  return out + s.slice(i);
};
const starts = (src) => [...src.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/gi)]; // every start tag: [whole, name, attributes]
// elements whose class list has the token `c` (and tag `t` when given): { tag, attrs, inner }
const find = (c, t, src = html) => {
  const has = new RegExp(`\\sclass="(?:[^"]*\\s)?${c}(?:\\s[^"]*)?"`);
  return starts(src).filter((m) => has.test(m[2]) && (!t || m[1].toLowerCase() === t)).map((m) => {
    const empty = VOID.test(m[1]) || m[0].endsWith('/>'); // void and self-closing elements hold nothing
    return { tag: m[1].toLowerCase(), attrs: m[2], inner: empty ? '' : inner(src, m.index + m[0].length, m[1]) };
  });
};
const num = (c, t, src) => find(c, t, src).length;
const withAttr = (name, src = html) => starts(src).filter((m) => hasAttr(m[2], name)); // start tags that carry an attribute

// ---- css: every <style> block, comments removed, flattened into rules ({ sel, body }); at-rule wrappers drop away
const css = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n').replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/@media[^{]*\bprint\b[^{]*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}/g, ''); // @media print blocks (one nesting level) never count: they reset --paper and --card to white
const rules = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map((m) => ({ sel: m[1].trim().replace(/\s+/g, ' '), body: m[2] }));
const rulesFor = (re) => rules.filter((r) => re.test(r.sel));

// ---- page identity: lang and data-type pick the limits and the extra rules
const TYPES = ['explainer', 'decision', 'status', 'spec', 'release', 'research', 'handover', 'portfolio', 'public', 'teach', 'incident', 'pr', 'runbook', 'compare', 'roadmap', 'tour', 'playbook', 'field-guide', 'gather', 'atlas'];
const htmlAttrs = (html.match(/<html\b([^>]*)>/i) || [])[1] || '';
const lang = (attr(htmlAttrs, 'lang') || '').trim(), type = (attr(htmlAttrs, 'data-type') || 'explainer').trim();
const ja = /^ja(-|$)/i.test(lang); // any other lang falls back to the English rules
const unit = ja ? 'chars' : 'words', size = ja ? chars : words;
const RATE = ja ? 500 : 200; // reading speed per minute, in `unit`
const LIM = { para: ja ? 90 : 40, sent: ja ? 60 : 30, keep: ja ? 25 : 15, answer: ja ? 70 : 40, chapter: 1.25 * RATE, path: 7 * RATE };
const ballot = type === 'gather' && /data-mode="ballot"/.test(htmlAttrs); // a ballot is a column of cards and a tray: no keep box, recap, chapters or rail
if (!lang) fail('missing lang on <html>; set lang="en" or lang="ja"');
if (!TYPES.includes(type)) fail(`unknown data-type "${type}"; use one of ${TYPES.join(', ')}`);
// the generator mark (meta name="generator", content "glance-explainer 2.0.0", or "html-explainer 1.8.0" before the rename), as [major, minor, patch]. null when it is missing or another tool's.
// A rule that only newer pages can meet reads it, so an older page is never judged by it.
const generator = (() => {
  for (const m of html.matchAll(/<meta\b[^>]*>/gi)) {
    if (!/\sname\s*=\s*["']?generator\b/i.test(m[0])) continue;
    const c = /\scontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i.exec(m[0]);
    const v = /^(?:glance|html)-explainer\s+(\d+)\.(\d+)\.(\d+)/i.exec((c?.[1] ?? c?.[2] ?? '').trim());
    return v ? v.slice(1).map(Number) : null;
  }
  return null;
})();
const atLeast = (v, want) => { for (let i = 0; i < 3; i++) if (v[i] !== want[i]) return v[i] > want[i]; return true; };

// ---- document basics
const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [])[1]?.trim() ?? '';
info.title = title; info.lang = lang; info.type = type; info.unit = unit; info.generator = generator ? generator.join('.') : null;
if (!title) fail('missing <title>');
else {
  const tw = ja ? chars(title) : title.split(/\s+/).length, [lo, hi] = ja ? [4, 24] : [2, 8];
  if (tw < lo || tw > hi) warn(`title has ${tw} ${unit}; aim for ${lo} to ${hi}`);
  if (/explainer/i.test(title)) warn('title contains "explainer"; name the subject instead');
}
if (!/<meta name="viewport"/i.test(html)) fail('missing <meta name="viewport">');
if (!/<meta name="color-scheme"/i.test(html)) fail('missing <meta name="color-scheme">');
const atlasFile = (u) => type === 'atlas' && /^(?:\.\/)?atlas\.(?:css|js)$/.test(u); // atlas pages load their two add-on files from next to index.html
if ([...html.matchAll(/<script\b[^>]*\ssrc=["']?([^"'\s>]*)/gi)].some((m) => !atlasFile(m[1]))) fail('external <script src>; everything must be inline');
const links = [...html.matchAll(/<link[^>]+href="([^"]+)"/gi)].map(m => m[1]);
for (const l of links) if (!/^(https:\/\/fonts\.(googleapis|gstatic)\.com|data:)/.test(l) && !atlasFile(l)) fail(`external <link> not allowed: ${l}`);
if (/<img[^>]+src="https?:/i.test(html)) fail('remote <img>; inline it as SVG or a data URI');
const kb = statSync(file).size / 1024, maxKb = type === 'atlas' ? 3072 : type === 'tour' ? 2048 : 400; info.kb = Math.round(kb); // an atlas embeds source: 3 MB budget; a tour embeds screenshots: 2 MB
if (kb > maxKb) fail(`file is ${info.kb} KB; keep under ${maxKb} KB`);

// ---- structure
const answers = count(hasClass('p', 'answer')); info.answers = answers;
if (answers !== 1) fail(`expected exactly one p.answer, found ${answers}`);
const answer = html.match(/<p class="answer">([\s\S]*?)<\/p>/);
if (answer) {
  const aw = size(answer[1]); info.answerWords = aw;
  if (aw > LIM.answer) fail(`answer bar is ${aw} ${unit}; one sentence, under ${LIM.answer}`);
  else if (aw > LIM.answer * 0.75) warn(`answer bar is ${aw} ${unit}; shorter reads better`);
}
if (!ja && title && title.split(/\s+/).length > 2 && title.split(/\s+/).every(w => /^[A-Z0-9]/.test(w))) warn('title is in Title Case; use sentence case');
const bodyOnly = html.replace(/<(style|script)[\s\S]*?<\/\1>/g, '').replace(/<head>[\s\S]*?<\/head>/, '');
const dashes = (bodyOnly.match(/—|&mdash;/g) || []).length; if (dashes > 0) warn(`${dashes} em dash(es); use a full stop, a colon, or a comma instead`);
const middots = (bodyOnly.match(/ · |&middot;/g) || []).length; if (!ja && middots > 0) warn(`${middots} middle dot(s) in text; use words or punctuation`);
if (!ballot) { // the explainer spine; a ballot page has none of it
  const keep = html.match(/<div class="keep">([\s\S]*?)<\/div>/);
  if (!keep) fail('missing div.keep'); else {
    const items = (keep[1].match(/<li\b/g) || []).length; info.keepItems = items;
    if (items < 1 || items > 3) fail(`keep box has ${items} items; 1 to 3 allowed`);
    for (const li of keep[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)) if (size(li[1]) > LIM.keep) warn(`keep item over ${LIM.keep} ${unit}: "${strip(li[1]).slice(0, 60)}"`);
  }
  if (!count(hasClass('section', 'recap'))) fail('missing section.recap');
}

// ---- chapters
// a chapter ends at its own </section>, not the first one: a roadmap's lanes are sections inside the chapter
const chapters = [...html.matchAll(/<section class="chapter"[^>]*id="([^"]+)"[^>]*>/g)].map((m) => [m[0], m[1], inner(html, m.index + m[0].length, 'section')]);
info.chapters = chapters.length;
const maxChapters = type === 'atlas' ? 12 : type === 'playbook' ? 10 : 7; // the atlas menu offers twelve chapters; a playbook has more parts than an explainer
if (!ballot && (chapters.length < 3 || chapters.length > maxChapters)) fail(`found ${chapters.length} chapters; 3 to ${maxChapters} expected`);
const visual = /class="[^"]*\b(figure|flow|split|timeline|status|decision|tiles|steps|metaphor|sysmap|trace|matrix|stepper|views|minimap|grid|lanes|runbook|tour|promises|phase-strip|phases|frame|roles|risks|undo|territory|start-here|index|duo|cols|findings|layers|runbook-overview|filmstrip|rulings|qprogress|journey)\b/;
const sentences = (s) => strip(s).split(ja ? /(?<=[。！？])/ : /(?<=[.!?])\s+/);
// a field guide's index is the part the reader looks things up in, not the part they read: it stays out of the reading-path count and the paragraph limits
const cutIndex = (s) => {
  let out = '', i = 0, m; const re = /<div\b[^>]*\sclass="(?:[^"]*\s)?index(?:\s[^"]*)?"[^>]*>/gi;
  while ((m = re.exec(s))) {
    if (m.index < i) continue;
    out += s.slice(i, m.index); i = m.index + m[0].length;
    i += inner(s, i, 'div').length; i += (/^<\/div\s*>/i.exec(s.slice(i)) || [''])[0].length; re.lastIndex = i;
  }
  return out + s.slice(i);
};
let totalWords = 0;
chapters.forEach(([, id, body], i) => {
  const readingPath = unfold(type === 'field-guide' ? cutIndex(body) : body);
  const w = size(readingPath.replace(/<svg[\s\S]*?<\/svg>/g, '')); totalWords += w;
  if (!/<h2\b/.test(body)) fail(`chapter #${id} has no h2`);
  if (!hasClass('p', 'remember').test(body)) fail(`chapter #${id} has no p.remember`);
  if (i > 0 && !hasClass('p', 'from').test(body)) warn(`chapter #${id} has no p.from carry-forward`);
  if (!visual.test(body)) fail(`chapter #${id} has no visual component`);
  if (type !== 'atlas' && !/class="(?:[^"]*\s)?take(?:\s[^"]*)?"/.test(body)) warn(`chapter #${id} has no .take; under its picture, say in one line what it proves`);
  if (w > LIM.chapter) warn(`chapter #${id} reading path is ${w} ${unit}; aim under ${LIM.chapter}`);
  for (const p of readingPath.matchAll(/<p(?![\w-])(?![^>]*class="(?:answer|take|remember|from|nothing)")[^>]*>([\s\S]*?)<\/p>/g)) {
    const pw = size(p[1]);
    if (pw > LIM.para) fail(`chapter #${id}: paragraph of ${pw} ${unit} (max ${LIM.para}): "${strip(p[1]).slice(0, 60)}…"`);
    for (const s of sentences(p[1])) if (size(s) > LIM.sent) warn(`chapter #${id}: sentence of ${size(s)} ${unit}: "${s.slice(0, 60)}…"`);
  }
});
// The at-a-glance picture (1.8.0) sits between the keep box and the chapter map. The reader reads it, so its words join the page's reading path,
// but it is no chapter, so they never join a chapter's own count. The script fills a derived picture's empty placeholder later, so those words are not counted.
const glances = find('glance', 'section');
for (const g of glances) totalWords += size(unfold(g.inner).replace(/<svg[\s\S]*?<\/svg>/g, ''));
info.readingPathWords = totalWords; info.readingMinutes = Math.ceil(totalWords / RATE);
if (totalWords > LIM.path) warn(`reading path is ${totalWords} ${unit} across chapters; aim under ${LIM.path}`);

// ---- figures and svg
const figures = find('figure', 'figure'); // every figure whose class list has "figure": "figure sysmap" and "figure bars" too
for (const f of figures) {
  if (!/<(svg|img|canvas|table)\b/i.test(f.inner) && !strip(f.inner.replace(/<figcaption[\s\S]*?<\/figcaption>/gi, ''))) fail('figure.figure holds nothing but its caption');
  if (!hasClass('figcaption', 'take').test(f.inner)) fail('figure.figure without figcaption.take');
}

// ---- phone legibility: a diagram's smallest label, rendered on a 375 px phone, must reach 9 px.
// Page, chapter and figure padding leave a figure's svg 274 px there, so an 800-wide viewBox shrinks 13 px labels
// to 4.5 px. The template's phone rule gives `.figure > svg` a 640 px minimum and lets the figure scroll, and an
// svg.narrow twin replaces the wide one; both are read from the page's own CSS, so older pages are judged as they render.
const PHONE_SVG = 274, MIN_LABEL = 9; // 9 px still reads; the failure this exists for is 4 to 5 px
const parts = (r) => r.sel.split(',').map((s) => s.trim());
let figMin = 0; // the min-width a `.figure > svg` rule gives, if any
for (const r of rules) if (parts(r).some((s) => /figure\s*>\s*svg$/.test(s))) figMin = Math.max(figMin, +(/min-width\s*:\s*(\d+)px/.exec(r.body) || [, 0])[1]);
const phoneHidden = new Set(); // svg classes a phone-width media rule hides, such as svg.wide
for (const m of css.matchAll(/@media[^{]*max-width\s*:\s*(\d+)px[^{]*\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/g)) if (+m[1] <= 600)
  for (const r of m[2].matchAll(/([^{}]+)\{([^{}]*)\}/g)) if (/display\s*:\s*none/i.test(r[2]))
    for (const s of r[1].split(',')) { const k = /svg\.([\w-]+)$/.exec(s.trim()); if (k) phoneHidden.add(k[1]); }
const classPx = {}; // .d-text-s -> 13, from every rule that sets a px font size on a class
for (const r of rules) { const px = /font-size\s*:\s*([\d.]+)px/i.exec(r.body); if (px) for (const s of parts(r)) { const k = /\.([\w-]+)$/.exec(s); if (k) classPx[k[1]] = +px[1]; } }
const labelPx = (attrs) => {
  const own = /(?:^|\s)font-size="([\d.]+)(?:px)?"/.exec(attrs) || /font-size\s*:\s*([\d.]+)px/.exec(attr(attrs, 'style') || '');
  if (own) return +own[1];
  const sizes = (attr(attrs, 'class') || '').split(/\s+/).map((c) => classPx[c]).filter(Boolean);
  return sizes.length ? Math.min(...sizes) : null;
};
for (const f of figures) {
  const svgs = starts(f.inner).filter((m) => m[1].toLowerCase() === 'svg').map((m) => ({ attrs: m[2], body: inner(f.inner, m.index + m[0].length, 'svg') }));
  const narrow = svgs.some((s) => /\bnarrow\b/.test(attr(s.attrs, 'class') || ''));
  for (const s of svgs) {
    const cls = (attr(s.attrs, 'class') || '').split(/\s+/), isNarrow = cls.includes('narrow');
    if ((narrow && !isNarrow) || cls.some((c) => phoneHidden.has(c))) continue; // hidden on a phone
    const vb = (attr(s.attrs, 'viewBox') || '').trim().split(/[\s,]+/).map(Number), w = vb[2];
    const px = starts(s.body).filter((m) => /^(text|tspan)$/i.test(m[1])).map((m) => labelPx(m[2])).filter(Boolean);
    if (!w || !px.length) continue;
    const shown = Math.round(Math.min(...px) * (isNarrow ? PHONE_SVG : Math.max(PHONE_SVG, figMin)) / w * 10) / 10;
    info.smallestPhoneLabel = Math.min(info.smallestPhoneLabel ?? Infinity, shown);
    const name = strip((/<title\b[^>]*>([\s\S]*?)<\/title>/i.exec(s.body) || [, ''])[1]).slice(0, 40);
    if (shown < MIN_LABEL) fail(`diagram "${name}": labels render at ${shown} px on a phone (min ${MIN_LABEL}); keep the template's 560px .figure rule, or add an svg.narrow twin`);
  }
}
for (const s of html.matchAll(/<svg\b([^>]*)>([\s\S]*?)<\/svg>/g)) {
  if (!/viewBox=/.test(s[1])) fail('svg without viewBox');
  if (/\b(width|height)="\d/.test(s[1])) warn('svg with fixed width/height attribute; use viewBox only');
  if (!/<title\b/.test(s[2])) fail('svg without <title>');
  const hard = s[2].match(/(fill|stroke)="#(?!fff\b|ffffff\b)[0-9a-f]{3,6}"/gi);
  if (hard) warn(`svg uses hard-coded colours (${hard.length}); prefer d-* classes so dark mode works`);
  const nodes = (s[2].match(/<rect\b/g) || []).length; if (nodes > 9) warn(`svg has ${nodes} boxes; split it or fold it`);
}
if (!ballot) { const rails = count(/<nav class="rail"/); if (rails !== 1) fail('missing nav.rail'); }

// ---- language: the text must match lang; Japanese also needs its own CSS, no italics and BIZ UDPGothic
const pageText = strip(bodyOnly);
const letters = pageText.match(/\p{L}/gu) || [], cjk = pageText.match(/(?=\p{L})[\p{sc=Han}\p{scx=Hira}\p{scx=Kana}]/gu) || [];
const share = letters.length ? cjk.length / letters.length : 0; info.cjkPercent = Math.round(share * 100);
if (ja && share < 0.2) fail(`lang="${lang}" but only ${info.cjkPercent}% of the letters are Japanese; need 20% or more`);
if (!ja && share > 0.3) fail(`lang="${lang}" but ${info.cjkPercent}% of the letters are Japanese or Chinese; max 30%, or set lang="ja"`);
if (ja) {
  const jaRules = rulesFor(/:lang\(\s*["']?ja\b/);
  if (!jaRules.length) fail('lang="ja" but the CSS has no :lang(ja) block (Japanese font stack and spacing)');
  if (jaRules.some((r) => /font-style\s*:\s*italic/i.test(r.body))) fail('font-style: italic inside a :lang(ja) rule; Japanese is never italic');
  if (/font-style\s*[:=]\s*["']?\s*italic/i.test(html.replace(/<style[\s\S]*?<\/style>/gi, ''))) fail('font-style: italic outside <style>; Japanese is never italic');
  const gf = links.find((l) => /fonts\.googleapis\.com/.test(l));
  if (gf && !/BIZ(?:\+|%20)UDPGothic/.test(gf)) fail('lang="ja" but the Google Fonts link lacks BIZ+UDPGothic');
}

// ---- contrast, computed from the token blocks in each theme (WCAG 2: text needs 4.5)
const tokensOf = (re) => Object.assign({}, ...rulesFor(re).map((r) => Object.fromEntries([...r.body.matchAll(/(--[\w-]+)\s*:\s*([^;]+)/g)].map((m) => [m[1], m[2].trim()]))));
const light = tokensOf(/^:root$/), themes = { light };
for (const [name, sel] of [['dark', /^:root\[data-theme="dark"\]$/], ['dark (prefers-color-scheme)', /^:root:not\(\[data-theme="light"\]\)$/]])
  if (rulesFor(sel).length) themes[name] = { ...light, ...tokensOf(sel) }; // a dark block overrides the light tokens it names
const rgb = (v) => { const h = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(v || '')?.[1]; return h && [0, 1, 2].map((i) => parseInt(h.length === 3 ? h[i] + h[i] : h.slice(2 * i, 2 * i + 2), 16)); };
const lin = (v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const floor2 = (x) => Math.floor(x * 100) / 100; // WCAG ratios are truncated, never rounded up
const PAIRS = [['--ink', '--paper'], ['--ink', '--card'], ['--ink-soft', '--card'], ['--ink-faint', '--paper'], ['--ink-faint', '--card'], ['--here', '--card'],
  ...['here', 'go', 'wait', 'stop', 'decide'].map((x) => [`--on-${x}`, `--${x}`]), ['--on-soft', '--ink-soft']];
const missing = new Set(); info.contrast = {}; // lowest ratio per theme
for (const [name, t] of Object.entries(themes)) for (const [fg, bg] of PAIRS) {
  const a = rgb(t[fg]), b = rgb(t[bg]);
  for (const [k, c] of [[fg, a], [bg, b]]) if (!c) missing.add(k);
  if (!a || !b) continue;
  const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p), r = floor2((hi + 0.05) / (lo + 0.05));
  info.contrast[name] = Math.min(info.contrast[name] ?? r, r);
  if (r < 4.5) fail(`contrast (${name}): ${fg} on ${bg} is ${r.toFixed(2)}:1; text needs 4.5:1`);
}
if (missing.size) warn(`contrast not checked, token missing or not a hex colour: ${[...missing].join(', ')}`);

// ---- colour is never the only cue (WCAG 1.4.1): the go state must carry a glyph
for (const sel of ['.status li.go::before', '.timeline li.go::before'])
  if (!rules.some((r) => r.sel.split(',').some((s) => s.trim().endsWith(sel)) && /content\s*:\s*(?!none|normal|""|'')[^;}\s]/.test(r.body)))
    fail(`colour-only: the CSS has no "${sel}" rule with a content: glyph`);

// ---- type rules, keyed by data-type on <html>
const bad = (m) => fail(`data-type="${type}": ${m}`), need = (ok, m) => { if (!ok) bad(m); };
const REQUIRED = { decision: ['decision'], status: ['status'], spec: ['split', 'status'], release: ['tiles', 'split'], handover: ['status', 'steps'],
  portfolio: ['status', 'steps'], incident: ['timeline', 'flow', 'status'], pr: ['split', 'status', 'tiles'], roadmap: ['lanes'],
  playbook: ['phase-strip', 'phases', 'undo', 'risks'] };
for (const c of REQUIRED[type] || []) need(num(c), `needs at least one .${c}`);
// Answer fields ride on one .collect bar and every field carries a data-q. A playbook gets advice; a decision page without an .ask gets hard rules.
const answerFieldRules = (fields, noun, report) => {
  if (num('collect') !== 1) report(`${fields.length} .answer-field and ${num('collect')} .collect; one collect bar carries the ${noun} back`);
  fields.forEach((f, i) => { if (!attr(f.attrs, 'data-q')) report(`.answer-field #${i + 1} has no data-q`); });
};
if (type === 'decision') { // the page ends in a typed-reply .ask, or in tap-to-answer fields (fieldset.answer-field, one per ruling) and one .collect bar
  if (!num('ask')) {
    const fields = find('answer-field');
    if (fields.length) answerFieldRules(fields, 'answers', bad);
    else bad('needs a .ask, or at least one .answer-field and one .collect bar');
  }
}
if (type === 'status') need(find('timeline').some((t) => num('here', 'li', t.inner) === 1), 'needs a .timeline with exactly one li.here');
if (type === 'research') { need(num('status') + num('tiles'), 'needs at least one .status or .tiles'); need(num('fold', 'details'), 'needs at least one details.fold'); }
if (type === 'gather' && !ballot) {
  const fields = find('answer-field'), seen = new Set();
  need(fields.length, 'needs at least one .answer-field');
  fields.forEach((f, i) => {
    const q = attr(f.attrs, 'data-q'), at = q ? `"${q}"` : `#${i + 1}`;
    if (!q) bad(`.answer-field ${at} has no data-q`); else if (seen.has(q)) bad(`duplicate data-q "${q}"`);
    seen.add(q);
    const el = f.tag === 'fieldset' ? 'legend' : 'label', m = f.inner.match(new RegExp(`<${el}\\b[^>]*>([\\s\\S]*?)</${el}>`, 'i'));
    need(m && strip(m[1]), `.answer-field ${at} has no non-empty ${el}`);
  });
  need(num('collect') === 1, `needs exactly one .collect, found ${num('collect')}`);
}
// ---- ballot mode: pictured cards and a pinned tray (data-type="gather" data-mode="ballot"); the tray replaces .collect
if (ballot) {
  const cards = find('ballot-card'), seen = new Set(); info.cards = cards.length;
  need(cards.length, 'needs at least one .ballot-card');
  cards.forEach((c, i) => {
    const q = attr(c.attrs, 'data-q'), at = q ? `"${q}"` : `#${i + 1}`;
    if (!q) bad(`.ballot-card ${at} has no data-q`); else if (seen.has(q)) bad(`duplicate data-q "${q}"`);
    seen.add(q);
    need(strip(attr(c.attrs, 'data-short') || ''), `.ballot-card ${at} has no data-short`);
    need(hasClass('p', 'skip').test(c.inner), `.ballot-card ${at} has no p.skip ("If you skip this")`);
    const opts = find('ballot-opt', null, c.inner), multi = attr(c.attrs, 'data-kind') === 'multi', rec = withAttr('data-rec', c.inner).length;
    need(opts.length >= 2, `.ballot-card ${at} has ${opts.length} option(s); at least 2 needed`);
    if (!multi) need(rec === 1, `.ballot-card ${at} has ${rec} [data-rec] options; exactly 1 needed (a multi card may have any number)`);
    opts.forEach((o) => { // an option is a picture (.vis) or a text option: a non-empty .detail line (span or p) and no picture
      const k = attr(o.attrs, 'data-k') || '?', vis = find('vis', null, o.inner)[0];
      const pictured = vis && (strip(vis.inner) || /<(?:img|svg|canvas|picture)\b/i.test(vis.inner));
      const detailed = find('detail', null, o.inner).some((d) => /^(?:span|p)$/.test(d.tag) && strip(d.inner));
      if (!pictured && !detailed) bad(`.ballot-card ${at}: option ${k} has neither a non-empty .vis nor a non-empty .detail line`);
      else if (pictured && !/<[a-z]/i.test(vis.inner)) warn(`.ballot-card ${at}: the .vis of option ${k} is text alone; draw a small mockup, use an <img>, or drop the .vis and give the option a .detail line`);
    });
  });
  const trays = find('ballot-tray');
  need(trays.length === 1, `needs exactly one .ballot-tray, found ${trays.length}`);
  if (trays.length === 1) {
    need(withAttr('data-copy', trays[0].inner).some((m) => m[1].toLowerCase() === 'button'), '.ballot-tray has no button[data-copy]');
    if (!/\saria-live=/.test(trays[0].inner)) warn('.ballot-tray has no aria-live status line');
  }
}
for (const m of withAttr('data-warn')) { // a consequence chip on a .ballot-opt or a decision .option is a few words ("Can't undo")
  const w = strip(attr(m[2], 'data-warn') || ''), n = w ? w.split(/\s+/).length : 0;
  if (!n) warn('data-warn is empty; name the consequence in a few words, such as "Can\'t undo"');
  else if (n > 4) warn(`data-warn "${w}" is ${n} words; the chip holds 4 or fewer`);
}
if (type === 'atlas') {
  const states = ['state-current', 'state-dormant', 'state-target'];
  need(find('legend').some((l) => states.every((s) => num(s, null, l.inner))), 'needs a .legend containing .state-current, .state-dormant and .state-target');
  need(num('sysmap'), 'needs at least one .sysmap');
  for (const a of find('anchor')) if (!attr(a.attrs, 'data-src') || !attr(a.attrs, 'data-line')) bad(`.anchor without data-src and data-line: "${strip(a.inner).slice(0, 40)}"`);
  need(withAttr('data-revision').length, 'needs an element with data-revision (commit hash and date)');
}

// ---- new page types (1.2.0): portfolio, public, teach, incident, pr, runbook, compare, roadmap, tour
// direct children `t` of the element whose inner html is `src`: [{ attrs, inner }]. A list nested in a list item never counts.
const kids = (src, t) => {
  const out = []; let end = 0;
  for (const m of starts(src)) {
    if (m.index < end) continue; // inside the previous child
    const body = VOID.test(m[1]) || m[0].endsWith('/>') ? '' : inner(src, m.index + m[0].length, m[1]);
    end = m.index + m[0].length + body.length;
    if (m[1].toLowerCase() === t) out.push({ attrs: m[2], inner: body });
  }
  return out;
};
const lead = (s) => strip(s).slice(0, 40);
const isGroup = (attrs) => /(?:^|\s)class="(?:[^"]*\s)?group(?:\s[^"]*)?"/.test(attrs); // tr.group
const typeChapters = [...html.matchAll(/<section class="chapter"[^>]*id="([^"]+)"[^>]*>/g)].map((m) => [m[1], inner(html, m.index + m[0].length, 'section')]); // [id, body]
const reading = (s) => unfold(s).replace(/<svg[\s\S]*?<\/svg>/g, ''); // what the reader sees with every fold closed
if (type === 'portfolio') {
  const rows = find('status').reduce((n, s) => n + kids(s.inner, 'li').length, 0);
  if (rows < 3) warn(`data-type="portfolio": the .status boards hold ${rows} row(s); a portfolio shows every project, one row each, so 3 or more`);
}
if (type === 'public') {
  need(num('promises', 'ul'), 'needs at least one ul.promises');
  need(!num('ask', 'section'), 'a customer page has no section.ask; it asks the reader for nothing');
  find('promises', 'ul').forEach((u) => kids(u.inner, 'li').forEach((li) => {
    if (!strip(attr(li.attrs, 'data-evidence') || '')) bad(`ul.promises > li has no non-empty data-evidence: "${lead(li.inner)}"`);
  }));
  const JARGON = ['API', 'backend', 'endpoint', 'database', 'server', 'JSON', 'OCR', 'LLM', 'token', 'deploy', 'repo', 'commit', 'branch', 'CI', 'schema', 'pipeline'];
  const opening = [/<p class="answer">([\s\S]*?)<\/p>/, /<div class="keep">([\s\S]*?)<\/div>/].map((re) => (re.exec(html) || [, ''])[1]); // the answer bar and the keep box are read first
  const readable = [...opening, ...typeChapters.map(([, body]) => reading(body))].map(strip).join(' ');
  for (const w of JARGON) {
    const n = (readable.match(new RegExp(`\\b${w}(?:e?s)?\\b`, 'gi')) || []).length; // whole word, plural too
    if (n) warn(`data-type="public": the jargon word "${w}" appears ${n} time(s) outside the folds; say it in plain words`);
  }
}
if (type === 'teach') need(num('term', 'dl'), 'needs at least one dl.term');
if (type === 'teach') for (const [id, body] of typeChapters) {
  if (!find('term', 'dl', body).length) warn(`data-type="teach": chapter #${id} has no dl.term; define the new words where they first appear`);
  if (!find('figure', 'figure', body).length) warn(`data-type="teach": chapter #${id} has no figure.figure; teach with a picture`);
}
if (type === 'incident') {
  const longest = Math.max(0, ...find('timeline').map((t) => kids(t.inner, 'li').length));
  if (find('timeline').length && longest < 3) warn(`data-type="incident": the timeline has ${longest} item(s); tell what happened in order, 3 or more`);
}
if (type === 'runbook') {
  need(num('runbook', 'ol'), 'needs at least one ol.runbook');
  find('runbook', 'ol').forEach((o) => kids(o.inner, 'li').forEach((li, i) => {
    const has = (c) => find(c, 'p', li.inner).some((p) => strip(p.inner));
    if (!has('check') || !has('fail')) bad(`ol.runbook step ${i + 1} needs both a p.check and a p.fail with text: "${lead(li.inner)}"`);
  }));
}
if (type === 'compare') {
  need(num('grid', 'table'), 'needs at least one table.grid');
  find('grid', 'table').forEach((t, i) => {
    const head = (/<thead\b[^>]*>([\s\S]*?)<\/thead>/i.exec(t.inner) || [, ''])[1];
    const bodies = [...t.inner.matchAll(/<tbody\b[^>]*>([\s\S]*?)<\/tbody>/gi)].map((m) => m[1]);
    const options = starts(head).filter((m) => /^t[hd]$/i.test(m[1])).length - 1; // the first header cell names the criterion column
    const rows = starts(bodies.length ? bodies.join('') : t.inner.replace(/<thead\b[\s\S]*?<\/thead>/i, '')).filter((m) => m[1].toLowerCase() === 'tr' && !isGroup(m[2])).length; // a tr.group band names rows; it is not a criterion
    if (options < 2) bad(`table.grid #${i + 1} has ${Math.max(options, 0)} option column(s); compare at least 2`);
    if (rows < 3) bad(`table.grid #${i + 1} has ${rows} body row(s); compare against at least 3 criteria`);
  });
}
if (type === 'roadmap') {
  find('lanes').forEach((l, i) => { const n = num('lane', null, l.inner); if (n !== 3) bad(`.lanes #${i + 1} has ${n} .lane; exactly three (now, next, later)`); });
  const ids = new Set([...html.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]));
  find('after', 'small').forEach((s) => starts(s.inner).filter((m) => m[1].toLowerCase() === 'a').forEach((a) => {
    const href = attr(a[2], 'href');
    if (href?.startsWith('#') && !ids.has(href.slice(1))) bad(`small.after links to "${href}" and no element has that id`);
  }));
}
if (type === 'tour') {
  need(num('tour', 'ol'), 'needs at least one ol.tour');
  find('tour', 'ol').forEach((o) => kids(o.inner, 'li').forEach((li, i) => {
    if (!starts(li.inner).some((m) => m[1].toLowerCase() === 'img' && strip(attr(m[2], 'alt') || ''))) bad(`ol.tour step ${i + 1} has no img with a non-empty alt: "${lead(li.inner)}"`);
  }));
}

// ---- field guide (1.7.0): a reference read once for orientation, then looked things up in. No older page carries this type, so its required parts fail.
// The index is outside the reading path (see cutIndex above). Counts on the map are written by the page's script from the entries, so a tile that types digits warns.
if (type === 'field-guide') {
  const tally = {};
  for (const m of html.matchAll(/\sid="([^"]*)"/g)) tally[m[1]] = (tally[m[1]] || 0) + 1;
  for (const [id, n] of Object.entries(tally)) if (n > 1) bad(`duplicate id "${id}" on ${n} elements; a deep link needs one`);
  need(num('territory'), 'needs a .territory (the map of families, by stage)');
  need(num('start-here'), 'needs an ol.start-here (what to do first)');
  need(num('index'), 'needs a .index (the families and their entries)');
  need(!num('ask', 'section'), 'a guide asks nothing, so it has no section.ask');
  const entries = find('entry'), families = find('family-index', 'details'), tiles = find('family', 'a');
  const entryIds = new Set(entries.map((e) => (attr(e.attrs, 'id') || '').trim()).filter(Boolean)), famIds = new Set(families.map((f) => (attr(f.attrs, 'id') || '').trim()).filter(Boolean));
  info.entries = entries.length; info.families = families.length;
  const DEF = ja ? 45 : 20; // a definition is one line: 20 words, or 45 characters in Japanese
  entries.forEach((e, i) => {
    const id = (attr(e.attrs, 'id') || '').trim(), at = id ? `"${id}"` : `#${i + 1}`, rel = attr(e.attrs, 'data-rel');
    if (!id) bad(`.entry ${at} has no id`);
    if (!find('name', 'b', e.inner).some((n) => strip(n.inner))) bad(`.entry ${at} has no b.name with text`);
    const defs = find('def', 'p', e.inner).filter((p) => strip(p.inner));
    if (!defs.length) bad(`.entry ${at} has no p.def with text`);
    if (!find('where', 'p', e.inner).some((p) => strip(p.inner))) bad(`.entry ${at} has no p.where with text`);
    if (!['now', 'next', 'later'].includes(rel)) bad(`.entry ${at} needs data-rel of now, next or later, found ${rel ? `"${rel}"` : 'none'}`);
    for (const p of defs) if (size(p.inner) > DEF) warn(`data-type="field-guide": the definition of ${at} is ${size(p.inner)} ${unit}; one line, ${DEF} or fewer`);
  });
  if (entries.length > 150) warn(`data-type="field-guide": ${entries.length} entries; past 150 a guide is hard to keep true, so split it`);
  if (families.length > 12) warn(`data-type="field-guide": ${families.length} families; 12 or fewer keeps the map on one screen`);
  tiles.forEach((t) => {
    const href = attr(t.attrs, 'href'), name = lead(t.inner);
    if (!href?.startsWith('#') || !famIds.has(href.slice(1))) bad(`a.family "${name}" links to ${href ? `"${href}"` : 'nothing'} and no details.family-index has that id`);
    if (/\d/.test(strip(t.inner))) warn(`data-type="field-guide": the tile "${name}" types a digit; counts are written by the script from the entries, so leave them out`);
  });
  find('start-here', 'ol').forEach((o) => {
    const items = kids(o.inner, 'li');
    if (items.length > 5) warn(`data-type="field-guide": ol.start-here has ${items.length} items; 5 or fewer, or nothing is first`);
    items.forEach((li, n) => {
      const hrefs = starts(li.inner).filter((m) => m[1].toLowerCase() === 'a').map((m) => attr(m[2], 'href'));
      if (!hrefs.length) warn(`data-type="field-guide": ol.start-here item ${n + 1} has no link to its entry: "${lead(li.inner)}"`);
      for (const h of hrefs) if (!h?.startsWith('#') || !(entryIds.has(h.slice(1)) || famIds.has(h.slice(1)))) bad(`ol.start-here links to ${h ? `"${h}"` : 'nothing'} and no entry has that id`);
    });
  });
}

// ---- lanes and backlog (1.6.0): advice only. A new FAIL would make upgrade.mjs refuse the pages it is meant to bring up to date.
{
  const cls = (attrs, c) => new RegExp(`(?:^|\\s)class="(?:[^"]*\\s)?${c}(?:\\s[^"]*)?"`).test(attrs);
  const filled = (c, t, src) => find(c, t, src).some((e) => strip(e.inner)); // an element of that class with text in it
  const lanes = find('lane'), tops = find('backlog-top', 'ol'), MAX_LIVE = 5;
  const cards = []; // every card in a lane or in the ranked backlog: { attrs, inner, where }
  lanes.forEach((l, i) => {
    const where = `.lane "${attr(l.attrs, 'data-lane') || `#${i + 1}`}"`;
    const lis = kids(l.inner, 'ul').flatMap((u) => kids(u.inner, 'li'));
    lis.forEach((li) => cards.push({ ...li, where }));
    if (!filled('lane-note', 'p', l.inner)) warn(`${where} has no non-empty p.lane-note; say its horizon, how sure it is, and whether order matters ("1 to 3 months. Likely. Not in order.")`);
    const live = lis.filter((li) => !cls(li.attrs, 'go')).length;
    if (live > MAX_LIVE) warn(`${where} has ${live} live cards; keep it to ${MAX_LIVE} or fewer and fold the rest away`);
    const done = lis.length - live;
    if (done && attr(l.attrs, 'data-lane') === 'now') warn(`${where} holds ${done} li.go; move shipped work to the shipped fold (details.fold.shipped)`);
  });
  tops.forEach((o) => kids(o.inner, 'li').forEach((li) => cards.push({ ...li, where: 'ol.backlog-top' })));
  tops.forEach((o, i) => { const n = kids(o.inner, 'li').length; if (n > MAX_LIVE) warn(`ol.backlog-top #${i + 1} has ${n} items; rank at most ${MAX_LIVE} and put the rest in a details.theme below the cut line`); });
  for (const c of cards) {
    if (cls(c.attrs, 'wait') && !filled('after', 'small', c.inner) && !filled('outside', 'small', c.inner))
      warn(`${c.where}: li.wait "${lead(c.inner)}" has neither a small.after nor a small.outside; say what it waits on`);
    if (c.where !== 'ol.backlog-top' && hasAttr(c.attrs, 'data-conf') && !filled('conf', 'small', c.inner))
      warn(`${c.where}: li[data-conf] "${lead(c.inner)}" has no non-empty small.conf; say why it is less certain than its lane`);
  }
  const theme = /<details\b[^>]*\sclass="(?:[^"]*\s)?theme(?:\s[^"]*)?"/.exec(html), cut = /\sclass="(?:[^"]*\s)?cutline(?:\s[^"]*)?"/.exec(html);
  if (theme && (!cut || cut.index > theme.index)) warn('details.theme comes before any .cutline; draw the cut line above the themes so ranked and unranked stay apart');
  if (type === 'roadmap' && !filled('asof', 'p')) warn('data-type="roadmap": no p.asof under the answer bar ("A plan, not a promise. Items move as we learn.")');
  if (cards.length) for (const [name, t] of Object.entries(themes)) for (const x of ['here', 'go', 'wait', 'stop', 'decide']) { // a card prints its state word as text in the state colour, on the card
    const a = rgb(t[`--${x}`]), b = rgb(t['--card']); if (!a || !b) continue;
    const [hi, lo] = [lum(a), lum(b)].sort((p, q) => q - p), r = floor2((hi + 0.05) / (lo + 0.05));
    if (r < 4.5) warn(`contrast (${name}): --${x} on --card is ${r.toFixed(2)}:1; roadmap state words are text in that colour and need 4.5:1`);
  }
}

// ---- playbook (1.3.0): a plan for one risky change, ending with the decisions it needs
if (type === 'playbook') {
  const ids = new Set([...html.matchAll(/\sid="([^"]*)"/g)].map((m) => m[1]));
  find('phases', 'ol').forEach((o) => kids(o.inner, 'li').forEach((li, i) => {
    if (!find('impact', 'p', li.inner).some((p) => strip(p.inner))) bad(`ol.phases phase ${i + 1} has no non-empty p.impact (what the audience notices): "${lead(li.inner)}"`);
  }));
  find('risk', 'article').forEach((r, i) => {
    const level = attr(r.attrs, 'data-level');
    if (!['high', 'medium', 'low'].includes(level)) bad(`article.risk ${i + 1} needs data-level of high, medium or low, found ${level ? `"${level}"` : 'none'}: "${lead(r.inner)}"`);
    if (!find('kept', 'p', r.inner).some((p) => strip(p.inner))) bad(`article.risk ${i + 1} has no non-empty p.kept (what keeps it small): "${lead(r.inner)}"`);
  });
  find('phase-strip', 'ol').forEach((o, i) => {
    const segs = kids(o.inner, 'li').length;
    if (segs < 3) warn(`data-type="playbook": the .phase-strip #${i + 1} has ${segs} segment(s); a plan shows its phases in one row, 3 or more`);
    starts(o.inner).filter((m) => m[1].toLowerCase() === 'a').forEach((a) => {
      const href = attr(a[2], 'href');
      if (href?.startsWith('#') && !ids.has(href.slice(1))) bad(`ol.phase-strip links to "${href}" and no element has that id`);
    });
  });
  const fields = find('answer-field');
  if (!fields.length) warn('data-type="playbook": no .answer-field; a playbook usually ends with the decisions it needs');
  else answerFieldRules(fields, 'decisions', (m) => warn(`data-type="playbook": ${m}`)); // the decisions copy through the gather bar: one .collect, and every field a data-q
}

// ---- fields that order or sort (1.6.0), on any page type. A rank item only warns, so an older page still passes. A buckets field is a new kind,
// so a broken one fails: its labels, ids and picks decide what the copies say.
find('answer-field').forEach((f, i) => {
  const kind = attr(f.attrs, 'data-kind'), q = attr(f.attrs, 'data-q'), at = q ? `"${q}"` : `#${i + 1}`;
  if (kind !== 'rank' && kind !== 'buckets') return;
  const ol = /<ol\b[^>]*>/i.exec(f.inner), items = ol ? kids(inner(f.inner, ol.index + ol[0].length, 'ol'), 'li') : [];
  const ids = items.map((li) => (attr(li.attrs, 'data-id') || '').trim());
  if (kind === 'rank') {
    const bare = ids.filter((id) => !id).length;
    if (bare) warn(`.answer-field ${at} (rank): ${bare} of ${items.length} item(s) have no data-id; an id lets a merge line items up when a page is translated or reworded`);
    else if (new Set(ids).size < ids.length) warn(`.answer-field ${at} (rank): two items share a data-id`);
    return;
  }
  const raw = attr(f.attrs, 'data-buckets'), labels = (raw || '').split('|').map((s) => s.trim());
  const sound = raw !== undefined && labels.length >= 2 && labels.length <= 5 && !labels.some((l) => !l || l.includes(':')) && new Set(labels.map((l) => l.toLowerCase())).size === labels.length;
  if (raw === undefined) fail(`.answer-field ${at} (buckets) has no data-buckets; list 2 to 5 labels split by "|", such as "Now|Next|Later"`);
  else if (!sound) fail(`.answer-field ${at} (buckets): data-buckets "${raw}" is malformed; 2 to 5 distinct labels split by "|", none empty and none holding a colon`);
  if (!items.length) fail(`.answer-field ${at} (buckets) has no ol of li items`);
  const seen = new Set();
  items.forEach((li, n) => {
    const id = ids[n], rec = (attr(li.attrs, 'data-rec') || '').trim();
    if (!id) warn(`.answer-field ${at} (buckets): item ${n + 1} has no data-id`);
    else if (seen.has(id)) fail(`.answer-field ${at} (buckets): duplicate data-id "${id}"`);
    seen.add(id);
    if (!rec) warn(`.answer-field ${at} (buckets): item ${n + 1} has no data-rec, so no bucket is marked ★ for it`);
    else if (sound && !labels.includes(rec)) fail(`.answer-field ${at} (buckets): item ${n + 1} has data-rec "${rec}", which is not one of the buckets (${labels.join(', ')})`);
  });
  if (items.length > 15) warn(`.answer-field ${at} (buckets) has ${items.length} items; 15 or fewer keeps the page short enough to finish on a phone`);
});

// ---- at a glance and the type parts (1.8.0), on any page type.
// Advice for the glance itself: only a page whose generator mark says 1.8.0 or later is asked for one, so no older page changes verdict.
// A part whose data is wrong or missing fails, because each would draw a broken picture: a finding with no strength, a layers list without one
// "you are here", and a derived picture (the script builds it from other parts of the page) with nothing on the page to build it from.
{
  const hasCls = (attrs, c) => new RegExp(`(?:^|\\s)class="(?:[^"]*\\s)?${c}(?:\\s[^"]*)?"`).test(attrs);
  const opensItself = ['roadmap', 'playbook', 'field-guide'].includes(type) || ballot; // their lanes, phase strip, territory or cards already open the page
  if (generator && atLeast(generator, [1, 8, 0]) && !opensItself && !glances.length)
    warn(`data-type="${type}": no section.glance; a page made by 1.8.0 or later puts the type's own picture on the first screen, after the keep box (see "At a glance" in types.md)`);
  glances.forEach((g, i) => {
    if (!find('take', null, g.inner).some((t) => strip(t.inner))) warn(`section.glance #${i + 1} has no take line; say in one line what its picture shows (a p.take, or the figure's own figcaption.take)`);
  });
  find('findings', 'ul').forEach((u, i) => kids(u.inner, 'li').forEach((li, n) => {
    const s = (attr(li.attrs, 'data-strength') || '').trim();
    if (!['strong', 'moderate', 'weak'].includes(s)) fail(`ul.findings #${i + 1}, finding ${n + 1} needs data-strength of strong, moderate or weak, found ${s ? `"${s}"` : 'none'}: "${lead(li.inner)}"`);
  }));
  find('layers', 'ol').forEach((o, i) => {
    const here = kids(o.inner, 'li').filter((li) => hasCls(li.attrs, 'here')).length;
    if (here !== 1) fail(`ol.layers #${i + 1} has ${here} li.here; exactly one marks the layer the newcomer is on`);
  });
  if (num('runbook-overview', 'div') && !num('runbook', 'ol')) fail('div.runbook-overview needs an ol.runbook on the page; the overview is built from its steps');
  if (num('filmstrip', 'div') && !num('tour', 'ol')) fail('div.filmstrip needs an ol.tour on the page; the strip is built from its steps');
  if (num('rulings', 'div') && !num('decision')) fail('div.rulings needs at least one .decision on the page; the list is built from them');
  if (num('qprogress', 'div') && !find('answer-field').some((f) => attr(f.attrs, 'data-q'))) fail('div.qprogress needs at least one .answer-field with a data-q; the dots are built from them');
}

// ---- reader-feature components, on any page type
find('stepper').forEach((s, i) => {
  if (!num('stepper-nav', null, s.inner)) fail(`.stepper #${i + 1} has no .stepper-nav`);
  const steps = withAttr('data-step-text', s.inner).length;
  if (steps < 2) fail(`.stepper #${i + 1} has ${steps} [data-step-text]; at least 2 needed`);
});
find('views').forEach((v, i) => {
  const [first] = withAttr('data-view-panel', v.inner);
  if (!first) fail(`.views #${i + 1} has no [data-view-panel]`);
  else if (hasAttr(first[2], 'hidden')) fail(`.views #${i + 1}: the first [data-view-panel] is hidden; the first tab must carry the point`);
});
find('minimap').forEach((m, i) => { if (!hasAttr(m.attrs, 'data-lit')) warn(`.minimap #${i + 1} has no data-lit; no node will be lit`); });

// ---- report
const out = { file, ok: fails.length === 0, fails, warns, info };
if (asJson) console.log(JSON.stringify(out, null, 2));
else {
  console.log(`${out.ok ? 'PASS' : 'FAIL'}  ${file}`);
  console.log(`  title: "${info.title}"  ${ballot ? 'cards: ' + info.cards : `chapters: ${info.chapters}  reading-path ${unit}: ${info.readingPathWords}`}  size: ${info.kb} KB`);
  for (const f of fails) console.log(`  FAIL  ${f}`);
  for (const w of warns) console.log(`  warn  ${w}`);
}
process.exit(out.ok ? 0 : 1);
