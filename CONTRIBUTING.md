# Contributing

Thank you for helping. The most useful contribution right now is feedback from a real reader: [tell us how a page worked](https://github.com/ariasr47/glance-explainer/issues/new?template=feedback.yml). New page types are frozen until someone outside brings content the current types cannot hold (see [ROADMAP.md](ROADMAP.md)).

## How the repository is laid out

```text
.claude-plugin/          plugin.json and marketplace.json (this repository is a one-plugin marketplace)
hooks/                   Claude Code hooks, outside the portable skills: hooks.json and explainer-check.mjs (runs the page checker by itself)
skills/
  glance-explainer/        the core skill, self-contained
    SKILL.md
    references/          types.md, design-system.md, diagrams.md, writing.md
    assets/              template.html, gallery.html, i18n/
    scripts/             check.mjs (the page checker), translate.mjs, upgrade.mjs (brings an old page to the current template)
    examples/            playbook.html, field-guide.html
  explainer-gather/      pages that ask and collect
    SKILL.md
    references/          modes.md
    assets/              merge.html
    examples/            ballot.html
  explainer-atlas/       architecture atlases
    SKILL.md
    assets/              atlas.css, atlas.js
    scripts/             anchors.mjs
docs/
  index.html, roadmap.html   the public site, made with the plugin
  install.md                 every install route
  images/                    screenshots for the README and the site
  dev/                       plans, proposals, research and parked work (history; paths there are as they were)
tools/check-repo.mjs     repository checks, run by CI
```

Each skill folder works on its own, because installers for other agents copy one skill folder at a time. A skill names its files by paths relative to its own `SKILL.md`. Gather and atlas reach the core skill's template and checker through `../glance-explainer/`, which works because the three are always installed side by side. Never point a skill at `docs/`, `tools/`, `hooks/` or anything outside `skills/`. The hooks may reach into `skills/` (they run the core skill's checker), never the other way round.

## Try your change

There is no build step. The scripts need Node 18 or newer and nothing else.

```bash
node tools/check-repo.mjs
```

It checks every shipped page with the page checker, that the gallery's style and script match the template's, that every path a skill names exists, that the manifests agree, that the template's generator mark matches the plugin version, and that `hooks/hooks.json` runs scripts that exist. CI runs the same script on every push and pull request.

To check a single page:

```bash
node skills/glance-explainer/scripts/check.mjs path/to/page.html
```

Exit code 0 means every hard rule passed. Warnings are advice. `--json` prints the result as JSON. The checker cannot see layout: open a changed page in a browser at phone width (390 px) and desktop width, in light and dark, and look for sideways scroll and words split across lines.

To load your working copy as the plugin for one Claude Code session, without touching your installed copy:

```bash
claude --plugin-dir /path/to/glance-explainer
```

If you also have the marketplace version installed, disable it for that session or you will have two plugins with the same name.

## Changing the design

- All tokens, component CSS and the reader script live in `skills/glance-explainer/assets/template.html`. The gallery carries a byte-identical copy of the template's `<style>` and `<script>` blocks so it stays a single file. After changing the template, paste both blocks into the gallery. `tools/check-repo.mjs` fails until they match.
- Atlas-only CSS and script live in `skills/explainer-atlas/assets/`, never in the template.
- Six meaning colours, one meaning each, and never colour alone. Add a component only when a new kind of information needs one, and document it in `references/design-system.md` and the gallery.
- Prose follows `references/writing.md`: plain English, short sentences, one idea each.

## Releasing

1. Update `version` in `.claude-plugin/plugin.json` and add a section to `CHANGELOG.md`. The generator mark in the template's `<head>` (`<meta name="generator" content="glance-explainer X.Y.Z">`) moves with the plugin version, and `tools/check-repo.mjs` fails until the two agree. Also add the release to `KNOWN` in `skills/glance-explainer/scripts/upgrade.mjs`, so the next release can name pages made with this one: run `node skills/glance-explainer/scripts/upgrade.mjs --hash skills/glance-explainer/assets/template.html` and copy the result.
2. Run `node tools/check-repo.mjs` and `claude plugin validate --strict .`.
3. Merge to `main`, tag `vX.Y.Z`, push the tag, and create a GitHub release from the changelog section.
4. Users on the marketplace get the new version when they update. The public site redeploys from `main` on its own.

## Conventions

- Conventional commits with a scope: `feat(checker):`, `fix(template):`, `docs(site):`, `chore(release):`.
- LF line endings, pinned by `.gitattributes`.
- Withdrawn work is parked, not deleted: move it to `docs/dev/parked/` with the reason and what would restore it.
