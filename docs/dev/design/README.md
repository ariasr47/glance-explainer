# Design canvases

Before a large visual change is built, its design is drawn on a claude.ai design canvas and approved there. This folder keeps the source of each canvas once its build has shipped, so the record does not depend on a session folder or on one account's artifacts.

Each canvas is a folder of `.dc.html` artboards and a `canvas.json` layout. These files run only inside the canvas editor. Read them as HTML and CSS; a browser will not render them on their own.

| Folder | Canvas | Shipped in | Status |
|---|---|---|---|
| `2026-10-14-roadmap-backlog-canvas/` | Roadmap and backlog redesign, https://claude.ai/artifact/HbUB4LJmuTgJka7gchpeMV (private, razorstick account) | 1.6.0 | Archived. The shipped design is `docs/roadmap.html` and the roadmap parts of `skills/html-explainer/assets/gallery.html`. |

Two other canvases are recorded but not kept here, because their artboards hold private project content:

- **Field guide redesign**, https://claude.ai/artifact/1HocoT2mHHeiU6fpRcgQG4 (private, razorstick account), shipped in 1.7.0. Its boards redraw a private Lockercore field guide. The public record is `docs/dev/proposals/2026-10-14-field-guide-type.md` and `skills/html-explainer/examples/field-guide.html`.
- **Explainer types redesign**, https://claude.ai/artifact/5RJfShZTE4xS6BW4LhfSTq (private, rodrigoarias4 account), shipped in 1.8.0. Its boards use Lockercore, FormIntact and Spire content. Its source is kept in the private explainer-eval repository, and the public record is `docs/dev/plan/2026-10-15-1.8.0-redesign-build-spec.md`.

## Rule

A canvas is a design record, not a live reference. Once its build ships, its source moves here, or to a private repository when it holds private content. The proposal or build spec that names it says what shipped and in which release. After that the artifact may be deleted. A later redesign starts from the shipped examples and the gallery, not from an old canvas.
