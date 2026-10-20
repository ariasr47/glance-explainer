# A field-guide page type

Status: approved by Rodrigo on 2026-10-14 and shipped in 1.7.0 as the `field-guide` page type (see `CHANGELOG.md`, 1.7.0, and `skills/html-explainer/examples/field-guide.html`). Written 2026-10-14. Design canvas (private, retired on 2026-10-19), three artboards: the page as written, the proposed desktop page, and a working phone prototype. Its source is not kept in this repository, because the boards redraw a private field guide; see `docs/dev/design/README.md`.

## Source

Rodrigo shared a field guide another session made for one of his projects: 85 fields of web product work in ten families, each with a one-line definition, a "where you meet it in this project" line and a relevance chip (now, before launch, later). Its content is private and is not copied here; this note keeps only the measurements and patterns.

## What the page does well

- It grounds every entry in the reader's own project, which turns a glossary into something to act on.
- Relevance is in words with a glyph, not colour alone.
- The answer bar and keep box say what matters for this project.

## Where it fights the explainer contract

- It is a reference, read once for orientation and then searched, but it is written as seven chapters read in order.
- On a 390 px phone it is 28,224 px tall, about 33 screens. Desktop: 15,788 px.
- 85 entries are open cards. Six of seven chapters exceed the 250-word chapter limit.
- Two overviews show the same thing: a five-step flow and ten family tiles.
- The tile counts ("15 fields, 9 now") are typed by hand and can drift from the entries.
- There is no search. The filter defaults to All.
- The most useful advice, what a solo builder must not skip, sits in the last chapter.

## Proposed type: `field-guide`

The name fits the job: get oriented once, then come back to identify and look things up, organised by family.

1. **A short reading path:** answer bar, keep box, one territory map, a "start here" list of at most five entries. The chapter and word limits apply to this path only.
2. **One territory map:** families placed by stage, with "you are here" on the reader's stage, and a bar per family showing now, before launch and later, in words as well as shape. The script derives every count from the entries.
3. **Start here:** at most five entries the reader must not skip, each with why.
4. **An index outside the reading path:**
   - families, each collapsed to a header with its derived counts
   - entries as one-line rows (name, definition, relevance word) that open to show the project example, "see also" links and a copyable link to the entry
   - a search box over names, definitions and examples
   - a relevance filter that defaults to the reader's "now" set and always says how many are shown
5. **Checker rules:**
   - every entry has an id, a name, a definition of at most 20 words, a project example, and a relevance from a fixed set of three
   - no hand-typed counts on the map
   - at most 12 families, with a warning above 150 entries
   - the start-here list holds at most five entries
   - no `section.ask`, because a guide asks nothing
6. **Expected effect:** with entries collapsed and the filter on "now", the same content runs to about four phone screens instead of 33. This is an estimate to measure when built.

## Note on the type freeze

The roadmap freezes new page types until an outside user brings content that fits none. This request comes from the owner, not an outside user. The freeze's reason, types built ahead of need, does not apply: this content exists, and the current types handle it badly. Building it is Rodrigo's call.
