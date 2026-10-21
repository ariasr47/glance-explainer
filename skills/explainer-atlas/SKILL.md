---
name: explainer-atlas
description: Use when asked for an architecture atlas, a system map, a backend or frontend reference, how a system fits together, or onboarding to a codebase.
license: MIT
---

# Explainer atlas

An atlas is an explainer page that maps one layer of a codebase. Every claim about code carries a file and line anchor, and three states are never mixed: current, dormant, target. It is a dated snapshot, so say so in the opening, and check current source before describing today's behaviour.

Paths are relative to this file. The template and checker live in the sibling `glance-explainer` skill, so install the three skills together.

## Inputs

- Repository path.
- Layer: backend, frontend, data, infra or whole system.
- The example entity to follow through the system, such as one uploaded file from request to deletion.
- Where the adopted target comes from: a contract, a proposal file or none.

## Steps

1. Read the code one layer at a time. Note the commit hash and date. This is the expensive step, so say so in your report.
2. Write anchored content. Every claim that names code carries `<span class="anchor" data-src="relative/path.py" data-line="120">path.py:120</span>`, with `data-src` relative to the repository root.
3. Compose chapters from this menu and keep only what applies: system map, one entity's journey, how data moves, request traces, processes and lifetimes, API, data model, storage and retention, identity and trust, states and failures, stack and deploy, sources and glossary. Put the journey before the reference chapters, so the page teaches first and answers lookups second. Draw the journey as `ol.journey`, one card per step, with its file anchors at the foot of the card.
4. Follow the core contract in `../glance-explainer/SKILL.md`: answer, keep facts, the glance and the chapter map first, engineering detail in folds, a remember line closing every chapter. The atlas's glance is the system map: put the `figure.sysmap` in `section.glance` and give that section an `id` such as `system`, so part links like `#system/lib` resolve. The chapter that explains the map builds on it and does not redraw it.
5. Add a key: a `div.legend` holding `span.state-current`, `span.state-dormant` and `span.state-target`, each saying what its state means. Put it inside the map's figure after the svg, or straight before the figure; `atlas.js` shows it under the map. Draw dormant nodes with `d-dormant` and target nodes with `d-target`, and name the state in the node label.
6. Put the revision stamp in the meta line: `<span data-revision="a1b2c3d">Revision a1b2c3d, 2026-10-07</span>`. Say once that the page is a snapshot, as one quiet line straight after the keep facts: `<div class="callout warn snapshot"><b>Snapshot, not a live view.</b><p>Line references point at commit a1b2c3d of 2026-10-07. Check the current source before you act on anything here.</p></div>`.
7. Mark up the map, source inspector, journey, traces, matrix and search as documented at the top of `assets/atlas.js`. Draw the map as one svg directly inside the figure (`atlas.js` boxes it in a well that scrolls sideways on a phone), every edge on its own track with a label, and give each trace an `id`. Give every map node a `data-layer` (for example Clients, Process, Storage, Outside services) and the figure a `data-layers` list in the order the chips should run: the map then gets a chip per layer with its count, beside the search. Write each `.node-detail` as one paragraph that opens with the part's name in `<b>`: the name becomes its title and its `a.anchor.inspect` links become pills above the sentence. The page's search moves above the map by itself.
8. Run `node ../glance-explainer/scripts/check.mjs index.html`, then `node scripts/anchors.mjs index.html --repo <path> --rev <hash>`. Fix every FAIL, missing file and out of range line.

## Output

A folder `docs/architecture/<layer>-atlas/` with `index.html` and copies of `assets/atlas.css` and `assets/atlas.js`. Start `index.html` from `../glance-explainer/assets/template.html`, set `data-type="atlas"` on `<html>`, link `atlas.css` after the template style block, and load `atlas.js` with `defer` after the template script. Keep the folder under 3 MB: embedded sources count.

## Reference

FormIntact's backend atlas in `C:\Dev\pdf-translator\docs\architecture\backend-atlas\` shows the quality to aim for. It is a reference, not a template to copy.
