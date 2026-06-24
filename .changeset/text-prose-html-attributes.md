---
"@uiid/typography": patch
---

Type native HTML attributes on Text and Prose by intersecting their props with `React.HTMLAttributes` (`HTMLSpanElement` and `HTMLDivElement` respectively), matching Box. Attributes like `id`, `onClick`, `aria-*`, and `title` are now type-valid — they were already forwarded at runtime.
