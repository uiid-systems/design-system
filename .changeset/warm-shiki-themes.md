---
"@uiid/code": patch
---

Fix code block theme switching to respect `[data-theme]` (not just OS preference) via `light-dark()`. Wire `@shikijs/transformers` for diff (`// [!code ++]` / `// [!code --]`) and notation/meta line highlighting; replace the regex-based `addLineHighlights` with shiki's meta `__raw` driven by the existing `highlightLines` prop.
