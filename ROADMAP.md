# Roadmap

What comes next and why, as of 13 October 2026. The plugin is free and MIT licensed, and it will stay that way. To ask for something, [open an issue](https://github.com/ariasr47/html-explainer-skill/issues/new/choose). A request from someone who has used a page moves an item up faster than anything else.

**Focus.** Decision pages for readers who can't hold a long document, checked before they ship. Work that makes pages more trustworthy, easier to install or easier to read comes before new page types.

A rendered version of this roadmap, made with the plugin, is at [ariasr47.github.io/html-explainer-skill/roadmap.html](https://ariasr47.github.io/html-explainer-skill/roadmap.html).

## Now: October and November 2026

| # | Item | Why |
|---|---|---|
| 1 | **Check every page automatically.** A plugin hook runs the checker whenever the agent writes an explainer and hands any failure back before you see the page. | Today the agent runs the checker because the skill tells it to. An instruction can be skipped; a hook cannot. |
| 2 | **Upgrade old pages.** A script swaps an older page's styles and reader script for the current template's, so a page made before a fix receives it. | Each page carries its own copy of the design, so a page made under 1.2 keeps 1.2's phone bugs. |
| 3 | **Answer by tapping.** Decision pages end with tap-to-answer fields and one copy bar instead of a typed reply. Ballots accept options without pictures, a "Pick all recommended" button, warning chips such as "Can't undo", and a review list before sending. | A hand-made ballot without pictures worked well for its reader, and ballot mode would reject it today. Tapping is faster than typing a reply. |
| 4 | **Trigger reliably.** Sharper skill descriptions and a trigger test suite built with `claude plugin eval`, covering the phrases people actually type. | In the author's own sessions about two requests in three did not visibly load the skill. |
| 5 | **Test with outside readers.** Five to ten readers, some with ADHD, read the same content three ways: a plugin page, a default Claude page and plain Markdown. We measure time to a correct decision and what they remember a day later. | Every page so far was judged by its author. This test decides what comes next. |
| 6 | **Settle the name, then list.** Pick the final plugin name, then submit to Anthropic's plugin directory and the agent-skills registries. | Renaming a listed plugin orphans every install, so the name comes first. |

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
| New page types | Sixteen types plus gather and atlas cover every request seen so far. More types would spread the checker thin before outsiders have tried the current ones. | An outside user brings content that no current type can hold. |
| Motion companion (animated walkthroughs) | Parked on 9 October 2026. It needs a Claude Code hook or API to drive it. | A supported hook or API that can render motion from a page. |
| A hosted service or paid tier | Pages work offline as single files, and everything that makes them useful is in public files. | Teams asking for something that cannot be a file. |

## Review

On 12 December 2026 this roadmap is reviewed against outside feedback and the reader test. If plugin pages do not help outside readers more than a default page does, the roadmap shrinks to maintenance and the plugin stays maintained for the people who use it.

## Recently shipped

See [CHANGELOG.md](CHANGELOG.md). The latest release moved each skill into a self-contained folder so the skills install in other agents, and added this roadmap, a public site and an automatic check on every change.
