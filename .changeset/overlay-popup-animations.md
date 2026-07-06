---
"@uiid/tokens": patch
"@uiid/overlays": patch
"@uiid/forms": patch
---

Consolidate anchored popup enter/exit animations into a shared `.popup` composition in `@uiid/tokens/compositions.module.css`, composed by Tooltip, Popover, Select, SelectMultiple, Autocomplete, and Combobox. Fixes the previously broken scale (the old `[data-is-popup]` rule referenced an undefined `--globals-transform-scale`, so popups only faded), scales popups from their anchor via Base UI's `--transform-origin`, and applies the shared easing token. Removes the dead `[data-is-popup]` block from `globals.css`.
