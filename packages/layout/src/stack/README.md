# Stack

> Vertical flex layout (column). Children flow top-to-bottom; `ax` controls horizontal alignment, `ay` controls vertical.

For horizontal layouts, reach for [`Group`](../group/README.md). Both wrap [`Box`](../box/README.md) under the hood.

Use Stack when you want to:

- Arrange items in a column (form fields, content blocks, lists)
- Fill the column's width with each child — `ax` defaults to `stretch`, the standard form-layout pattern; pass `ax="start"` to let children shrink to their content
- Center content along either axis with `ax` and `ay`
- Size a Stack against its siblings with `flex`, e.g. a `flex={1}` column beside a fixed sidebar

`wrap` is available but only acts once the Stack has a bounded height, since a column wraps into new columns, not new rows. For items that flow onto new lines, use `Group` with `wrap`.

## Gotchas

- `ax` and `ay` name the screen axis, not the CSS property. Stack swaps them internally, so `ax` takes the cross-axis values (`start`, `center`, `end`, `stretch`, `baseline`) and `ay` the distribution ones (`space-between`, …), the reverse of Group. `<Stack ax="space-between">` is a type error; use `ay`.
- Stack takes no `direction`. For a row, use `Group`.
- A Stack is `inline-flex`, so it sizes to its content. Add `w="full"` when the Stack itself should fill its parent.
