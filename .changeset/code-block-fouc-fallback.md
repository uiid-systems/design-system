---
"@uiid/code": patch
---

Fixed a flash of unstyled content during the (unavoidable) async shiki load: `CodeBlockContent` now renders the raw `code` as a styled `<pre><code>` with per-line spans while highlighting is pending, then swaps to the highlighted HTML in place. Identical layout, only token colors fill in.
