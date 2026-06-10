---
"@uiid/typography": patch
---

Refit the typography scale and add `Prose`.

- Refit `text` tokens to a familiar pixel grid (12/14/16/20/24/30/36/48 px) with size-scoped line-height, weight, and a tracking curve that tightens as size grows. Adds `letter-spacing` tokens to each scale step.
- Scope `text-box-trim` to sizes `≥2` so body paragraphs keep breathing room.
- Polish inline `<code>` inside `Text` with a subtle background chip.
- Add `medium` (500) and `semibold` (600) to the `weight` prop and add a `truncate` boolean for single-line ellipsis. Drop the dead `mono` variant.
- Add `Prose` — a wrapper that applies the typography scale and vertical rhythm to descendant `h1`–`h6`, `p`, `ul`, `ol`, `code`, `pre`, `blockquote`, `hr`, and `a` for markdown-rendered content.
- Slim `Text` `README` to the layout-package pattern and co-locate examples in `text.examples.tsx` / `prose.examples.tsx`; new Storybook stories cover the full scale, weight ladder, families, shades, palette, decorations, and Prose's markdown rendering.
