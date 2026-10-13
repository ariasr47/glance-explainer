# Install html-explainer

The plugin is three skills: `html-explainer` writes the pages, `explainer-gather` adds pages that ask questions and collect answers, and `explainer-atlas` maps a codebase. Install all three together, because the other two use the core skill's template and checker.

| Where you work | How to install | Tested |
|---|---|---|
| Claude Code | [The plugin marketplace](#claude-code) | Yes |
| Claude Code, for a whole team | [Project settings](#a-whole-team) | Not yet |
| Codex, Cursor, Gemini CLI, Copilot and other agents | [Copy the skill folders](#other-agents) | Not yet |
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

Pages you made earlier keep the design they were made with. A fix in a new release reaches a page only when the page is made again.

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

Each skill folder follows the [Agent Skills](https://agentskills.io) format, so agents that read `SKILL.md` files can load it. These routes follow each tool's documentation and have not been tested here yet. If you try one, please [say how it went](https://github.com/ariasr47/html-explainer-skill/issues/new?template=feedback.yml).

**With an installer.** Either of these installs the three skills:

```bash
gh skill install ariasr47/html-explainer-skill --agent codex --scope user
npx skills add ariasr47/html-explainer-skill -g
```

`gh skill` is part of the GitHub CLI (preview) and takes `--agent` values such as `codex`, `cursor`, `gemini-cli`, `github-copilot` and `opencode`. `npx skills` is the [skills CLI](https://github.com/vercel-labs/skills); add `-a <agent>` to pick one agent.

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
- **Links inside a page do nothing in a preview pane.** Pages made with 1.4.0 or later scroll by script, so chapter links work inside embedded viewers. For an older page, open the file in a browser, or ask the agent to make the page again.
- **No Node.** Pages still work, but the agent cannot run the checker, so nothing verifies them before you see them.
