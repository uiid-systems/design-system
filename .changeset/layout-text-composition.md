---
"@uiid/tokens": patch
"@uiid/typography": patch
"@uiid/forms": patch
"@uiid/layout": patch
---

Add a shared `.text` composition to `@uiid/tokens/compositions.module.css` holding the root text-rendering fundamentals (`text-wrap`, `text-rendering`, `font-feature-settings`). `Text`, `Prose`, and the form `Textarea` now compose it instead of duplicating those declarations, and `Separator` composes it for its label — removing `@uiid/typography` as a dependency of `@uiid/layout` so the layout primitives no longer rely on the `Text` component. Note: the `Separator` string label no longer renders with `muted`/`bold` emphasis; it uses the default text style.
