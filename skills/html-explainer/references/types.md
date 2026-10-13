# Page types

Set the type on `<html data-type="...">`. Every type keeps the core contract (answer bar, keep box, chapter map, chapters, recap). Each entry adds only what that type needs. A page with no type is a plain `explainer`.

## decision

### When
The reader must rule on options that a session poses.

### Chapter composition
One chapter per option or ruling, each with a split or a small diagram. Then the recap and the ask.

### Required components
A `.decision` card for each ruling, one option marked recommended, and a line saying what happens if the reader does nothing. A closing `.ask`.

### Checker rules
At least one `.decision` and one `.ask`.

### Example topic
Three rulings on how the nightly export should behave.

## status

### When
The reader needs to know where things stand and what comes next.

### Chapter composition
A timeline chapter, a status board chapter, a "since last time" list, and a next-steps chapter. Add an ask only if something is blocked on the reader.

### Required components
`ol.timeline` with one `li.here`, `ul.status` for the health of each item, a short list of what changed since last time, `ol.steps` for what happens next.

### Checker rules
At least one `.timeline` with exactly one `li.here` and at least one `.status`.

### Example topic
Where the Japanese launch stands this week.

## spec

### When
The reader must approve a feature before it is built.

### Chapter composition
What it does (a flow). What changes for you (a split, plus a wireframe when a screen changes). How we know it works (a status board of checks). The risks. End with the ask: approve or hold.

### Required components
`ol.flow`, `div.split`, `ul.status` for the checks, a `div.callout` for each risk, `section.ask`.

### Checker rules
At least one `.split` and one `.status`.

### Example topic
Approve "remember my last filter" on the orders page.

## release

### When
The reader needs to know what shipped and what to do differently now.

### Chapter composition
The counts that matter as tiles. One chapter per theme, each with a before and after. A short chapter on what changes in practice.

### Required components
`div.tiles` with a label saying what each number means, `div.split` for each theme, `ol.steps` for what to do differently.

### Checker rules
At least one `.tiles` and one `.split`.

### Example topic
What shipped in version 2.4.

## research

### When
The reader needs findings and how far to trust each one.

### Chapter composition
One chapter per finding, each carrying its evidence and its strength, with sources in a fold. Then what this changes (a split) and the open questions. Ask only if the findings force a choice.

### Required components
Evidence as `div.tiles`, `ul.status` or `ol.timeline`. Source quotes in `details.fold`. A strength label on every finding.

### Checker rules
At least one `.status` or `.tiles`, and at least one `details.fold`.

### Example topic
What eleven interviews say about why new users stop at step two.

## handover

### When
A session or a person takes over work in progress.

### Chapter composition
State. Work in flight. What is next. What is verified and what is only a claim. Evidence links in folds.

### Required components
`ul.status` for state and in-flight work, verified items green and unchecked claims amber. `ol.steps` for next actions. `details.fold` for evidence links.

### Checker rules
At least one `.status` and one `.steps`.

### Example topic
Handing the invoice migration to the next session.

## portfolio

### When
The reader owns several projects and needs to see all of them at once: what moves, what is blocked, and what waits on them.

### Chapter composition
A status board with one row per project. What moved since last time. What is blocked and why, one callout each. What waits on the reader, most valuable first. Add an ask only when one decision unblocks several projects.

### Required components
`ul.status` with one row per project: the dot is the health, the first words say what changed. `ol.steps` for what waits on the reader. A `table.grid` helps when the projects share the same few measures.

### Checker rules
At least one `.status` and one `.steps`. A warning if the status boards hold fewer than three rows in all.

### Example topic
Where six side projects stand this week, and which two need me.

## public

### When
The reader is a customer, not a teammate, and needs to know what the product does for them.

### Chapter composition
One chapter per kind of promise, in the customer's words: what you can do, what we do with what you give us, what happens when something goes wrong. Nothing is asked of the reader, so there is no ask. The proof sits in a fold.

### Required components
`ul.promises`: each item is one bold lead and one plain sentence, and each carries `data-evidence` holding the file and line or the URL that backs it. The attribute is not displayed. A `details.fold` titled "How we know" lists the evidence in words.

### Checker rules
At least one `ul.promises`. It fails when the page has a `section.ask`, and for each promise whose `data-evidence` is missing or empty. It warns for each jargon word outside the folds, in the answer bar, the keep box and the chapters: API, backend, endpoint, database, server, JSON, OCR, LLM, token, deploy, repo, commit, branch, CI, schema, pipeline. Whole words only, plurals included.

### Example topic
What happens to the invoice you upload.

## teach

### When
A newcomer must learn one system well enough to work with it.

### Chapter composition
One chapter per layer or step of the system, the easiest first. Each defines its new words in a term box and shows its idea in a figure. Finish with a short chapter of steps the newcomer can try.

### Required components
`dl.term` in every chapter, under the first use of a new word. `figure.figure` in every chapter. `p.from` restating what the last chapter gave.

### Checker rules
At least one `dl.term`. A warning for each chapter without a `dl.term`, and for each chapter without a `figure.figure`.

### Example topic
How an order travels through the shop, for someone on their first day.

## incident

### When
Something broke and the reader needs what happened, why, what is fixed, and what stops a repeat.

### Chapter composition
What broke and who felt it. The timeline, in order. The cause chain, one step causing the next. What is fixed and what is still open. What prevents a repeat. Name the cause in the system, never in a person.

### Required components
`ol.timeline` of three or more points. `ol.flow` for the cause chain, with the failing step in `stop`. `ul.status` for the follow-ups: done is `go`, in progress is `wait`, needs a ruling is `decide`.

### Checker rules
At least one `.timeline`, one `.flow` and one `.status`. A warning if the longest timeline has fewer than three items.

### Example topic
Why exports failed for two hours on Tuesday.

## pr

### When
A reviewer must understand a pull request before reading its diff.

### Chapter composition
What changed and why, as a before and after. How big the diff is. What was checked. Where to look first and what to skip.

### Required components
`div.split` for the behaviour before and after. `ul.status` with one row per check, each naming its command and its exit code. `div.tiles` for the diff stat: files changed, lines added, lines removed.

### Checker rules
At least one `.split`, one `.status` and one `.tiles`. No extra rules.

### Example topic
Add retries with backoff to the nightly export (pull request 214).

## runbook

### When
A person or an agent follows a procedure step by step and must know after each step whether it worked.

### Chapter composition
What you need before you start. The procedure, in chapters of five steps or fewer. What to do when it goes wrong, including how to undo it.

### Required components
`ol.runbook`. Every step has a bold sentence that starts with a verb, its command in `pre.cmd`, a `p.check` that says how to know it worked (the command that proves it), and a `p.fail` that says what to do if it did not. The template script gives every `pre.cmd` a Copy button, and the page reads fine without it.

### Checker rules
At least one `ol.runbook`. It fails for each step that lacks a `p.check` with text or a `p.fail` with text.

### Example topic
Cut a release of the plugin.

## compare

### When
The reader must choose between options, and the choice rests on a few criteria that every option is measured against.

### Chapter composition
The grid first: options across, criteria down. Then one chapter for each criterion that decides the matter. End with the recommendation, and a `.decision` and an ask if the reader must rule.

### Required components
`table.grid` inside a `div.grid-wrap`, with a `caption`, a `th[scope="col"]` for each option, `data-rec` on the recommended option's header, a `th[scope="row"]` for each criterion, and a state class (`go`, `wait`, `stop` or `decide`) on each cell, with a few words beside the glyph. A `p.take` straight after the grid says what it shows. On a phone the grid scrolls sideways and the criterion column stays in view.

### Checker rules
At least one `table.grid`. It fails for a grid with fewer than two option columns or fewer than three body rows.

### Example topic
Three ways to store uploaded files.

## roadmap

### When
The reader needs to know what is under way now, what is next, what is later, and what depends on what.

### Chapter composition
The lanes. What unblocks the most. What is left off the roadmap on purpose, parked with the reason and what would restore it.

### Required components
`.lanes` holding exactly three `.lane`, with `data-lane` set to `now`, `next` and `later`. Each lane has an `h3` and a `ul` of items. An item takes a state class, and an item that waits on another carries `small.after` with a link to that item's `id`. Every item that others depend on needs an `id`. On a Japanese page the interface file keeps 次へ for the Next button, so the strings file sets 次 for the Next lane.

### Checker rules
At least one `.lanes`, each with exactly three `.lane`. It fails for each `small.after a[href^="#"]` whose target `id` does not exist.

### Example topic
The plugin's next three releases.

## tour

### When
The reader must see how a product works, step by step, on its real screens.

### Chapter composition
One chapter per task, three to six steps. Each step is one screenshot with a numbered pin and one line. End with where to go next.

### Required components
`ol.tour`. Every step has a `figure.shot` holding an `img` (an inline data URI) with an `alt` that says what is on the screen, a `span.pin` for each spot to look at with `--x` and `--y` as percentages, then an `h3` and one plain line. Use real screenshots, about 1000 px wide, saved as WebP.

### Checker rules
At least one `ol.tour`. It fails for each step without an `img` that has a non-empty `alt`. The size limit is 2048 KB, not 400 KB.

### Example topic
Your first transfer in the vault app, in four screens.

## playbook

### When
The reader must rule on a plan for a risky, multi-step change, and needs the whole plan at a glance: what changes, what the people it affects will notice at each phase, who does what, the one risky moment with its way back, and the decisions the plan needs.

### Chapter composition
Up to ten chapters, not seven. In this order: before and after; what the audience sees; the phases; what goes where; who does what, and the rules that never bend; the risky moment, step by step, with its undo; the risks; costs and decisions. The page opens as every page does (answer bar, keep box), then the `ol.phase-strip` gives the whole plan in one row. The chapter map is optional, because the strip already navigates. The decisions come last, answerable on the page, and the recap closes it.

### Required components
`ol.phase-strip`: one `li` per phase, each linking to its phase. Each segment carries `span.seg-num` ("Phase 1"), a bold title, a `span.who` letter badge for the owner, `small.effort` in words, and `span.bar` with `--effort` from 1 to 5. `li.notice` marks a phase the audience will notice and adds a `span.notice-tag` whose label is written in the markup. Six or more segments wrap to two rows under 760 px. Owner is the badge, never colour alone.

`ol.phases`: the same phases in order, numbered because the order is real. Each `li` has an `id` the strip links to, an `h3`, `span.chip` labels for who and how long, a short `ul` of work, and a `p.impact` that names the real audience ("Members notice:", "Customers notice:"). A phase the audience notices carries `class="notice"` too.

`figure.frame` shows what the audience sees: a browser bar, a plain mockup in `.frame-screen`, and a `figcaption.take`. `.phone` makes it a portrait phone, and `.frame-row` lays out two to four side by side. A `div.roles` of two `section.role` (each with `data-who`) says who does what, and a `ul.rules` holds the rules that never bend. `div.undo` is the way back from the risky moment. `div.risks` holds `article.risk` cards, each with `data-level` of `high`, `medium` or `low`, the level word in `span.level`, one line of risk, and a `p.kept` naming what keeps it small. `table.grid` may group its rows with `tr.group`. A cost chapter uses `div.tiles`.

The decisions are one `fieldset.answer-field[data-kind="choice"]` per question. The recommended option's label carries `data-rec="Recommended"` (or "My pick"), which shows a ★ chip. One `.collect` bar sits outside the chapters. The header may hold a `figure.thesis`, a small SVG drawing of the outcome, which sits beside the title from 1100 px and under it on a phone.

### Checker rules
At least one `.phase-strip`, `.phases`, `.undo` and `.risks`. It fails for each phase without a `p.impact` that has text, for each `article.risk` without a `data-level` of high, medium or low or without a `p.kept` that has text, and for each phase-strip link whose target `id` does not exist. It warns when there is no `.answer-field` ("a playbook usually ends with the decisions it needs"), when answer fields have no `.collect` bar or no `data-q`, and when a `.phase-strip` has fewer than three segments. The compare rule does not count a `tr.group` as a criterion row. The chapter limit is ten.

### Example topic
Moving a small team's wiki to a new host (`../examples/playbook.html`): six phases, two the team notices, three frames, roles and four rules, switch day with its undo, four risks, cost tiles and three decisions.
