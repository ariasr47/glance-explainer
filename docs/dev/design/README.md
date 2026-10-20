# Design canvases

Before a large visual change is built, its design is drawn on a claude.ai design canvas and approved there. This folder keeps the source of each canvas once its build has shipped, so the record does not depend on a session folder or on one account's artifacts.

Each canvas is a folder of `.dc.html` artboards and a `canvas.json` layout. These files run only inside the canvas editor. Read them as HTML and CSS; a browser will not render them on their own.

| Folder | Canvas | Shipped in | Status |
|---|---|---|---|
| `2026-10-14-roadmap-backlog-canvas/` | Roadmap and backlog design (shipped in 1.6.0), https://claude.ai/artifact/HbUB4LJmuTgJka7gchpeMV (private) | 1.6.0 | Kept as a record (2026-10-19). A fourth board, added 2026-10-20, shows the live roadmap page in 1.9.0; `shipped-roadmap.webp` here is that image. The shipped design is `docs/roadmap.html` and the roadmap parts of `skills/html-explainer/assets/gallery.html`. |

Two other canvases are recorded but not kept here, because their artboards hold private project content:

- **Field guide redesign**, shipped in 1.7.0. Retired on 2026-10-19: its boards redraw a private Lockercore field guide, and the shipped type replaces it. The public record is `docs/dev/proposals/2026-10-14-field-guide-type.md` and `skills/html-explainer/examples/field-guide.html`.
- **Explainer types redesign**, https://claude.ai/artifact/5RJfShZTE4xS6BW4LhfSTq (private), shipped in 1.8.0. Kept as a record (2026-10-19). Its boards use Lockercore, FormIntact and Spire content. Its source is kept in the private explainer-eval repository, and the public record is `docs/dev/plan/2026-10-15-1.8.0-redesign-build-spec.md`.

## Rule

A canvas is a design record, not a live reference. Once its build ships, its source moves here, or to a private repository when it holds private content. The proposal or build spec that names it says what shipped and in which release. After that the artifact may be retired, or kept as a record when it is still worth showing. A later redesign starts from the shipped examples and the gallery, not from an old canvas.
