# Progress

> A bar showing how far a task has run, or that it is running when its size is not yet known.

Use Progress when you want to:

- Show a task's completion with `value`, bounded by `min` and `max` (0 and 100 by default)
- Show that work has started before its size is known, by passing `value={null}` — the indicator sweeps the track, and holds still as a dimmed full bar when the user prefers reduced motion
- Name the bar with `label`, which takes any node and labels the progressbar for assistive tech
- Format the readout with `format`, which takes `Intl.NumberFormat` options, and `locale`
- Replace the readout entirely through `ValueProps.children`, a render function receiving the formatted string and the raw number
- Drop the readout with `hideValue` — the value still reaches assistive tech through `aria-valuenow` and `aria-valuetext`
- Set the track's thickness with `size` (`xsmall`, `small`, `medium`, `large`)
- Colour the indicator with a palette `color` (`red`, `blue`, …) — the track stays neutral

With `hideValue` and no `label`, Progress renders the track alone — the compact form a loading toast or a card footer wants.

Pass `value={null}`, not `0`, while a task works out how much there is to do. `0` reads as "nothing done yet"; `null` reads as "working". Base UI requires `value`, so Progress does not default it.

When a readout replaces the number with words, pass `getAriaValueText` too, so screen readers hear what sighted users read.

`ProgressRoot`, `ProgressHeader`, `ProgressLabel`, `ProgressValue`, `ProgressTrack`, and `ProgressIndicator` are exported for composition, and slot overrides (`RootProps`, `HeaderProps`, `LabelProps`, `ValueProps`, `TrackProps`, `IndicatorProps`) reach them from the monolithic component.

The root renders a `Stack` and the header a `Group`, so they take layout props (`gap`, `p`, `ax`, `ay`, ...) alongside Base UI's. The root defaults to `gap={2}` and `fullwidth`, and never shrinks below `--progress-min-width` (8rem), so a bare bar stays visible in a shrink-to-fit container; the header to `gap={2}`, `ay="center"`, and `fullwidth`; pass any of them to change it.

Every colour and dimension reads a `--progress-*` variable (`--progress-min-width`, `--progress-track-color`, `--progress-indicator-color`, `--progress-track-height`, `--progress-radius`, `--progress-indeterminate-width`, `--progress-indeterminate-duration`), so a single bar can be retuned from CSS without reaching into its parts.

Additional props are forwarded to the underlying Base UI [Progress](https://base-ui.com/react/components/progress).
