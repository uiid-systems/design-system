---
"@uiid/buttons": patch
---

Fix `Button` rendered as a link losing its box. Restore `display: flex` and content centering on `.button` unconditionally so the box owns its own layout regardless of the element produced by `render`. Previously these were pruned on the assumption the native `<button>` UA styles (and the inner `Layer`) sufficed — but an `<a>` is `display: inline` and drops the `height` from the `.size-*` composition, collapsing the box. `display: flex` alone is insufficient; `fullwidth` links also need `justify-content: center`.
