---
"@uiid/forms": patch
"@uiid/buttons": patch
"@uiid/tokens": patch
"@uiid/cards": patch
---

Fix `SelectMultiple` ignoring the `size` prop (the trigger now resizes, not just the label). Consolidate the duplicated control size scale (input, button) and the drifting dropdown option states (select, combobox, autocomplete) into shared `composes` sources in `compositions.module.css`. Add a checkmark indicator to the selected `Select` item, and make the `Card` inner container fullwidth so body content spans the card.
