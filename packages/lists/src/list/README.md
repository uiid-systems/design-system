# List

> A vertical collection of items. Precomposed when you have data, composable when you don't.

Use List when you want to:

- Render an array of items with `items` — each entry is a `ListItem` (`{ label, description, icon }`) or a `ListGroup` (`{ category, icon, items }`) for nesting
- Compose by hand instead — pass `<ListItem>` and `<ListGroup>` as children
- Pick a bullet style with `marker`: `"none"` (default, unstyled), `"disc"` / `"square"` (renders `<ul>`), or `"decimal"` (renders `<ol>`)
- Set shared defaults for every item via `ItemProps`, and for every group's root `Stack` via `GroupProps` (layout props like `gap` or `className`). Both reach nested groups, an entry's own props win, and `className` joins rather than replaces

Both shapes coexist: `items` is the fast path for data, JSX children is the escape hatch for custom layouts. The `marker` is drawn only on the `label` of an item with no `icon` and no `children`, so a `ListItem` with an `icon` or given `children` shows no bullet or number.

## Subcomponents

- **`ListItem`** — a single row. Slots: `label`, `description`, `icon`. Pass `children` to take over the contents. Items render as `<li>`; inside a `List`, keep that `<li>` and put an interactive element in it, as in `<ListItem><a href="/docs">Docs</a></ListItem>`. `render` replaces the `<li>` itself, and a `<ul>` or `<ol>` may only hold `<li>` children, so don't pass `render={<a />}` to a row of a plain `List`.
- **`ListGroup`** — a labeled grouping. Slots: `category` (header text), `icon`, `items`. Nest groups to build trees.

`ListGroup` is purely visual — no collapsible behavior. For collapsible lists, wrap a `List` in your own `Collapsible` from `@uiid/interactive`.

## Forms integration

`Select`, `Combobox`, and `Autocomplete` from `@uiid/forms` render their dropdown options as `ListItem` via the Base UI render system. Items inherit list-item styling and pick up `data-highlighted` / `data-selected` from Base UI's state, so any CSS targeting those attributes works.
