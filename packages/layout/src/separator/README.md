# Separator

> A single line that divides sibling content, horizontally or vertically. Optional `children` split the line into two segments around inline copy.

Built on Base UI's [`Separator`](https://base-ui.com/react/components/separator). Pair with [`Stack`](../stack/README.md) for horizontal rules between rows, or [`Group`](../group/README.md) for vertical rules between columns.

Use Separator when you want to:

- Divide stacked content with a horizontal rule (default)
- Divide row content with `orientation="vertical"`
- Frame inline copy between two line segments by passing `children` (e.g. "OR" between sign-in options)
- Match a specific token color via `shade` — defaults to the global border color
