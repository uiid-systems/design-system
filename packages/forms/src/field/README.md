# Field

> The label, description, hint, and error layer every control in this package is built on. Wrap any control and it joins the validation graph.

Use Field when you want to:

- Put a `label` and `description` on a control that doesn't take them directly
- Share one label across several controls — the inputs keep their own `name`s and the field supplies the heading
- Add a `hint` at the end of the label row: `{ text }` for a quiet aside, or `{ icon, tooltip }` to keep longer guidance out of the layout
- Choose where the error goes with `errorType` — `inline` reserves a line beneath the control, `tooltip` moves it to an icon beside the label, and `absolute` floats it so nothing below shifts
- Validate with `validate` (return the message, or `null` when the value passes) and decide when it runs with `validationMode`
- Mark the whole field `required` or `disabled` — both reach the control, not just the label

A field with no label, hint, description, or out-of-flow error paints no chrome and adds no layout: the control sits exactly where it would alone while still joining the field's validation graph.

Give the field a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it — the same path a server response takes. Slot overrides (`RootProps`, `LabelProps`, `DescriptionProps`, `ErrorProps`, `HintProps`) reach the individual parts when a top-level prop isn't expressive enough.

`FieldRoot`, `FieldControl`, `FieldItem`, `FieldValidity`, `FieldLabel`, `FieldDescription`, and `FieldError` are exported for composition, along with `FieldRow` — the shared label row that [`Checkbox`](../checkbox/README.md), [`Radio`](../radio/README.md), and [`Switch`](../switch/README.md) sit in.

Additional props are forwarded to the underlying Base UI [Field](https://base-ui.com/react/components/field).
