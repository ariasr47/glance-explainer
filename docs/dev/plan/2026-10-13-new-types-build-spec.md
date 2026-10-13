# Build spec: nine page types and the ballot mode (html-explainer 1.2.0)

Date 2026-10-13. This file is the integration contract for two parallel build lanes. Every name below (type, class, attribute, string) is final. Use these names exactly and invent no others. Where this spec is silent, follow the existing conventions in `assets/template.html`, `assets/design-system.md` and `scripts/check.mjs`.

Read first: `AGENTS.md`, `skills/html-explainer/SKILL.md`, `skills/html-explainer/types.md`, `skills/explainer-gather/SKILL.md` and `modes.md`, and `docs/plan/2026-10-12-ballot-mode.md`. That last file is lane A1's full brief.

## Lanes and file ownership

| Lane | Owns | Also edits, in its own clearly marked region only |
|---|---|---|
| **A1 ballot** | The ballot CSS section `12d` and the ballot script block in `assets/template.html`; the "Ballot" section in `assets/gallery.html`; `skills/explainer-gather/*`; `docs/examples/ballot.html` | `scripts/check.mjs`: one block marked `// ---- ballot mode`, plus an `if (!ballot)` guard around the spine rules. `assets/i18n/ui.ja.json`: append ballot strings |
| **A2 types** | CSS sections `9b`, `9c`, `9d`, `9e` and `9f` in `assets/template.html` (after section 9, tiles); the `pre.cmd` copy-button script block; the gallery sections for the new components; `skills/html-explainer/types.md`; the html-explainer `SKILL.md` type list; the design-system rows | `scripts/check.mjs`: the `TYPES` list, the `REQUIRED` map, and one block marked `// ---- new page types (1.2.0)`. `assets/i18n/ui.ja.json`: append its strings |

- Neither lane bumps the version; the integrator sets 1.2.0.
- Mirror every template CSS change into `assets/gallery.html` (rule in `AGENTS.md`).
- Every colour state carries a glyph as well as the colour (WCAG 1.4.1): ✓ for go, ! for wait, ✕ for stop, ? for decide. Copy the `.status li.*::before` pattern.
- Labels live in markup, never in CSS `content`, so `translate.mjs` reaches them. The one exception is a glyph.

## The nine page types (lane A2)

Add each to `TYPES` in `check.mjs` and give each a section in `types.md`, in the existing format (When, Chapter composition, Required components, Checker rules, Example topic). Every type keeps the full explainer contract (answer, keep box, map, chapters, recap) unless it says otherwise.

| `data-type` | Job | Required (FAIL if missing) | Extra rules |
|---|---|---|---|
| `portfolio` | Every project at once: what moves, what is blocked, what waits on the reader | `.status` (one row per project), `.steps` (what waits on you) | warn if `.status` has fewer than 3 rows |
| `public` | Customer-facing: what it does for a person, in plain words | `ul.promises` | FAIL if `section.ask` exists. FAIL for each `ul.promises > li` with no non-empty `data-evidence`. Warn per jargon word in the reading path: API, backend, endpoint, database, server, JSON, OCR, LLM, token, deploy, repo, commit, branch, CI, schema, pipeline (whole words, case-insensitive) |
| `teach` | Teach one system to a newcomer | `dl.term` | warn for each chapter without a `dl.term` or without a `figure.figure` |
| `incident` | What broke, why, what is fixed, what prevents a repeat | `.timeline`, `.flow` (the cause chain), `.status` (follow-ups) | warn if the timeline has fewer than 3 items |
| `pr` | Explain a pull request to its reviewer | `.split`, `.status` (checks run, each naming its exit code), `.tiles` (the diff stat) | none |
| `runbook` | A procedure a person or agent follows step by step | `ol.runbook` | FAIL for each `ol.runbook > li` without both `p.check` and `p.fail` |
| `compare` | Options against criteria | `table.grid` | FAIL if a `table.grid` has fewer than 2 option columns or fewer than 3 body rows |
| `roadmap` | Now, next, later, with dependencies | `.lanes` with exactly three `.lane` | FAIL for each `small.after a[href^="#"]` whose target id does not exist |
| `tour` | A product walkthrough built from real screenshots | `ol.tour` | FAIL for each `ol.tour > li` without an `img` with non-empty `alt`. The size budget is 2048 KB (default 400) |

## New components (lane A2: CSS in the template and gallery, a row in design-system.md, an example in the gallery)

**`table.grid`** (compare and portfolio):

```html
<div class="grid-wrap"><table class="grid">
  <caption>What each provider gives you</caption>
  <thead><tr><th scope="col">Criterion</th><th scope="col" data-rec>Perigon</th><th scope="col">Jina</th></tr></thead>
  <tbody><tr><th scope="row">Finds articles by date</th><td class="go">Yes, any month</td><td class="stop">No</td></tr></tbody>
</table></div>
```

- `td.go`, `.wait`, `.stop` and `.decide` each get a glyph and a tint.
- `th[data-rec]` shows a ★ before its text, through a glyph only.
- On a phone, `.grid-wrap` scrolls sideways and the first column stays sticky.
- A `figcaption.take` or `p.take` follows the table.

**`.lanes`** (roadmap):

```html
<div class="lanes">
  <section class="lane" data-lane="now"><h3>Now</h3><ul>
    <li id="r-checkout" class="go"><b>Checkout holds</b><span>One line on what it delivers.</span><small class="after">After: <a href="#r-crypto">Crypto core</a></small></li>
  </ul></section>
  <section class="lane" data-lane="next"><h3>Next</h3><ul>…</ul></section>
  <section class="lane" data-lane="later"><h3>Later</h3><ul>…</ul></section>
</div>
```

- Three columns, stacked under 760 px.
- Items take the state classes, each with its glyph.
- `small.after` names a dependency and links to it.

**`ol.runbook`**:

```html
<ol class="runbook">
  <li id="rb-1"><b>Tag the release.</b>
    <pre class="cmd"><code>git tag -a v1.2.0 -m "html-explainer 1.2.0"</code></pre>
    <p class="check"><b>Check:</b> <code>git ls-remote --tags origin</code> lists v1.2.0.</p>
    <p class="fail"><b>If it fails:</b> the tag exists already; delete it locally and tag again.</p></li>
</ol>
```

- Numbered like `.steps`.
- `p.check` has a go tint and `p.fail` a stop tint, each with its glyph.
- The template script adds a small Copy button to every `pre.cmd`. It has no JavaScript dependency and the page reads fine without it. Its label comes from the script's `T` table: `copy` "Copy", `copied` "Copied".

**`ol.tour`**:

```html
<ol class="tour">
  <li><figure class="shot"><img src="data:image/webp;base64,…" alt="The vault list with one account picked">
      <span class="pin" style="--x:62%;--y:30%">1</span></figure>
    <h3>Pick an account</h3><p>One line on what the reader sees and why it matters.</p></li>
</ol>
```

- Each `.shot` is `position: relative`, and each `.pin` is a numbered circle placed at `left: var(--x); top: var(--y)`.
- The image is `width: 100%`, with rounded corners and a border.

**`ul.promises`** (public):

```html
<ul class="promises"><li data-evidence="server/app/retention.py:14"><b>Deleted automatically.</b> Your file is removed within 24 hours.</li></ul>
```

- Each item carries a ✓ glyph.
- `data-evidence` holds a file and line or a URL. It is not displayed; a `details.fold` titled "How we know" lists the evidence.

New interface strings for `assets/i18n/ui.ja.json` (lane A2):

| English | Japanese |
|---|---|
| Check: | 確認： |
| If it fails: | 失敗したら： |
| Now | 今 |
| Next | 次 |
| Later | その後 |
| After: | 前提： |
| How we know | 根拠 |
| Criterion | 項目 |

## Ballot mode (lane A1)

Build `docs/plan/2026-10-12-ballot-mode.md` as written, with these integration names:

- The page is `<html data-type="gather" data-mode="ballot">`.
- In `check.mjs`, `const ballot = type === 'gather' && /data-mode="ballot"/.test(htmlAttrs);`. When `ballot` is true, skip the keep, recap, chapter-count, rail and gather `.collect` rules, and apply the ballot rules from the plan.
- The ballot script runs only when `root.dataset.mode === 'ballot'`, and leaves the existing gather `.collect` code alone.

Design first: lane A1 builds `docs/examples/ballot.html` (neutral content, 4 cards) before wiring the gallery.

## Done means (each lane, recorded in its final report)

- `node scripts/check.mjs` exits 0 on `assets/template.html`, `assets/gallery.html` and the lane's new example page; quote the PASS line.
- The gallery, rendered in Chrome at 1280 and 390, light and dark, has no sideways scroll and no console errors. Save screenshots of the new sections in the lane's worktree under `docs/examples/shots/`.
- At least one hand-written negative check per new FAIL rule: write the bad markup, run the checker, quote the FAIL line, then delete the bad file. Record this once; do not add a test suite.
- Commit on the lane's branch with conventional commits and no AI attribution, then report the branch name. Do not merge or push to main.
