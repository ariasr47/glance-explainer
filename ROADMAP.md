# Roadmap

What comes next and why, as of 20 October 2026. The plugin is free and MIT licensed, and it will stay that way. To ask for something, [open an issue](https://github.com/ariasr47/html-explainer-skill/issues/new/choose). A request from someone who has used a page moves an item up faster than anything else.

**Focus.** Decision pages for readers who can't hold a long document, checked before they ship. Work that makes pages more trustworthy, easier to install or easier to read comes before new page types.

A rendered version of this roadmap, made with the plugin, is at [ariasr47.github.io/html-explainer-skill/roadmap.html](https://ariasr47.github.io/html-explainer-skill/roadmap.html).

## Now: October and November 2026

None of these has started yet. October went to the page redesign (1.8.0 and 1.8.1) and a public example of every kind of page (1.9.0). The 12 December review date stands.

| # | Item | Why |
|---|---|---|
| 1 | **Trigger reliably.** Sharper skill descriptions and a trigger test suite built with `claude plugin eval`, covering the phrases people actually type. | In the author's own sessions about two requests in three did not visibly load the skill. |
| 2 | **Test with outside readers.** Five to ten readers, some with ADHD, read the same content three ways: a plugin page, a default Claude page and plain Markdown. We measure time to a correct decision and what they remember a day later. | Every page so far was judged by its author. This test decides what comes next. |
| 3 | **Settle the name, then list.** Pick the final plugin name, then submit to Anthropic's plugin directory and the agent-skills registries. | Renaming a listed plugin orphans every install, so the name comes first. |

## Next: December 2026

- **Optional browser check.** `check.mjs --render` opens the page in a local Chrome at phone and desktop widths and reports sideways scroll, words split across lines and clipped commands. It runs only when Playwright is installed. *Why:* the 1.3.0 layout defects were invisible to the static checker.
- **Tested installs in other agents.** Codex, Gemini CLI, Cursor and Copilot, each with a recorded install and one finished page. Add a Codex plugin manifest and a Gemini extension if those routes keep the folders intact.
- **claude.ai upload.** A zip per skill attached to each GitHub release, with skill descriptions short enough for the upload form.
- **Publish where Claude publishes.** When the agent can publish a page as a Claude artifact, it offers that link next to the file.
- **A one-minute demo** recorded from the gallery: skim mode, one chapter at a time, read aloud and the ballot round trip.

## Later: 2027, if outside readers confirm the gain

- **Pull request pages in CI.** A GitHub Action writes a `pr` page for each pull request and links it in a comment.
- **Brand themes.** Swap the colour and type tokens for your own, with the contrast and meaning rules still checked.
- **More languages** after Japanese, on request, using the same translate and merge workflow.
- **Commercial support** for teams that adopt it, if a team asks.

## Not planned

| Item | Why it is parked | What would restore it |
|---|---|---|
| New page types | Seventeen types plus gather and atlas cover every request seen so far. The field guide was added on 14 October 2026 because a real page fought the explainer contract. More types would spread the checker thin before outsiders have tried the current ones. | An outside user brings content that no current type can hold. |
| Motion companion (animated walkthroughs) | Parked on 9 October 2026. It needs a Claude Code hook or API to drive it. | A supported hook or API that can render motion from a page. |
| A hosted service or paid tier | Pages work offline as single files, and everything that makes them useful is in public files. | Teams asking for something that cannot be a file. |

## Review

On 12 December 2026 this roadmap is reviewed against outside feedback and the reader test. If plugin pages do not help outside readers more than a default page does, the roadmap shrinks to maintenance and the plugin stays maintained for the people who use it.

## Recently shipped

- **1.9.0:** a working public example of every kind of page, an [examples page](https://ariasr47.github.io/html-explainer-skill/examples.html) on the site and a thumbnail grid in the README.
- **1.8.1:** a polish round on the redesign: sentence-case labels, calmer callouts, roomier flow steps and a mini-map that scrolls on a phone.
- **1.8.0:** every page type redesigned around its own picture: the answer as the headline, an At a glance section on the first screen, the rail as the chapter map, one Reading tools button and a calmer chapter. Old pages get the look through `upgrade.mjs`.
- **1.7.0:** the field-guide page type, a reference with a territory map, a start-here list and a searchable index. The automatic check now skips pages made by a newer release.
- **1.6.0:** roadmap lanes that state their horizon and confidence, one fixed set of status words, exception marks, derived "Unblocks N" counts, folded history and a backlog view; buckets for prioritising, a repaired rank control and a combined ranking in the merge tool.
- **1.5.0:** a hook runs the checker at the end of every turn that wrote a page, so failures go back to the agent before you see the page (Claude Code only). `upgrade.mjs` brings a page made with an older release to the current design. Decision pages can end in tap-to-answer fields, and ballots take text options, a Pick all ★ button, warning chips and a review list with a note.
- **1.4.0:** each skill folder became self-contained, so the skills install in other agents; chapter links work inside embedded viewers; this roadmap, a public site and an automatic check on every change.

Details are in [CHANGELOG.md](CHANGELOG.md).
