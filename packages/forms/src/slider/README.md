# Slider

> A draggable control for a value in a range, with a formatted readout above the track.

Use Slider when you want to:

- Pick a value by dragging rather than typing — an array `defaultValue` gives one thumb per value, so a two-value slider is a range
- Bound and quantize with `min`, `max`, and `step`, with `largeStep` applying when shift is held
- Format the readout with `format`, which takes `Intl.NumberFormat` options
- Replace the readout entirely through `ValueProps.children`, a render function receiving the formatted strings and the raw numbers
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — the row height, inline padding, and readout scale with the tier, while the track and thumb stay fixed so a small slider keeps a usable grab target
- Run it top-to-bottom with `orientation="vertical"`
- Label it inline with `label` and `description` instead of composing a [`Field`](../field/README.md) by hand
- Soften the surface with `variant="ghost"`, fill the container with `fullwidth`, or mark it `disabled`
- Colour the filled track and thumb with a palette `color` (`red`, `blue`, …) — the unfilled track and the surrounding surface stay neutral

Leave `value` unset and the slider runs itself; pass `value` and `onValueChange` to drive it yourself. `onValueCommitted` fires once the drag ends.

Slider's root is a control surface like any other form control, so it paints with [`Input`](../input/README.md)'s styles rather than duplicating them — a slider lines up with a sibling input at the same `size`.

`SliderRoot`, `SliderLabel`, `SliderValue`, `SliderControl`, `SliderTrack`, `SliderIndicator`, and `SliderThumb` are exported for composition, and slot overrides (`RootProps`, `ValueProps`, `ControlProps`, `TrackProps`, `IndicatorProps`, `ThumbProps`, `FieldProps`) reach them from the monolithic component.

Additional props are forwarded to the underlying Base UI [Slider](https://base-ui.com/react/components/slider).
