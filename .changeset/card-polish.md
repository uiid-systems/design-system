---
"@uiid/cards": patch
"@uiid/tokens": patch
---

Polish `Card`: rebuild header conditional rendering so empty cells and the inner container no longer reserve phantom space. Move description out of the title lockup; the header + description are wrapped in a `Stack(gap=2)` only when both are present. Lift icon and header-cell sizing into CSS via `--card-icon-size` and drop `card.constants.ts`. Remove the orphan `size` variant — the `--card-size-*-max-width` CSS references never matched the sm/md/lg tokens and no consumer used it. `CardTitle` drops inline `minHeight`/`alignContent` and switches `weight` from `bold` to `semibold`. `CardFooter` gains a leading `Separator`.
