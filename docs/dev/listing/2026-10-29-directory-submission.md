# Listing glance-explainer

Status on 29 October 2026: ready to submit. Two submissions need the author in person:

- Anthropic's portal needs a paid claude.ai account, a contact email and four legal acknowledgements.
- awesome-claude-code accepts only recommendations "created by human beings", through its web form.

Everything else either happens automatically or is out of reach.

## 1. Anthropic's directory (about 10 minutes)

A listing there reaches claude.ai, Cowork and Claude Code. The read-only community marketplace, `anthropics/claude-plugins-community`, lists only plugins submitted this way.

1. **Open the portal.** Sign in to claude.ai with the paid account, open <https://claude.ai/directory/manage>, choose **Submit new**, then **Plugin bundle**.
2. **Source.**
   - Repository: `ariasr47/glance-explainer`
   - Plugin path: leave empty, because `.claude-plugin/plugin.json` is at the repository root.
   - Branch or tag: leave empty, so the listing follows `main`.
   - Press **Validate**. Expect no Blocking findings. Some files may be held for a reviewer (see the table below).
3. **Listing details.** This step is read-only: it shows the name and description from `plugin.json` and the README. Check that the name is `glance-explainer` and the description starts "Explainer pages for readers with ADHD".
4. **Data handling.** The README section "What it runs, sends and fetches" holds the facts. In short:
   - **Personal data:** the plugin reads or stores none. The pages it makes keep the reader's settings, picks and draft answers in that reader's own browser storage, and on a gather page that includes the name they type. Nothing is sent anywhere.
   - **Sending data to other services:** none. Pages opened online load fonts from Google Fonts, which sees the reader's IP address as with any web font. The plugin makes no other request.
   - **How long data is kept:** the hook keeps one small state file per session in the system's temporary folder. Browser storage stays until the reader clears it.
   - **Intended for people under 18:** no. It is a general tool, not made for children.
5. **Compliance.** Give a contact email, then read and tick the four acknowledgements.
6. **Review and submit.**
   - New versions: choose **GitHub push webhook**. It needs admin access to the repository, which the author has.
   - Leave **Auto-publish passing versions** on, so a release that passes every check goes live without waiting.
   - Press **Submit for review**.

**After submitting.**

- The status moves through Scanning, In review, Approved and Published. Only a Published plugin can be installed.
- A person reviews the first listing. Review time is not fixed.
- If the status comes back as **Needs changes**, paste the requested changes into a session. Then push the fix and press **Resubmit for review**.
- For questions, email `directory@anthropic.com`.

### What the validator may hold

This table checks Anthropic's [pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist) against the repository on 29 October. Because `plugin.json` sits at the root, the whole repository is the plugin folder.

| Rule | This repository | Expected |
|---|---|---|
| 512 files or fewer | 256 tracked files | Passes |
| Each non-image file under 256 KiB | 6 files are over: `tour.html` and `tour.ja.html` (690 KB, nine screenshots inline), the atlas example's `index.html` and `index.ja.html` (600 KB), `gallery.html` (324 KB) and `teach.ja.html` (265 KB) | Held for a reviewer |
| Only text, images and fonts | No other binaries | Passes |
| No `.DS_Store`, `Thumbs.db` or `desktop.ini` | None | Passes |
| No `export-ignore`, `export-subst` or `filter` in `.gitattributes` | Only text and line-ending rules | Passes |
| No `package.json` with a lockfile, and no `.npmrc` | None | Passes |
| Hook commands use full paths from `${CLAUDE_PLUGIN_ROOT}`, with no launchers | `node` with one full path | Passes |
| README of at least 40 words that says what the plugin runs, sends and fetches | About 2,100 words, with that section | Passes |
| A licence | MIT | Passes |
| Bundled images shown with Markdown image syntax | The README uses HTML `<img>` | Unknown: read what Validate says |

**A note on the size hold.**

- The template alone is 237 KB, so most pages sit close to the 256 KiB line.
- If the hold repeats on every new version, each release waits for a reviewer.
- The fix would be to move the tour screenshots into image files beside the page and to slim the atlas example. That waits until the validator shows the hold actually costs something.

## 2. awesome-claude-code (about 2 minutes)

A curated list of Claude Code resources. Its rules, from its [CONTRIBUTING.md](https://github.com/hesreallyhim/awesome-claude-code/blob/main/CONTRIBUTING.md):

- The repository must be at least 14 days old and still under active development. This one dates from 16 September 2026 and has had 73 commits since 15 October.
- Only one resource at a time.
- The recommendation goes through the web issue form, written by a person. It cannot be sent with the `gh` CLI or opened as a pull request.
- The description should be one line that states what the tool does, with no sales pitch and no emoji.

Here is a one-line description you can paste:

> Claude Code plugin with three skills that turn agent output into one checked HTML page for readers with ADHD or a short working memory: the answer first, three facts to keep, a picture per chapter, and a hook that runs the page checker before the agent finishes.

## 3. Lists that need nothing

- **claude-plugins.dev** "automatically discovers and indexes all public Claude Code plugins and agent skills on GitHub", reading `.claude-plugin/marketplace.json` and each `SKILL.md`. There is nothing to submit.
- **claude-plugins-community** is synced nightly from Anthropic's review pipeline and has no route of its own. Step 1 is the route.
- **claude-plugins-official** has no route for solo developers. The Claude Code docs say to ask an Anthropic partner contact.

## Sources

- [Publish and distribute a plugin](https://code.claude.com/docs/en/plugins/publish), Claude Code docs
- [Submit a plugin](https://claude.com/docs/plugins/submit) and the [pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist), Claude docs
- [Platform support](https://claude.com/docs/plugins/platform-support): skills load in chat, Cowork and Claude Code; hooks load in Cowork and Claude Code
- [anthropics/claude-plugins-official](https://github.com/anthropics/claude-plugins-official) and [anthropics/claude-plugins-community](https://github.com/anthropics/claude-plugins-community) READMEs
- [Kamalnrf/claude-plugins](https://github.com/Kamalnrf/claude-plugins), the registry behind claude-plugins.dev
