# Resizable

> Panels laid out in a row or a column, with handles between them that the user drags to share out the space.

Use Resizable when you want to:

- Let the user widen a sidebar, or heighten an editor against a terminal, with `orientation` (`horizontal` or `vertical`, default `horizontal`). The older `direction` prop still works but is deprecated; `orientation` wins when both are set
- Start each panel at a `defaultSize`, and bound it with `minSize` and `maxSize`
- Nest one group inside another's panel for a split in both directions
- Fold a panel away with `collapsible` once it is dragged below its `minSize`
- Lock a handle with `disabled`, which takes it out of the tab order and stops it dragging
- Follow the sizes with `onLayoutChanged`, which reports each panel's share, keyed by its `id`, when a drag ends

Sizes follow react-resizable-panels: a number is pixels, and a string is a percentage of the group (`"25%"`, or `"25"`). A panel without a `defaultSize` takes an even share of what is left.

The group fills its parent (`width` and `height` are `100%`), so give the parent a size. Each panel scrolls its own overflow.

A handle renders a grip unless `withHandle={false}`, and children replace the grip. Handles are focusable separators that the arrow keys move. A disabled handle stops only itself; a panel that must not resize at all, directly or through a neighbour, needs `disabled` too.

`Resizable`, `ResizablePanel` and `ResizableHandle` wrap react-resizable-panels' [`Group`, `Panel` and `Separator`](https://github.com/bvaughn/react-resizable-panels) and forward their props unchanged, `orientation` included. `direction` is a deprecated alias for `orientation`.
