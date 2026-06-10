# Stack

> Vertical flex layout (column). Children flow top-to-bottom; `ax` controls horizontal alignment, `ay` controls vertical.

For horizontal layouts, reach for [`Group`](../group/README.md). Both wrap [`Box`](../box/README.md) under the hood.

Use Stack when you want to:

- Arrange items in a column (form fields, content blocks, lists)
- Stretch children to fill the column's width with `ax="stretch"` — the standard form-layout pattern
- Center content along either axis with `ax` and `ay`
