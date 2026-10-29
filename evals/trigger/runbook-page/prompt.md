---
max_turns: 2
allowed_tools: [Skill, Read, Glob, Grep]
---

Turn our database restore steps into a runbook page with a check and a way out at each step: maintenance on, find the latest backup, restore into a scratch database, swap, maintenance off.
