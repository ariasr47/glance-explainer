# Install html-explainer

The plugin is three skills: `html-explainer` writes the pages, `explainer-gather` adds pages that ask questions and collect answers, and `explainer-atlas` maps a codebase. Install all three together, because the other two use the core skill's template and checker.

| Where you work | How to install | Tested |
|---|---|---|
| Claude Code | [The plugin marketplace](#claude-code) | Yes |
| Claude Code, for a whole team | [Project settings](#a-whole-team) | Not yet |
| Codex, Cursor, Gemini CLI, Copilot and other agents | [An installer, or copy the folders](#other-agents) | Install yes, use not yet |
| claude.ai | Not supported yet; see the [roadmap](../ROADMAP.md) | No |

**Requirements.** Node 18 or newer, which the agent uses to run the page checker. Nothing else installs: the scripts use only Node's built-in modules. Pages open in any browser, offline too; fonts load from Google Fonts when online and fall back to system fonts.

## Claude Code

Inside a Claude Code session:

```text
/plugin marketplace add ariasr47/html-explainer-skill
/plugin install html-explainer@html-explainer-skill
```

When asked for a scope, pick **user** to have it in every project. Restart Claude Code or run `/reload-plugins`.

From a shell instead:

```bash
claude plugin marketplace add ariasr47/html-explainer-skill
claude plugin install html-explainer@html-explainer-skill --scope user
```

To stay on one release, add the tag to the marketplace: `ariasr47/html-explainer-skill#v1.4.0`.

### Check that it worked

1. `/plugin` lists **html-explainer** under Installed.
2. Type `/html-explainer:` and the three skills appear: `/html-explainer:html-explainer`, `/html-explainer:explainer-gather` and `/html-explainer:explainer-atlas`.
3. Ask in plain words: *"Make an html explainer for this spec."* The agent writes the page, checks it, saves it under `docs/explainers/` and gives you the link.

### Automatic checks

Claude Code only. The plugin adds three small hooks, so the page checker runs without anyone asking for it.

- **When.** Just before the agent finishes a turn. If that turn wrote or edited an explainer page, the checker runs on the page.
- **What it covers.** An `.html` file whose `<html>` tag has a `data-type` and which holds an answer bar or ballot cards. Any other file is left alone. A page saved with Write, Edit or MultiEdit is always covered. A page that a script wrote through Bash is covered only when the folder is inside a git repository and the file is not committed yet.
- **On a FAIL.** The agent is shown the FAIL lines and asked to fix the page before it hands over. After three tries in one turn the hook lets go, so one stubborn page cannot trap a session.
- **What it never does.** It never uses the network and never changes a file. If something breaks inside a hook, the session carries on as if the hook were not there.

It needs `node` on the path, the same as the checker. To switch it off, set `"disableAllHooks": true` in your Claude Code settings. That also turns off every other hook you have, because Claude Code cannot disable one hook alone. Agents other than Claude Code do not get these hooks. Run the checker by hand instead.

### Update

Third-party marketplaces do not update on their own unless you turn that on.

- **Turn on auto-update:** `/plugin`, then Marketplaces, then html-explainer-skill, then Enable auto-update.
- **Update now, in a session:** `/plugin`, then Marketplaces, then Update marketplace. Then run `/reload-plugins`.
- **Update now, from a shell:**

  ```bash
  claude plugin marketplace update html-explainer-skill
  claude plugin update html-explainer@html-explainer-skill
  ```

  Restart Claude Code afterwards.

Pages you made earlier keep the design they were made with until you upgrade them. See the next section.

### Upgrade pages you made earlier

Every page made from release 1.5.0 on carries a mark in its `<head>`: `<meta name="generator" content="html-explainer 1.5.0">`. It says which release made the page. The upgrader brings an older page to the current design and keeps your words and pictures.

Ask the agent: *"Upgrade docs/explainers/my-page.html to the current html-explainer design."* It runs the upgrader for you. To run it yourself, use the `scripts/upgrade.mjs` file in the `html-explainer` skill folder:

```bash
node <skill folder>/scripts/upgrade.mjs docs/explainers/my-page.html --dry-run
node <skill folder>/scripts/upgrade.mjs docs/explainers/my-page.html
node <skill folder>/scripts/upgrade.mjs docs/explainers
```

The first line only says what would happen. The second upgrades one page. The third upgrades every explainer page in a folder.

- **What changes.** The page's first `<style>` block and first `<script>` block become the current ones, and the generator mark is set. Content, extra blocks the page added after those two, and atlas links stay as they are.
- **How it knows the old version.** It compares the two blocks with every release from 1.0.0 on. A page whose blocks match none of them has hand-edited styles. It is skipped as custom. Add `--force` to upgrade it anyway. Your style edits are then replaced, and the backup keeps them.
- **Safety.** It saves `my-page.html.bak` first, then runs the checker. If the page passed before and fails after, the original is put back and the backup stays.
- **Output.** One line per page, for example `upgraded 1.2.0 -> 1.5.0`, `already current`, `skipped: custom styles (use --force)` or `skipped: not an explainer page`.

An upgrade changes the design and the script. It does not add the new components of a release to a page. Make the page again for those.

### Uninstall

```bash
claude plugin uninstall html-explainer@html-explainer-skill
```

## A whole team

Add this to the repository's `.claude/settings.json` and commit it. Teammates who trust the folder get the plugin without running an install command.

```json
{
  "extraKnownMarketplaces": {
    "html-explainer-skill": {
      "source": { "source": "github", "repo": "ariasr47/html-explainer-skill" }
    }
  },
  "enabledPlugins": {
    "html-explainer@html-explainer-skill": true
  }
}
```

The same two commands with `--scope project` write these entries for you:

```bash
claude plugin marketplace add ariasr47/html-explainer-skill --scope project
claude plugin install html-explainer@html-explainer-skill --scope project
```

## Other agents

Each skill folder follows the [Agent Skills](https://agentskills.io) format, so agents that read `SKILL.md` files can load it. The `gh skill` install below was tested for 1.4.0: it places the three folders side by side and every file a skill names is found. Nobody has yet made a page with them inside Codex, Cursor, Gemini CLI or Copilot. If you try one, please [say how it went](https://github.com/ariasr47/html-explainer-skill/issues/new?template=feedback.yml).

**With an installer.** Either of these installs the three skills:

```bash
gh skill install ariasr47/html-explainer-skill --all --agent codex --scope user
npx skills add ariasr47/html-explainer-skill -g
```

`gh skill` is part of the GitHub CLI (2.95 or newer, in preview). `--all` installs the three skills, and `--agent` takes values such as `codex`, `cursor`, `gemini-cli`, `github-copilot` and `opencode`. `npx skills` is the [skills CLI](https://github.com/vercel-labs/skills), not yet tested here; add `-a <agent>` to pick one agent.

**By hand.** Copy the three folders from `skills/` into your agent's skills folder, side by side:

| Agent | For you | For one project |
|---|---|---|
| Codex | `~/.agents/skills/` | `.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.gemini/skills/` |
| Cursor | `~/.cursor/skills/` | `.cursor/skills/` |
| GitHub Copilot and VS Code | `~/.copilot/skills/` | `.github/skills/` |
| OpenCode | `~/.config/opencode/skills/` | `.opencode/skills/` |

Many of these agents also read `~/.agents/skills/`.

## When something goes wrong

- **The skill does not start.** Name it in the request ("use the html-explainer skill") or call it directly with `/html-explainer:html-explainer <topic>`. In Claude Code, `/plugin` shows load errors under Errors.
- **Two copies of the skill.** The plugin and a copy in a skills folder (`~/.claude/skills/`) each register it. Keep one. Before 1.4.0 the README offered a git clone into `~/.claude/skills/html-explainer`; if you have that folder, delete it and use the plugin.
- **Links inside a page do nothing in a preview pane.** Pages made with 1.4.0 or later scroll by script, so chapter links work inside embedded viewers. For an older page, [upgrade it](#upgrade-pages-you-made-earlier), open the file in a browser, or ask the agent to make the page again.
- **No Node.** Pages still work, but the agent cannot run the checker, so nothing verifies them before you see them.
