/* html-explainer atlas add-on, v1.1. Zero dependencies, atlas pages only.
   Load after the template script:  <script src="atlas.js" defer></script>

   Markup (names are final)
   Map     <figure class="figure sysmap" data-layers="Clients, Process, Storage"><svg role="group" ..>
           nodes <g data-node="api" data-layer="Process">shape and label</g>,
           edges <g data-edge="web>api">line, arrowhead, <text class="d-text-s">label</text></g> </svg>
           <div class="node-detail" data-node="api"><p><b>API routes.</b> One line, with file anchors.</p></div> ..
           <figcaption class="take">..</figcaption></figure>
           Select a node (click, Enter): it gets is-selected, its edges and neighbours is-lit, the rest dims, its
           .node-detail shows under the map. Escape or a second click clears. Other states: d-dormant, d-target on
           the shape. The svg is boxed in a well that scrolls sideways on a phone (a div.map-scroll, added for you).
           Detail: the bold lead of its first <p> becomes the title, and every a.anchor in it moves up beside the
           title as a pill; the sentence keeps its words. A short line under the map says "Pick a part" until one is chosen.
   Layers  data-layer="Clients" on a node (any label, shown as written) adds a chip row above the map: "All 10",
           "Clients 2", .. data-layers on the figure fixes the chip order; without it, the order of first use.
           A chip dims the parts outside its layer. Search dims them too: a part stays lit only when it passes
           the layer and, if the query names any part, the query. Nodes without a layer count under All only.
   Key     a .legend directly before the figure moves under the map box; one inside the figure stays where it is.
   Source  <a class="inspect" href="#src-up" data-src="app/up.py" data-line="12">Inspect implementation</a>
           <script type="text/plain" id="src-up" data-src="app/up.py">the whole file, from line 1</script>
           (write </script in a snippet as <\/script)
   Journey <ol class="journey"><li><b>Added</b><span>A user uploads a file</span><p>One fact.</p>
           <ul class="anchors"><li><a class="anchor inspect" ..>file.py:12</a></li></ul></li>..</ol>
           A horizontal strip of cards that scrolls sideways inside its own box; li.here gets the ring.
   Trace   <ol class="trace" id="upload" data-lanes="browser,api,db"><li data-lane="api">One-line label</li>..</ol>
   Matrix  <table class="matrix"><caption>..</caption>.. <td class="go|wait|stop">..</td></table>
   Search  <input type="search" class="atlas-search" aria-label="Search"> in the rail's .tools moves above the first
           map, where the layer chips are. Put it in a <div class="atlas-tool"> yourself and it stays there. It finds
           headings, rail labels, glossary terms and map nodes first, then any paragraph, list item, table cell or caption
   Link    #<chapter-id>/<node-or-trace-id>, written on select and restored on load. The chapter is the nearest
           section with an id: a chapter, or the glance (section.glance gets id="glance" if it has none). */
(() => {
  'use strict';
  const d = document, body = d.body;
  const ja = /^ja/i.test(d.documentElement.lang);
  const S = ja ? {
    close: '閉じる', none: '一致なし', hits: n => n + ' 件',
    layer: 'レイヤー', layers: 'レイヤーで図を絞り込む', all: 'すべて', shown: (n, t) => t + ' 件中 ' + n + ' 件', nopart: '一致する部品なし',
    pick: '図の部品を選ぶと、説明とソースの場所が出ます。', selected: '選択中',
    map: '構成図。狭い画面では横にスクロールします', steps: '手順。狭い画面では横にスクロールします',
  } : {
    close: 'Close', none: 'No match', hits: n => n + (n === 1 ? ' match' : ' matches'),
    layer: 'Layer', layers: 'Filter the map by layer', all: 'All', shown: (n, t) => n + ' of ' + t + ' parts', nopart: 'No part matches',
    pick: 'Pick a part on the map to see its one line and where it lives in the source.', selected: 'Selected',
    map: 'System map, scrolls sideways on a narrow screen', steps: 'The steps, scrolls sideways on a narrow screen',
  };
  const all = (sel, from = d) => [...from.querySelectorAll(sel)];
  const chap = el => el.closest('section[id]');
  const text = el => el.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
  const make = (tag, cls, txt) => { const e = d.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; };
  const nodes = [], traces = [], maps = [];
  let current = null, dlg, pre, opener;
  const box = d.querySelector('input.atlas-search');

  all('section.glance:not([id])').forEach((s, i) => { s.id = i ? 'glance-' + (i + 1) : 'glance'; });  // a node link needs a section to name

  /* ---------- permalinks and jumping ---------- */
  function write(el, id) {
    const c = chap(el);
    if (c) try { history.replaceState(null, '', '#' + encodeURIComponent(c.id) + (id ? '/' + encodeURIComponent(id) : '')); } catch (e) {}
  }
  function reveal(el, block, focus) {
    for (let f = el.closest('details'); f; f = f.parentElement.closest('details')) f.open = true;
    const c = chap(el);
    const link = c && body.dataset.focus === 'on' && d.querySelector(`.rail a[href="#${c.id}"]`);
    if (link) link.click();  // one-chapter mode: let the template switch
    el.scrollIntoView({ block });
    if (focus) { if (!el.hasAttribute('tabindex')) el.tabIndex = -1; el.focus({ preventScroll: true }); }
  }
  function restore() {
    let m = /^#([^/]+)\/(.+)$/.exec(location.hash);
    if (!m) return;
    try { m = m.slice(1).map(decodeURIComponent); } catch (e) { return; }
    const hit = [...nodes, ...traces].find(o => o.id === m[1] && chap(o.el)?.id === m[0]);
    if (!hit) return;
    select(hit);
    requestAnimationFrame(() => reveal(hit.el, hit.node ? 'center' : 'start'));
  }

  /* ---------- selection: one node or one trace at a time ---------- */
  function clear() {
    all('.is-selected, .is-lit').forEach(el => el.classList.remove('is-selected', 'is-lit'));
    nodes.forEach(n => n.el.setAttribute('aria-pressed', 'false'));
    all('.node-detail').forEach(x => { x.hidden = true; });
    maps.forEach(m => { if (m.hint) m.hint.hidden = false; });
    current = null;
  }
  function select(o) {
    clear(); current = o;
    o.el.classList.add('is-selected');
    if (o.node) {  // light edges and neighbours, show detail
      const svg = o.el.closest('svg'), fig = svg.closest('.sysmap'), lit = new Set();
      o.el.setAttribute('aria-pressed', 'true');
      all('[data-edge]', svg).forEach(e => {
        const [a, b = ''] = e.dataset.edge.split('>').map(s => s.trim());
        if (a === o.id || b === o.id) { e.classList.add('is-lit'); lit.add(a === o.id ? b : a); }
      });
      all('[data-node]', svg).forEach(n => { if (n !== o.el && lit.has(n.dataset.node)) n.classList.add('is-lit'); });
      all('.node-detail', fig.querySelector('.node-detail') ? fig : chap(fig) || d).forEach(x => { x.hidden = x.dataset.node !== o.id; });
      if (o.map?.hint) o.map.hint.hidden = true;
    }
    if (o.id) write(o.el, o.id);
  }
  function toggle(o) {
    if (current !== o) return select(o);
    clear(); write(o.el, '');
  }

  /* ---------- system maps ---------- */
  const edgeEnds = e => e.dataset.edge.split('>').map(s => s.trim());
  // The title and the file anchors of a detail sit in one head row; the sentence keeps its words.
  function head(x) {
    if (x.querySelector('.node-head')) return;
    const p = x.querySelector('p'), row = make('div', 'node-head'), pills = make('div', 'node-pills'), seen = new Set();
    const first = p && [...p.childNodes].find(n => n.nodeType !== 3 || n.textContent.trim());
    let moved = false;
    row.append(make('span', 'node-state', S.selected));
    if (first && first.nodeType === 1 && first.matches('b, strong')) {
      row.append(make('b', '', first.textContent.replace(/[.。:：]\s*$/, '')));
      first.remove(); moved = true;
    }
    all('a.anchor', x).forEach(a => {
      const key = a.dataset.src + ':' + a.dataset.line;
      if (!seen.has(key) && a.getAttribute('href')) {
        const c = make('a', 'anchor inspect', (a.dataset.src || '') + (a.dataset.line ? ':' + a.dataset.line : ''));
        c.setAttribute('href', a.getAttribute('href')); c.title = a.title;
        if (a.dataset.src) c.dataset.src = a.dataset.src;
        if (a.dataset.line) c.dataset.line = a.dataset.line;
        pills.append(c); seen.add(key);
      }
      const wrap = a.parentElement.matches('.pill-tail') ? a.parentElement : null;
      a.remove(); moved = true;
      if (wrap) wrap.replaceWith(...wrap.childNodes);
    });
    if (p && moved) {  // close the gap a moved word or anchor leaves: "word ." becomes "word."
      p.normalize();
      const walk = d.createTreeWalker(p, NodeFilter.SHOW_TEXT), runs = [];
      while (walk.nextNode()) runs.push(walk.currentNode);
      runs.forEach(n => { if (!n.parentElement.closest('code, pre')) n.textContent = n.textContent.replace(/\s+([.,;:。、])/g, '$1').replace(/ {2,}/g, ' '); });
      if (p.firstChild?.nodeType === 3) p.firstChild.textContent = p.firstChild.textContent.replace(/^\s+/, '');
    }
    if (pills.children.length) row.append(pills);
    x.prepend(row);
  }
  function paint() {  // layer chips and search, together: a part stays lit when it passes both
    const q = box ? box.value.trim().toLowerCase() : '';
    maps.forEach(m => {
      const named = q ? m.nodes.filter(n => n.text.includes(q)).length : 0, on = !!m.layer || named > 0;
      let shown = 0;
      m.nodes.forEach(n => {
        n.vis = (!m.layer || n.layer === m.layer) && (!named || n.text.includes(q));
        if (n.vis) shown++;
        n.el.classList.toggle('is-off', on && !n.vis);
      });
      m.edges.forEach(e => e.el.classList.toggle('is-off', on && !e.ends.some(id => m.byId.get(id)?.vis)));
      if (m.status) m.status.textContent = on ? (shown ? S.shown(shown, m.nodes.length) : S.nopart) : '';
      if (on && m.scroll) {  // on a phone the matching parts may sit off to the side: bring the first one into the box
        const at = m.scroll.getBoundingClientRect(), rows = m.nodes.filter(n => n.vis).map(n => n.el.getBoundingClientRect());
        if (rows.length && !rows.some(r => r.right > at.left && r.left < at.right)) m.scroll.scrollLeft += Math.min(...rows.map(r => r.left)) - at.left - 16;
      }
    });
  }
  function tool(fig) {
    let t = fig.previousElementSibling;
    if (!t || !t.matches('.atlas-tool')) { t = make('div', 'atlas-tool'); fig.before(t); }
    return t;
  }
  function chips(m) {
    const order = (m.fig.dataset.layers || '').split(',').map(s => s.trim()).filter(Boolean);
    const rank = s => order.includes(s) ? order.indexOf(s) : order.length;
    const names = [...new Set(m.nodes.map(n => n.layer).filter(Boolean))].sort((a, b) => rank(a) - rank(b));
    const row = make('div', 'atlas-filters'), buttons = [];
    row.setAttribute('role', 'group'); row.setAttribute('aria-label', S.layers);
    const label = make('span', 'atlas-label', S.layer); label.setAttribute('aria-hidden', 'true');
    row.append(label);
    ['', ...names].forEach(name => {
      const b = make('button'), n = name ? m.nodes.filter(x => x.layer === name).length : m.nodes.length;
      b.type = 'button'; b.append(name || S.all, ' ', make('b', '', String(n)));
      b.addEventListener('click', () => {
        m.layer = name && m.layer !== name ? name : '';
        buttons.forEach(([k, el]) => el.setAttribute('aria-pressed', String(k === m.layer)));
        paint();
      });
      buttons.push([name, b]); row.append(b);
    });
    buttons.forEach(([k, el]) => el.setAttribute('aria-pressed', String(k === '')));
    m.status = make('output', 'atlas-count');
    tool(m.fig).append(row, m.status);
  }
  all('.sysmap').forEach(fig => {
    const svgs = all('svg', fig);
    if (!svgs.length) return;
    const m = { fig, nodes: [], edges: [], byId: new Map(), layer: '', hint: null, status: null, scroll: null };
    let scroll = fig.querySelector('.map-scroll');
    const bare = all(':scope > svg', fig);
    if (!scroll && bare.length === 1 && !bare[0].matches('.narrow')) {  // the box that scrolls sideways on a phone
      scroll = make('div', 'map-scroll'); bare[0].replaceWith(scroll); scroll.append(bare[0]);
    }
    if (scroll) {
      m.scroll = scroll;
      if (!scroll.hasAttribute('tabindex')) scroll.tabIndex = 0;
      if (!scroll.hasAttribute('role')) scroll.setAttribute('role', 'region');
      if (!scroll.hasAttribute('aria-label') && !scroll.hasAttribute('aria-labelledby')) scroll.setAttribute('aria-label', S.map);
      const prev = fig.previousElementSibling;
      if (prev && prev.matches('.legend')) scroll.after(prev);  // the key reads under the map
    }
    svgs.forEach(svg => {
      if (svg.getAttribute('role') === 'img') svg.setAttribute('role', 'group');  // role=img hides the nodes from screen readers
      all('[data-node]', svg).forEach(el => {
        const n = { el, id: el.dataset.node, node: true, map: m, layer: (el.dataset.layer || '').trim(), vis: true };
        n.text = n.id.toLowerCase() + ' ' + text(el);
        el.setAttribute('role', 'button');
        if (!el.hasAttribute('tabindex')) el.tabIndex = 0;
        if (!el.hasAttribute('aria-label') && !el.textContent.trim()) el.setAttribute('aria-label', n.id);
        el.addEventListener('click', () => toggle(n));
        el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(n); } });
        nodes.push(n); m.nodes.push(n); m.byId.set(n.id, n);
      });
      all('[data-edge]', svg).forEach(el => m.edges.push({ el, ends: edgeEnds(el) }));
    });
    const dets = all('.node-detail', fig);
    dets.forEach(head);
    if (dets.length) { m.hint = make('p', 'node-hint', S.pick); dets[dets.length - 1].after(m.hint); }
    if (m.nodes.some(n => n.layer)) chips(m);
    maps.push(m);
  });
  if (box && !box.closest('.atlas-search-wrap')) {  // a field with an icon; one in the rail's tools moves up to the map
    const inTool = box.closest('.atlas-tool'), inRail = maps.length && box.closest('.rail');
    if (inTool || inRail) {
      const from = box.parentElement, wrap = make('div', 'atlas-search-wrap');
      box.replaceWith(wrap); wrap.append(box);
      if (!inTool) {
        tool(maps[0].fig).prepend(wrap);
        if (!from.matches('.tools, .rail') && !from.children.length && !from.textContent.trim()) from.remove();
      }
    }
  }

  /* ---------- journey: a strip of cards that scrolls inside its own box ---------- */
  all('ol.journey').forEach(ol => {
    if (!ol.hasAttribute('tabindex')) ol.tabIndex = 0;
    if (!ol.hasAttribute('aria-label') && !ol.hasAttribute('aria-labelledby')) ol.setAttribute('aria-label', S.steps);
  });

  /* ---------- request traces: one grid column per lane ---------- */
  all('ol.trace').forEach(ol => {
    const lanes = (ol.dataset.lanes || '').split(',').map(s => s.trim()).filter(Boolean);
    const t = { el: ol, id: ol.id }, head = d.createDocumentFragment();
    [...ol.children].forEach((li, i) => {
      li.style.setProperty('--lane', lanes.indexOf(li.dataset.lane) + 1 || 1);
      li.style.setProperty('--step', i + 2);  // row 1 holds the lane heads
      li.tabIndex = 0;
    });
    lanes.forEach((name, k) => {
      const li = d.createElement('li');
      li.className = 'trace-lane'; li.setAttribute('aria-hidden', 'true'); li.textContent = name; li.style.setProperty('--lane', k + 1);
      head.append(li);
    });
    ol.style.setProperty('--lanes', lanes.length || 1);
    ol.prepend(head);
    ol.addEventListener('click', e => { if (!e.target.closest('a, button')) toggle(t); });
    ol.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === ' ') && e.target.parentNode === ol) { e.preventDefault(); toggle(t); }
    });
    traces.push(t);
  });

  /* ---------- matrix: a scroll box keeps the first column in view ---------- */
  all('table.matrix').forEach(tb => {
    const w = d.createElement('div');
    w.className = 'matrix-wrap'; w.tabIndex = 0;
    tb.replaceWith(w); w.append(tb);
  });

  /* ---------- source inspector ---------- */
  function inspect(link) {
    const src = d.getElementById(link.getAttribute('href').slice(1));
    if (!src) return false;
    if (!dlg) {
      dlg = body.appendChild(d.createElement('dialog'));
      dlg.className = 'inspector'; dlg.setAttribute('aria-labelledby', 'inspector-title');
      dlg.innerHTML = `<header><div><b id="inspector-title"></b><small></small></div><form method="dialog"><button>${S.close}</button></form></header><pre tabindex="0"></pre>`;
      pre = dlg.querySelector('pre');
      dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
      dlg.addEventListener('keydown', e => e.stopPropagation());  // keep the page's J K F S D R keys quiet
      dlg.addEventListener('close', () => opener.focus());  // WebKit does not restore focus itself
    }
    opener = link;
    const line = parseInt(link.dataset.line, 10) || 0, rev = d.querySelector('[data-revision]'), rows = d.createDocumentFragment();
    const lines = src.textContent.replace(/<\\\/script/gi, '</script').replace(/^\r?\n|\r?\n$/g, '').split(/\r?\n/);
    lines.forEach((text, i) => {
      const s = d.createElement('span');
      s.dataset.n = i + 1; s.textContent = text;
      if (i + 1 === line) s.setAttribute('aria-current', 'location');
      rows.append(s);
    });
    dlg.querySelector('b').textContent = link.dataset.src + (line ? ':' + line : '');
    dlg.querySelector('small').textContent = rev ? rev.dataset.revision : '';
    pre.replaceChildren(rows);
    pre.style.setProperty('--w', String(lines.length).length);
    if (!dlg.open) dlg.showModal();
    const hit = pre.querySelector('[aria-current]');
    if (hit) hit.scrollIntoView({ block: 'center' }); else pre.scrollTop = 0;
    return true;
  }
  d.addEventListener('click', e => {
    const a = e.target.closest('a.inspect');
    if (a && inspect(a)) e.preventDefault();
  });

  /* ---------- search: headings, rail labels, glossary terms and map nodes first, then the body text ---------- */
  if (box) {
    const out = d.createElement('output'), index = [];
    const add = (el, rank) => { if (!el.closest('.node-detail')) index.push({ el, rank, text: text(el) }); };
    let hits = [];
    (box.closest('.atlas-search-wrap') || box).after(out);
    all('main h2, main h3, main .term dt').forEach(el => add(el, 0));
    all('.rail ol > li > a[href^="#"]').forEach(a => {  // the rail's short labels name a chapter in words its heading may not use
      const c = d.getElementById(a.getAttribute('href').slice(1));
      if (c) index.push({ el: c, rank: 0, text: text(a) });
    });
    nodes.forEach(n => index.push({ el: n.el, node: n, rank: 0, text: n.text }));
    all('main :is(p, li, td, th, dd, figcaption, summary)').forEach(el => add(el, 1));  // "session", "token": words that live only in prose
    index.sort((a, b) => (a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1));
    const run = () => {
      const q = box.value.trim().toLowerCase(), seen = new Set();
      hits = q ? index.filter(it => it.text.includes(q) && (!it.node || !it.node.map.layer || it.node.layer === it.node.map.layer)).sort((a, b) => a.rank - b.rank || a.text.indexOf(q) - b.text.indexOf(q)) : [];
      hits.forEach(h => { const c = chap(h.el); if (c) seen.add(c.id); });
      all('.rail ol > li').forEach(li => {
        const a = li.querySelector('a[href^="#"]');
        li.hidden = !!q && !(a && seen.has(a.getAttribute('href').slice(1)));
      });
      out.textContent = q ? (hits.length ? S.hits(hits.length) : S.none) : '';
      paint();
    };
    box.addEventListener('input', run);
    box.addEventListener('keydown', e => {
      if (e.key === 'Escape') { box.value = ''; run(); }
      if (e.key !== 'Enter' || !hits.length) return;
      e.preventDefault();
      if (hits[0].node) select(hits[0].node);
      reveal(hits[0].el, hits[0].node ? 'center' : 'start', true);
    });
  }

  /* ---------- Escape and the hash ---------- */
  clear();
  d.addEventListener('keydown', e => {
    if (e.key === 'Escape' && current && !dlg?.open && !e.target.matches('input, textarea, select')) toggle(current);
  });
  addEventListener('hashchange', restore);
  restore();
})();
