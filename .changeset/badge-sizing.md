---
"@uiid/indicators": patch
"@uiid/tokens": patch
---

Tighten `Badge` sizing to feel sane at `small`. Reduces padding-y across all sizes (small `0.375rem` → `0.125rem`), trims padding-x on medium/large, drops border-radius from `0.5rem` → `0.375rem`, and adds a new `--badge-line-height` token (`1.25`) applied to both `.badge` and `.badge-text` so the inner `<Text>` no longer forces 1.5 line-height padding into the box. The small badge now lands around 18–20px tall — proportional to shadcn's default badge.
