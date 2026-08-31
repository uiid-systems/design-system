# Autocomplete

> A text input that suggests without constraining — the typed value stands on its own, whether or not it appears in the list.

Use Autocomplete when you want to:

- Suggest as the user types while still accepting anything they enter — reach for [`Combobox`](../combobox/README.md) when the value has to come from the list
- Label it inline with `label` and `description` instead of composing a `Field` by hand
- Put an icon or a hint inside the control with `before` and `after`
- Mark it `required`, `disabled`, or `readOnly`

Leave `value` unset and the autocomplete runs itself; pass `value` and `onValueChange` to drive it yourself. Give it a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it.

The full tree — `AutocompleteRoot`, `AutocompleteInput`, `AutocompletePortal`, `AutocompletePositioner`, `AutocompletePopup`, `AutocompleteList`, `AutocompleteItem`, and `AutocompleteEmpty` — is exported for composition, and slot overrides (`RootProps`, `InputProps`, `InputGroupProps`, `PortalProps`, `PositionerProps`, `PopupProps`, `ListProps`) reach them from the monolithic component. Autocomplete and Combobox share their popup, list, item, and empty layer.

Additional props are forwarded to the underlying Base UI [Autocomplete](https://base-ui.com/react/components/autocomplete).
