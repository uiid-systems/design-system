# Group

> Horizontal flex layout (row). Children flow left-to-right; `ax` controls alignment along the row, `ay` controls cross-axis alignment.

For vertical layouts, reach for [`Stack`](../stack/README.md). Both wrap [`Box`](../box/README.md) under the hood.

Use Group when you want to:

- Arrange items in a row (toolbar, button cluster, icon + text)
- Distribute children evenly across the row with `evenly`
- Size children against each other with `flex` on each child — `flex={2}` takes twice the space of a `flex={1}` sibling, and a child that names its own `flex` keeps it under `evenly`
- Let children flow onto new lines with `wrap`
- Vertically center mixed-height content with `ay="center"`
