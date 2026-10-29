---
max_turns: 2
allowed_tools: [Skill, Read, Glob, Grep]
---

Make a glance explainer for pull request 88: it adds retry with backoff (2s, 4s, 8s) to the supplier feed fetch, retries only 5xx and timeouts, and adds 9 tests.
