---
"@uiid/tokens": patch
"@uiid/forms": patch
---

Add `before`/`after` slot props to Select and SelectMultiple, mirroring Input's slotted-field model. Extract the shared slot styling into a `.field-slot` composition in `@uiid/tokens/compositions.module.css`, now composed by both Input and Select so slot color, icon sizing, pointer pass-through, and size-based edge padding stay consistent across form controls.
