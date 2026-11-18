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

For multiple selection, compose the parts: `ComboboxChips` replaces the plain input row and `ComboboxValue` renders one chip per selected item. The full tree — `ComboboxRoot`, `ComboboxInput`, `ComboboxPortal`, `ComboboxPositioner`, `ComboboxPopup`, `ComboboxList`, `ComboboxItem`, `ComboboxEmpty`, and the chip parts — is exported, and slot overrides (`RootProps`, `InputProps`, `InputGroupProps`, `PortalProps`, `PositionerProps`, `PopupProps`, `ListProps`) reach them from the monolithic component. `ComboboxInput` renders the input group around its control row only, leaving the label, description and error outside it, so the popup opens against the control rather than below the description. Never wrap `ComboboxInput` in `ComboboxInputGroup`: that nests a second group, the outer one takes the popup's anchor, and the popup opens below the description again. To reach the group, pass `InputGroupProps` to `ComboboxInput`, or to the monolithic component, which merges it with any `InputGroupProps` inside `InputProps`.

When you compose the parts, `required` goes in two places: on `ComboboxRoot` to make the control required, and on `ComboboxInput` to show the label's required marker. Neither does the other's job, since `ComboboxRoot` alone leaves the label unmarked. `ComboboxInput`'s `required` also puts the native `required` attribute on the query text input, and in multiple-select mode that input is empty whenever nothing is being typed, so the form fails validation even when values are selected.

The popup renders a [`Card`](../../../cards/src/card/README.md) and `ComboboxChips` a `Group`. `PopupProps` takes the layout props `Card` spreads onto its container (`p`, `fullwidth`, `maxh`, ...) alongside Base UI's, though not its content slots like `title` or `footer`, and defaults to `p={2}`, `gap={0}`, and `fullwidth`. The rows sit inside the Card's inner container, so `gap`, `ax`, and `ay` on the popup don't move them. The chips take the `Group`'s layout props and default to `gap={1}` and `ay="center"`; pass any of them to change it. A `render` of your own replaces the primitive, so layout props passed beside it reach your element as plain attributes.

Combobox and [`Autocomplete`](../autocomplete/README.md) share their popup, list, item, and empty layer. Reach for Autocomplete when the typed value stands on its own, and [`Select`](../select/README.md) when the list is short enough not to need filtering.

Additional props are forwarded to the underlying Base UI [Combobox](https://base-ui.com/react/components/combobox), except DOM attributes — `aria-*` and `data-*` land on the input, which is the focusable element and the one carrying `role="combobox"`. That is where a name or a `data-*` hook belongs, and Base UI's `Root` renders no element to carry one.
