# Combobox

> A text input that filters a list and commits to one of its options. The value has to come from the list.

Use Combobox when you want to:

- Narrow a long list by typing — `items` supplies the options and filtering is handled for you
- Label it inline with `label` and `description` instead of composing a `Field` by hand
- Put an icon or a hint inside the control with `before` and `after`
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — the tier reaches the input, so it lines up with a sibling [`Input`](../input/README.md)
- Tint it with a palette `color` (`red`, `blue`, …) — the hue paints the input and the popup together
- Mark it `required`, `disabled`, or `readOnly`

Leave `value` unset and the combobox runs itself; pass `value` and `onValueChange` to drive it yourself. Give it a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it.

For multiple selection, compose the parts: `ComboboxChips` replaces the plain input row and `ComboboxValue` renders one chip per selected item. The full tree — `ComboboxRoot`, `ComboboxInput`, `ComboboxPortal`, `ComboboxPositioner`, `ComboboxPopup`, `ComboboxList`, `ComboboxItem`, `ComboboxEmpty`, and the chip parts — is exported, and slot overrides (`RootProps`, `InputProps`, `InputGroupProps`, `PortalProps`, `PositionerProps`, `PopupProps`, `ListProps`) reach them from the monolithic component.

Combobox and [`Autocomplete`](../autocomplete/README.md) share their popup, list, item, and empty layer. Reach for Autocomplete when the typed value stands on its own, and [`Select`](../select/README.md) when the list is short enough not to need filtering.

Additional props are forwarded to the underlying Base UI [Combobox](https://base-ui.com/react/components/combobox).
