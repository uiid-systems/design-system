# Autocomplete

> A text input that suggests without constraining — the typed value stands on its own, whether or not it appears in the list.

Use Autocomplete when you want to:

- Suggest as the user types while still accepting anything they enter — reach for [`Combobox`](../combobox/README.md) when the value has to come from the list
- Label it inline with `label` and `description` instead of composing a `Field` by hand
- Put an icon or a hint inside the control with `before` and `after`
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — the tier reaches the input, so it lines up with a sibling [`Input`](../input/README.md)
- Tint it with a palette `color` (`red`, `blue`, …) — the hue paints the input and the popup together
- Soften the surface with `variant="ghost"`, or pass `fullwidth={false}` to let it size to its content rather than span its row, as it does by default
- Mark it `required`, `disabled`, or `readOnly`

Leave `value` unset and the autocomplete runs itself; pass `value` and `onValueChange` to drive it yourself. Give it a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it.

`items` is not limited to strings. `Autocomplete` is generic over its item `Value`, as Base UI's `Root` is, and infers it from `items`. Base UI's Autocomplete has no `itemToStringLabel`: `itemToStringValue` is the text it fills the input with, so each row shows the same text, falling back to an object item's own `label`, then its `value` field, then to a primitive item, never to `[object Object]`. An object with neither a `label` nor a primitive `value` field renders an empty row, so pass `itemToStringValue` for one. `AutocompleteItem` takes a `label` when you compose the list yourself. The monolith renders flat `items` only; compose the parts for grouped items.

The full tree — `AutocompleteRoot`, `AutocompleteInputGroup`, `AutocompleteInput`, `AutocompletePortal`, `AutocompletePositioner`, `AutocompletePopup`, `AutocompleteList`, `AutocompleteItem`, and `AutocompleteEmpty` — is exported for composition, and slot overrides (`RootProps`, `InputProps`, `InputGroupProps`, `PortalProps`, `PositionerProps`, `PopupProps`, `ListProps`) reach them from the monolithic component. When a top-level prop and `RootProps` set the same key, the top-level prop wins. Autocomplete and Combobox share their popup, list, item, and empty layer. `AutocompleteInput` renders the input group around its control row only, leaving the label, description and error outside it, so the popup opens against the control, as in Combobox. Never wrap `AutocompleteInput` in `AutocompleteInputGroup`: that nests a second group, the outer one takes the popup's anchor, and the popup opens below the description again. To reach the group, pass `InputGroupProps` to `AutocompleteInput`, or to the monolithic component, which merges it with any `InputGroupProps` inside `InputProps`.

The popup renders a [`Card`](../../../cards/src/card/README.md), so `PopupProps` takes the layout props `Card` spreads onto its container (`p`, `fullwidth`, `maxh`, ...) alongside Base UI's, though not its content slots like `title` or `footer`. It defaults to `p={2}`, `gap={0}`, and `fullwidth`; pass any of them to change it. The rows sit inside the Card's inner container, so `gap`, `ax`, and `ay` on the popup don't move them. A `render` of your own replaces the `Card`, so layout props passed beside it reach your element as plain attributes.

Additional props are forwarded to the underlying Base UI [Autocomplete](https://base-ui.com/react/components/autocomplete), except DOM attributes — `aria-*` and `data-*` land on the input, which is the focusable element and the one carrying `role="combobox"`. That is where a name or a `data-*` hook belongs, and Base UI's `Root` renders no element to carry one.
