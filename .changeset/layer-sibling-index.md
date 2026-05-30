---
"@uiid/layout": patch
---

Refactor `Layer` to apply offsets via CSS `sibling-index()` on direct children instead of wrapping each child in a positioned `<div>`. Preserves component identity in the DOM and removes the runtime `Children.map` traversal.
