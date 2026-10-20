# Changelog

Each release is a git tag and the `version` in `.claude-plugin/plugin.json`. Pages carry their own copy of the template, so a fix reaches a page only when the page is made again.

## 1.9.1 (2026-10-20)

### Fixed
- **Dark or light is one tap again.** Since 1.8.0 the switch sat inside the Reading tools menu, so pages looked light-only to anyone who did not open it. It is now a round icon button beside Reading tools, in the rail on a wide screen and on the meta line on a phone. The D key still works.
- **Ballots can switch too.** A ballot page had no Dark / light button at all. Any page without one now gets the switch beside its meta line or title.
- Old pages get both fixes through `upgrade.mjs`.

## 1.9.0 (2026-10-16)

A working public example of every kind of page. Before, a prospective user could open six: the playbook, field guide, ballot, roadmap, the site's home page and the gallery. The other examples were private, because they used real project content.

### Added
- **Sixteen new examples**, written fresh, each passing the checker with no warnings.
  - **About a made-up notes app,** labelled as made-up data: decision, spec, compare, research, status, incident, handover, portfolio, teach and a questionnaire.
  - **About this plugin, with real facts from this repository:** a release note for 1.8.0 and 1.8.1, the pull request page for #9, the release runbook, an explainer of why every page opens with the answer, a tour on real screenshots of the examples, and an atlas of this repository with 69 file anchors.
- **An examples page on the site** (`examples.html`) with a card for each of the 21 kinds of page, grouped by the job you have. Each card shows the type's own picture.
- **A thumbnail grid in the README** that links each example to its live page.

### Changed
- **The repo check covers every example.** `tools/check-repo.mjs` now finds every page under `skills/*/examples/`. It runs the checker on each one and requires the template's current blocks, so a published example cannot fall behind the design.
- **The site build publishes every example,** the atlas folder included.

### Fixed
- **Captions in a glance.** The glance's take-line style no longer strips the padding from a caption inside a figure or frame in the glance.
- **Drafts are not checked.** The stop check skips an HTML file with no `<style>` block, such as a page body a build script will wrap. Before, such drafts failed at every turn.
- **Atlas tables keep whole words.** Matrix cells no longer split words mid-word on a phone.

## 1.8.1 (2026-10-15)

A polish round on the 1.8.0 redesign, after a close look at the gallery, the examples and real pages at both widths and in both themes.

### Changed
- **Labels in sentence case.** The keep label, a chapter's kicker, small headings in a glance and the runbook overview's chapter names were in spaced capitals. They are authored text and can be long ("Chapter 1 of 5, about 1 minute"), and capitals slow reading. Short labels the page writes itself, such as "In this page", stay in capitals.
- **The rail's lines fit.** Each chapter's line in the rail shows its minutes first and stops at two lines.
- **Calmer callouts.** A tip, a warning or a stop is a white card with a hairline in its colour, and a glyph before its title. It used to be a full tint with a thick left bar.
- **Roomier flow steps.** A step's number sits beside its title, and the line under it uses the card's full width, so narrow steps no longer squeeze their text.
- **Quieter "Before this".** The gap after the bold lead is now a normal space.

### Fixed
- **The mini-map on a phone.** It scrolls sideways instead of shrinking its labels to 7 px.
- **Atlas snapshot line.** The quiet snapshot line also applies when the chapter map sits between the keep box and the warning. An atlas page built before 1.8.0 carries its own atlas styles, so it shows the quiet line once it is built again.

## 1.8.0 (2026-10-15)

Every page type redesigned around its own picture. A review of 21 real pages found that 19 types opened with the same first phone screen, so a status report looked like a release note until the third screen. Every type was redrawn on a canvas, today beside redesigned, and Rodrigo approved them before the build.

### Changed
- **The opening.**
  - The answer is the page's headline, with no box.
  - The three keep facts sit side by side as cards.
  - On a computer, the side rail is the chapter map: each chapter's one line and its minutes, a number per chapter and an "N of M read" bar.
  - On a phone, the chapter map is a compact list and the two rows of tool chips are gone.
- **One Reading tools button** holds skim mode, one chapter at a time, the reading ruler, text size (A−, A, A+), dark or light, and the keys. It replaces six buttons.
- **A calmer chapter.**
  - Read aloud and Done are small icon buttons.
  - "Before this" is a quiet line. The take line is a caption, and folds are quiet rows.
  - Remember is the only tinted strip.
  - Four look-alike bars per chapter became two.
- **Calmer colour.**
  - The before pane of a split is white, and the after pane has a thin green rule.
  - The recommended option is marked in purple with ★ inside its card.
  - Tile numbers are ink.
  - A runbook's check and failure lines are quiet glyph lines, not red and green boxes.
  - Customer pages drop the Done control and the progress line.
- **Old pages get the new look** through `upgrade.mjs`. On 21 real pages brought from 1.7.0, phone height fell by a median of 9%, up to 15% for a runbook, with no markup changed.
- **The atlas:**
  - layer filter chips beside the search
  - a detail line for the part you pick
  - a key for current, dormant and target
  - a journey strip with file anchors
  - the snapshot warning as one quiet line

### Added
- **At a glance**, a section after the keep box that puts the type's own picture on the first screen. `types.md` names the picture for each type; roadmap, playbook, field-guide and ballot pages already open with theirs.
- **New parts for the glance:**
  - `div.duo`, two columns.
  - `div.cols`, two or three state columns.
  - `ul.findings`, each finding with its strength in words and bars.
  - `ol.layers`, a system as layers with "You are here".
- **Four pictures the page draws for itself,** from parts already on the page, so nothing is typed twice:
  - `div.runbook-overview`: every step as a checklist that shares the steps' done state.
  - `div.filmstrip`: a tour's screens as thumbnails.
  - `div.rulings`: a decision page's rulings, with the recommendation and the state.
  - `div.qprogress`: a questionnaire's questions as dots that fill as you answer.
- **Checker rules.**
  - A page from 1.8.0 on without a glance gets a warning, and a glance without a take line gets one too. Older pages are never warned.
  - Each new part fails when its data is wrong, or when it is missing what it draws from.

### Fixed
- **No rail, no error.** A page with no side rail, such as a ballot, no longer stops the reader script.

## 1.7.0 (2026-10-14)

### Added
- **The `field-guide` page type**, a reference you read once to get oriented and then come back to look things up in. Rodrigo asked for it after a real field guide fought the explainer contract: 33 phone screens, 85 open cards and six chapters over the word limit. It was designed on a canvas and approved before the build.
  - **A short reading path:** the answer, three facts and three chapters (where everything fits, which ones cannot wait, look something up). The index does not count toward the word limits.
  - **One territory map by stage,** with "You are here", and a bar and counts per family. The script counts these from the entries, so they cannot drift.
  - **A start-here list** of at most five items that cannot wait, each with why.
  - **A searchable index.**
    - Families fold away, and entries are one-line rows that open to show where you meet them, see-also links and a copy-link button.
    - The relevance filter starts on Now and always says how many are shown.
    - A link to an entry opens it, even through a filter.
  - **Checker rules** for its required parts, entries, relevance values and links.
  - **A public example:** `examples/field-guide.html`, about web product work for a small notes app.
  - **Measured on a real 85-entry guide remade with it:** 6,186 px on a phone instead of 28,224, 78% shorter.

### Fixed
- **Newer pages are left alone.** The automatic check now skips a page made by a newer release than the installed plugin, because an older checker may not know its type. Before, a 1.7.0 page in a repository failed the 1.6.0 check of another session at every turn.

### Changed
- **The type freeze has a recorded exception.** `docs/install.md` names two limits of the automatic check: pages from newer releases, and pages another program writes into the same repository during a turn.

## 1.6.0 (2026-10-14)

Roadmaps that say what they mean, and prioritising that adds up. Designed on a canvas and approved before the build; the research behind it compared roadmap and backlog practice with what short-memory readers can hold.

### Added
- **Roadmap lanes state their meaning.** A `p.lane-note` under each lane gives the horizon, the confidence and whether the lane is ordered. Each card's status word ("Under way", "Waits on another", "Needs your ruling", "Blocked", "Done", "Planned") comes from its class, so one mark means one thing on every page.
- **Exceptions only.** `data-conf="exploring"` with a `small.conf` reason gives a dashed card. A `small.when` line marks a real fixed date. `small.outside` names a blocker outside the roadmap.
- **Derived dependencies.** The page counts "Unblocks N" from the After links. A jump to an item shows "You jumped here" with a link back.
- **Folds for history.** Shipped and parked work folds below the lanes. A `p.asof` line says the roadmap is a plan, not a promise.
- **A backlog view** for a roadmap chapter: the top five ranked, a cut line, themes folded with their count and top item, and a parked shelf with why and what brings each item back.
- **Buckets for prioritising.** A `data-kind="buckets"` field sorts each item into Now, Next, Later or Not now, with the recommendation preset, then orders only the first bucket.
- **A combined ranking in `merge.html`.** With three or more readers: the average place, a spread bar, a Contested flag and how much readers agree, in words. Exports carry the combined columns. CI checks the arithmetic on a fixed sample.

### Fixed
- **Rank answers.** An untouched rank is now an answer, through "This order is right". Items carry ids, the reason is copied, moves are announced, and "Move to top" saves taps.
- **Badges in lane cards.** `.who` and `.chip` inside a lane card were invisible. They render now.
- **Nested folds.** The checker no longer reports a false FAIL for a fold inside a fold.

### Changed
- **Roadmap warnings.** New checker warnings for roadmap pages:
  - a lane without a note
  - a waiting card without an After or Outside line
  - more than five live cards in a lane
  - shipped work left in Now
  - a missing as-of line
  - backlog limits
  - a rank item without an id
- **Buckets checks.** A malformed buckets field fails, since buckets are new.
- **Docs.** `modes.md` no longer marks the combined ranking parked. A ballot is documented as fitting 5 to 15 decisions.
- **Site and examples.** The site's pages and both examples carry the 1.6.0 design. The public roadmap page uses the new lanes.

## 1.5.0 (2026-10-13)

### Added
- **The checker runs by itself** (Claude Code only). Three plugin hooks note each explainer page a turn writes, then run the checker before the agent finishes. Any FAIL goes back to the agent with the failing lines, at most three times per turn. Pages written by a script are covered when they sit in the session's git repository. The hooks never change a file, never use the network, and step aside on any internal error.
- **`upgrade.mjs`** brings a page made with an older release to the current design. It swaps the page's template style and script for the current ones, keeps the content byte for byte, saves a `.bak`, and puts the original back if the result fails the checker. It recognises every release from 1.0.0 and skips pages with hand-edited styles unless you pass `--force`.
- **A version mark.** Pages carry `<meta name="generator" content="html-explainer 1.5.0">`, so the upgrader and the skill know which release made them.
- **Decision pages can end in tap-to-answer fields** and one copy bar, instead of a typed reply.
- **Ballots:** options without pictures (a label and one detail line), a Pick all ★ button, warning chips such as "Can't undo" (`data-warn`), a review list with an optional note, a one-line paste when every pick is ★, and an optional line naming the plan the ballot rules on.

### Fixed
- A link whose target is just `#`, such as the ask's choices, no longer blanks the page inside an embedded viewer.

### Changed
- The checker's decision rule accepts an `.ask` or answer fields with one `.collect` bar. A ballot option passes with a picture or a detail line. Empty or long `data-warn` chips get a warning.
- The site pages, the gallery and both examples carry the 1.5.0 design; the site and the playbook example were brought there with `upgrade.mjs`.

## 1.4.0 (2026-10-13)

### Fixed
- **Chapter links work in embedded viewers.** Links to a place in the page (the chapter list, the chapter map, the phase strip, "after" links on a roadmap) now scroll by script. Before, a viewer that shows the page inside a frame, such as a preview pane, treated the click as leaving the page and showed a blank frame.

### Changed
- **Each skill folder is self-contained**, in the [Agent Skills](https://agentskills.io) layout: `SKILL.md`, then `references/`, `assets/`, `scripts/` and `examples/`. Installers that copy one skill folder at a time (`gh skill install`, `npx skills add`) now get working skills. The gather and atlas skills use the core skill's template and checker through `../html-explainer/`, so install the three together.
- **The root `SKILL.md` shim is retired.** It made `npx skills add` install the whole repository as one skill. It is parked in `docs/dev/parked/` with the reason and how to restore it. If you cloned this repository into `~/.claude/skills/html-explainer`, delete that folder and install the plugin instead (see `docs/install.md`).
- Planning history (plans, proposals, research, scenarios, old screenshots) moved to `docs/dev/`.
- Each `SKILL.md` declares `license: MIT`. `plugin.json` gains `homepage` and `keywords`.

| Before | Now |
|---|---|
| `assets/template.html`, `assets/gallery.html`, `assets/i18n/` | `skills/html-explainer/assets/` |
| `assets/design-system.md`, `diagrams.md`, `writing.md`, `skills/html-explainer/types.md` | `skills/html-explainer/references/` |
| `scripts/check.mjs`, `scripts/translate.mjs` | `skills/html-explainer/scripts/` |
| `docs/examples/playbook.html` | `skills/html-explainer/examples/` |
| `assets/merge.html` | `skills/explainer-gather/assets/` |
| `skills/explainer-gather/modes.md` | `skills/explainer-gather/references/` |
| `docs/examples/ballot.html` | `skills/explainer-gather/examples/` |
| `assets/atlas.css`, `assets/atlas.js` | `skills/explainer-atlas/assets/` |
| `scripts/anchors.mjs` | `skills/explainer-atlas/scripts/` |

### Added
- A public site, [ariasr47.github.io/html-explainer-skill](https://ariasr47.github.io/html-explainer-skill/), with live examples, the gallery and a roadmap page, all made with the plugin.
- `docs/install.md` (every install route), `ROADMAP.md`, `CONTRIBUTING.md`, this changelog, and issue forms for feedback and bugs.
- `tools/check-repo.mjs`, run by CI on every push and pull request: every shipped page passes the checker, the gallery matches the template, every path a skill names exists, and the manifests agree.

## 1.3.0 (2026-10-13)

### Added
- **Playbook page type**, for one risky change and one decision-maker: a phase strip, phases with a line on who notices, frames of what the audience sees, roles and rules, an undo box and risk cards. Up to ten chapters. Example: moving a team wiki to a new host.

### Fixed
- The ballot's Copy picks button stays on screen with many cards.
- Tables, flows and timelines keep words whole; a crowded table scrolls inside its own box.
- A timeline that wraps keeps its line on the second row.
- Long commands wrap instead of hiding their end; Copy still copies the exact text.
- Runbook numbering continues across chapters with `start`.
- Inline code no longer breaks remember lines and carry-forward lines.
- On phones and tablets, jump links land below the sticky chapter bar.

## 1.2.0 (2026-10-13)

### Added
- **Nine page types:** portfolio, public, teach, incident, pr, runbook, compare, roadmap and tour, with their components: comparison grids, now-next-later lanes, runbooks with copyable commands, product tours on real screens, and customer promises with hidden evidence.
- **Ballot mode** for explainer-gather: one card per decision, a picture on every option, and a pinned bar that copies the picks back to the agent.
- Japanese interface strings for the new components.

## 1.1.1 (2026-10-10)

### Fixed
- Smooth scrolling removed; chapter links stalled in embedded browser panes.

## 1.1.0 (2026-10-08)

### Fixed
- Diagrams stay readable on phones: wide drawings scroll, or a narrow version replaces them. The checker fails labels under 9 px on a phone and warns when a picture has no take line.
- Big numbers in tiles no longer break; skim mode is shorter; the opening fits a phone.
- The checker ignores code shown inside pages.
- Atlas search also finds rail labels and body text.

## 1.0.0 (2026-10-07)

First plugin release.

- Three skills: `html-explainer`; `explainer-gather` with ten modes and a merge tool for collected answers; `explainer-atlas` with a system map, source inspector, traces, matrix, search and an anchor checker.
- Six page types: decision, status, spec, release, research and handover.
- The checker computes contrast from the colour tokens in each theme and enforces glyphs beside colour, per-type rules and Japanese character limits.
- Reader tools on every page: skim mode, one chapter at a time, read aloud, reading ruler, text size, dark or light, keyboard shortcuts and resume.
- Japanese pages, interface strings, a glossary and a translation sidecar.

## Before 1.0.0

The standalone skill, first committed on 2026-09-16: the single-file explainer design system and one-chapter-at-a-time focus mode.
