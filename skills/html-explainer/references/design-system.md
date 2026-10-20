# Visual system for explainers

This is a guide, not a layout. Every explainer shows something different: a decision, a status, an architecture, a spec, a release. The system gives you a calm page frame, a small vocabulary of components with a fixed meaning, and rules for colour and type. You choose which components the content needs and in what order.

Paths are relative to this file. `template.html` and `gallery.html` are in `../assets/`, `merge.html` is in the gather skill (`../../explainer-gather/assets/`), and `atlas.css` and `atlas.js` are in the atlas skill (`../../explainer-atlas/assets/`). Diagram rules are in `diagrams.md` and prose rules are in `writing.md`, beside this file.

## Who it is for and why it looks like this

The reader has severe ADHD and a short working memory. Concretely:

- They lose the thread when they scroll. So context is restated where it is needed, and the page always shows where they are: the rail on a wide screen, the progress bar at the top on a narrow one.
- They can hold three things. So the page names the three things up front and never asks for a fourth.
- Their attention goes to whatever moves or is brightest. So nothing moves on its own, and saturated colour is spent only on meaning.
- They need the point on the first screen. So the answer is the headline, the three keep facts sit beside it, and the type's own picture comes next, before any chapter.
- They skim first and read second, if at all. So the page must work as a skim: answer, glance, chapter map, diagram captions, remember lines. Skim mode makes this literal.
- Finishing something feels good and keeps them going. So chapters have a done checkbox and the rail shows progress.
- Dense text is a wall. So paragraphs are short, type is large, lines are 62 characters, and the machinery lives in folds.

## Page identity

Every page opens with `<html lang="en" data-type="explainer">`.

- `lang` is `en` or `ja`. Other codes are allowed and fall back to the English rules. The language sets the fonts, the line measure, and whether the checker counts words or characters (see Japanese typography).
- `data-type` names the page's job: `explainer` (the default when missing), `decision`, `status`, `spec`, `release`, `research`, `handover`, `portfolio`, `public`, `teach`, `incident`, `pr`, `runbook`, `compare`, `roadmap`, `tour`, `playbook`, `field-guide`, `gather` or `atlas`. Every type keeps the same opening and closing contract and adds required components. A playbook may run to ten chapters. The eighteen content types are in `types.md`. `gather` and `atlas` have their own skills.

## Tokens

All tokens live in `:root` in `template.html`. Change them there, nowhere else.

### Colour has meaning, and only one meaning

| Token | Meaning | Where it appears |
|---|---|---|
| `--here` cobalt | You are here, the answer, structure, links | the rule above the answer, rail current, map numbers, step numbers, timeline current, `d-box-here` |
| `--go` green | Done, safe, yes, recommended | status rows, flow steps, recommended stamp, the top rule of the after card |
| `--wait` amber | In progress, caution, needs a check | status rows, callout.warn, flow steps |
| `--stop` red | Blocked, risk, no | status rows, callout.stop, the ✕ on a runbook failure |
| `--decide` purple | The reader must choose | decision card, the recommended option, the ask, status rows |
| `--memory` yellow | Offloaded working memory | keep cards, remember strip, recap |

Each has a `-tint` for fills. Never use a meaning colour for decoration, and never introduce a seventh colour. If two things need to be told apart and neither carries one of these meanings, use position, a border, or a label, not a new colour.

**Calm colour.** Meaning colour is spent on dots, glyphs, thin rules and small chips, and a large area is a white card. The before side of a split is a white card, and the after side is a white card with a 3 px `--go` rule along its top. The recommended option takes a `--decide` border and tint. Tile numbers are plain `--ink`, with any state shown as a glyph and a word under the number. Yellow is the one large fill, because it means "keep this": the keep cards, the remember strip and the recap.

Surfaces are cool neutrals: `--paper` fog, `--card` white, `--well` inset for diagrams and code. Text is deep navy `--ink`, never pure black, with `--ink-soft` and `--ink-faint` for secondary and tertiary.

Dark mode is automatic through `prefers-color-scheme` and can be forced with `data-theme` on `<html>`. Every token is redefined for dark; components never hard-code a colour.

### Text on a meaning fill, and the glyph rule

Text drawn on a meaning fill uses the matching `--on-*` token and never plain white: `--on-here`, `--on-go`, `--on-wait`, `--on-stop`, `--on-decide`, and `--on-soft` for the neutral `--ink-soft` fill. They are white in the light theme and near-black navy in both dark blocks, where the meaning colours are lighter. Map numbers, step numbers, flow numbers, the recommended stamp, the skip link and the pressed rail buttons all use them. The checker computes contrast from the tokens and fails any text pair under 4.5 to 1 in either theme: the inks on paper and card, `--here` on card, and each `--on-*` on its fill.

Colour is never the only signal (WCAG 1.4.1). Each status dot carries a glyph: ✓ go, ! wait, ✕ stop, ? decide, ● here, ★ memory, drawn in the matching `--on-*` colour. Done points on a timeline show ✓, and a flow card in go, wait or stop shows the same glyph in its corner, in the state colour. A new component that uses a meaning colour must pair it with a glyph, a word, or a position. The checker fails a stylesheet whose done dots lose their glyph. The playbook pairs a risk level with ✕, ! or ✓ and its word, the way back with ↺, and a phase the audience notices with a filled ● against ○ for one it does not. Who owns a phase is a letter badge, so it never rests on colour.

### Type

| Role | Face | Why |
|---|---|---|
| Headings, kickers, labels, numbers | Lexend 500 to 700 | Designed to reduce visual stress in reading; wide, even, calm at large sizes |
| Body | Atkinson Hyperlegible Next 400 and 700 | Designed for maximum letter distinction (b/d, I/l/1, O/0) |
| Code | Atkinson Hyperlegible Mono | Same letterforms for anything the reader must type |

Fallback is the Segoe UI Variable and system stack, so an offline file still reads well. The scale is 18 px base with a 1.25 ratio: 18, 22.5, 28, 35, 44. Body line height is 1.6, headings 1.15. Prose width is 62 characters. Text is always left aligned and never justified. It is never all caps, except two short fixed labels: the chapter kicker and the keep label. Japanese pages swap the whole stack; see Japanese typography below.

Headings are sentences a person would say, not labels. A chapter heading is the question the chapter answers: "Why does this need you at all?" not "Rationale". Kickers are small semibold labels in sentence case, written only where they carry information: the page purpose above the title, and above each chapter its position and reading time ("Chapter 2 of 6, about 1 minute", counted at 200 words a minute, or 500 characters a minute in Japanese, rounded up).

### Japanese typography

A `:lang(ja)` block in the template swaps the type system when `<html lang="ja">`. Nothing else changes.

| Rule | English page | Japanese page |
|---|---|---|
| Body face | Atkinson Hyperlegible Next | BIZ UDPGothic (a universal-design face built for legibility, on Google Fonts), falling back to Yu Gothic, Hiragino Sans, Meiryo, Noto Sans JP |
| Heading face | Lexend | BIZ UDPGothic bold; one family for all Japanese text |
| Code face | Atkinson Hyperlegible Mono | BIZ UDGothic, the monospaced sibling |
| Line height | 1.6 body, 1.15 headings | 1.75 body, 1.35 headings |
| Measure | 62 characters | about 36 em (35 to 40 full-width characters) |
| Letter spacing | none, headings -0.01 em | 0.03 em body, 0 headings |
| Emphasis | bold, no italics by rule | bold or 「 」; italics forbidden, Japanese has none |
| Line breaking | `text-wrap: pretty`, manual hyphens | `line-break: strict`, no hyphenation, `text-wrap: pretty` |
| Numbers and dates | 1,250; 2026-10-07 | half-width digits throughout; 2026年10月7日 |
| Interface strings | Skim mode, One chapter at a time, Done, Remember, Recap, What I need from you | ざっと読む, 1章ずつ, 完了, 覚えておく, まとめ, お願いしたいこと, from `i18n/ui.ja.json` |

Offline, the system fonts above are good on Windows and macOS, so the fallback is not a degradation. The Google Fonts link must carry BIZ UDPGothic when `lang="ja"`, and the checker fails a Japanese page without it.

For `lang="ja"` the checker counts characters, not words: paragraph 90, sentence 60 (split on 。！？), keep item 25, answer bar 70, reading time at 500 characters a minute. The middle-dot and Title Case warnings are off, italics fail, and the page must carry the `:lang(ja)` block. Register and phrasing rules are in the Japanese section of `writing.md`. `../scripts/translate.mjs` turns a finished English page into a Japanese one with the same layout and question ids.

### Space and shape

Radius follows hierarchy: chapters 18 px, components 10 px, chips full. Borders are 1.5 px hairlines; meaning borders go to 2 or 2.5 px. There are no drop shadows on content. Chapters are separated by 2 rem of paper, which is the page's main rhythm.

### Layout

```
≥1100 px                                       <1100 px
┌──────────┬───────────────────────────────┐   ┌──────────────────────────┐
│ rail =   │ kicker                        │   │ progress bar (4 px)      │
│ chapter  │ H1                            │   ├──────────────────────────┤
│ map      │ answer (the headline)         │   │ kicker / H1              │
│ 1 • done │ keep (three cards in a row)   │   │ answer (the headline)    │
│ 2 • here │ at a glance (the type's own   │   │ keep (cards stacked)     │
│ 3        │   picture, then its take)     │   │ at a glance              │
│ 2 of 5   │ ┌───────────────────────────┐ │   │ chapter map (list)       │
│ Reading  │ │ chapter 1                 │ │   │ chapter 1 …              │
│ tools    │ │  from / prose / figure    │ │   │                          │
│          │ │  fold / remember          │ │   │                          │
│          │ └───────────────────────────┘ │   │                          │
│          │ recap · ask                   │   │ recap · ask              │
└──────────┴───────────────────────────────┘   └──────────────────────────┘
```

From 1100 px the rail is the chapter map and `ol.map` is hidden. Below 1100 px the rail is hidden, the 4 px progress bar stays at the top, and `ol.map` is a compact list. The Reading tools button sits in the rail on a wide screen and at the end of `.meta` on a narrow one.

Prose stays inside 62 ch. Figures, flows, decision grids, status boards and timelines may use the full column width. The eye reads left aligned text and left to right diagrams; nothing is centred except labels inside boxes.

## The component vocabulary

Each component encodes one kind of information. Use it only for that. Full markup is in `template.html` and rendered in `gallery.html`.

| Component | Class | Information it encodes | Rules |
|---|---|---|---|
| Answer bar | `p.answer` | The whole page in one sentence | Exactly one per page, before anything else |
| Answer as headline | `p.answer` | The whole page, said as its headline | No box and no left bar. Lexend weight 500, about 28 px (23 px on a phone), line height 1.32, no wider than 34em, with a short cobalt rule above it. Still exactly one per page and one sentence |
| Keep box | `div.keep` | The three facts to carry | Max three lines, under fifteen words each |
| Keep cards | `div.keep` with `strong` and `ol` | The three facts to carry, side by side | No outer box. `strong` is a small semibold label in sentence case, in `--ink-faint`. The `ol` is a row of three yellow cards (`--memory` fill and line), each numbered in a 26 px navy circle. They stack under 760 px |
| At a glance | `section.glance` with `div.glance-head`, the type's picture and a `p.take` | The type's own picture, on the first screen | After `div.keep`, before `ol.map`. A white card with a hairline. The head is an `h2` and an optional `span.chip`. It is not a chapter: no kicker, no read-aloud, no Done. Its words count toward the reading path and toward no chapter. Skim mode keeps it, and one-chapter mode shows it with the opening. The checker warns for a missing glance on a page made by 1.8.0 or later, and for a glance with no take line. A roadmap, playbook and field guide have none. `types.md` names each type's picture |
| Duo | `div.duo` | Two pictures that explain each other, side by side | Two columns, the first a little wider. Stacks under 760 px. Used in a glance or a chapter: status (health beside the timeline), release (tiles beside steps), spec (drawings beside the verdict) |
| Columns | `div.cols` of `section.col` | Two or three lists that differ by state | Each column is `.go`, `.wait`, `.here`, `.decide` or `.stop`: an `h3` with that state's glyph, a 3 px rule on top in its colour, then a `ul` or `ol`. Stacks under 760 px. Handover: Verified, Only claimed, Do first |
| Findings | `ul.findings` | Findings ranked by how far to trust each | Each `li` has `data-strength` (`strong`, `moderate` or `weak`; the checker fails anything else), the finding in an `a` or `b`, one line in a `span`, `small.evidence` and an optional `small.open`. CSS prints the strength word and draws three bars, filled 3, 2 or 1. Only the weak row is tinted, in `--wait-tint`. Stacks on a phone |
| Layers | `ol.layers` | A system taught one layer at a time, easiest first | Each `li` has a numbered circle, a `b` name, a `span` line and a `span.terms` of `span` chips for the layer's new words. Exactly one `li.here` gets a `--here` ring and "You are here", the way `.stage[data-here]` does. The checker fails any other count |
| Runbook overview | `div.runbook-overview`, written empty | Every runbook step on one screen | Derived by the script. One row per `ol.runbook > li`, grouped under its chapter's `h2`: a checkbox that shares the step's done state, the step number and the step's first bold sentence. The first unchecked step is marked "Next". Each row links to its step. Fails without an `ol.runbook` |
| Filmstrip | `div.filmstrip`, written empty | Every tour step as a thumbnail | Derived by the script. One per `ol.tour > li`: the step's `img` cloned at 16:10 with `object-fit: cover`, its pins, the step number and its `h3`. Each links to its step, and the script gives the step an `id` if it has none. Scrolls sideways inside its box on a phone. Fails without an `ol.tour` |
| Rulings | `div.rulings`, written empty | Every ruling and where it stands | Derived by the script. One row per `.decision`: its `h3` question, the `data-rec` option with a ★, and a state. The state is "Needs your ruling" with the `--decide` glyph until the matching `fieldset.answer-field` has an answer, then the chosen option. The first unanswered row is the only tinted one. Each row links to its chapter. Fails without a `.decision` |
| Question progress | `div.qprogress`, written empty | How many questions are answered | Derived by the script, on gather pages. One numbered dot per `.answer-field[data-q]`, linking to its field and filled when answered, with "N of M answered". Updates live. Fails without such a field |
| Chapter map | `ol.map` | What the chapters are and what each gives | 3 to 7 entries, one line each. Optional in a playbook, where the phase strip navigates. A compact list under 1100 px, and hidden from 1100 px, where the rail is the map |
| Rail as chapter map | `nav.rail` | The chapters, always in view on a wide screen | From 1100 px. The script adds to each `.rail a` that has a matching `.map a` the map item's `span` text and the chapter's minutes, read from the kicker. The `.dot` is a 26 px numbered circle. The current item is a white card with a filled `--here` circle, and a read item shows ✓ in `--go`. Under the list sits "2 of 5 read" with a 6 px bar, derived from the done or answered state. A public page has no Done control and no progress line |
| Chapter | `section.chapter` | One idea | Has a kicker with position and time, `.from`, a body, optional folds, one `.remember` |
| Quiet chapter frame | `p.from`, `.take`, `details.fold`, `p.remember`, and the chapter header | Fewer frames, so the picture stands out | `p.from` is one quiet line: a small corner-arrow icon and a bold lead, no grey box. `.take` has no bar: under a figure it is the caption below a hairline, under any other component a plain line with a hairline above, with a `--here` bold lead. A fold's summary is a 46 px row with a chevron and hairlines, no fill. `p.remember` is a `--memory` strip with a bookmark icon. In the header, Read aloud and Done are 44 px icon buttons (a speaker and a check), and their words stay in the markup as the accessible name. Done checked shows the check in `--go` |
| Carry-forward | `p.from` | The one prior fact this chapter needs | Restated in full, never "as above" |
| Remember line | `p.remember` | The one sentence to keep from the chapter | Copied verbatim into the recap |
| Figure | `figure.figure` + `figcaption.take` | A relationship that prose cannot hold | Always has a take-away caption. Scrolls sideways on a phone; an `svg.narrow` twin replaces the wide drawing there |
| Take line | `p.take` straight after a component | What a status board, split, flow or tiles proves | One line; every chapter's picture gets one, and so does the glance |
| Stepper | `figure.stepper` + `.stepper-nav` | Change over time, one step at a time | Everything stays visible and steps not lit are dimmed; the caption shows the current step; step 1 carries the point; no autoplay |
| Views | `div.views` + `.views-tabs` + `.view` | Several views of one thing | The first tab is open and carries the point; the others are `hidden` |
| Minimap | `figure.minimap` | Where this chapter sits in the whole | The page's master SVG, small; `data-lit` names the lit node and the rest dim |
| Flow | `ol.flow` | A linear sequence | 3 to 7 steps, states via `.here .go .wait .stop` |
| Split | `div.split` | Two states of the same thing | `.before` is a white card. `.after` is a white card with a 3 px green rule along its top |
| Decision | `div.decision` + `div.options` | A choice the reader owns | One recommended option, with a `--decide` border and tint and its ★ chip inside the card at the top, and a "do nothing" line. The page may follow each card with its `fieldset.answer-field[data-kind="choice"]` and end with one `.collect` bar, instead of the ask |
| Warning chip | `[data-warn]` on a decision `.option` or a `.ballot-opt` | A cost the reader must see on the option itself | Amber (`--wait`) with a ⚠ glyph and the attribute's own words, such as "Can't undo". Four words at most. Never colour alone. It hangs from the top left edge of a decision option and is the last line of a ballot option |
| Status board | `ul.status` | Health of several items | One dot colour per row, one line each |
| Timeline | `ol.timeline` | Position in time | Exactly one `li.here` |
| Steps | `ol.steps` | Ordered actions | Bold verb first, one line, detail in a fold |
| Tiles | `div.tiles` | Numbers that change the decision | Label says what the number means. The number is plain ink, and any state shows as a glyph and a word under it. The number never wraps and shrinks to fit its tile, so keep it short: `$24k`, not `$24,000+` |
| Grid | `table.grid` in `div.grid-wrap` | Options measured against the same criteria | `caption`, a column per option, a row per criterion. A cell state (`td.go .wait .stop .decide`) is a tint and a glyph. `th[data-rec]` carries a ★. `tr.group` with a `th[colspan][scope="colgroup"]` is a quiet band that names the rows under it; it is not a criterion. On a phone it scrolls sideways and the criterion column stays. A `p.take` follows |
| Lanes | `div.lanes` with three `section.lane` | What is now, next and later, and what waits on what | Exactly three lanes (`data-lane`), stacked under 760 px. Each has an `h3`, a `p.lane-note` and its items. An item takes a state class and its glyph. A `li.wait` links to what it waits on in `small.after`, or names an outside blocker in `small.outside`. At most 5 live items a lane |
| Lane note | `p.lane-note` | What a lane means | One line after the `h3`: horizon, confidence, order. "Next 4 weeks. Committed. Top item first." A `span.lane-count` in the `h3` may show the budget, "3 of 5" |
| State word | state class on a lane or backlog item | The state of one item, in one fixed vocabulary | CSS prints the word above the title from the class, so it cannot drift: `here` Under way, `wait` Waits on another, `decide` Needs your ruling, `stop` Blocked, `go` Done, no class Planned. On a roadmap amber means waits on another, and under way is cobalt. Each word has its glyph dot. No other meaning, and no word typed by hand |
| Exception | `data-conf="exploring"` with `small.conf`, and `small.when` | An item less certain than its lane, or with a real date | A dashed card and dot, and the reason in words: "Exploring: depends on the platform". `small.when` starts with a bold "Fixed date:". The default carries no mark |
| Unblocks count | `span.unblocks`, written by the script | How many items wait on this one | Counted from the `small.after` links, never typed. A cobalt outlined chip with an arrow drawn in CSS |
| Jump landing | `.is-target` and `a.jump-back`, written by the script | Where a jump landed, and the way back | A static 3 px outline, a "You jumped here" label and one "Back to:" link to the item you came from. No animation. The next jump removes them. A field guide's entries and families land the same way, and the jump opens them first |
| Shipped and parked folds | `details.fold.shipped`, `details.fold.parked` | History, kept out of the lanes | The summaries carry the ✓ and ✕ dots. Shipped reads "Shipped in 1.5.0: 3 items" with a changelog link. Parked lists each item with `Why:` and `Back when:` |
| As-of line | `p.asof` | A roadmap is a plan, not a promise | Under the answer bar of a roadmap page: a small clock and one line |
| Backlog top | `ol.backlog-top` | The few ideas that are ranked | At most 5 cards, numbered by CSS. Each has a state word, a title, one line and the derived Unblocks |
| Cut line | `div.cutline[role="separator"]` | Where ranked stops and unranked begins | A dashed rule and "Cut line. Below is not ranked and not promised." It comes before the themes |
| Theme fold | `details.theme` | A group of unranked ideas | The summary shows the theme name, `span.count` ("6 ideas") and `span.top` ("Top: ..."). The body is a compact list |
| Parked shelf | `div.parked-shelf` | What is parked on purpose and what would bring it back | One card per item with a ✕ dot, `Why:` and `Back when:` |
| Runbook | `ol.runbook` | A procedure a person follows, step by step | Numbered like `.steps`. Each step has its command in `pre.cmd`, a `p.check` (a green ✓, then ink text) and a `p.fail` (a red ✕, then ink text). Neither is a filled box. The script adds a Copy button to every `pre.cmd`; long commands wrap. To continue the numbering in a later chapter, start that list where the last one stopped: `<ol class="runbook" start="4">` |
| Tour | `ol.tour` with `figure.shot` and `span.pin` | A product walkthrough on real screenshots | One screenshot per step, a numbered pin placed with `--x` and `--y`, an `h3` and one line. Every image has an `alt` |
| Promises | `ul.promises` | What the product does for a customer | Each item is a card in an auto-fit grid with a ✓, one bold lead and one plain sentence. `data-evidence` holds the file and line or the URL; it is not shown. A "How we know" fold lists it |
| Phase strip | `ol.phase-strip` | The whole plan in one row | A segment links to its phase: `span.seg-num`, a bold title, a `span.who` letter badge (the owner, never colour alone), `small.effort` in words and `span.bar` with `--effort` 1 to 5. `li.notice` adds a `span.notice-tag` for the phases the audience will notice. Six or more segments wrap to two rows under 760 px |
| Phases | `ol.phases` | Ordered phases, numbered because the order is real | Each `li` has an `id`, an `h3`, `span.chip` labels, a short `ul` and a `p.impact` naming the real audience. `li.notice` marks the phases the audience notices |
| Frame | `figure.frame`, `.frame.phone`, `.frame-row` | What the audience sees | A browser bar (`.frame-bar` with `.dots` and `.url`), a plain mockup in `.frame-screen`, a `figcaption.take`. Two to four per row, stacked on a phone |
| Roles and rules | `div.roles` of `section.role[data-who]`, `ul.rules` | Who does what, and what never bends | Two roles, each headed by its `.who` badge. Each rule is a bold lead and one line, with a ✓ |
| Undo | `div.undo` | The way back from the risky moment | A ↺ glyph, a go tint, and the label `If something goes wrong:` in the markup |
| Risks | `div.risks` of `article.risk[data-level]` | What could go wrong and what keeps it small | `data-level` is `high`, `medium` or `low`: stop, wait and go tint, each with a glyph and its word in `span.level`. `p.kept` names the mitigation |
| Thesis | `header.hero` with `figure.thesis` | The outcome of the plan, drawn small | Optional. A small SVG with a `title`, beside the `h1` from 1100 px and under it on a phone |
| Territory | `div.territory` of `div.stage` | Where each family sits, by stage, and how much of it matters now | Stages share a row on a desktop and stack on a phone. One stage carries `data-here` and CSS prints "You are here" on it. `data-across` makes a full-width dashed band for families no stage owns |
| Family tile | `a.family[href="#fam-id"]` with a `b` and a `span` | One family: its name and a line | The tile types no digits. The script adds `span.fam-bar` (solid, hatched and grey parts for the three relevances) and `span.fam-counts` ("11 now, 1 before launch, 1 later"), read from the family it links to, and a `div.territory-key` in the index's own labels. On a phone a tile is the name, a short bar and the counts |
| Start here | `ol.start-here` | The few things not to skip | At most five cards in the risk colour, numbered by CSS, each linking to an entry or a family with a bold name and one line saying why. The whole card is the link. A `p.can-wait` says what may wait |
| Index | `div.index[data-rel-labels]` with `div.guide-tools` | Everything to look up, outside the reading path | The script fills the tools: a search with a visible label, a filter per relevance plus All with live counts, and a status line. The filter starts on the first relevance. The tools stick from 1100 px up |
| Family index | `details.family-index[id]` | One family of entries | The summary holds an `h3` and the derived counts. `h4.group` splits it. Open, it says how many entries the filter hides. A family with no match says "Nothing here matches" |
| Entry | `div.entry[id][data-rel]` with `b.name`, `p.def` and `div.entry-body` (`p.where`, optional `p.see`) | One field | A one-button row: the name, a relevance word with its glyph (● ◐ ○) and the definition. It opens to the example, the see-also links and "Copy link to this field". A jump to it opens it and lands with the jump outline |
| Relevance word | `span.rel`, written by the script from `data-rel` and the labels | How much an entry matters to the reader now | A glyph and a word, so colour is never the only cue: ● filled and tinted, ◐ outlined, ○ plain |
| Metaphor | `div.metaphor` | An analogy with an exact mapping | One per chapter at most; say where it stops |
| Callout | `div.callout` `.tip .warn .stop` | Something that changes what the reader does | Not for asides |
| Term box | `dl.term` | Plain-English definitions | Directly under the first use |
| Fold | `details.fold` | Machinery: commands, paths, tables, reasoning | Page must read with all folds closed |
| Reading tools | `button.tools-toggle`, written by the script before `.tools` | The reader's aids behind one button | The toggle reads "Reading tools" with a sliders icon, `aria-expanded` and `aria-controls`. `.tools` stays hidden until it is opened, and always without script. Open, it is a small panel: one 44 px row per tool, its keyboard key on the right where it has one, and Text size as three segments. Escape or a click outside closes it. Dark or light is not in the panel: the script moves `button[data-theme-toggle]` beside the toggle as a 44 px round icon button (`.theme-quick` in `div.tools-bar`), because readers look for it at once. A page with no Dark / light button at all, such as a ballot, gets one beside its meta line or title. On a wide screen the bar sits in the rail under the progress line. Below 1100 px the script moves it to the end of `.meta`. Print hides it |
| Focus mode | Reading tools row `[data-focus]` + `.focus-nav` | One chapter on screen at a time, reader paced | Built into the template; needs no content work beyond self-contained chapters |
| Read aloud | `button.read-aloud` | The chapter spoken, one block at a time | A 44 px speaker button in each chapter header, only where the browser can speak; folds and SVG text are skipped; the block being read is `.speaking` |
| Reading ruler | Reading tools row `[data-ruler]` | One block at full strength, the rest dimmed | Reader-triggered and remembered |
| Resume | `div.resume` | Where the reader left off | Under the answer bar, only when the stored chapter is not the first |
| Keys | `dialog.keys` | Keyboard shortcuts | J next chapter, K previous, F one-chapter mode, S skim, D theme, R ruler, ? this list; the Reading tools menu has a Keys row too |
| Finish state | `.finished` chip + `body[data-finished]` | Every chapter is done | Set when all Done boxes are ticked; the recap dot in the rail turns green; no confetti, no motion |
| Text size | Reading tools segments | The reader's own type size | Three segments (A−, A, A+): normal, 20 px, 22 px; remembered |
| Recap | `section.recap` | The remember lines, collected | Nothing new |
| The ask | `section.ask` | One question with 2 to 4 choices | Recommendation marked, "if you do nothing" stated |
| Answer field | `.answer-field` | A question the reader answers | A full-sentence question, a stable `data-q`, a `.hint` saying what a good answer holds. On a choice, `label[data-rec]` marks the recommended option with a ★ chip that shows the attribute's words ("Recommended", "My pick") |
| Buckets field | `fieldset.answer-field[data-kind="buckets"]` with `data-buckets="Now\|Next\|Later\|Not now"`, an `ol` of `li[data-id][data-rec]` (a `b` title and a `span` line), and the script's `.bucket-row` and `.rank-box` | Sorting items into 2 to 5 labelled buckets, then ordering the first | `data-buckets` holds 2 to 5 distinct labels with no colon. Every item has a unique `data-id` and a `data-rec` that names one bucket (the writer's pick, preset and marked ★). Up to 15 items. One row of 44 px bucket buttons per item (`aria-pressed`, a ✓ on the pressed one), a one-line summary ("All 6 match ★" or "2 of 6 changed from ★"), then the first bucket's items in a bordered box with the rank controls. Without script it reads as a list. The copies carry `Now 1: item`, one line per other item, and a JSON `buckets` object of ids |
| Rank controls | `fieldset.answer-field[data-kind="rank"]` with `ol > li[data-id]`; the script adds `.rank-moves`, `button[data-rank-ok]` and `.rank-say` | Putting items in order | Move up, Move down and Move to top at 44 px, each named for its item. The ends stay focusable and say "already". A polite status says "Speed moved to 2 of 3". "This order is right" makes the untouched order an answer. The reason textarea is copied in both copies, and the JSON copy carries `items` with ids |
| Collect bar | `.collect` | The reader's answers, ready to send | Exactly one per page, hidden until a field has a value |
| Ballot card | `article.ballot-card` with `.ballot-opts` of `button.ballot-opt` | One decision the reader rules on (gather `data-mode="ballot"`) | A picture (`.vis`) or a `.detail` line on every option, exactly one `data-rec` (put it first), a `p.skip`, a stable `data-q` and a `data-short` |
| Text option | `button.ballot-opt` with `span.name` and `span.detail`, no `.vis` | A ruling with nothing to draw | A bold label and one plain line in `--ink-soft`, the same tap target as a pictured option. Text options always stack on a phone |
| Source line | `p.ballot-source` | What the ballot rules on | Optional, right under the title: "Rules on: the plan, its date, its commit". Small and muted |
| Picks tray | `.ballot-tray` | The rulings so far, and the one action that hands them back | Pinned and visible from the first screen. A tally, 44 px jump dots, Copy picks as the only primary button and a live status line. `button[data-pick-rec]` ("Pick all ★") fills every unpicked single-choice card with its ★. A collapsed `details.ballot-review` lists one row per card, and a skipped card reads "★ (skipped)". Under the rows, `.ballot-note` holds one optional line, copied as `Note: ...`. When every pick is the ★ option, Copy picks is one line: "title: all ★ (recommended)" |

The stepper, the tabs and the reader tools are reader-triggered. Nothing autoplays, `prefers-reduced-motion` is respected, and with JavaScript off the page reads without them.

### Interactive figures

Readers skip clicks. An interactive figure must make its point in its default state, with nothing clicked: the stepper opens on step 1 with everything visible, the first tab is open, the minimap arrives already lit, and the atlas system map reads before any node is selected. The first step and the first tab carry the point, and the caption states the conclusion. Interaction adds detail for the reader who wants it; it never holds the point back.

### Ask and collect

A `data-type="gather"` page lets its chapters ask questions. The mechanic lives in the template script. The modes and the process are in `../../explainer-gather/SKILL.md`, and the markup of every kind is in the gallery chapter "Ask and collect".

- `data-kind` on an `.answer-field` picks the control: `text` (the default), `choice` (radio), `multi` (checkbox), `scale` (radios 1 to 5), `rank` (a list the reader moves, with Move to top and "This order is right"), `buckets` (a row of bucket buttons per item, then the first bucket in order), or `confirm` (understood, agree or concern, plus a comment). A rank or buckets field counts as answered only when the reader moves something, taps a bucket, writes a reason or presses "This order is right".
- Answers save in the browser as the reader types. The `.collect` bar appears with the first answer and shows "3 of 5 answered", and the rail dot of an answered chapter turns green.
- Copy all answers, Download .md and Copy JSON are the only ways answers leave the page. The Markdown copy has one `## [q] question` block per answer and a `## Not answered` list at the end. The JSON copy carries the same data. `merge.html` reads either shape and merges any number of respondents by question id.
- The page must pass the checker with every field empty.
- A decision page may use the same fields: a `fieldset.answer-field[data-kind="choice"]` straight after each `.decision` card, and one `.collect` bar after the recap instead of the ask.

## Composition patterns by page type

These are starting points, not templates. Drop what the content does not need. Every pattern except the roadmap, playbook and field guide puts the type's glance between the keep box and the map. `types.md` lists the glance picture, the required components and the checker rules for each type.

- **Decision page**: answer → keep → glance → map → one chapter per option or per ruling (each with a split or a small diagram) → a `.decision` per ruling, each followed by its answer field when the page answers by tapping → recap → the ask, or the one collect bar.
- **Status / where are we**: answer → keep → glance → map → timeline chapter with `li.here` → status board chapter → "what is next" chapter with steps → recap → ask only if something is blocked on the reader.
- **Spec / feature**: answer → keep → glance → map → "what it does" chapter with a flow → "what changes for you" chapter with a split and a wireframe if UI is touched → "how we know it works" chapter with a status board of checks → "risks" chapter with callouts → recap → ask (approve / hold).
- **Architecture / how it works**: answer → keep → glance → map → one chapter per layer, each with one SVG box map and a metaphor → "how a request travels" chapter with a flow → recap. A reference anchored to code is an atlas page; see the atlas add-on below.
- **What shipped**: answer → keep → glance → map → tiles for the counts that matter → one chapter per theme with split before/after → "what to do differently now" steps → recap.
- **Research findings**: answer → keep → glance → map → one chapter per finding, each carrying its evidence as tiles, a timeline, or a status board and the source quotes in a fold → "what this changes" chapter with a split → recap → ask only if the findings force a choice.
- **Ask and collect**: answer → keep → glance (the question dots and the first question) → map → one chapter per topic, each teaching only what its question needs and ending with its answer fields → recap → the collect bar.
- **Portfolio**: answer → keep → glance → map → a status board with a row per project → what moved → what is blocked → what waits on you (steps) → recap.
- **Public / customer**: answer → keep → glance → map → one chapter per kind of promise, each a `ul.promises` → a "How we know" fold in each → recap. No ask.
- **Teach**: answer → keep → glance → map → one chapter per layer, each with a term box and a figure → a short "try it" chapter of steps → recap.
- **Incident**: answer → keep → glance → map → what broke → the timeline → the cause chain (flow) → the follow-ups (status board) → what prevents a repeat → recap.
- **Pull request**: answer → keep → glance → map → a split of before and after → tiles for the diff stat → a status board of checks, each with its exit code → where to look first → recap.
- **Runbook**: answer → keep → glance → map → before you start → the procedure in `ol.runbook` chapters of five steps or fewer → when it goes wrong → recap.
- **Compare**: answer → keep → the grid as the glance → map → one chapter per criterion that decides → recap → the decision and ask if the reader must rule.
- **Roadmap**: answer → as-of line → keep → map → the lanes with their shipped and parked folds → what unblocks the most → what is parked on purpose → optionally "What else waits?" (backlog top, cut line, themes, parked shelf) → recap.
- **Tour**: answer → keep → glance → map → one chapter per task, each a tour of three to six steps → recap.
- **Playbook**: answer → keep → phase strip (the map is optional) → before and after → what the audience sees (frames) → the phases → what goes where (a grid with group rows) → roles and rules → the risky moment with its undo → the risks → costs and the decisions as answer fields → recap, with the collect bar after it. Up to ten chapters.
- **Field guide**: answer → keep → the territory map → the start-here list → the index → recap. Three chapters, no ask, and the index stays out of the reading path.
- **Mixed page**: most real pages mix two of the above. Take the chapter shapes from one and the closing from the other. The opening and closing contract never changes.

## Atlas add-on

An architecture atlas is a folder, not a single file: `index.html` beside `atlas.css` and `atlas.js`, copied from the atlas skill's `assets/` folder and loaded after the template block with `<link rel="stylesheet" href="atlas.css">` and `<script src="atlas.js" defer></script>`. Only atlas pages load them. Composition and anchor rules are in `../../explainer-atlas/SKILL.md`.

The add-on keeps three states apart everywhere, with one `.legend` before the first diagram. It is the single exception to the no-legend rule: it explains three line styles, and every node is still labelled on the node.

| State | Meaning | Look |
|---|---|---|
| Current | Behaviour that runs today | Solid border, `.state-current` |
| Dormant | Built but off, or test-only | Amber dashed border, `.state-dormant`; SVG nodes use `d-dormant` |
| Target | Adopted but not built | Dashed `--line-strong` border and no fill, `.state-target`; SVG nodes use `d-target` |

It adds a clickable system map (`.sysmap`), an "Inspect implementation" dialog for anchored source (`.inspect`), a trace swimlane (`ol.trace`), a trust matrix (`table.matrix`), rail search, and permalinks. Every claim that names code carries a `.anchor` with `data-src` and `data-line`. All of it works from the keyboard, respects `prefers-reduced-motion`, and prints as static content. Like every interactive figure, the system map must make its point before anything is selected.

## The one memorable thing

The page spends its boldness on memory offloading: the yellow keep cards at the top, the yellow remember strip closing every chapter, and the yellow recap at the end are the same colour on purpose. The reader learns in one page that yellow means "this is what you keep". Everything else stays quiet so that stays loud.

## What the evidence says

A verified research pass (September 2026, sources fetched and each claim adversarially checked) sorted the system's choices into three bins.

**Backed by evidence**

- Short single-topic paragraphs, a visible completed / current / pending state for a multi-step read, and a cue that restores context after attention is lost. W3C COGA "Making Content Usable" says all three. This is why the chapter rail, the done checkboxes, and the "Before this" line exist.
- Labels on the thing they name, never in a separate legend. Mayer and Moreno's spatial contiguity effect, corroborated by a later meta-analysis. This is why diagram text lives inside boxes and on arrows.
- A measure of 50 to 75 characters is the craft consensus (the page uses 62). Later empirical work questions how much it matters; treat it as convention, not law.
- Reader-controlled pacing. A small 2026 pilot found attention-adaptive chunking beat a static page, but only as a bundle and with eleven participants. A static file cannot adapt, so the page offers reader-controlled approximations: skim mode and one-chapter-at-a-time mode, plus the reader tools in the component vocabulary.

**Refuted, so the system will not add them**

- Bionic-style bolding of word beginnings. Peer-reviewed eye tracking shows no speed gain, no change in eye movements, and no "auto-completion" effect. Multiple studies converge on a null.
- Dyslexia-specific typefaces such as OpenDyslexic. No reading-speed or fixation benefit over ordinary fonts. General-legibility faces with distinct letterforms are the better bet, which is what Atkinson Hyperlegible Next is.

**Design choices, not evidence**

- The three-fact cap on the keep box. The popular "working memory holds three to four items" figure did not survive verification as stated. Three is kept because it is small, memorable, and forces the writer to choose. Do not cite it as science.
- Chapter length, the effect of a current-section map on comprehension, and an 80-character line limit attributed to WCAG all failed verification. The chapter rules stay as craft defaults.

## What this system refuses

- Cream paper with a warm-clay accent, or a near-black page with a single neon accent. Both read as generated and neither serves reading.
- All-caps or tracked-out text longer than a short fixed label (the chapter kicker and the keep label are the only ones), middle-dot meta strings, monospace for anything that is not code.
- Cards for everything. A chapter is a card; the things inside it mostly are not.
- Entrance animations, parallax, hover effects that change layout. Motion only answers the reader's action: a fold opening, a checkbox ticking, the progress bar following the scroll.
- Numbered markers on things that are not a sequence.
- Bionic bolding, dyslexia novelty fonts, and diagram legends (the atlas keeps one legend for its three line styles). See the evidence section above.
- Meaning carried by colour alone, and text on a fill below 4.5 to 1.
- An interactive figure whose default state hides the point.
- A page that needs the network. Fonts are progressive; everything else is inline.
