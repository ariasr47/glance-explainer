# Plan: a `ballot` mode for explainer-gather

Date 2026-10-12. Status: plan only, nothing built. Written for an agent with no context.

## Why

On 2026-10-12 a session built a decision ballot by hand: 11 open rulings on one page, each a card with a picture per option. The owner decided all 11 in a few minutes and pasted the result back into chat. That page is the reference, and it is private: `C:\Users\rodri\OneDrive\Desktop\court-decisions.html` on Rodrigo's machine. Read it, but never copy it or its content into this public repository.

The plugin cannot make that page today:

- The `decision` type explains choices, but the reader still types the answer into chat.
- The `gather` modes collect answers, but options are plain radio rows with no pictures, nothing marks a recommended option, and a skipped question has no default.
- The copy bar stays hidden until the first answer, and it sits at the same weight as two other buttons. The one usability miss in the reference was "Copy picks was hard to find".
- `check.mjs` fails the reference 12 times (exit 1). Six failures are the explainer spine: answer, keep box, recap, chapters and rail, plus a missing `color-scheme` meta. Four are decorative SVGs without `<title>`, and two are glyph rules for components the page does not use.

## What a ballot is

A gather mode for one respondent, the owner, handing decisions back to the agent. Each open decision is a card. The reader compares pictured options, taps one, and copies all picks in one action. A skipped card means the recommended option.

## Contract (all names final)

**Page identity:** `<html lang="en" data-type="gather" data-mode="ballot">`.

**Opening:** `.kicker`, `h1`, then `p.answer` with the count of decisions and the skip rule, for example "11 decisions. Anything you skip goes with ★." Then `ol.ballot-steps` with three steps, the third showing the exact Copy picks button.

**Groups:** `section.ballot-group > h2` plus one line under it. The order is weight: "Shapes the build", "Small calls", then optionally "Already decided", which holds `.ballot-done` cards for reference only.

**Card:**

```html
<article class="ballot-card" id="card-q3" data-q="q3">
  <header><span class="num">3</span><h3 id="q-q3">What does sealing a month do?</h3>
    <p class="why">One line on why it matters.</p><span class="state">Not picked</span></header>
  <div class="ballot-opts" role="radiogroup" aria-labelledby="q-q3">
    <button type="button" class="ballot-opt" role="radio" aria-checked="false" data-k="A">
      <span class="vis" aria-hidden="true"><!-- mini mockup or <img>, never text alone --></span>
      <span class="name"><b>A</b> Ceremony only</span>
      <span class="effect">One line on what happens.</span>
    </button>
    <!-- B, C: exactly one option carries data-rec -->
  </div>
  <p class="skip"><b>If you skip this:</b> B, the ★ option.</p>
</article>
```

- Each `.ballot-card` also takes `data-short="Sealing a month"`, the short topic used in the copy text and the jump dots.
- A multi-select card adds `data-kind="multi"`. It uses `button.ballot-ship[aria-pressed]` toggles plus a "Ship none" button.

**Tray:** `.ballot-tray`, pinned to the bottom of the screen and always visible from first load. It holds:

- the tally "N of M picked"
- `ol.ballot-pips`, one link per card that scrolls to it and flashes it
- `button[data-copy]` as the only primary button, labelled "Copy picks"
- a status line with `aria-live="polite"`
- a save-status label
- a hidden fallback textarea for when the clipboard is blocked

The tray replaces `.collect` on ballot pages. Keep `button[data-json]` as a quiet secondary button, so `merge.html` still reads ballot copies.

**Copy format:** made for pasting into chat, one line per pick.

```
<page title>: my picks (N of M)
3B Allow edits, flag them · Sealing a month
11 Runes: ship A, B
Not picked (use ★): 7
```

The JSON copy reuses the template's existing `pack()` shape, with `kind: "choice"` and the option name as the answer, so `assets/merge.html` keeps working unchanged.

**Saving:**

- **Standalone:** `localStorage`, under the template's existing key scheme.
- **Inside a claude.ai artifact:** when `window.claude?.use('db')` resolves, write `picks/<data-q>` = `{ choice, at }` and listen with `onSnapshot`, so the agent reads the picks without a paste. Load the `artifact-capabilities` skill before writing this code. The reference page's script shows a working version.
- The save label reads "Saved for Claude", "Saved in this browser" or "Not saved; Copy picks still works".

## Steps

1. **Design first.** This is a new user-facing surface. Build `docs/examples/ballot.html` with neutral content: 4 cards, 2 or 3 options each, one multi-select card and one "Already decided" card, using the plugin's own tokens. Render it at 1280 dark and 390 light, and put it in front of Rodrigo before step 2.
2. **Template** (`assets/template.html`, mirrored in `assets/gallery.html` per `AGENTS.md`):
   - Add the ballot CSS: cards, the options grid aligned with `subgrid`, a picked ring and badge, unpicked options faded to about 72 %, the pinned tray, jump dots at least 44 px tall (the reference's 27 px were too small) and the copy fallback.
   - Add the ballot script, run only when `data-mode="ballot"`. It handles picking, arrow keys within a radiogroup, the tally, the jump dots, the copy text, the fallback, saving and the optional artifact database.
   - Add a ballot section to the gallery.
   - On a phone, keep options side by side when there are two; three or more stack.
3. **Interface strings:** add to the template's `T` table and to `assets/i18n/ui.ja.json`: "Copy picks", "Copied", "{n} of {m} picked", "Not picked", "Your pick: {k}", "If you skip this:", "Not picked (use ★)", "Saved for Claude", "Saved in this browser", "Ship this", "Ship none".
4. **Checker** (`scripts/check.mjs`): when `data-mode="ballot"`, skip the keep, chapter, recap and rail rules, and require instead:
   - every `.ballot-opt` has a non-empty `.vis`
   - exactly one `[data-rec]` per card, except multi-select cards
   - a `p.skip` in every card
   - a unique `data-q` and a `data-short` on every card
   - exactly one `.ballot-tray` holding `button[data-copy]`
   - the answer bar rule still applies

   Note: the tray is pinned with `position: fixed`, so the "visible from the first screen" rule holds by construction. Check the CSS once; it needs no script.
5. **Skill text:** add `ballot` to `skills/explainer-gather/modes.md`, and a short section to `skills/explainer-gather/SKILL.md`: when to use it (an agent needs rulings back from the owner), the card rule that every option gets a picture, and delivery (tell the owner to press Copy picks and paste, or that the agent reads the artifact database).
6. **Release:** bump to 1.2.0 in `.claude-plugin/plugin.json` and the README, merge, tag `v1.2.0`, then run `claude plugin update html-explainer@html-explainer-skill`.

## Verification (record the evidence in the PR)

- `node scripts/check.mjs docs/examples/ballot.html` passes, and the template and gallery still pass.
- In Chrome at 390 and 1280, light and dark:
  - no sideways scroll
  - the tray is visible on the first screen
  - picking updates the state chip, the tally, a jump dot and the status line
  - Copy picks produces the exact format above
  - with the clipboard blocked, the fallback opens with the text selected
- Paste one ballot's JSON copy into `assets/merge.html`: one copy, one question per card.
- Write one ballot from a real backlog in another repository and record how long the owner takes to decide.

## Out of scope

- Many-respondent ballots, where `choose` mode remains the tool.
- A reason box per card. The reference ballot had none, and the owner did not miss it.
- Publishing the reference page anywhere.
