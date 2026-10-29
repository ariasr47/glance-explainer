---
max_turns: 2
allowed_tools: [Skill, Read, Glob, Grep]
---

この仕様を、ぱっと見てわかるHTMLページにまとめてください。

Spec for "save my cart across devices": today the cart lives in the browser and is lost when a customer switches from phone to laptop; 23% of abandoned carts in September involved a device switch. Proposal: save signed-in carts on the server and merge them at sign-in (same item twice keeps the higher quantity); guest carts unchanged; carts expire after 30 days. Effort: 6 days. Priya must approve the merge rule and the 30-day expiry.
