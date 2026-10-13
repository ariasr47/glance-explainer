<!--
PARKED 2026-10-13 (release 1.4.0). This file was SKILL.md at the repository root.

Why it was parked: each skill folder under skills/ is now self-contained, so installers that copy one
skill folder (npx skills add, gh skill install, gemini skills install, a claude.ai zip) work without it.
While it sat at the root, `npx skills add ariasr47/html-explainer-skill` stopped at this file and
installed the whole repository as one skill, so explainer-gather and explainer-atlas never registered.

What would restore it: a request to clone the whole repository straight into a skills folder as one
skill. To restore, move this file back to the repository root as SKILL.md and drop this comment.
Expect the npx skills problem above to return.
-->
---
name: html-explainer
description: Use when asked for an "html explainer", a visual explainer, a page that explains something "in simple plain english", "with lots of visuals and diagrams", or "for someone with ADHD / short working memory"; also when a spec, decision, status update, architecture, or release needs to be understood and approved by a reader who cannot hold a long document in their head.
argument-hint: "[topic or file to explain]"
---

This checkout is a plugin. Read `skills/html-explainer/SKILL.md` (relative to this file) and follow it.
For pages that ask questions and collect answers, also read `skills/explainer-gather/SKILL.md`.
For an architecture atlas, also read `skills/explainer-atlas/SKILL.md`.
