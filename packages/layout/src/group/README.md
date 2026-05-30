# Group

> Horizontal flex layout (row). Children flow left-to-right; `ax` controls alignment along the row, `ay` controls cross-axis alignment.

For vertical layouts, reach for [`Stack`](../stack/README.md). Both wrap [`Box`](../box/README.md) under the hood.

Use Group when you want to:

- Arrange items in a row (toolbar, button cluster, icon + text)
- Distribute children evenly across the row with `evenly`
- Vertically center mixed-height content with `ay="center"`
