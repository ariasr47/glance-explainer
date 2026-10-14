---
name: explainer-gather
description: Use when asked to "ask and collect", gather requirements, write a questionnaire, get answers from coworkers, collect feedback, review and annotate a draft, poll a decision, prioritise items, capture interview notes, pilot a survey, collect reactions to a readout, or get rulings back from the owner on several open decisions (a ballot).
license: MIT
argument-hint: "[topic, and who will answer]"
---

# Explainer gather

An explainer page that also asks questions. The reader learns a little, answers in the page and sends the answers back. Follow the core contract in `../html-explainer/SKILL.md`.

Paths are relative to this file. The template, gallery and checker live in the sibling `html-explainer` skill, so install the three skills together.

## What you produce

One `.html` file with `<html lang="en" data-type="gather">`:

- One `.answer-field` per question, at the end of the chapter that makes it answerable.
- Exactly one `.collect` bar (a ballot has a tray instead; see Ballot mode below).
- Every question is a full sentence the reader can answer without rereading the chapter.
- Every hint says what a good answer contains.

```html
<div class="answer-field" data-q="q1">
  <label for="q1">Which step in approvals costs your team the most time?</label>
  <p class="hint">Name the step and give one example from last month.</p>
  <textarea id="q1" rows="3"></textarea>
</div>
```

Other kinds set `data-kind` on the field: `choice`, `multi`, `scale`, `rank`, `buckets`, `confirm`. Copy their markup and the `.collect` bar from the "Ask and collect" chapter of `../html-explainer/assets/gallery.html`.

## Process

1. Write the questions first. Give each a stable id (`q1`, `q2`) that never changes, even in a translation.
2. Pick a mode from `references/modes.md`. It names the `data-kind` to use.
3. Write the chapters that make each question answerable. Teach only what the answer needs.
4. Build from `../html-explainer/assets/template.html`. Its script autosaves answers, counts them and builds the copies.
5. Run `node ../html-explainer/scripts/check.mjs <file.html>` and fix every FAIL. The page must pass with every field empty.
6. Open the page once in a browser. Fill one field and check that the collect bar appears.

## Delivery

Save under `docs/explainers/` and reply with the answer line and the link. Then tell the author how answers come back:

- Each respondent clicks Copy all answers, Download .md or Copy JSON, and sends the result by any channel.
- The author opens `assets/merge.html` in a browser and pastes or drops every copy.
- The merge tool groups answers by question and exports Markdown, JSON or CSV. A ranked or bucketed question also gets a combined view once three people have answered.

Nothing leaves a respondent's browser unless they send it.

## Prioritise mode

Use it when several people must say what comes first. Sort first, then order only the top.

- One `fieldset.answer-field[data-kind="buckets"]` holds 5 to 15 items and `data-buckets="Now|Next|Later|Not now"` (2 to 5 labels). Each item is an `li` with a unique `data-id`, a `data-rec` that names the bucket you recommend, a `b` for the title and a `span` for one line. The reader taps a bucket per item, with your pick already set and marked ★, and the page then asks for an order of the first bucket only. The "Ask and collect" chapter of `../html-explainer/assets/gallery.html` shows it live.
- A short list that needs a full order uses `data-kind="rank"` instead. Every `li` takes a `data-id`. The script adds the move buttons and "This order is right".
- Say in the hint what ★ means ("My pick is already set") and ask for a reason in an optional textarea. The reason goes into both copies.
- Run the checker. A buckets field with a missing or malformed `data-buckets`, a repeated `data-id` or a `data-rec` outside its buckets fails. A rank item with no `data-id` and a buckets field above 15 items warn.
- In `assets/merge.html`, three or more readers give each item a mean, best and worst place and a spread bar. Items the readers disagree on are flagged Contested, and a buckets question adds a tally with Split. Kendall's W is shown in words, and a combined order is named only at 0.3 or more.

## Ballot mode

Use it when an agent needs rulings back from the owner: several open decisions, one respondent, no typing. A ballot suits 5 to 15 decisions. Above that, group the rest as "Already decided" reference cards or send a second ballot. The page is `<html lang="en" data-type="gather" data-mode="ballot">`. It has no rail, keep box, chapters or recap, and a tray pinned to the bottom of the screen replaces the `.collect` bar.

- Each decision is a `.ballot-card` with a stable `data-q` and a short `data-short`. The "Ask and collect" chapter of `../html-explainer/assets/gallery.html` shows the markup, and `examples/ballot.html` is a whole page to copy from.
- Every option is a picture in `.vis`, a small mockup in plain HTML and CSS or an `<img>`, or a text option. A text option has no `.vis`: a bold `.name` and one plain `span.detail` line. Use text options when the ruling has nothing to draw, such as an address, a waiting time or a policy, and do not invent a picture for it. If an option cannot be pictured or said in one line, the question belongs in choose mode.
- A single-choice card has exactly one `data-rec` option and ends with a `p.skip` that names it. Put the recommended option first, so the reader finds the ★ in the same place on every card. A skipped card means that ★ option. A ship-or-not list uses `data-kind="multi"`.
- `data-warn="Can't undo"` on an option adds an amber chip with a ⚠ and those words. Use it for the cost the reader must not miss, such as "Can't undo", "Redo later" or "Weaker". Four words at most.
- An optional `p.ballot-source` under the title says what the ballot rules on: "Rules on: the plan, its date, its commit".
- Order the groups by weight: "Shapes the build", "Small calls", then optionally "Already decided".
- `p.answer` gives the count and the skip rule: "11 decisions. Anything you skip goes with ★."
- The tray carries three more pieces, all in the example. **Pick all ★** gives every unpicked single-choice card its ★ option and leaves multi cards and the reader's own picks alone. **Review picks** is a collapsed list with one row per card, and a skipped card reads "★ (skipped)". Under the rows, **Anything else?** is one optional line for the agent.
- Run `node ../html-explainer/scripts/check.mjs <file.html>`, then open the page, pick one option and check that the tray counts it.

Delivery: tell the owner to press Copy picks and paste the result into the chat. It is one line per pick, then `Not picked (use ★)` for the skipped cards. When every card is single-choice and every pick is the ★ option, picked or skipped, it is one line instead: `<page title>: all ★ (recommended)`. A note, when the owner writes one, is the last line: `Note: ...`. Copy JSON carries it as `"note"`. To read picks without a paste, publish the page as an artifact with the `db` capability (see `artifact-capabilities`). It writes each pick to `picks/<data-q>` as `{ choice, at }`. The note is not in the database, only in the copies. Copy JSON still merges in `assets/merge.html`.
