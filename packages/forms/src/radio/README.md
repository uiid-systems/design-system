# Radio

> One choice in a mutually exclusive set. Only meaningful inside a `RadioGroupRoot`, which supplies the shared name, the roving focus, and the single-selection behavior.

Use Radio when you want to:

- Compose a group by hand rather than passing `items` to [`RadioGroup`](../radio-group/README.md) — each radio can then carry its own `description`, `size`, or variants
- Label the row inline with `label` and `description` instead of composing a `Field` by hand
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`)
- Draw the row as a control surface with `bordered`, and put the dot after the label with `reversed`
- Colour the checked dot with a palette `color` (`red`, `blue`, …) — the hue paints the selected state only, so a resting radio stays on the neutral scale
- Hide the dot from sight with `hideIndicator` while it stays in the accessibility tree, so the row still reads and toggles as a radio

`value` identifies the radio within its group; selection state lives on the group, not here.

Radio and [`Checkbox`](../checkbox/README.md) share one control surface — Radio paints with the checkbox styles rather than duplicating them — and both sit in the same shared field row. `FieldProps` and `IndicatorProps` reach the row and the dot when a top-level prop isn't expressive enough.

Additional props are forwarded to the underlying Base UI [Radio](https://base-ui.com/react/components/radio).
