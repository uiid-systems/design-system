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

Leave `value` unset and the field runs itself; pass `value` and `onValueChange` to drive it yourself.

Pick the change handler by what it costs. `onValueChange` fires on every keystroke while typing and on every step of a scrub or wheel drag, so it suits cheap per-step work — mirroring the value into local state, moving a preview. `onValueCommitted` fires once the interaction settles: blur after typing, pointer release after a scrub or a stepper press. Wire anything that writes, fetches, or navigates to that one, or a caller gets a round trip per character. Getting it wrong fails quietly and blames the wrong thing: if `value` is derived from the expensive work, the field cannot update until that work resolves, so it lags what was typed or dragged and reads as broken. Track the value on local state and report on commit.

Compose the parts to add a scrub area — dragging the label changes the value, which is faster than stepping for coarse adjustments. `NumberFieldRoot`, `NumberFieldGroup`, `NumberFieldDecrement`, `NumberFieldIncrement`, `NumberFieldInput`, `NumberFieldScrubArea`, and `NumberFieldScrubAreaCursor` are all exported, and slot overrides (`RootProps`, `GroupProps`, `DecrementProps`, `IncrementProps`, `InputProps`, `FieldProps`) reach them from the monolithic component.

`NumberFieldGroup` renders a `Group`, so `GroupProps` takes its layout props (`gap`, `p`, `ax`, `ay`, ...) alongside Base UI's. A `render` of your own replaces the `Group`, so layout props passed beside it reach your element as plain attributes.

Give it a `name` and a surrounding [`Form`](../form/README.md) publishes the matching entry of its `errors` map onto it; `FieldProps` is where `errorType` lives.

Additional props are forwarded to the underlying Base UI [Number Field](https://base-ui.com/react/components/number-field). `size` is the same deliberate exception as on [`Input`](../input/README.md): the system control scale, not the native character-width attribute.
