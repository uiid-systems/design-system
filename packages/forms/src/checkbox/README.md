# Checkbox

> A single on/off box with its label row built in. Pass `label` and `description` and it renders a full field row; pass neither and it renders just the box.

Use Checkbox when you want to:

- Toggle one independent option — for a set of related options reach for [`CheckboxGroup`](../checkbox-group/README.md)
- Label the row inline with `label` and `description` instead of composing a `Field` by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`)
- Draw the row as a control surface with `bordered`, and put the box after the label with `reversed`
- Colour the checked box with a palette `color` (`red`, `blue`, …) — the hue paints the selected state only, so an unchecked box stays on the neutral scale
- Show a partial selection with `indeterminate` — the "select all" state above a list of children
- Hide the box from sight with `hideIndicator` while it stays in the accessibility tree, so the row still reads and toggles as a checkbox
- Mark it `required`, `disabled`, or `readOnly`

Leave `checked` unset and the box runs itself; pass `checked` and `onCheckedChange` to drive it yourself.

Validity comes from the surrounding [`Form`](../form/README.md) or [`Field`](../field/README.md) — give it a `name` and a `Form` publishes the matching entry of its `errors` map onto it. The error takes the `description`'s place in the row while it shows, and the description comes back once it clears. `FieldProps` and `IndicatorProps` reach the row and the box when a top-level prop isn't expressive enough. `FieldProps` takes no `label`, `description`, `size`, `reversed` or `bordered`, which are set on Checkbox itself, and its `LabelProps` and `DescriptionProps` take no `children`.

Additional props are forwarded to the underlying Base UI [Checkbox](https://base-ui.com/react/components/checkbox).
