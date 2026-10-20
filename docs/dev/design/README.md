# Design canvases

Before a large visual change is built, its design is drawn on a claude.ai design canvas and approved there. This folder keeps the source of each canvas once its build has shipped, so the record does not depend on a session folder or on one account's artifacts.

Each canvas is a folder of `.dc.html` artboards and a `canvas.json` layout. These files run only inside the canvas editor. Read them as HTML and CSS; a browser will not render them on their own.

| Folder | Canvas | Shipped in | Status |
|---|---|---|---|
| `2026-10-14-roadmap-backlog-canvas/` | Roadmap and backlog design (canvas retired on 2026-10-20) | 1.6.0 | Archived here. The canvas's last version added a board of the live roadmap page in 1.9.0; `shipped-roadmap.webp` is that image. The shipped design is `docs/roadmap.html` and the roadmap parts of `skills/html-explainer/assets/gallery.html`. |

Two other canvases are recorded but not kept here, because their artboards hold private project content:

- **Field guide redesign**, shipped in 1.7.0. Retired on 2026-10-19: its boards redraw a private Lockercore field guide, and the shipped type replaces it. The public record is `docs/dev/proposals/2026-10-14-field-guide-type.md` and `skills/html-explainer/examples/field-guide.html`.
- **Explainer types redesign**, shipped in 1.8.0. On 2026-10-20 its canvas became the living designs canvas below, and its redesign boards were removed. They used Lockercore, FormIntact and Spire content; their source is kept in the private explainer-eval repository, and the public record is `docs/dev/plan/2026-10-15-1.8.0-redesign-build-spec.md`.

## The living designs canvas

**html-explainer designs**, https://claude.ai/artifact/5RJfShZTE4xS6BW4LhfSTq (private), is the one canvas kept current. It has two pages:

- **Current designs.** One board per kind of page (21), each the shipped example at 1280 px beside the same page on a phone, grouped by the job the reader has. The page name carries the release it shows.
- **Exploratory designs.** New ideas for a page type, today beside proposed. When an idea ships, its type's board on Current designs is replaced and the idea leaves this page.

After every release that changes how pages look:

1. Run `py -3 tools/current-designs.py <out dir>`. It renders `current-<kind>.webp` for all 21 kinds from the examples in this repository.
2. Upload the images to the canvas, point each `Current-<kind>.dc.html` board at its new image, and rename the page to the new release.

## Rule

Apart from the living designs canvas, a canvas is a design record, not a live reference. Once its build ships, its source moves here, or to a private repository when it holds private content. The proposal or build spec that names it says what shipped and in which release. After that the artifact may be retired, or kept as a record when it is still worth showing. A later redesign starts from the shipped examples and the gallery, not from an old canvas.
