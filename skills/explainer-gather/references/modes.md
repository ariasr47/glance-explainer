# Gather modes

Pick one mode per page. A mode that needs two controls uses two fields.

| Mode | The reader does | `data-kind` | Merged view |
|---|---|---|---|
| collect | Answers open questions after each chapter | `text` | Answers grouped by question, respondent named |
| confirm | Marks each chapter understood, agree or concern, with a comment | `confirm` | Who has a concern where, most concerns first |
| choose | Picks one option per decision and says why | `choice`, with the reason box | Tally per option, reasons listed under each |
| ballot | One person, the owner, rules on several open decisions: taps one option per card, pictured or in words, or skips and takes the ★ default | `choice` (a `.ballot-card`, set by `data-mode="ballot"`), `multi` for a ship-or-not list | One copy, one question per card; the agent can also read the picks straight from the artifact database |
| prioritise | Taps a bucket for each item (Now, Next, Later, Not now) with the author's pick already set and marked ★, then puts the top bucket in order | `buckets` (it orders its first bucket itself). A plain `rank` suits a short list | Needs 3 readers. A combined order with each item's mean, best and worst place, items the readers disagree on flagged Contested, and Kendall's W in words. A buckets question adds a tally per bucket, with Split when no bucket has more than half the votes |
| annotate | Reviews a draft and comments per section | `text`, one per section | Comments by section, then by respondent |
| check | Answers a check question, then writes the idea back in a sentence | `choice`, then `text` for the teach-back | Author scores each question, teach-backs side by side |
| protocol | An interviewer follows a script and records notes per question | `text`, one copy per interview, interviewee in the name box | Notes per question across all interviews |
| pilot | A test respondent answers the survey and says what was unclear | The survey's own kind, plus `text` per question | Clarity problems per question |
| readout | Reacts to each finding | Two `scale` fields (surprising, actionable), one `text` | Reactions per finding, findings nobody would act on stand out |
| recurring | Answers the same questions on several dates | Any kind, same ids | Change over time per question |

The merge tool groups by question and exports Markdown, JSON and CSV. A `rank` or `buckets` question also gets its combined view, and the exports carry it. Build other tallies and scores from the CSV.

## Rules

1. One question per field (one `.ballot-card` in a ballot). A second idea gets its own field.
2. Stable `data-q` ids never change between versions or languages, so answers merge.
3. The page passes `../../glance-explainer/scripts/check.mjs` with every field empty.
4. Prioritise with `buckets` for 5 to 15 items. Give every item a stable `data-id` that never changes between versions or languages, so the merge lines items up. Set `data-rec` on every item to the bucket you recommend, so a reader changes only what they disagree with. Above 15 items, split the list into two fields.
5. A rank or buckets answer counts only when the reader acts: a move, a bucket tap, a reason, or the "This order is right" button. An untouched field stays in "Not answered".
6. The combined view needs 3 readers and names an order only when Kendall's W is 0.3 or more. Below that it shows each reader's order and says there is not enough agreement.
7. Every mode except ballot opens with a glance. Its `section.glance` holds an empty `div.qprogress`, the first question as a real `.answer-field` (so choose one the reader can answer before reading anything), and a take line. A ballot keeps its own opening and has no glance.
