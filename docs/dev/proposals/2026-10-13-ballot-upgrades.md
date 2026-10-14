# Ballot upgrades learned from a hand-made ballot

Status: accepted for the next build on 2026-10-13 (Rodrigo: "add it"), together with tap-to-answer fields on decision pages. Not built yet.

## Source

Rodrigo shared a ballot another session made by hand, outside the plugin, and said he really enjoyed it. It asked five product decisions with no pictures. Its content is private and is not copied here; this note keeps only the patterns.

## What it did better than ballot mode

1. **Text options.** No option had a picture. Each had a bold label and one detail line, and the question had a short "why" paragraph with the key fact in bold. The decisions were abstract (an address, a waiting time, a policy), so pictures would have been invented. Ballot mode fails such a page today (`.ballot-card ... option X has no non-empty .vis`).
2. **Pick all recommended.** One button in the sticky strip ticks every recommended option and jumps to the sign-off. Ballot mode relies on skipped cards meaning ★, which is fast but silent.
3. **Consequence chips.** Risky options carried a small chip in words: "Redo later", "Weaker", "Can't undo". The reader sees the cost on the option itself, not in a paragraph.
4. **A review before sending.** A sign-off box listed every pick, with unpicked rows flagged in amber, and an optional note field ("Anything else I should know?").
5. **A short paste line.** All recommended collapses to one line ("ballot: A (all recommended)"); otherwise "1 A, 2 B, 3 A".
6. **Provenance.** A serial line named the plan the ballot rules on, with its commit, and the footer linked the full design. It also said "nothing gets built until you cast this ballot; the newest ballot counts".
7. **The recommended option is always A.** One fixed position, stated once, so the reader never hunts for the star.
8. **"Other" with an input.** One option revealed a text field when picked, for a value the author could not list.

## What ballot mode already does better

- Content is in the HTML, not built by script, so it reads without JavaScript, prints, translates with `translate.mjs`, and the checker can see it.
- `lang`, contrast, glyph and phone rules are checked.
- In-page links scroll by script, so the pips work inside embedded viewers.
- A skipped card still has a defined answer (★), so a half-finished ballot is usable.

## Proposed changes

| Change | Where | Size |
|---|---|---|
| Allow text options: a `.ballot-opt` without `.vis` passes when it has a non-empty `.detail` line; keep the warning "draw a small mockup" only when every option on the card is text and the card is in "Shapes the build" | `check.mjs` ballot block, template CSS for `.detail`, gather SKILL | small |
| "Pick all ★" button in the tray: sets every unpicked card to its `data-rec`, then focuses Copy picks | template script and tray markup | small |
| Consequence chip: `data-warn="Can't undo"` on an option renders an amber chip with the text (never colour alone) | template CSS, design-system row | small |
| Review list in the tray, expandable: one row per card, unpicked rows say "★ (skipped)"; optional note textarea included in the copy | template script | medium |
| Short paste line when every pick is ★ | template script `picksText()` | small |
| Optional `.ballot-source` line under the title: plan name, date, commit | template CSS, gather SKILL | small |
| Put the recommended option first, by convention, in the gather SKILL | docs only | small |

Not adopted: building questions from a script array (loses the checker, printing and translation), two questions inside one card (breaks "one question per card" and stable ids), and disabling Copy until every card is answered (skipping to ★ stays).

## Effect on the decision type

The two types stay separate. A decision page explains one to three rulings, a chapter each. A ballot asks several quick rulings, pictured or in text.

Both now answer by tapping. Decision pages may end with `.answer-field[data-kind="choice"]` fields and one `.collect` bar, the markup playbook pages already use, instead of the typed-reply `section.ask`. The checker rule for `data-type="decision"` (`check.mjs:234`) changes from "needs `.ask`" to "needs `.ask`, or answer fields with one `.collect` bar", reusing the playbook checks at `check.mjs:381-385`. `references/types.md` and the decision row of the gallery change with it.
