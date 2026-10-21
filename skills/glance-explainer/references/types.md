# Page types

Set the type on `<html data-type="...">`. Every type keeps the core contract (answer bar, keep box, at a glance, chapter map, chapters, recap). Each entry adds only what that type needs. A page with no type is a plain `explainer`.

**At a glance.** Each entry names the picture its page opens with. It goes in a `section.glance` straight after the keep box and before the chapter map. The section holds a `div.glance-head` (an `h2` and an optional `span.chip`), the picture, and a `p.take` (or the picture's own `figcaption.take`). It is not a chapter, so it has no kicker, no read-aloud and no Done. The chapter that explains the glance picture builds on it and does not repeat it. A roadmap, a playbook and a field guide have none, because their lanes, phase strip and territory already open the page.

Some glance pictures are **derived**. You write an empty placeholder and the take line, and the script fills the placeholder from parts already on the page, so nothing is typed twice. Without script the placeholder stays empty and the glance still shows its take line.

The checker warns when a page made by 1.8.0 or later has no `section.glance`, and when any glance has no take line. A page made by an older release is never warned. A ballot has no glance either.

## explainer

### When
The reader needs to understand one thing, and no more specific type fits. This is the default when a page has no type.

### Chapter composition
Three to seven chapters, one idea each, in the order the reader needs them. Add an ask only when a decision is needed.

### Required components
**At a glance:** the one figure that carries the idea (`figure.figure` with its `figcaption.take`).

### Checker rules
The core rules only. No extra rules.

### Example topic
How the nightly export works, for someone who has never seen it.

## decision

### When
The reader must rule on options that a session poses.

### Chapter composition
One chapter per option or ruling, each with a split or a small diagram. Then the recap and the ending.

### Required components
**At a glance:** `div.rulings`, derived. One row per `.decision`: its question, the recommended option with a ★, and "Needs your ruling" until the reader answers. Write an empty `div.rulings` and a `p.take`.

A `.decision` card for each ruling, one option marked recommended, and a line saying what happens if the reader does nothing. The page ends in one of two ways.

- **A typed reply.** A closing `section.ask`.
- **Taps.** Each chapter's `.decision` card is followed by its own `fieldset.answer-field[data-kind="choice"]`. The recommended option's label carries `data-rec="Recommended"`, which shows a ★ chip. One `.collect` bar sits after the recap, outside the chapters, so one-chapter mode never hides it. The reader taps an option per ruling, then copies every answer back.

An option may carry `data-warn="Can't undo"`, a chip that names its cost in words.

### Checker rules
At least one `.decision`, and either a `.ask` or at least one `.answer-field` with exactly one `.collect` bar where every field has a `data-q`. A `div.rulings` fails on a page with no `.decision`.

### Example topic
Three rulings on how the nightly export should behave.

## status

### When
The reader needs to know where things stand and what comes next.

### Chapter composition
A timeline chapter, a status board chapter, a "since last time" list, and a next-steps chapter. Add an ask only if something is blocked on the reader.

### Required components
**At a glance:** a `div.duo` with `ul.status` beside `ol.timeline` (one `li.here`), and the one blocker as a `div.callout` under it.

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
**At a glance:** a `div.duo` with the before and after `figure.frame` drawings beside a verdict: approve or hold, and the check count.

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
**At a glance:** a `div.duo` with `div.tiles` beside `ol.steps` headed "What you do differently".

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
**At a glance:** `ul.findings`. Each `li` takes `data-strength` of `strong`, `moderate` or `weak`. It holds the finding in an `a` or `b`, one line in a `span`, `small.evidence` ("8 sources") and an optional `small.open` ("2 open"). CSS prints the strength word and draws the bars, so type no strength word. The weak row is the only tinted one.

Evidence as `div.tiles`, `ul.status` or `ol.timeline`. Source quotes in `details.fold`. A strength label on every finding.

### Checker rules
At least one `.status` or `.tiles`, and at least one `details.fold`. A `ul.findings` fails for each `li` whose `data-strength` is missing or is not `strong`, `moderate` or `weak`.

### Example topic
What eleven interviews say about why new users stop at step two.

## handover

### When
A session or a person takes over work in progress.

### Chapter composition
State. Work in flight. What is next. What is verified and what is only a claim. Evidence links in folds.

### Required components
**At a glance:** a `div.cols` of three `section.col`, each with an `h3` and a list: Verified (`go`), Only claimed (`wait`) and Do first (`here`).

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
**At a glance:** `ul.status` grouped under `h3` headings, most urgent first: Needs you, Moving, Stalled.

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
**At a glance:** `ul.promises`, three cards in the customer's words.

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
**At a glance:** `ol.layers`, easiest first. Each `li` has a `b` name, a `span` line and a `span.terms` of `span` chips for the layer's new words. Exactly one `li.here` marks where the newcomer is, and CSS prints "You are here" on it.

`dl.term` in every chapter, under the first use of a new word. `figure.figure` in every chapter. `p.from` restating what the last chapter gave.

### Checker rules
At least one `dl.term`. A warning for each chapter without a `dl.term`, and for each chapter without a `figure.figure`. An `ol.layers` fails unless it has exactly one `li.here`.

### Example topic
How an order travels through the shop, for someone on their first day.

## incident

### When
Something broke and the reader needs what happened, why, what is fixed, and what stops a repeat.

### Chapter composition
What broke and who felt it. The timeline, in order. The cause chain, one step causing the next. What is fixed and what is still open. What prevents a repeat. Name the cause in the system, never in a person.

### Required components
**At a glance:** `div.tiles` (what broke, who felt it, how long, status now) over `ol.timeline`.

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
**At a glance:** `div.tiles` for the diff stat, then `ul.status` for the checks, each with its command and exit code.

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
**At a glance:** `div.runbook-overview`, derived. Every step is a row, grouped by chapter, with a checkbox that shares the step's done state, and the first unchecked step marked "Next". Write an empty `div.runbook-overview` and a `p.take`. The overview shows each step's own number, so when the procedure runs over several chapters, give each later `ol.runbook` a `start` that continues the count.

`ol.runbook`. Every step has a bold sentence that starts with a verb, its command in `pre.cmd`, a `p.check` that says how to know it worked (the command that proves it), and a `p.fail` that says what to do if it did not. The template script gives every `pre.cmd` a Copy button, and the page reads fine without it.

### Checker rules
At least one `ol.runbook`. It fails for each step that lacks a `p.check` with text or a `p.fail` with text. A `div.runbook-overview` fails on a page with no `ol.runbook`.

### Example topic
Cut a release of the plugin.

## compare

### When
The reader must choose between options, and the choice rests on a few criteria that every option is measured against.

### Chapter composition
The grid first: options across, criteria down. Then one chapter for each criterion that decides the matter. End with the recommendation, and a `.decision` and an ask if the reader must rule.

### Required components
**At a glance:** the `table.grid` itself. It opens the page, so the first chapter is the first criterion that decides, not the grid again.

`table.grid` inside a `div.grid-wrap`, with a `caption`, a `th[scope="col"]` for each option, `data-rec` on the recommended option's header, a `th[scope="row"]` for each criterion, and a state class (`go`, `wait`, `stop` or `decide`) on each cell, with a few words beside the glyph. A `p.take` straight after the grid says what it shows. On a phone the grid scrolls sideways and the criterion column stays in view.

### Checker rules
At least one `table.grid`. It fails for a grid with fewer than two option columns or fewer than three body rows.

### Example topic
Three ways to store uploaded files.

## roadmap

### When
The reader needs to know what is under way now, what is next, what is later, and what depends on what.

### Chapter composition
The lanes. What unblocks the most. What is left off the roadmap on purpose, parked with the reason and what would restore it. A long list of ideas may take one more chapter, "What else waits?" (the backlog view below), and the page stays at seven chapters or fewer.

### Required components
**At a glance:** none. The lanes already open the page.

`.lanes` holding exactly three `.lane`, with `data-lane` set to `now`, `next` and `later`. Each lane has an `h3`, a `p.lane-note` and a `ul` of items. Under the answer bar sits `p.asof`: "A plan, not a promise. Items move as we learn."

- **A note on each lane.** One line right after the `h3` says the horizon, how sure the lane is and whether order matters: "Next 4 weeks. Committed. Top item first." or "1 to 3 months. Likely. Not in order." or "3 months or more. Exploring. Not in order." A `span.lane-count` inside the `h3` may show the budget, "3 of 5".
- **One set of states.** An item takes a state class and CSS prints its word above the title, so the words cannot drift: `here` is Under way, `wait` is Waits on another, `decide` is Needs your ruling, `stop` is Blocked, `go` is Done, and no class is Planned. Never use a state for another meaning. A `li.wait` names what it waits on: `small.after` with a link to that item's `id`, or `small.outside` for a blocker outside the roadmap ("Outside: Anthropic reviews each listing."). Every item that others depend on needs an `id`.
- **Exceptions only.** The lane carries the default, so only an item less certain than its lane is marked: `data-conf="exploring"` on the `li` and a `small.conf` with the reason ("Exploring: depends on the platform"). The card gets a dashed border. A real external date goes in `small.when`, which starts with a bold "Fixed date:". Every other item carries neither.
- **Derived, never typed.** The script writes "Unblocks N" on each item that other items list in a `small.after`, so do not write it by hand. A jump to an item outlines it, labels it "You jumped here" and adds one link back to the item you came from.
- **History folds away.** Shipped work does not sit in Now. A `details.fold.shipped` below the lanes reads "Shipped in 1.5.0: 3 items" and links the changelog. A `details.fold.parked` lists each parked item with a `Why:` line and a `Back when:` line. A lane keeps 5 live items at most.

On a Japanese page the interface file keeps 次へ for the Next button, so the strings file sets 次 for the Next lane.

#### The backlog view
"What else waits?" is an optional chapter of a roadmap, not a page type. Its parts, in order:

- `ol.backlog-top`: at most 5 ranked cards, numbered by CSS. Each has a state word, a title, one line and the derived "Unblocks N".
- `div.cutline` with `role="separator"`: "Cut line. Below is not ranked and not promised."
- One `details.theme` per theme. The summary holds the theme name, `span.count` ("6 ideas") and `span.top` ("Top: the first item"). The body is a compact list.
- `div.parked-shelf`: parked cards, each with `Why:` and `Back when:`.

#### A roadmap for customers
Show time at quarter precision at most, and a month only for a fixed date. Leave out internal fields such as owner, size, effort and score. Link each shipped item to its changelog entry.

### Checker rules
At least one `.lanes`, each with exactly three `.lane`. It fails for each `small.after a[href^="#"]` whose target `id` does not exist. It warns, never fails, for a `.lane` without a `p.lane-note`, a `li.wait` with neither `small.after` nor `small.outside`, a `data-conf` without a `small.conf`, a lane with more than 5 live cards, a `li.go` in the Now lane, a roadmap page without `p.asof`, an `ol.backlog-top` with more than 5 items, and a `details.theme` with no `.cutline` before it.

### Example topic
The plugin's next three releases.

## tour

### When
The reader must see how a product works, step by step, on its real screens.

### Chapter composition
One chapter per task, three to six steps. Each step is one screenshot with a numbered pin and one line. End with where to go next.

### Required components
**At a glance:** `div.filmstrip`, derived. One thumbnail per `ol.tour` step, each linking to its step. Write an empty `div.filmstrip` and a `p.take`.

`ol.tour`. Every step has a `figure.shot` holding an `img` (an inline data URI) with an `alt` that says what is on the screen, a `span.pin` for each spot to look at with `--x` and `--y` as percentages, then an `h3` and one plain line. Use real screenshots, about 1000 px wide, saved as WebP.

### Checker rules
At least one `ol.tour`. It fails for each step without an `img` that has a non-empty `alt`. A `div.filmstrip` fails on a page with no `ol.tour`. The size limit is 2048 KB, not 400 KB.

### Example topic
Your first transfer in the vault app, in four screens.

## playbook

### When
The reader must rule on a plan for a risky, multi-step change, and needs the whole plan at a glance: what changes, what the people it affects will notice at each phase, who does what, the one risky moment with its way back, and the decisions the plan needs.

### Chapter composition
Up to ten chapters, not seven. In this order: before and after; what the audience sees; the phases; what goes where; who does what, and the rules that never bend; the risky moment, step by step, with its undo; the risks; costs and decisions. The page opens as every page does (answer bar, keep box), then the `ol.phase-strip` gives the whole plan in one row. The chapter map is optional, because the strip already navigates. The decisions come last, answerable on the page, and the recap closes it.

### Required components
**At a glance:** none. The phase strip already opens the page.

`ol.phase-strip`: one `li` per phase, each linking to its phase. Each segment carries `span.seg-num` ("Phase 1"), a bold title, a `span.who` letter badge for the owner, `small.effort` in words, and `span.bar` with `--effort` from 1 to 5. `li.notice` marks a phase the audience will notice and adds a `span.notice-tag` whose label is written in the markup. Six or more segments wrap to two rows under 760 px. Owner is the badge, never colour alone.

`ol.phases`: the same phases in order, numbered because the order is real. Each `li` has an `id` the strip links to, an `h3`, `span.chip` labels for who and how long, a short `ul` of work, and a `p.impact` that names the real audience ("Members notice:", "Customers notice:"). A phase the audience notices carries `class="notice"` too.

`figure.frame` shows what the audience sees: a browser bar, a plain mockup in `.frame-screen`, and a `figcaption.take`. `.phone` makes it a portrait phone, and `.frame-row` lays out two to four side by side. A `div.roles` of two `section.role` (each with `data-who`) says who does what, and a `ul.rules` holds the rules that never bend. `div.undo` is the way back from the risky moment. `div.risks` holds `article.risk` cards, each with `data-level` of `high`, `medium` or `low`, the level word in `span.level`, one line of risk, and a `p.kept` naming what keeps it small. `table.grid` may group its rows with `tr.group`. A cost chapter uses `div.tiles`.

The decisions are one `fieldset.answer-field[data-kind="choice"]` per question. The recommended option's label carries `data-rec="Recommended"` (or "My pick"), which shows a ★ chip. One `.collect` bar sits outside the chapters. The header may hold a `figure.thesis`, a small SVG drawing of the outcome, which sits beside the title from 1100 px and under it on a phone.

### Checker rules
At least one `.phase-strip`, `.phases`, `.undo` and `.risks`. It fails for each phase without a `p.impact` that has text, for each `article.risk` without a `data-level` of high, medium or low or without a `p.kept` that has text, and for each phase-strip link whose target `id` does not exist. It warns when there is no `.answer-field` ("a playbook usually ends with the decisions it needs"), when answer fields have no `.collect` bar or no `data-q`, and when a `.phase-strip` has fewer than three segments. The compare rule does not count a `tr.group` as a criterion row. The chapter limit is ten.

### Example topic
Moving a small team's wiki to a new host (`../examples/playbook.html`): six phases, two the team notices, three frames, roles and four rules, switch day with its undo, four risks, cost tiles and three decisions.

## field-guide

### When
The reader needs to get oriented in a whole field of work once, then come back to look things up. The content is many short entries in families, each with a plain definition, an example from the reader's own project and a relevance. It is a reference, not a story.

### Chapter composition
Three chapters, in this order, each with its kicker, a question heading, a visual and a remember line.

1. "Where does everything fit?" holds the territory map.
2. "Which ones cannot wait?" holds the start-here list.
3. "Look something up" holds the index.

The recap closes it. There is no `section.ask`, because a guide asks nothing. The chapter map is optional, because the rail and the territory already navigate. The reading path is the answer bar, the keep box, the map and the start-here list. The index sits outside it, so the usual word limits do not count it.

### Required components
**At a glance:** none. The territory already opens the page.

`div.territory` holds `div.stage` blocks, each with an `h3` naming the stage. One stage carries `data-here`, and CSS prints "You are here" on it, the way a lane prints its state word. Families no stage owns go in a `div.stage[data-across]` band. A stage holds `a.family[href="#fam-<id>"]` tiles, each with a bold name in `b` and a one-line `span`. The tiles carry no digits. The script reads the entries of the family a tile links to and adds a three-part bar (solid for the first relevance, hatched for the second, grey for the third), the counts in words ("11 now, 1 before launch, 1 later") and a key under the map, all in the index's own labels. Without script a tile shows its name and line.

`ol.start-here` holds at most five items. Each item is `li > a[href="#<entry id>"] > b` with the entry's name, then a `span` with one line saying why it comes first. The cards use the risk colour on purpose, because a mistake in these is silent or hard to undo. A link to a whole family is fine when the advice is about the family. A `p.can-wait` under the list says what may wait.

`div.index` holds the families and carries `data-rel-labels="Now|Before launch|Later"`, the three words for the relevance values `now`, `next` and `later`. They default to Now, Next and Later. An empty `div.guide-tools` at its top marks where the toolbar goes. The script fills it with a search field that has a visible label, a filter button for each relevance plus All, each showing a live count, and a status line ("Showing 48 of 85 fields, Now only"). The filter starts on the first relevance.

- **Family:** `details.family-index[id="fam-<id>"]` whose `summary` holds an `h3`. The script adds its counts, derived from its entries. Optional `h4.group` subheadings split a long family.
- **Entry:** `div.entry[id][data-rel]` with a `b.name`, a `p.def` of 20 words or fewer, and a `div.entry-body` holding `p.where` (a bold lead, then the example from the reader's project) and an optional `p.see` linking other entries. The script turns the name, the relevance word (a glyph and the label) and the definition into one button that opens the body, and adds a "Copy link to this field" button.
- **Search:** it matches the name, the definition and the where line, in any case. A family with no match says "Nothing here matches" and how many entries are hidden.
- **Links:** a link to an entry, or a page opened on its hash, opens the entry and its family, lifts a filter or search that would hide it, and lands on it with the roadmap's outline and "You jumped here" label.
- **Print and skim:** printing opens every family and entry. Skim mode keeps the rows and hides the bodies.

### Checker rules
It fails without a `.territory`, a `.index` or an `ol.start-here`. It fails for an entry without an `id`, a `b.name`, a `p.def` or a `p.where`, for a `data-rel` that is not `now`, `next` or `later`, for a duplicate `id` anywhere on the page, for a `section.ask`, for an `a.family` whose family does not exist, and for a start-here link whose entry or family does not exist. It warns for a definition over 20 words, more than 150 entries, more than 12 families, more than 5 start-here items, and a family tile with a digit in its text, because the counts are derived. Everything inside `.index` stays out of the reading-path count and the chapter word limits.

### Example topic
A field guide to web product work for a small notes app (`../examples/field-guide.html`): four stages, six families, 30 entries with fictional notes-app examples, four fields that come first and a "can wait" line.
