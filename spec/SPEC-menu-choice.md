# Spec: menu-choice — V1

Milestone 3. Inherits the shared conventions in `spec/capability-map.md`.

## Objective

A menu can hold toggles and one-of-many choices, for view options and sort pickers. These are parts only: they carry state, and the `items` array does not mirror it.

## Current behavior this spec changes

- Base UI's `CheckboxItem`, `CheckboxItemIndicator`, `RadioGroup`, `RadioItem` and `RadioItemIndicator` are not wrapped.

## Requirements

1. New parts `MenuCheckboxItem`, `MenuRadioGroup` and `MenuRadioItem` wrap Base UI's and take its props unchanged (`checked`, `defaultChecked`, `onCheckedChange`, `value`, `onValueChange`, `closeOnClick`, `disabled`).
2. `MenuCheckboxItem` and `MenuRadioItem` render a `ListItem` row with `label`, `description` and `icon`, like `MenuItem`, and draw their indicator themselves at the end of the row, the way `SelectItem` draws its check.
3. `MenuCheckboxItemIndicator` and `MenuRadioItemIndicator` are exported for a row whose `children` take over the content.
4. An unchecked row reserves the indicator's space, so labels in a mixed list stay aligned.
5. Checked, highlighted and disabled states combine correctly: a checked disabled row shows its indicator, muted.
6. These parts work inside `MenuGroup` and inside a submenu.

## Testing strategy

- Unit tests cover 1 to 6: roles `menuitemcheckbox` and `menuitemradio`, `aria-checked`, controlled and uncontrolled state, `closeOnClick` default (menu stays open on toggle, as in Base UI), disabled.
- Browser test: label x-position is equal for a checked and an unchecked row.
- Stories: view toggles, sort picker, both in one menu with group labels.

## Success criteria

- [ ] Toggling a checkbox item flips `aria-checked` and calls `onCheckedChange`.
- [ ] Choosing a radio item updates the group's value and unchecks its siblings.
- [ ] Checked and unchecked labels share an x-position in the browser test.
- [ ] The five parts and their prop types are in `index.test.ts`.

## Out of scope (deferred)

- Checkbox or radio entries in `items`.

## Open questions

None.
