# Toggle Group

> A row of toggles that behave as one control — a segmented picker for a small, always-visible set of options.

Use ToggleGroup when you want to:

- Offer two to four options that are worth showing at once — for a longer list reach for [`Select`](../select/README.md), and for a form value with a label row [`RadioGroup`](../radio-group/README.md)
- Let more than one be pressed at a time with `multiple`; without it the toggles are mutually exclusive
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — the tier sets the group's height and each toggle's inline padding, font size and icon size
- Drop the container surface with `variant="ghost"`, leaving only the moving indicator
- Stack the toggles with `orientation="vertical"`
- Disable the whole group with `disabled`, or a single `Toggle` with its own `disabled`

`value` is always an array, even in single-selection mode. Leave it unset and the group runs itself from `defaultValue`; pass `value` and `onValueChange` to drive it yourself.

Children are `Toggle` elements, each carrying its `value`. An icon-only group needs an `aria-label` on every toggle.

Additional props are forwarded to the underlying Base UI [Toggle Group](https://base-ui.com/react/components/toggle-group).
