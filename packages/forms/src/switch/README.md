# Switch

> An on/off control for a setting that takes effect immediately. Same label row as [`Checkbox`](../checkbox/README.md), different affordance.

Use Switch when you want to:

- Toggle a setting that applies right away — use a checkbox instead when the value is only committed on submit
- Label the row inline with `label` and `description` instead of composing a `Field` by hand
- Draw the row as a control surface with `bordered`, and put the switch after the label with `reversed`
- Mark it `disabled` or `readOnly`

Leave `checked` unset and the switch runs itself; pass `checked` and `onCheckedChange` to drive it yourself.

Validity comes from the surrounding [`Form`](../form/README.md) or [`Field`](../field/README.md) — give it a `name` and a `Form` publishes the matching entry of its `errors` map onto it. Slot overrides (`RootProps`, `ThumbProps`, `FieldProps`) reach the individual parts when a top-level prop isn't expressive enough.

Additional props are forwarded to the underlying Base UI [Switch](https://base-ui.com/react/components/switch).
