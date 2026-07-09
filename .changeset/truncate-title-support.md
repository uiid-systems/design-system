---
"@uiid/tokens": patch
"@uiid/typography": patch
"@uiid/forms": patch
---

Fix `Text` `truncate` and `balance`, which were silently overridden by the `.text` composition's `text-wrap: pretty` in the always-win `uiid.compositions` layer. Both toggles now live in that layer (declared after `.text`) so they actually apply. As a result, `Select` and `SelectMultiple` triggers truncate their value to a single line with an ellipsis instead of wrapping. When truncated with string/number children, `Text` also sets a native `title` attribute exposing the full text on hover.
