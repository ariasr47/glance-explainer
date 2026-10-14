# Roadmap and backlog redesign

Status: proposal, awaiting Rodrigo's approval. Written 2026-10-14.

- Research report (private): `C:\Dev\explainer-eval\reports\Roadmap and backlog page design.md`, with notes in `research_notes/Roadmap and backlog page design/`.
- Design canvas (private): https://claude.ai/artifact/HbUB4LJmuTgJka7gchpeMV, six artboards: today's lanes, proposed lanes on desktop and on a phone, a bucket row for prioritise, a combined ranking, and a backlog with a cut line.

## The proposals, ranked by the report

1. Each lane states its horizon, confidence and whether it is ordered; one fixed set of status words leads every card; an "as of, not a promise" line under the answer.
2. Mark only exceptions: a dashed card with "Exploring" for an item less sure than its lane, a "Fixed date" line for a real external date.
3. The page counts "Unblocks N" from the After links, outside blockers get their own line, and a jump visibly lands.
4. At most five live cards per lane (checker warning); shipped and parked items fold below the lanes.
5. Repair the rank control: stable ids, "This order is right", the reason copied, moves announced, move to top.
6. A bucket row for prioritise: Now, Next, Later, Not now per item with the recommendation preset, then order only the Now bucket.
7. A combined ranking in `merge.html`: average place, spread bar, a contested flag, and agreement in words.
8. A backlog view built from existing parts: top five ranked, a cut line, themes folded with a count and their top item, a parked shelf with reasons.
9. Hygiene: lane headings named for screen readers, public-roadmap rules in types.md, ballot size guidance.

None adds a colour, motion, a page type or a second file.
