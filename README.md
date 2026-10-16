<div align="center">

# html-explainer

**Pages you can decide from.**

A Claude Code plugin that turns what your agent did into one page you can read in minutes:<br>
the answer first, a picture in every chapter, one question when you must decide, and checked before it reaches you.

[![CI](https://github.com/ariasr47/html-explainer-skill/actions/workflows/ci.yml/badge.svg)](https://github.com/ariasr47/html-explainer-skill/actions/workflows/ci.yml)
[![Version](https://img.shields.io/github/v/tag/ariasr47/html-explainer-skill?label=version&color=2457d6)](CHANGELOG.md)
[![License: MIT](https://img.shields.io/badge/license-MIT-2457d6)](LICENSE)
[![Agent Skills](https://img.shields.io/badge/Agent%20Skills-compatible-2457d6)](https://agentskills.io)

**[See live examples](https://ariasr47.github.io/html-explainer-skill/)** · [Install](#install) · [What it makes](#what-it-makes) · [Roadmap](ROADMAP.md) · [Changelog](CHANGELOG.md)

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/images/hero-dark.png">
  <img alt="A plan page on a desktop and a decision ballot on a phone, both made by the plugin" src="docs/images/hero-light.png" width="820">
</picture>

</div>

## Why

Agents write more than anyone can read: long summaries, plans, diffs and status reports. When you have to approve something or choose between options, a wall of text costs attention you may not have, especially with ADHD or a short working memory.

Every page this plugin makes has the same shape:

1. **The answer**, in one sentence, right under the title.
2. **At most three facts** to keep in your head.
3. **At a glance**: the page's own picture on the first screen, such as a status board, the steps of a procedure or the options side by side.
4. **One idea per chapter**, each with a picture, each closing with one line to remember.
5. **A recap**, and **one question** only when a decision is needed, with the recommended choice marked and what happens if you do nothing.

## What makes it different

- **Checked before you see it.** A checker script runs on every page and the agent fixes each failure first: answer length, at most three keep facts, a picture per chapter, text contrast of 4.5 to 1 in light and dark, status colours that always carry a glyph, diagram labels readable on a phone, and the rules of each page type. In Claude Code a hook runs it at the end of every turn that wrote a page, so it cannot be skipped.
- **The reader is in control.** One Reading tools button holds skim mode, one chapter at a time, a reading ruler, text size, dark or light and keyboard shortcuts. Each chapter can be read aloud, and a link resumes where you left off. Nothing moves unless you ask.
- **Answer by tapping.** A decision page can end in tap-to-answer fields, and a ballot puts one decision per card, pictured or in words, with a Pick all ★ button and warning chips such as "Can't undo". You copy every answer back to the agent in one paste, and a gather page collects answers from several readers, which a merge tool combines.
- **One file, offline, private.** Each page is a single HTML file. No server, no account, no tracking. It works on a phone and prints cleanly.

## See it

| Page | What it shows |
|---|---|
| [A plan for one risky change](https://ariasr47.github.io/html-explainer-skill/examples/playbook.html) | A playbook: moving a team wiki, with phases, who notices what, the undo plan and the risks |
| [A field guide to look things up in](https://ariasr47.github.io/html-explainer-skill/examples/field-guide.html) | A field guide: web product work for a small notes app, with a map by stage, the four fields that come first and 30 entries to search |
| [Four decisions on one phone screen](https://ariasr47.github.io/html-explainer-skill/examples/ballot.html) | A ballot: tap a pictured option per card, then copy the picks back to the agent |
| [Every component](https://ariasr47.github.io/html-explainer-skill/gallery.html) | The gallery: each building block with real content, in both themes |
| [The roadmap](https://ariasr47.github.io/html-explainer-skill/roadmap.html) | This project's roadmap as a roadmap page |
| [The site's home page](https://ariasr47.github.io/html-explainer-skill/) | A public page: what the plugin promises, with the evidence behind each promise |

All six were made with the plugin and pass its checker.

## Install

In Claude Code:

```text
/plugin marketplace add ariasr47/html-explainer-skill
/plugin install html-explainer@html-explainer-skill
```

Restart Claude Code, then ask: *"Make an html explainer for this spec."*

Node 18 or newer runs the checker; nothing else installs. **[The install guide](docs/install.md)** covers installing from a shell, setting it up for a whole team, updating, other agents such as Codex, Cursor, Gemini CLI and Copilot, and what to do when a skill does not start.

## Use

Ask in plain words. The agent picks the page type, writes the page from the template, runs the checker, saves it under `docs/explainers/` and gives you the link.

| When you need to | Ask it like this | Page types |
|---|---|---|
| Decide | "Make an html explainer for the three decisions you need from me." | decision, compare |
| Know where things stand | "Explain where we are with the project as an html explainer." | status, release, incident, pr, portfolio |
| Approve a plan | "Turn this spec into an html explainer I can approve." | spec, roadmap, research, playbook |
| Hand over or teach | "Write a handover page for whoever picks this up." | handover, teach, tour |
| Look things up | "Make a field guide to this field that I can search later." | field-guide |
| Follow a procedure | "Make a runbook page for the release steps." | runbook |
| Tell customers | "Explain to customers what happens to the file they upload." | public |
| Ask a group | "Make a page that asks my team these questions and collects their answers." | gather (11 modes, including ballot) |
| Map a codebase | "Write a backend architecture atlas for this repository." | atlas |

To call a skill directly, type `/html-explainer:html-explainer <topic>`, `/html-explainer:explainer-gather <topic>` or `/html-explainer:explainer-atlas <layer>`.

To bring a page made with an older release up to the current design, ask: *"Upgrade this page to the current html-explainer design."* The agent runs `upgrade.mjs`, which keeps your content and saves a backup.

## What it makes

<details>
<summary><b>Seventeen page types</b>, each with its own chapters, required components and checker rules</summary>

| Type | When |
|---|---|
| decision | You must rule on options a session poses. |
| status | You need to know where things stand and what comes next. |
| spec | You must approve a feature before it is built. |
| release | You need to know what shipped and what to do differently now. |
| research | You need findings and how far to trust each one. |
| handover | A session or a person takes over work in progress. |
| portfolio | You own several projects and need all of them at once. |
| public | The reader is a customer who needs to know what the product does for them. |
| teach | A newcomer must learn one system well enough to work with it. |
| incident | Something broke: what happened, why, what is fixed, and what stops a repeat. |
| pr | A reviewer must understand a pull request before reading its diff. |
| runbook | Someone follows a procedure and must know after each step whether it worked. |
| compare | You choose between options measured on the same few criteria. |
| roadmap | What is under way now, next and later, and what depends on what. |
| tour | How a product works, step by step, on its real screens. |
| playbook | You rule on a plan for one risky, multi-step change. |
| field-guide | You need to get oriented in a whole field once, then look things up. |

Full definitions: [`skills/html-explainer/references/types.md`](skills/html-explainer/references/types.md).
</details>

<details>
<summary><b>Eleven ways to ask and collect</b> with explainer-gather</summary>

collect, confirm, choose, ballot, prioritise, annotate, check, protocol, pilot, readout and recurring. Answers save in the reader's browser until they copy them as Markdown or JSON or download a file. [`merge.html`](skills/explainer-gather/assets/merge.html) combines any number of copies, grouped by question, and exports Markdown, JSON or CSV. Details: [`references/modes.md`](skills/explainer-gather/references/modes.md).
</details>

<details>
<summary><b>Architecture atlases</b> with explainer-atlas</summary>

A folder with `index.html`, `atlas.css` and `atlas.js` that maps one layer of a codebase: backend, frontend, data, infrastructure or the whole system. Every claim that names code carries a file and line anchor, current, dormant and target states stay visually apart, and [`anchors.mjs`](skills/explainer-atlas/scripts/anchors.mjs) confirms each anchor exists at the recorded revision.
</details>

<details>
<summary><b>Japanese pages</b></summary>

With `<html lang="ja">` the template switches to BIZ UDPGothic, a looser line height, strict line breaking and no italics, and the checker counts characters instead of words. [`translate.mjs`](skills/html-explainer/scripts/translate.mjs) turns a finished English page into a Japanese one with the same layout and question ids, so answers in both languages merge.
</details>

## Design in one paragraph

Cool fog paper, deep navy ink, one cobalt for "you are here", four meaning colours (green done, amber caution, red blocked, purple your choice), and yellow for anything you are asked to remember. Colour is never the only signal. Lexend for headings, Atkinson Hyperlegible Next for body text, 18 px base, 62-character lines, left aligned. Dark mode follows your system. The full system is in [`references/design-system.md`](skills/html-explainer/references/design-system.md).

## What is in the repository

| Path | What it holds |
|---|---|
| [`skills/html-explainer/`](skills/html-explainer/) | The core skill: template, gallery, checker, page types and writing rules |
| [`skills/explainer-gather/`](skills/explainer-gather/) | Pages that ask and collect, the merge tool and the ballot example |
| [`skills/explainer-atlas/`](skills/explainer-atlas/) | Architecture atlases and the anchor checker |
| [`docs/`](docs/) | The public site, the install guide, screenshots and planning history |
| [`.claude-plugin/`](.claude-plugin/) | Plugin and marketplace manifests |
| [`tools/check-repo.mjs`](tools/check-repo.mjs) | The checks CI runs on every change |

Each skill folder is self-contained in the [Agent Skills](https://agentskills.io) layout. [CONTRIBUTING.md](CONTRIBUTING.md) explains how to change the design, run the checks and release.

## Roadmap and feedback

Next: the skill starts reliably when asked, pages get tested with outside readers, and the plugin gets its final name and a directory listing. See [ROADMAP.md](ROADMAP.md).

If you try a page, [say how it went](https://github.com/ariasr47/html-explainer-skill/issues/new?template=feedback.yml), especially if you or your reader has ADHD. That feedback decides what gets built.

## Licence

MIT. Fonts load from Google Fonts under the SIL Open Font License and are optional; pages fall back to system fonts.
