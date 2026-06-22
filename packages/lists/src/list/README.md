# List

> A vertical collection of items. Precomposed when you have data, composable when you don't.

Use List when you want to:

- Render an array of items with `items` — each entry is a `ListItem` (`{ label, description, icon }`) or a `ListGroup` (`{ category, icon, items }`) for nesting
- Compose by hand instead — pass `<ListItem>` and `<ListGroup>` as children
- Pick a bullet style with `marker`: `"none"` (default, unstyled), `"disc"` / `"square"` (renders `<ul>`), or `"decimal"` (renders `<ol>`)
- Add a vertical guide on nested group panels with `line` — useful for tree-style navigation
- Apply shared overrides to every rendered item or group via `ItemProps` and `GroupProps` on the wrapper

Both shapes coexist: `items` is the fast path for data, JSX children is the escape hatch for custom layouts. They render the same output.

## Subcomponents

- **`ListItem`** — a single row. Slots: `label`, `description`, `icon`. Pass `children` to take over the contents. Items render as `<li>` by default; pass `render={<a />}` or `render={<div onClick={...} />}` for interactive rows.
- **`ListGroup`** — a labeled grouping. Slots: `category` (header text), `icon`, `items`. Nest groups to build trees.

`ListGroup` is purely visual — no collapsible behavior. For collapsible lists, wrap a `List` in your own `Collapsible` from `@uiid/overlays`.

## Forms integration

`Select`, `Combobox`, and `Autocomplete` from `@uiid/forms` render their dropdown options as `ListItem` via the Base UI render system. Items inherit list-item styling and pick up `data-highlighted` / `data-selected` from Base UI's state, so any CSS targeting those attributes works.
