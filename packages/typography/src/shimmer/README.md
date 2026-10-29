# Shimmer

> A soft highlight that sweeps across a line of text in a loop, built on [`Text`](../text/README.md). It is the pending-state pattern from AI chat UIs ("Thinking…"), done with one CSS keyframe: a soft band in the text's own hue slides over its color, both clipped to the glyphs. No JavaScript, no dependencies, and it renders on the server.

Use Shimmer when you want to:

- Show that something is in progress without a spinner — a reasoning step, a tool call, a status line
- Keep the label readable the whole time: the glyphs stay real text in `Text`'s resolved color, with a glint passing through
- Style the label with any `Text` prop — `size`, `weight`, `family`, `color`, `emphasis`, spacing, and `render` all pass through

## Usage

```tsx
import { Shimmer } from "@uiid/typography";

<Shimmer>Thinking…</Shimmer>;
```

## Props

All [`Text`](../text/README.md) props, plus:

| Prop       | Type     | Default | Description                                                         |
| ---------- | -------- | ------- | ------------------------------------------------------------------- |
| `children` | `string` | —       | Text to shimmer — string only, since its length sizes the highlight |
| `duration` | `number` | `2000`  | Duration of one sweep, in ms                                        |
| `spread`   | `number` | `2`     | Highlight width per character, in px                                |

## Color

The base color is whatever `Text` resolves — the default foreground, a palette `color`, or an `emphasis` — so a blue label shimmers in blue. The highlight is the hue's `--palette-tint-border`, a soft wash a few steps toward the page, so the glyphs stay legible under the band in both themes. A label with no `color` or `emphasis` falls back to `--shade-accent`, a light gray wash. Shimmer adds no color props of its own.

```tsx
<Shimmer color="blue">Searching the web…</Shimmer>
<Shimmer emphasis="muted">Generating…</Shimmer>
```

## Accessibility

- Respects `prefers-reduced-motion` — the sweep stops and the text renders statically in its own color.
- Content stays a plain text node: selection, find-in-page, and screen readers see ordinary text. The animation itself announces nothing; if the pending state needs announcing, put `aria-busy` or a live region on the surrounding status.

## Notes

- `children` must be a string. The highlight fades in and out over `children.length × spread` px on each side of its center, so a longer label gets a proportionally wider band.
- The element sizes itself to its text (`width: fit-content`), so a block `render` such as `<p />` shrinks to the label and the sweep covers the text rather than the container. A parent's `text-align: center` therefore no longer centers it; use the parent's layout props instead.
- Each Shimmer runs on its own clock, so several mounted at different times will not be in phase.
