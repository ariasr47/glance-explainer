# Build spec: the `playbook` page type (html-explainer 1.3.0)

Date 2026-10-13. All names below are final. Where this spec is silent, follow `assets/template.html`, `assets/design-system.md`, `scripts/check.mjs` and `docs/plan/2026-10-13-new-types-build-spec.md`, which set the conventions this follows.

## Why

On 2026-10-13 a session hand-built a "decision playbook": a plan for splitting one web app into two, written for its non-technical owner. It ended by collecting the owner's decisions on the page. Rodrigo rated it highly. Today's types cover pieces of it (`roadmap`, `spec`, `runbook`, the ballot) but not the whole. The plugin's checker fails it 28 times.

The reference page is private, on Rodrigo's machine: `C:\Users\rodri\Downloads\2026-10-13-lockercore-split.html`, with notes in `2026-10-13-lockercore-split.ABOUT.md` next to it. Read both. Never copy their content, product names or wording into this public repository.

**What a playbook is:** a plan for a risky, multi-step change, written for one decision-maker. It shows:

- the whole plan at a glance
- what changes, drawn as before and after
- what the people affected will notice at each phase
- who does what, and the rules that never bend
- the one risky moment, zoomed in, with its undo
- the risks and costs
- the decisions it needs, answerable on the page

## Page contract

`<html lang="en" data-type="playbook">`. The full explainer contract still holds (answer, keep box, chapters, remember lines, recap, rail), with these differences:

- **Up to 10 chapters** (default 7). A playbook has more parts than an explainer.
- **Order:**
  1. answer bar (the thesis in one sentence)
  2. keep box
  3. `.phase-strip`
  4. chapter map (optional; the strip already navigates)
  5. chapters: before and after, then the audience's view, phases, what goes where, roles and rules, the risky moment, risks, costs and decisions
  6. recap

## New components (CSS in the template, mirrored into the gallery, a row each in design-system.md, an example each in the gallery)

**`ol.phase-strip`**: the whole plan in one row; each segment links to its phase.

```html
<ol class="phase-strip">
  <li data-owner="you"><a href="#phase-1"><span class="seg-num">Phase 1</span><b>Decide what it is</b>
    <span class="who" title="You">R</span><small class="effort">a few days</small><span class="bar" style="--effort:2"></span></a></li>
  <li class="notice" data-owner="both"><a href="#phase-5"><span class="seg-num">Phase 5</span><b>Switch day</b>
    <span class="who" title="Both">R+C</span><small class="effort">an hour</small><span class="bar" style="--effort:1"></span>
    <span class="notice-tag">Members notice</span></a></li>
</ol>
```

- **Owner** is shown by the letter badge `.who`, never by colour alone; colour keeps meaning state.
- **Effort:** `--effort` runs from 1 to 5 and sets the bar's width.
- **`li.notice`** marks the phases the audience will notice. It gets a here-tint border and the `.notice-tag` label, which is written in markup.
- **Width:** six or more segments wrap to two rows under 760 px.

**`ol.phases`**: ordered phases, numbered because the order is real.

```html
<ol class="phases">
  <li id="phase-1"><h3>Decide what it is</h3><span class="chip">You decide</span><span class="chip">A few days</span>
    <ul><li>One line per piece of work.</li></ul>
    <p class="impact"><b>Members notice:</b> nothing.</p></li>
</ol>
```

`p.impact` is required on every phase. Its label is markup, so it names the real audience ("Friends notice", "Customers notice").

**`figure.frame`**: a small browser or phone mockup of what the audience sees.

```html
<figure class="frame"><div class="frame-bar"><span class="dots"></span><span class="url">example.com/sign-in</span></div>
  <div class="frame-screen"><!-- plain HTML mockup --></div>
  <figcaption class="take"><b>Take from this:</b> one line.</figcaption></figure>
```

- `figure.frame.phone` is a narrow portrait variant.
- `.frame-row` lays out two to four frames side by side, stacking on a phone.

**`div.roles` with `ul.rules`**: who does what, and the rules that never bend.

```html
<div class="roles">
  <section class="role" data-who="you"><h3><span class="who">R</span> You</h3><ul><li>…</li></ul></section>
  <section class="role" data-who="me"><h3><span class="who">C</span> Me</h3><ul><li>…</li></ul></section>
</div>
<ul class="rules"><li><b>Nothing live without your yes.</b> One line on what that means.</li></ul>
```

**`div.undo`**: the way back from the risky moment. A ↺ glyph, a go tint, and a label in markup: `<div class="undo"><b>If something goes wrong:</b> …</div>`.

**`div.risks` of `article.risk`**:

```html
<div class="risks"><article class="risk" data-level="high"><h3>The old app gets forgotten</h3><span class="level">High</span>
  <p>One line on the risk.</p><p class="kept"><b>Kept small by:</b> one line on the mitigation.</p></article></div>
```

- `data-level` is `high`, `medium` or `low`. The levels map to the stop, wait and go tints, each with its glyph.
- The level word is markup.

**`table.grid` group rows**: `<tr class="group"><th colspan="3" scope="colgroup">Goes to both</th></tr>` starts a group inside a grid. It is styled as a quiet band, and it is not counted as a criterion row by the compare rule.

**The decisions** reuse what exists: one `fieldset.answer-field[data-kind="choice"]` per question, with the `.collect` bar.

- New: `label[data-rec="Recommended"]` on the recommended option shows a ★ chip with the attribute's text (the ballot's convention).
- Add a "My pick" style to the gallery example.

**Hero (optional)**: `header.hero` may hold a `figure.thesis`, a small SVG drawing of the outcome, beside the `h1` at 1100 px and wider and under it on a phone. The usual SVG rules apply (`viewBox`, `title`, phone legibility).

## Checker (`scripts/check.mjs`)

- Add `playbook` to `TYPES`.
- Set `maxChapters` to 10 for `playbook`.
- **REQUIRED:** `phase-strip`, `phases`, `undo` and `risks`.
- **FAIL:**
  - an `ol.phases > li` without a non-empty `p.impact`
  - an `article.risk` without `data-level` (high, medium or low) or without a non-empty `p.kept`
  - an `ol.phase-strip a[href^="#"]` whose target id does not exist
- **Warn:**
  - a playbook with no `.answer-field` ("a playbook usually ends with the decisions it needs")
  - a `.phase-strip` with fewer than 3 segments
- The compare rule's body-row count skips `tr.group`.
- Count the new components as visuals in the `visual` regex: `phase-strip|phases|frame|roles|risks|undo`.

## Skill text

- A `playbook` section in `skills/html-explainer/types.md`, in the existing format.
- Add it to the type list in `skills/html-explainer/SKILL.md` and to `design-system.md`.
- Japanese strings in `assets/i18n/ui.ja.json`:

| English | Japanese |
|---|---|
| Phase | フェーズ |
| If something goes wrong: | うまくいかなかったら： |
| Kept small by: | 抑える方法： |
| High | 高 |
| Medium | 中 |
| Low | 低 |

## Lessons from the reference to honour

- On a phone, the reference's phase lists overflowed by 15 px. Every new component must keep `min-width: 0` and wrap long code.
- Its Copy button sat at the very bottom. Here the decisions use the gather `.collect` bar, which pins itself after the first answer.

## Example and checks (done means)

- **Example page:** `docs/examples/playbook.html`, neutral and public-safe. Moving a small team's wiki to a new host: six phases, two notice phases, a before and after, three audience frames, roles and four rules, a switch-day zoom with undo, four risks, cost tiles and three decisions.
- **Checker:** `node scripts/check.mjs` exits 0 on the template, the gallery and the example. Read the exit code without a pipe.
- **Negative checks:** one per new FAIL rule, recorded once; add no test suite.
- **Chrome:** the example and the gallery at 1280 and 390, light and dark. No sideways scroll and no console errors. Save screenshots to `docs/examples/shots/playbook-*.png`, then look at them.
- **Commits:** conventional commits on the lane's branch, with no AI attribution. No version bump, no merge and no push to main.
