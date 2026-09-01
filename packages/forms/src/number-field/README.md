# Number Field

> A numeric input with stepper buttons, keyboard stepping, and locale-aware formatting.

Use NumberField when you want to:

- Collect a number rather than a string — the value comes back as a `number`, not text
- Bound the range with `min` and `max`; outside it the stepper buttons disable themselves
- Set the increment with `step`, with `largeStep` applying when shift is held and `smallStep` with alt, and round to the grid with `snapOnStep`
- Format the displayed value with `format`, which takes `Intl.NumberFormat` options — currency, percent, and units all work
- Label it inline with `label` and `description` instead of composing a [`Field`](../field/README.md) by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`)
- Tint the cluster with a palette `color` (`red`, `blue`, …) — the hue lands on the group, so the stepper buttons and the input between them read as one field
- Mark it `required`, `disabled`, or `readOnly`

Leave `value` unset and the field runs itself; pass `value` and `onValueChange` to drive it yourself. `onValueCommitted` fires once the interaction settles.

Compose the parts to add a scrub area — dragging the label changes the value, which is faster than stepping for coarse adjustments. `NumberFieldRoot`, `NumberFieldGroup`, `NumberFieldDecrement`, `NumberFieldIncrement`, `NumberFieldInput`, `NumberFieldScrubArea`, and `NumberFieldScrubAreaCursor` are all exported, and slot overrides (`RootProps`, `GroupProps`, `DecrementProps`, `IncrementProps`, `InputProps`, `FieldProps`) reach them from the monolithic component.

Give it a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it; `FieldProps` is where `errorType` lives.

Additional props are forwarded to the underlying Base UI [Number Field](https://base-ui.com/react/components/number-field). `size` is the same deliberate exception as on [`Input`](../input/README.md): the system control scale, not the native character-width attribute.
