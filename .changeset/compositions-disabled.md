---
"@uiid/tokens": patch
"@uiid/buttons": patch
"@uiid/code": patch
"@uiid/forms": patch
"@uiid/interactive": patch
"@uiid/navigation": patch
---

Introduce `@uiid/tokens/compositions.module.css` as a shared CSS Modules source for `composes`. Adds a `.disabled` class that bundles `opacity: var(--globals-disabled-opacity)` and `pointer-events: none` under the new `uiid.compositions` layer, and converts 14 consumers (input, checkbox, radio, switch, textarea, slider, number-field's increment/decrement, button, code-editor, sidebar-menu-button, sidebar-menu-sub-button, accordion-root, resizable-handle, sortable-item-handle) to compose this source instead of duplicating the rule.
