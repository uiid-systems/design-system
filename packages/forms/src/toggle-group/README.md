# Toggle Group

> A row of toggles that behave as one control — a segmented picker for a small, always-visible set of options.

Use ToggleGroup when you want to:

- Offer two to four options that are worth showing at once — for a longer list reach for [`Select`](../select/README.md), and for a form value with a label row [`RadioGroup`](../radio-group/README.md)
- Let more than one be pressed at a time with `multiple`; without it the toggles are mutually exclusive. A `multiple` group has no sliding indicator — one pill cannot sit behind several pressed toggles — so each pressed toggle carries its own background, and pressing it again releases it
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — the tier sets the group's height and each toggle's inline padding, font size and icon size
- Drop the container surface with `variant="ghost"`, leaving only the moving indicator
- Stack the toggles with `orientation="vertical"` — arrow-key navigation follows the axis, so a vertical group walks with up and down
- Stretch the group across its container with `w="full"` — a horizontal group shares the width evenly between its toggles, however long their labels, and a vertical group stretches each toggle across it
- Disable the whole group with `disabled`, or a single `Toggle` with its own `disabled`

The group shrink-wraps its toggles rather than stretching to fill its container, so it can be dropped into a layout without being sized down. Pass `w="full"` when it should fill the row instead.

`value` is always an array, even in single-selection mode. Leave it unset and the group runs itself from `defaultValue`; pass `value` and `onValueChange` to drive it yourself. The handler is Base UI's own: it receives the new array and the event details, so calling `eventDetails.cancel()` refuses the change, and a group whose values are a string union hands that union back.

A single-selection group that holds a value keeps one. Pressing the pressed toggle again, by pointer or by keyboard, changes nothing and does not call `onValueChange`. A `Toggle`'s own `onPressedChange` still receives `false` for that refused press, because Base UI calls it before the group's handler; the toggle stays pressed. A group can still start empty, by leaving out `defaultValue` or passing `value={[]}`, and it shows no indicator until a toggle is pressed.

Children are `Toggle` elements, each carrying its `value`. An icon-only group needs an `aria-label` on every toggle. A `Toggle` takes Base UI's props, except that its `className` is a string (the group merges its own class into it), so style the pressed state through `data-pressed`. Its types are `ToggleProps`, `ToggleState` and `ToggleChangeEventDetails`.

Additional props are forwarded to the underlying Base UI [Toggle Group](https://base-ui.com/react/components/toggle-group).
