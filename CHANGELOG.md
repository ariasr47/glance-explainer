# Changelog

Each release is a git tag and the `version` in `.claude-plugin/plugin.json`. Pages carry their own copy of the template, so a fix reaches a page only when the page is made again.

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
