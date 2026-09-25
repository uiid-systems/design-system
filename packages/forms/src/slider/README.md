# Slider

> A draggable control for a value in a range, with a formatted readout above the track.

Use Slider when you want to:

- Pick a value by dragging rather than typing — an array `defaultValue` gives one thumb per value, so a two-value slider is a range
- Bound and quantize with `min`, `max`, and `step`, with `largeStep` applying when shift is held
- Format the readout with `format`, which takes `Intl.NumberFormat` options
- Replace the readout entirely through `ValueProps.children`, a render function receiving the formatted strings and the raw numbers
- Match a control row with `size` (`xsmall`, `small`, `medium`, `large`) — the row height, inline padding and readout match a sibling Input at the same tier, and the thumb and track scale with it
- Run it top-to-bottom with `orientation="vertical"`
- Label it inline with `label` and `description` instead of composing a [`Field`](../field/README.md) by hand
- Soften the surface with `variant="ghost"`, fill the container with `fullwidth`, or mark it `disabled`
- Colour the filled track and thumb with a palette `color` (`red`, `blue`, …) — the unfilled track and the surrounding surface stay neutral

Leave `value` unset and the slider runs itself; pass `value` and `onValueChange` to drive it yourself.

Pick the change handler by what it costs. `onValueChange` fires on every step of a drag, so it suits cheap per-step work — mirroring the value into local state, moving a preview. `onValueCommitted` fires once, when the pointer releases, a key lifts, or the track is pressed; wire anything that writes, fetches, or navigates to that one. Getting it wrong fails quietly and blames the wrong thing: if `value` is derived from the expensive work, the thumb cannot move until that work resolves, so it lags the pointer and rubber-bands, and the slider reads as broken rather than the handler. Track the thumb on local state and report on commit.

Slider's root is a control surface like any other form control, so it paints with [`Input`](../input/README.md)'s styles rather than duplicating them — a slider lines up with a sibling input at the same `size`.

`SliderRoot`, `SliderLabel`, `SliderValue`, `SliderControl`, `SliderTrack`, `SliderIndicator`, and `SliderThumb` are exported for composition, and slot overrides (`RootProps`, `ValueProps`, `ControlProps`, `TrackProps`, `IndicatorProps`, `ThumbProps`, `FieldProps`) reach them from the monolithic component.

The root and `SliderControl` each render a `Group`, so the slider's own props, `RootProps`, and `ControlProps` take its layout props (`gap`, `p`, `ax`, `ay`, ...) alongside Base UI's. The root defaults to `gap={2}` and `ay="center"`, the control to `ay="center"`, `px={3}`, and `fullwidth`; pass any of them to change it. A `render` of your own replaces the `Group`, so layout props passed beside it reach your element as plain attributes.

Additional props are forwarded to the underlying Base UI [Slider](https://base-ui.com/react/components/slider).
