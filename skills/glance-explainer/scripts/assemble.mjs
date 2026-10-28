#!/usr/bin/env node
// glance-explainer page assembler. Zero dependencies, Node 18 or newer.
//   node assemble.mjs <body.html> <out.html> --type <type> [--lang en|ja] [--mode ballot] [--title "..."] [--description "..."]
//   node assemble.mjs --refresh <page.html>
// The first form builds a page from ../assets/template.html and a body fragment: what goes inside <main> after the focus-nav, from the
// kicker and h1 down to the recap, ask and collect bar. The template's head, styles, script, fonts and generator mark stay as they are.
// The script then
//   - sets <html lang data-type> (and data-mode="ballot"), <title> (--title, else the h1) and the meta description (--description, else p.answer);
//   - builds the rail from every <section class="chapter" id="...">, in order, plus a recap link when section.recap has an id.
//     A rail link reads the chapter's data-rail, else its h2. The template's tools block stays;
//   - adds an ol.map after the glance (else after the keep box) when the body has none: one line per chapter, from data-line, else data-keep.
//     A field guide and a playbook get none, because types.md makes the map optional there; an ol.map written in the body is always kept;
//   - writes every chapter kicker and the meta reading time (below).
//   --lang ja      also puts the template's own interface strings (skip link, rail title, tools, focus-nav) into Japanese,
//                  from ../assets/i18n/ui.ja.json, the file translate.mjs applies
//   --mode ballot  a ballot (data-type gather) has no rail, no focus-nav, no chapters, no map and no reading time
// An atlas also needs its atlas.css and atlas.js links; this script does not add them.
// Reading time: a chapter's reading path is its html with the folds closed, a field guide's index cut and the svg drawings gone, counted in words
// (characters when <html lang="ja">) and divided by 200 (500) a minute, rounded up, never below 1. The kicker reads "Chapter 2 of 6, about 1 minute"
// (plural above 1) or 「第2章 / 全6章、約1分」. The page's reading time adds every chapter's path and the glance, then does the same sum:
// "Reading time about 5 minutes" or 「約5分で読めます」. A kicker or a meta with no reading time in it is left alone, and a note says so.
// The second form, --refresh, works on a finished page and rebuilds only the rail list and the reading minutes, in place. The map and the
// rest stay as they are. A rail label stays as the page has it (a hand-shortened one survives) unless the chapter has a data-rail;
// a chapter the rail does not know yet gets its h2. For pages edited by hand.
// Exit 0 when done, 1 on a missing file, a body with no h1, or a chapter without an id or an h2, 2 on a usage error.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const TEMPLATE = here('../assets/template.html'), UI_JA = here('../assets/i18n/ui.ja.json');
const USAGE = `usage:
  node assemble.mjs <body.html> <out.html> --type <type> [--lang en|ja] [--mode ballot] [--title "..."] [--description "..."]
  node assemble.mjs --refresh <page.html>`;
// the page types check.mjs accepts (its TYPES list): keep the two the same
const TYPES = ['explainer', 'decision', 'status', 'spec', 'release', 'research', 'handover', 'portfolio', 'public', 'teach', 'incident', 'pr', 'runbook', 'compare', 'roadmap', 'tour', 'playbook', 'field-guide', 'gather', 'atlas'];

const die = (m) => { console.error('assemble: ' + m); process.exit(1); };
const usage = (m) => { console.error((m ? 'assemble: ' + m + '\n' : '') + USAGE); process.exit(2); };
const read = (f) => { try { const s = readFileSync(f, 'utf8'); return s.charCodeAt(0) === 0xFEFF ? s.slice(1) : s; } catch (e) { return die(`cannot read ${f} (${e.code})`); } };

// ---- reading rules. These are check.mjs's, copied: its page text, word and character counts, folds, field-guide index and tag matching.
// The two MUST AGREE. A change to how check.mjs counts a chapter's reading path or finds its chapters is a change here too,
// or the kickers this script writes would disagree with the checker's own numbers.
// check.mjs reads the page with comments gone and script and textarea bodies emptied. This script edits the real text, so it keeps a masked twin:
// the same page with those parts blanked to spaces, so an index found in the twin is the same index in the real text.
const COMMENTS = /<!--[\s\S]*?-->/g, BODIES = /(<(script|textarea)\b[^>]*>)[\s\S]*?(<\/\2\s*>)/gi;
const cleaned = (s) => s.replace(COMMENTS, '').replace(BODIES, '$1$3'); // what check.mjs reads
const blank = (s) => s.replace(/[^\r\n]/g, ' ');
const mask = (s) => s.replace(COMMENTS, (c) => blank(c)).replace(BODIES, (all, open, _t, close) => open + blank(all.slice(open.length, all.length - close.length)) + close);
const strip = (s) => s.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
// a number with separators (1,250 or 3.5) counts as one word
const words = (s) => (strip(s).match(/[A-Za-z]+(?:[’'\-][A-Za-z]+)*|\d[\d,.]*\d|\d/g) || []).length;
// Japanese has no spaces: every character that is not a space or punctuation counts one
const chars = (s) => [...strip(s)].filter((c) => !/[\s\p{P}]/u.test(c)).length;
const attr = (attrs, name) => (attrs.match(new RegExp(`(?:^|\\s)${name}="([^"]*)"`, 'i')) || [])[1];
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
// the html without its folds. A fold may hold another details, so each </details> is matched to its own open tag.
const unfold = (s) => {
  let out = '', i = 0, m; const re = /<details\b[^>]*>/gi;
  while ((m = re.exec(s))) {
    out += s.slice(i, m.index); i = m.index + m[0].length;
    i += inner(s, i, 'details').length; i += (/^<\/details\s*>/i.exec(s.slice(i)) || [''])[0].length; re.lastIndex = i;
  }
  return out + s.slice(i);
};
// a field guide's index is the part the reader looks things up in, not the part they read: it stays out of the reading path
const cutIndex = (s) => {
  let out = '', i = 0, m; const re = /<div\b[^>]*\sclass="(?:[^"]*\s)?index(?:\s[^"]*)?"[^>]*>/gi;
  while ((m = re.exec(s))) {
    if (m.index < i) continue;
    out += s.slice(i, m.index); i = m.index + m[0].length;
    i += inner(s, i, 'div').length; i += (/^<\/div\s*>/i.exec(s.slice(i)) || [''])[0].length; re.lastIndex = i;
  }
  return out + s.slice(i);
};
const starts = (src) => [...src.matchAll(/<([a-z][a-z0-9]*)\b([^>]*)>/gi)]; // every start tag: [whole, name, attributes]
const CHAPTER = /<section class="chapter"[^>]*id="([^"]+)"[^>]*>/g; // the chapter tag check.mjs finds; its body starts where this match ends
// types.md: "the chapter map is optional" in these, because the territory or the phase strip already navigates. No map is made for them.
const MAP_OPTIONAL = ['field-guide', 'playbook'];

// ---- finding things in the masked page
// elements whose class list has the token `cls` (and tag `t` when given): { tag, attrs, start, a, b, end }; a..b is the inside, end is after the close tag
const elems = (m, cls, t) => {
  const has = new RegExp(`\\sclass="(?:[^"]*\\s)?${cls}(?:\\s[^"]*)?"`);
  return starts(m).filter((s) => has.test(s[2]) && (!t || s[1].toLowerCase() === t)).map((s) => {
    const a = s.index + s[0].length, empty = VOID.test(s[1]) || s[0].endsWith('/>'), b = empty ? a : a + inner(m, a, s[1]).length;
    return { tag: s[1].toLowerCase(), attrs: s[2], start: s.index, a, b, end: b + (/^<\/[a-z][a-z0-9]*\s*>/i.exec(m.slice(b, b + 24)) || [''])[0].length };
  });
};
// a whole start tag, quotes respected, so a ">" inside an attribute value does not cut it short
const tagAt = (m, i) => /^<[a-z][a-z0-9]*\b(?:"[^"]*"|'[^']*'|[^'">])*>/i.exec(m.slice(i, i + 4000))?.[0] ?? '';
// text for a label: tags gone, entities left as they are, so the result is still valid html
const plain = (s) => s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const escText = (s) => s.replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escAttr = (s) => escText(s).replace(/"/g, '&quot;');
const applyEdits = (s, edits) => { for (const e of [...edits].sort((x, y) => y.a - x.a)) s = s.slice(0, e.a) + e.s + s.slice(e.b); return s; };

// ---- the rail, the map and the reading minutes of one page. Returns the new text and what it did.
// fresh: a page just spliced from the template, so its rail holds only the template's sample labels. map: add an ol.map when there is none.
// An error names `name` and counts lines from `skip` lines down, so a body file is blamed at its own line numbers, not the assembled page's.
function renew(raw, { fresh, map, name, skip = 0 }) {
  const m = mask(raw), edits = [], log = [], notes = [];
  const htmlAttrs = (/<html\b([^>]*)>/i.exec(m) || [])[1] || '';
  const lang = (attr(htmlAttrs, 'lang') || '').trim(), type = (attr(htmlAttrs, 'data-type') || 'explainer').trim();
  const ja = /^ja(-|$)/i.test(lang), size = ja ? chars : words, RATE = ja ? 500 : 200, unit = ja ? 'characters' : 'words'; // reading speed per minute, in `unit`
  const ballot = type === 'gather' && /data-mode="ballot"/.test(htmlAttrs);
  const eol = raw.includes('\r\n') ? '\r\n' : '\n';
  const text = (a, b) => cleaned(raw.slice(a, b));
  const minutesOf = (w) => Math.max(1, Math.ceil(w / RATE));

  // chapters: each <section class="chapter" id="..."> as check.mjs finds it, in order
  const chapters = [];
  if (!ballot) {
    const known = new Map([...m.matchAll(CHAPTER)].map((x) => [x.index, x]));
    for (const t of m.matchAll(/<section\b(?:"[^"]*"|'[^']*'|[^'">])*>/gi)) {
      if (!(attr(t[0], 'class') || '').split(/\s+/).includes('chapter')) continue;
      const x = known.get(t.index), at = `${name} line ${raw.slice(0, t.index).split('\n').length - skip}`;
      if (!x) {
        if (!(attr(t[0], 'id') || '').trim()) die(`a chapter without an id (${at}); write <section class="chapter" id="...">`);
        die(`a chapter that check.mjs would not count (${at}); write it <section class="chapter" id="..."> with the class first and nothing else in it`);
      }
      const a = x.index + x[0].length, b = a + inner(m, a, 'section').length, h = /<h2\b[^>]*>/i.exec(m.slice(a, b));
      if (!h) die(`chapter #${x[1]} (${at}) has no h2`);
      const ha = a + h.index + h[0].length, label = plain(text(ha, ha + inner(m, ha, 'h2').length));
      if (!label) die(`chapter #${x[1]} (${at}) has an empty h2`);
      chapters.push({ id: x[1], a, b, tag: t[0], h2: label });
    }
  }

  // reading path per chapter, then the glance (the checker adds a glance's words to the page total, never to a chapter's)
  const noSvg = (s) => s.replace(/<svg[\s\S]*?<\/svg>/g, '');
  let total = 0;
  for (const c of chapters) { const body = text(c.a, c.b); c.w = size(noSvg(unfold(type === 'field-guide' ? cutIndex(body) : body))); total += c.w; }
  for (const g of elems(m, 'glance', 'section')) total += size(noSvg(unfold(text(g.a, g.b))));
  const pageMinutes = minutesOf(total);

  // ---- rail
  const nav = elems(m, 'rail', 'nav')[0], recap = elems(m, 'recap', 'section').find((e) => (attr(e.attrs, 'id') || '').trim());
  if (ballot) log.push('rail: none (a ballot has no rail)');
  else if (!nav) notes.push('the page has no nav.rail, so no rail was built');
  else {
    const ol = /<ol\b[^>]*>/i.exec(m.slice(nav.a, nav.b));
    if (!ol) notes.push('nav.rail has no ol, so no rail was built');
    else {
      const olStart = nav.a + ol.index, a = olStart + ol[0].length, b = a + inner(m, a, 'ol').length, old = new Map();
      if (!fresh) for (const li of raw.slice(a, b).matchAll(/<li\b[^>]*>\s*<a\b[^>]*\shref="#([^"]+)"[^>]*>([\s\S]*?)<\/a>\s*<\/li>/g)) old.set(li[1], li[2].replace(/<span class="dot"><\/span>/, '').trim());
      const items = chapters.map((c) => ({ id: c.id, label: attr(c.tag, 'data-rail') || old.get(c.id) || c.h2 }));
      if (recap) {
        const id = attr(recap.attrs, 'id').trim(), h2 = /<h2\b[^>]*>/i.exec(m.slice(recap.a, recap.b)), ha = h2 && recap.a + h2.index + h2[0].length;
        items.push({ id, label: attr(tagAt(m, recap.start), 'data-rail') || old.get(id) || (h2 && plain(text(ha, ha + inner(m, ha, 'h2').length))) || (ja ? 'まとめ' : 'Recap') });
      }
      const lead = raw.slice(raw.lastIndexOf('\n', olStart) + 1, olStart), olIndent = /^[ \t]*$/.test(lead) ? lead : '    ';
      const liIndent = (/\n([ \t]*)<li\b/.exec(raw.slice(a, b)) || [, olIndent + '  '])[1];
      const list = eol + items.map((i) => `${liIndent}<li><a href="#${i.id}"><span class="dot"></span>${i.label}</a></li>`).join(eol) + eol + olIndent;
      const same = list === raw.slice(a, b);
      if (!same) edits.push({ a, b, s: list });
      log.push(`rail: ${chapters.length} chapters${recap ? ' + recap' : ''}, ${same ? 'list already right' : 'list rebuilt'}`);
    }
  }

  // ---- map: one line per chapter, from data-line, else data-keep. Only a fresh assembly makes one; --refresh leaves it alone.
  if (ballot) log.push('map: none (a ballot has no chapter map)');
  else if (!map) log.push('map: left alone');
  else if (elems(m, 'map', 'ol').length) log.push('map: kept (the body has its own)');
  else if (MAP_OPTIONAL.includes(type)) log.push(`map: none (types.md makes it optional in a ${type}; write an ol.map in the body to have one)`);
  else if (!chapters.length) notes.push('no chapters, so no map was made');
  else {
    const glance = elems(m, 'glance', 'section')[0], keep = elems(m, 'keep', 'div')[0], after = glance || keep || elems(m, 'answer', 'p')[0];
    if (!after) notes.push('no section.glance, div.keep or p.answer to put the map after, so no map was made');
    else {
      const ind = ((raw.slice(raw.lastIndexOf('\n', after.start) + 1, after.start)).match(/^[ \t]*$/) || ['    '])[0];
      const lines = chapters.map((c) => {
        const line = attr(c.tag, 'data-line') || attr(c.tag, 'data-keep');
        if (!line) notes.push(`chapter #${c.id} has neither data-line nor data-keep, so its map entry has no line`);
        return `${ind}  <li><a href="#${c.id}"><b>${c.h2}</b>${line ? `<span>${line}</span>` : ''}</a></li>`;
      });
      edits.push({ a: after.end, b: after.end, s: `${eol}${eol}${ind}<ol class="map">${eol}${lines.join(eol)}${eol}${ind}</ol>` });
      log.push(`map: generated, ${chapters.length} entries after the ${glance ? 'glance' : keep ? 'keep box' : 'answer bar'}`);
    }
  }

  // ---- reading minutes: every chapter kicker, then the meta
  if (ballot) log.push('minutes: none (a ballot has no chapters)');
  else {
    // "Chapter 2 of 6, about 1 minute" (plural above 1) and 「第2章 / 全6章、約1分」; "Reading time about 5 minutes" and 「約5分で読めます」
    const KICKER = ja ? /第\s*(\d+)\s*章\s*[\/／]\s*全\s*(\d+)\s*章\s*[、,，]\s*約\s*(\d+)\s*分/ : /Chapter\s+(\d+)\s+of\s+(\d+),\s+about\s+(\d+)\s+minutes?/i;
    const kickerText = (n, of, t) => ja ? `第${n}章 / 全${of}章、約${t}分` : `Chapter ${n} of ${of}, about ${t} minute${t === 1 ? '' : 's'}`;
    const META = ja ? /約\s*(\d+)\s*分で読めます/ : /Reading time about\s+(\d+)\s+minutes?/i;
    const metaText = (t) => ja ? `約${t}分で読めます` : `Reading time about ${t} minute${t === 1 ? '' : 's'}`;
    const kickers = elems(m, 'kicker'), changed = [];
    chapters.forEach((c, i) => {
      const k = kickers.find((e) => e.start >= c.a && e.start < c.b);
      if (!k) return notes.push(`chapter #${c.id} has no kicker, left alone`);
      const inside = raw.slice(k.a, k.b), hit = KICKER.exec(inside);
      if (!hit) return notes.push(`chapter #${c.id}: the kicker has no reading time ("${strip(inside).slice(0, 40)}"), left alone`);
      const t = minutesOf(c.w), next = kickerText(i + 1, chapters.length, t);
      if (next === hit[0]) return;
      const parts = [];
      if (+hit[1] !== i + 1 || +hit[2] !== chapters.length) parts.push(`chapter ${hit[1]} of ${hit[2]} to ${i + 1} of ${chapters.length}`);
      if (+hit[3] !== t) parts.push(`${hit[3]} to ${t} min`);
      changed.push(`#${c.id} ${parts.join(', ') || 'wording'}`);
      edits.push({ a: k.a + hit.index, b: k.a + hit.index + hit[0].length, s: next });
    });
    const meta = elems(m, 'meta', 'div')[0], hit = meta && META.exec(raw.slice(meta.a, meta.b));
    if (!hit) notes.push(`no reading time in div.meta (${meta ? `"${strip(raw.slice(meta.a, meta.b)).slice(0, 40)}"` : 'there is no div.meta'}), left alone`);
    else if (metaText(pageMinutes) !== hit[0]) {
      changed.push(`meta ${hit[1]} to ${pageMinutes} min`);
      edits.push({ a: meta.a + hit.index, b: meta.a + hit.index + hit[0].length, s: metaText(pageMinutes) });
    }
    log.push(`minutes: ${total} ${unit} on the reading path = about ${pageMinutes}; ` + (changed.length ? `changed ${changed.join('; ')}` : 'every kicker and the meta already right'));
  }
  return { html: applyEdits(raw, edits), log, notes };
}

// ---- assemble: the template with the body spliced in
function assemble(bodyFile, outFile, o) {
  const lang = o.lang || 'en', type = o.mode === 'ballot' ? 'gather' : (o.type || 'explainer');
  const body0 = read(bodyFile).replace(/\r\n?/g, '\n'), bm = mask(body0);
  for (const [re, what] of [[/<html\b/i, '<html>'], [/<body\b/i, '<body>'], [/<main\b/i, '<main>'], [/<nav\b[^>]*\sclass="[^"]*\brail\b/i, 'the nav.rail'], [/\sclass="(?:[^"]*\s)?focus-nav\b/i, 'the focus-nav']])
    if (re.test(bm)) die(`${bodyFile} holds ${what}; it is a fragment, what goes inside <main> after the template's focus-nav (the script adds the rest)`);
  const h1 = /<h1\b[^>]*>/i.exec(bm);
  if (!h1) die(`${bodyFile} has no <h1>; start the body with the kicker and the h1`);
  const h1a = h1.index + h1[0].length, h1Text = plain(cleaned(body0.slice(h1a, h1a + inner(bm, h1a, 'h1').length)));
  const answer = elems(bm, 'answer', 'p')[0], answerText = answer && plain(cleaned(body0.slice(answer.a, answer.b)));
  const title = o.title ? escText(o.title.trim()) : h1Text, desc = o.description ? escAttr(o.description.trim()) : answerText && answerText.replace(/"/g, '&quot;');
  if (!title) die(`the h1 in ${bodyFile} is empty and --title was not given`);

  const T = read(TEMPLATE).replace(/\r\n?/g, '\n'), tm = mask(T);
  const pick = (re, what) => re.exec(tm) || die(`the template has no ${what}`);
  const htmlTag = pick(/<html\b[^>]*>/i, '<html>'), titleEl = pick(/<title>[\s\S]*?<\/title>/i, '<title>'), descEl = pick(/<meta\s+name="description"[^>]*>/i, 'meta description');
  const bodyIdx = pick(/<body\b/i, '<body>').index, mainOpen = pick(/<main\b[^>]*>/i, '<main>'), mainClose = tm.indexOf('</main>'), focus = elems(tm, 'focus-nav', 'div')[0];
  if (mainClose < 0 || !focus) die('the template has no </main> or no focus-nav');

  // head: html attributes, title, description; the two comments that tell the author what to set are done their job
  let head = applyEdits(T.slice(0, bodyIdx), [
    { a: htmlTag.index, b: htmlTag.index + htmlTag[0].length, s: `<html lang="${lang}" data-type="${type}"${o.mode === 'ballot' ? ' data-mode="ballot"' : ''}>` },
    { a: titleEl.index, b: titleEl.index + titleEl[0].length, s: `<title>${title}</title>` },
    ...(desc ? [{ a: descEl.index, b: descEl.index + descEl[0].length, s: `<meta name="description" content="${desc}">` }] : []),
  ]).replace(/<!-- (?:PAGE|TITLE):[^\n]*-->\n/g, '');

  // shell: skip link, rail, and (outside a ballot) the focus-nav. The template's RAIL and FOCUS NAV comments go; a ballot has no rail and no focus-nav.
  const cut = o.mode === 'ballot' ? mainOpen.index + mainOpen[0].length : focus.end, notes = [];
  let shell = T.slice(bodyIdx, cut).replace(/[ \t]*<!-- RAIL:[\s\S]*?-->\n/, '').replace(/[ \t]*<!-- FOCUS NAV:[\s\S]*?-->\n/, '');
  if (o.mode === 'ballot') shell = shell.replace(/[ \t]*<nav class="rail"[\s\S]*?<\/nav>\n\n?/, '');
  if (lang === 'ja') {
    let ui; try { ui = JSON.parse(read(UI_JA)); } catch (e) { die(`${UI_JA} is not valid JSON: ${e.message}`); }
    const tr = (s) => { const k = s.trim(); if (ui[k] !== undefined) return ui[k]; notes.push(`ui.ja.json has no Japanese for "${k}", left in English`); return k; };
    shell = shell.replace(/(<a class="skip"[^>]*>)([^<]*)(<\/a>)/, (all, a, t, z) => a + tr(t) + z)
      .replace(/(<nav class="rail" aria-label=")([^"]*)(")/, (all, a, t, z) => a + tr(t) + z)
      .replace(/(<button\b[^>]*>)([^<]*)(<\/button>)/g, (all, a, t, z) => a + tr(t) + z);
  }
  const lead = (/^(?:[ \t]*\n)+/.exec(body0) || [''])[0], body = body0.slice(lead.length).replace(/\s+$/, ''), front = head + shell + '\n';
  const newlines = (s) => s.split('\n').length - 1;
  const page = renew(front + body + '\n  ' + T.slice(mainClose), { fresh: true, map: true, name: bodyFile, skip: newlines(front) - newlines(lead) });

  mkdirSync(dirname(resolve(outFile)), { recursive: true });
  writeFileSync(outFile, page.html);
  console.log(`assemble: ${outFile} (${Math.round(Buffer.byteLength(page.html) / 1024)} KB) from the template and ${bodyFile}`);
  console.log(`html: lang="${lang}" data-type="${type}"${o.mode === 'ballot' ? ' data-mode="ballot"' : ''}`);
  console.log(`title: ${title}${o.title ? '' : ' (from the h1)'}`);
  console.log(desc ? `description: ${o.description ? 'from --description' : 'from p.answer'}` : 'description: the template\'s sample text stays (no --description and no p.answer)');
  for (const l of page.log) console.log(l);
  for (const n of [...notes, ...page.notes]) console.log(`note: ${n}`);
}

// ---- refresh: the rail list and the reading minutes of a finished page, in place
function refresh(file) {
  const raw = read(file), page = renew(raw, { fresh: false, map: false, name: file });
  if (page.html !== raw) writeFileSync(file, page.html);
  console.log(`refresh: ${file} ${page.html === raw ? 'unchanged' : 'rewritten'}`);
  for (const l of page.log) console.log(l);
  for (const n of page.notes) console.log(`note: ${n}`);
}

// ---- command line
const argv = process.argv.slice(2), flags = {}, args = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i], f = /^--([a-z]+)(?:=([\s\S]*))?$/.exec(a);
  if (!f) { args.push(a); continue; }
  if (f[1] === 'refresh') flags.refresh = true;
  else if (f[1] === 'help') { console.log(USAGE); process.exit(0); }
  else if (['type', 'lang', 'mode', 'title', 'description'].includes(f[1])) {
    const v = f[2] ?? argv[++i];
    if (v === undefined) usage(`--${f[1]} needs a value`);
    flags[f[1]] = v;
  } else usage(`unknown option --${f[1]}`);
}
if (flags.refresh) {
  if (args.length !== 1 || Object.keys(flags).length !== 1) usage('--refresh takes one page and no other option');
  refresh(args[0]);
} else {
  if (args.length !== 2) usage();
  if (flags.lang !== undefined && !['en', 'ja'].includes(flags.lang)) usage(`--lang is en or ja, not "${flags.lang}"`);
  if (flags.mode !== undefined && flags.mode !== 'ballot') usage(`--mode is ballot, not "${flags.mode}"`);
  if (flags.type !== undefined && !TYPES.includes(flags.type)) usage(`--type "${flags.type}" is not a page type; use one of ${TYPES.join(', ')}`);
  if (flags.mode === 'ballot' && flags.type !== undefined && flags.type !== 'gather') usage('--mode ballot goes with --type gather');
  if (flags.type === undefined && flags.mode === undefined) usage('--type is needed');
  if (resolve(args[0]) === resolve(args[1])) usage('the output file is the body file; choose another name');
  assemble(args[0], args[1], flags);
}
