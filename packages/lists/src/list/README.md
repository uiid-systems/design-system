# List

> A vertical collection of items. Precomposed when you have data, composable when you don't.

Use List when you want to:

- Render an array of items with `items` — each entry is a `ListItem` (`{ label, description, icon }`) or a `ListGroup` (`{ category, icon, items }`) for nesting
- Compose by hand instead — pass `<ListItem>` and `<ListGroup>` as children
- Pick a bullet style with `marker`: `"none"` (default, unstyled), `"disc"` / `"square"` (renders `<ul>`), or `"decimal"` (renders `<ol>`, and an `<ol>` for each nested group too)
- Set shared defaults for every item via `ItemProps`, and for every group's root `Stack` via `GroupProps` (layout props like `gap` or `className`). Both reach nested groups, an entry's own props win, and `className` joins rather than replaces. In a marked list, `className` and DOM props stay on the `<li>` while layout props go to an inner flex element, so flex CSS you attach through `className` won't reach the flex element, and flex-item props like `grow` act on the inner element

Both shapes coexist: `items` is the fast path for data, JSX children is the escape hatch for custom layouts. With a `marker`, every row's `<li>` is a native list item, so the browser draws and counts the marker the same for a `label`, an `icon` row (the marker sits beside the icon), composed `children` and a `ListGroup`, whose own items restart at 1. The row's layout props (`ax`, `ay`, `gap`, spacing and sizing) move to an inner flex element so the row keeps its layout, while `className`, `render` and DOM attributes stay on the `<li>`. A `List` nested inside a row follows its own `marker`, so an unmarked one stays unmarked.

## Subcomponents

- **`ListItem`** — a single row. Slots: `label`, `description`, `icon`. Pass `children` to take over the contents. Items render as `<li>`; inside a `List`, keep that `<li>` and put an interactive element in it, as in `<ListItem><a href="/docs">Docs</a></ListItem>`. `render` replaces the `<li>` itself, and a `<ul>` or `<ol>` may only hold `<li>` children, so don't pass `render={<a />}` to a row of a plain `List`.
- **`ListGroup`** — a labeled grouping. Slots: `category` (header text), `icon`, `items`. Nest groups to build trees.
- **`ListGroupHeader`** — a group's heading row: the `icon` and the `category` as an `<h3>`. Renders nothing without a `category`. It is a `div`, not an `<li>`, so place it inside a `ListGroup` row, never directly in a `List`'s `<ul>` or `<ol>`.
- **`ListLabel`** and **`ListDescription`** — the `Text` a `ListItem` renders for `label` and `description`, for rebuilding that text in a row whose `children` take over the contents.

`ListGroup` is purely visual — no collapsible behavior. For collapsible lists, wrap a `List` in your own `Collapsible` from `@uiid/interactive`.

## Forms integration

`Select`, `Combobox`, and `Autocomplete` from `@uiid/forms` render their dropdown options as `ListItem` via the Base UI render system. Items inherit list-item styling and pick up `data-highlighted` / `data-selected` from Base UI's state, so any CSS targeting those attributes works.
