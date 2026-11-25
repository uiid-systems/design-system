# Switch

> An on/off control for a setting that takes effect immediately. Same label row as [`Checkbox`](../checkbox/README.md), different affordance.

Use Switch when you want to:

- Toggle a setting that applies right away — use a checkbox instead when the value is only committed on submit
- Label the row inline with `label` and `description` instead of composing a `Field` by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — the tier sets the track's width and height, and the thumb and its travel follow from that pair
- Draw the row as a control surface with `bordered`, and put the switch after the label with `reversed`
- Colour the checked track with a palette `color` (`red`, `blue`, …) — the thumb takes the paired foreground, and the off state stays on the neutral scale
- Mark it `disabled` or `readOnly`

Leave `checked` unset and the switch runs itself; pass `checked` and `onCheckedChange` to drive it yourself.

Validity comes from the surrounding [`Form`](../form/README.md) or [`Field`](../field/README.md) — give it a `name` and a `Form` publishes the matching entry of its `errors` map onto it. The error takes the `description`'s place in the row while it shows, and the description comes back once it clears. Slot overrides (`RootProps`, `ThumbProps`, `FieldProps`) reach the individual parts when a top-level prop isn't expressive enough. `FieldProps` takes no `label`, `description`, `size`, `reversed` or `bordered`, which are set on Switch itself, and its `LabelProps` and `DescriptionProps` take no `children`. When a top-level prop and `RootProps` set the same key, the top-level prop wins.

Additional props are forwarded to the underlying Base UI [Switch](https://base-ui.com/react/components/switch).
