# Writing for a short working memory

The reader can hold about three things at once and loses them the moment they scroll. Every rule below exists to stop the page from asking for a fourth.

## The contract of every page

1. **Answer first.** The `.answer` line is the whole page in one sentence, and it is the page's headline. Write it before anything else. If you cannot write it, you do not understand the topic yet.
2. **Three facts to keep.** The `.keep` box holds at most three lines under fifteen words each. These are the only things the page asks the reader to carry.
3. **The glance shows the type's own picture.** A `section.glance` sits after the keep box. It holds one picture and one `.take` line that says what the picture shows. The chapter that explains the picture builds on it and does not repeat it. A roadmap, a playbook and a field guide have none.
4. **Chapters are self-contained.** A chapter opens with `.from` (the one fact it builds on, restated, never "as we saw above") and closes with `.remember` (one sentence). A reader who lands mid-page loses nothing.
5. **Recap = the remember lines.** The closing `.recap` list is the chapters' remember lines, copied. Nothing new appears at the end.
6. **The ask is one question.** If a decision is needed, `.ask` holds one question, two to four choices, the recommendation marked, and what happens if the reader does nothing.

## Titles and headings

- Sentence case everywhere: "How you ask for visuals", not "How You Ask For Visuals". Capitals are for names.
- The page title names the subject in 2 to 8 words. Chapter headings are sentences a person would say, and they state the chapter's point, not its topic: "The ask took five shapes" beats "Request patterns".
- Derived numbers are fine when they are plain arithmetic on stated facts (20 asks plus 11 earlier asks is 31). Say what was added when the parts matter.

## Sentences

- One idea per sentence. Under twenty words. A verb in every sentence.
- Paragraphs under forty words. Three sentences is plenty. If a paragraph grows, it is two ideas: split it or turn it into a list, a `.steps` ladder, or a diagram.
- Say it the way you would say it out loud to a friend who is smart but tired. "The server forgets who you are after an hour" beats "session tokens expire after 3600 s".
- Active voice, present tense. "Sync writes career columns only" not "career columns will be written by the sync phase".
- Concrete beats abstract. Name the file, the person, the number, the button. Avoid "the system", "various", "appropriate", "leverage".
- No hedging stacks. One qualifier at most per sentence.
- No em dashes and no semicolons. Each one hides a second idea; give it its own sentence. No middle dots between labels ("A · Adopt"); write "A. Adopt" or just "Adopt".
- The answer bar is one sentence under thirty words. If it needs a second clause, the second clause is a keep-box line.

## Jargon

- The first time a technical word is unavoidable, define it in the same sentence or in a `.term` box directly beneath. Wrap the word in `<dfn>`.
- Prefer the plain word for the rest of the page. If the page must use "idempotent", say "safe to run twice" and put "idempotent" in the term box.
- Analogies work when the mapping is exact. Use `.metaphor` for one analogy per chapter at most, and say where the analogy stops.

## Structure words that do the reader's memory work

| Instead of | Write |
|---|---|
| "As mentioned above" | Restate the fact in `.from` |
| "See section 3" | Link the chapter title, and restate the one fact you need from it |
| "There are several considerations" | "Three things matter:" then a three-item list |
| "It is recommended that" | "Do X." or a `.decision` with the option marked recommended |
| "Note that" | Delete it. Or use a `.callout` if it changes what the reader does |
| "In conclusion" | The `.recap` box |

## What goes in a fold

Anything the reader needs only if they want to verify or act: exact commands, file paths, error text, tables of numbers, commit hashes, the reasoning trail. Put it in `details.fold` with a summary that says what is inside ("Show the exact commands", "Why the other two options lost"). The reading path above the fold must make sense with every fold closed.

## Tone

Calm, direct, warm. No exclamation marks. No "simply" or "just" (they shame the reader who does not find it simple). Errors and risks are stated plainly with what to do about them. Never apologize in the page.

## Numbers

A number appears only when it changes what the reader decides. Then it gets a `.tile` with a label saying what it means, or it sits in a fold. Prose carries at most one number per sentence.

## Self-check before shipping

Read only the `.answer`, the `.keep` box, every `.take` caption and every `.remember` line, in order. If that alone tells the story, the page works. If it does not, the prose is carrying weight that belongs in structure.

## Japanese

Write native Japanese, not a word-for-word copy. The checker counts characters, not words.

- **Length.** A sentence under 60 characters, one idea. A paragraph under 90. A keep-box line under 25. The answer bar under 70.
- **Voice.** です・ます throughout. Split long sentences instead of chaining clauses.
- **Emphasis.** Bold, or 「」 around a term at first use. Never italics: Japanese has none, and the checker fails them.
- **Digits and dates.** Half-width digits (3, 1,250). Dates as 2026年10月7日, not 2026-10-07.
- **Reading time.** 500 characters a minute, rounded up: 第2章 / 全6章、約1分.
- **Fixed strings.** Interface text comes from `../assets/i18n/ui.ja.json`. Leave those items untranslated so the file fills them in; never type your own word for one, or pages drift apart. A glossary term marked `keep` stays in English.
- **Ids and layout never change.** `data-q` ids, element ids, classes and chapter order match in both files, so answers merge across languages by question id. Translate text only.
- **Split sentences.** Inline tags cut one sentence into several items. Translate the pieces so they join into one sentence.

| Reader | Register |
|---|---|
| Coworkers | Plain business Japanese, です・ます |
| Executives | Shorter. Headings may end in a noun. |
| Engineers | Established terms may stay in English. |
| Public, customers | Easy Japanese (やさしい日本語): short sentences, common words, furigana only here. |

### Standard labels

Use these on every Japanese page, so a reader meets the same words each time. `ui.ja.json` fills most of them in.

| English | Japanese | Not this |
|---|---|---|
| Keep in your head (only these) | 押さえておくのはこれだけ | 覚えておくこと（これだけ） |
| Before this: | おさらい： | 前提： |
| Take from this: / Take: | つまり： | ここが要点： |
| Remember: | この章のポイント： | 覚える： |
| Recap | まとめ | |
| What I need from you | お願いしたいこと | |
| If you do nothing: | 何もしなければ： | 何もしない場合： |
| Recommended, ★ | おすすめ | 推奨 |
| Reading time about 5 minutes | 約5分で読めます | 読了目安 約5分 |
| Chapter 2 of 6, about 1 minute | 第2章 / 全6章、約1分 | |
| Done (a chapter checkbox) | 読んだ | 完了 |
| Now / Next / Later (lanes, buckets) | 今すぐ / 次に / あとで | 今 / 次へ / その後 |
| Not now | 今はやらない | |
| After: (waits on) | 前提： | |

### Sound native, not translated

- **Drop the subject.** Japanese leaves out あなた and 私 when context carries them. "I recommend A" is 「おすすめはAです」, not 「私はAを推奨します」.
- **Headings are questions a person asks,** in plain form: 「なぜ必要なのか」「メモはいつ保存するか」, or 「なぜ必要なの？」 on a friendly public page. Not a noun label such as 「理由」, and not 「〜ますか？」 on every heading. A question the reader answers on the page (a field's legend, a ballot card) stays polite: 「いつ保存しますか？」. The chapter map and the rail repeat the heading in the same form.
- **Short verbs.** 「できます」, not 「することができます」. 「〜します」, not 「〜を行います」.
- **Kanji words over katakana** when a common one exists: 「確認」 not 「チェック」, 「手順」 not 「ステップ」. Keep katakana that Japanese readers use daily: リリース, ブラウザ, ダウンロード.
- **No literal idioms.** "Keep in your head", "the ball is in your court" and "at a glance" get a Japanese way of saying the same thing, not a word-for-word copy.
- **Numbers carry counters.** 3件, 2章, 5分, 4週間. Ranges use 〜: 1〜3か月.
- **No calques.** 「ログインを持つ」 is 「ログインできる」; 「上限を持つ」 is 「上限がある」; 「10回行い」 is 「10回試し」. Do not add a 「ため」 or 「ので」 the English does not state.
- **Keep every clause when shortening.** The answer bar aims for 52 characters or fewer; cut words, never a fact the English states.
- **Fixed words keep their kana:** ひと晩, ひとつ目. People count as 2人, not 二人.
- **Brackets.** 「」 for a term or a quoted label, full-width （） in Japanese prose, half-width () only around code.

### Characters, numbers and names

- **Full-width punctuation** in Japanese text: 、。「」『』（）：！？〜. Never an ASCII comma, period or colon after Japanese. A label ends in a full-width colon: 「おさらい：」.
- **Half-width letters and digits**, never full-width: 3件, JSON, 2.4. Commas in thousands: 1,250.
- **Space beside Latin text.** One half-width space between Japanese and a Latin word or code: 「JSON をコピー」「Claude に保存」. No space between a digit and its counter or unit: 3件, 30日, 5分, 128文字. A Latin unit joins its number, then one space before Japanese: 「4MB の写真」「9px に」.
- **Dates and times.** 2026年10月13日, or 10月13日（月） when the weekday matters. Times as 14:00. Ranges with 〜: 10月13日〜17日.
- **Words, not word counts.** Japanese counts characters, so "128 words" becomes 「128文字」 and "word count" 「文字数」.
- **People.** Write a made-up English name in katakana with さん in prose: 「マーラさん」. A real person keeps the spelling they use.
- **Katakana spelling.** One spelling per term on a page. This plugin writes ユーザー, サーバー, ブラウザ, フォルダ, メモ.
- **Ellipsis and dashes.** 「……」 (two three-dot characters) and 「――」, never ... or a single dash.
- **Code stays code.** File names, commands, ids and keys are left as written, inside `<code>`.

### Terms

| English | Japanese |
|---|---|
| explainer page | 説明ページ |
| decision, ruling | 判断 |
| recommend, recommended | おすすめ |
| blocker, blocked | ブロック要因, ブロック中 |
| release | リリース |
| ship (a feature) | リリースに入れる |
| rollback | ロールバック, 切り戻し |
| owner | 担当者 |
| stakeholder | 関係者 |
| respondent | 回答者 |
| handover | 引き継ぎ |
| incident | 障害 |
| runbook | 手順書 |
| release notes | リリースノート |
| roadmap | ロードマップ |
| parked | 保留 |
| pull request | プルリクエスト |
| the answer (the page's one sentence) | 結論 |
| at a glance | ひと目でわかる |
| reading ruler | 読んでいる行を強調 |
| answer bar | 結論バー |
| keep box | 要点ボックス |
| checker | チェッカー |
| web app (beside a phone app) | ブラウザ版 |
| accept (an invite) | 参加 |
| bug | 不具合 |
| domain registrar | ドメイン管理会社 |
| the page's picture | 図 |
| user | ユーザー |
| chapter map | 目次 |

Page types, when a page names one: 判断 (decision), 選択カード (ballot), 比較 (compare), 仕様 (spec), 実行計画 (playbook), 状況報告 (status), プロジェクト一覧 (portfolio), ロードマップ (roadmap), リリースノート (release), 障害報告 (incident), 引き継ぎ (handover), 解説 (explainer), 学習 (teach), 画面ツアー (tour), 調査 (research), フィールドガイド (field guide), アトラス (atlas), 手順書 (runbook), プルリクエスト (pr), アンケート (questionnaire), 公開ページ (public).

Afterwards run `node ../scripts/translate.mjs check`. It lists what is still in English.
