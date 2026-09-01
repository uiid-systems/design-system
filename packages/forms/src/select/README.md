# Select

> A dropdown over a known list of options. Pass `items` for the common case; compose the parts when the list needs its own markup.

Use Select when you want to:

- Pick from a fixed list — each entry in `items` carries `value` and `label`, and optionally an `icon`, a `description`, or `disabled`
- Open empty rather than preselecting the first option by giving it a `placeholder`
- Label it inline with `label` and `description` instead of composing a `Field` by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`)
- Put an icon or a hint inside the trigger with `before` and `after`
- Collect several values at once with `multiple` — the trigger lists the selection and the popup keeps the checked state
- Soften the surface with `variant="ghost"` or fill the container with `fullwidth`
- Tint it with a palette `color` (`red`, `blue`, …) — the hue paints the trigger and the popup together
- Mark it `required`, `disabled`, or `readOnly`

The trigger never grows past its container: a long value truncates instead.

Drop `items` and pass children to compose the list yourself with `SelectItem`. Doing so also takes over value-to-label resolution, so give the trigger a `placeholder` or a `ValueProps` render function.

Leave `value` unset and the select runs itself; pass `value` and `onValueChange` to drive it yourself. Give it a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it.

Slot overrides (`RootProps`, `TriggerProps`, `PortalProps`, `PositionerProps`, `PopupProps`, `ListProps`, `ValueProps`, `IconProps`, `FieldProps`) reach the individual parts when a top-level prop isn't expressive enough.

When the list is long enough to need filtering, reach for [`Combobox`](../combobox/README.md); when the typed value doesn't have to come from the list, [`Autocomplete`](../autocomplete/README.md).

Additional props are forwarded to the underlying Base UI [Select](https://base-ui.com/react/components/select).
