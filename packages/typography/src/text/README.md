# Text

> Typography primitive. Renders a `<span>` by default; size, weight, family, shade, color, and decorations are props. The whole design system reaches for this when rendering any string of text.

Use Text when you want to:

- Apply the size scale (`-1`..`6`) — small/body sizes through display
- Pair size with weight (`thin`..`bold` including `medium` and `semibold`) and family (`sans`, `serif`, `mono`)
- Color text via the shade ladder (`background`..`foreground`) or the palette (`red`, `blue`, etc.)
- Truncate to a single line, balance a heading, or strip decoration with `truncate`, `balance`, `underline={false}`, etc.
- Render as a different element (`<h1>`, `<label>`, `<p>`) via the `render` prop while keeping the typography props

For rendering markdown or arbitrary HTML content with vertical rhythm and default element styling, reach for [`Prose`](../prose/README.md) instead.
