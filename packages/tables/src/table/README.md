# Table

> A data table in a scrolling card. Pass `items` and Table renders the header, rows and cells; compose the parts when the markup needs more than one row per item.

Use Table when you want to:

- Show a list of records as rows, one column per key, with `columns` to pick and order the keys
- Label headers with `formatHeader` and render cells with `formatCell`
- Let the user select rows with `selectable`, controlled or uncontrolled
- Put per-row actions at the end of each row: icon buttons, an overflow menu, or both
- Pin the header and footer while a bounded body scrolls

## Quick Reference

```tsx
import { Table } from "@uiid/tables";

// One column per key of the first item
<Table items={users} />

// Pick and order the columns, and label them
<Table
  items={users}
  columns={["name", "email", "status"]}
  formatHeader={(column) => LABELS[column]}
/>

// Selectable rows, keyed by record
<Table
  items={users}
  selectable
  getRowId={(user) => user.id}
  selectedRows={selected}
  onSelectedRowsChange={setSelected}
/>

// Row actions
<Table
  items={users}
  actions={{
    primary: [{ icon: PencilIcon, tooltip: "Edit", onClick: editUser }],
    secondary: { items: (user) => [{ label: "Delete", value: "delete", onClick: () => remove(user) }] },
  }}
/>

// A bounded body with a pinned header and footer
<Table items={users} maxHeight={320} stickyHeader stickyFooter footer="42 users" />
```

## Props

| Prop                   | Type                                                      | Default                                                                                                  | Description                                                                                    |
| ---------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `items`                | `T[]`                                                     | —                                                                                                        | The rows. Each item is a record                                                                |
| `columns`              | `string[]`                                                | Keys of `items[0]`                                                                                       | Keys to show, in order                                                                         |
| `formatHeader`         | `(key) => ReactNode`                                      | Key split into words, first letter capitalised (`createdAt` → "Created At", `first_name` → "First name") | Renders a header cell from its key                                                             |
| `formatCell`           | `(value, column, item) => ReactNode`                      | `defaultFormatCell`                                                                                      | Renders a body cell                                                                            |
| `size`                 | `"xsmall" \| "small" \| "medium" \| "large"`              | `"medium"`                                                                                               | Row height, font size and cell padding, matching the form-control tiers                        |
| `striped`              | `boolean`                                                 | `false`                                                                                                  | Shade every even body row                                                                      |
| `bordered`             | `boolean`                                                 | `false`                                                                                                  | Rule a border between body rows                                                                |
| `highlightOnHover`     | `boolean`                                                 | `false`                                                                                                  | Highlight a body row under the pointer                                                         |
| `minw`                 | `number`                                                  | —                                                                                                        | Minimum width in px; a narrower container scrolls the table sideways                           |
| `maxHeight`            | `CSSProperties["maxHeight"]`                              | —                                                                                                        | Bounds the scroller's height so the body scrolls                                               |
| `stickyHeader`         | `boolean`                                                 | `false`                                                                                                  | Pin the header while the body scrolls. Needs a bounded height                                  |
| `footer`               | `ReactNode`                                               | —                                                                                                        | Content of a footer row whose one cell spans every column                                      |
| `stickyFooter`         | `boolean`                                                 | `false`                                                                                                  | Pin the footer while the body scrolls. Needs `footer` and a bounded height                     |
| `selectable`           | `boolean`                                                 | `false`                                                                                                  | Add a checkbox column                                                                          |
| `getRowId`             | `(item, index) => TableRowId`                             | The row index                                                                                            | Stable id of a row, keying its selection and its React key. Ids must be unique                 |
| `getRowLabel`          | `(item, index) => string`                                 | `"Select row N"`                                                                                         | Accessible name of a row's checkbox                                                            |
| `selectedRows`         | `TableRowId[]`                                            | —                                                                                                        | Controlled selected row ids. Pair with `onSelectedRowsChange`                                  |
| `defaultSelectedRows`  | `TableRowId[]`                                            | —                                                                                                        | Initially selected row ids when uncontrolled                                                   |
| `onSelectedRowsChange` | `(selectedRows: TableRowId[]) => void`                    | —                                                                                                        | Called with the selected row ids whenever the selection changes                                |
| `actions`              | `{ primary?: TableActionsProps<T>[]; secondary?: {...} }` | —                                                                                                        | Per-row icon buttons (`primary`) and overflow menu (`secondary`), in a column at the row's end |

Any other prop, such as `className` or `aria-label`, reaches the `<table>` element (`TableRoot`).

## Cells

`defaultFormatCell` renders a React element as itself and a string, number, bigint or boolean as text. An object with its own string form, such as a `Date` or a `URL`, renders that string, and an array prints only when every entry is a primitive. Anything else renders an empty cell: `null`, `undefined`, a plain object, a function, a symbol. It is exported so a `formatCell` can handle the columns it cares about and hand the rest back:

```tsx
<Table
  items={users}
  formatCell={(value, column) =>
    column === "joined" && value instanceof Date
      ? value.toLocaleDateString()
      : defaultFormatCell(value)
  }
/>
```

## Selection

`selectable` adds a header checkbox, which selects or clears every current row, and a checkbox per row. Without `getRowId` a row is keyed by its index, so a selection stays on the same position when `items` are sorted or filtered. Pass `getRowId` to key it by record instead.

`onSelectedRowsChange` receives the current rows' ids in row order, then any selected ids that match no current row (an off-screen page, a filtered-out record) in the order they were selected. Those ids stay selected but don't count toward the header checkbox, and select-all adds or removes only the current rows.

## Actions

Each `primary` action is a ghost icon button with a `tooltip`, which also names it. `onClick` receives the row's item, and `wrapper` wraps the rendered button, for example in a link or a dialog trigger. `secondary` is an overflow menu ([Menu](../../../navigation/src/menu/README.md)) behind an ellipsis button: pass `items` as a list, or as a function of the row so each entry's `onClick` knows which row opened it. Its `icon` and `tooltip` (default "More options") replace the trigger's. The action buttons and the checkboxes take the table's `size`.

## Scrolling

The table is as wide as its container and scrolls inside its card. `minw` floors it, so a narrower container scrolls it sideways, and the card paints an edge shadow on whichever side has content past it. `maxHeight` bounds the scroller's height for a vertically scrolling body.

## Composition

Compose the parts when the data-driven form can't express the markup, such as grouped rows or cells that span columns:

```tsx
import {
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "@uiid/tables";

<TableContainer>
  <TableRoot bordered>
    <TableHeader>
      <TableRow>
        <TableHead>Name</TableHead>
        <TableHead>Balance</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Ada</TableCell>
        <TableCell>$1,250.00</TableCell>
      </TableRow>
    </TableBody>
    <TableFooter>
      <TableRow>
        <TableCell colSpan={2}>1 user</TableCell>
      </TableRow>
    </TableFooter>
  </TableRoot>
</TableContainer>;
```

For grouped rows, render one `TableBody` per group and start it with a header row whose `TableHead` spans the columns and has `scope="rowgroup"`, so it labels only its own group's rows.

`TableRoot` takes `size`, `striped`, `bordered`, `highlightOnHover` and `minw`, and `TableContainer` takes `maxHeight`. To pin a composed header or footer, set `data-sticky` on `TableHeader` or `TableFooter`. `TableHead` and `TableCell` take `collapse`, which shrinks the column to its content, as the checkbox and action columns do.

### Selection in a composed table

Wrap the table in `TableSelectionProvider` and give it the row ids, or a `count` to key rows by index. Put a `TableCellCheckbox head` in the header row and a `TableCellCheckbox` with each row's `rowId` (or `index`) in its row. `TableCellCheckbox` and `useTableSelection` throw outside a provider. The provider takes the same `selectedRows`, `defaultSelectedRows` and `onSelectedRowsChange` as Table.

```tsx
<TableSelectionProvider rowIds={users.map((user) => user.id)}>
  <TableContainer>
    <TableRoot>
      <TableHeader>
        <TableRow>
          <TableCellCheckbox head />
          <TableHead>Name</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCellCheckbox rowId={user.id} label={`Select ${user.name}`} />
            <TableCell>{user.name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </TableRoot>
  </TableContainer>
</TableSelectionProvider>
```

`useTableSelection` reads the provider's state for UI outside the table, such as a bulk-action bar: `allSelected`, `someSelected`, `isSelected(id)`, `toggleAll(checked)` and `toggleRow(id, checked)`.

## Subcomponents

| Component                | Description                                                                        |
| ------------------------ | ---------------------------------------------------------------------------------- |
| `TableContainer`         | The scrolling card. Takes Card's props and `maxHeight`                             |
| `TableRoot`              | The `<table>`, with the size and row treatments                                    |
| `TableHeader`            | `<thead>`                                                                          |
| `TableBody`              | `<tbody>`                                                                          |
| `TableFooter`            | `<tfoot>`                                                                          |
| `TableRow`               | `<tr>`, rendered through `Box`                                                     |
| `TableHead`              | `<th>`                                                                             |
| `TableCell`              | `<td>`                                                                             |
| `TableCellCheckbox`      | A header or row selection checkbox in a collapsed cell. Needs a selection provider |
| `TableCellActions`       | A row's actions cell, from the same `actions` object Table takes, and the row item |
| `TableCellDropdown`      | The overflow menu button used by `TableCellActions`                                |
| `TableSelectionProvider` | Holds row selection for a composed table                                           |
| `useTableSelection`      | Reads the nearest provider's selection                                             |

## Data Slots

| Slot              | Element                                   |
| ----------------- | ----------------------------------------- |
| `table-container` | The card around the table                 |
| `table-scroller`  | The card's inner container, which scrolls |
| `table-root`      | `<table>`                                 |
| `table-header`    | `<thead>`                                 |
| `table-body`      | `<tbody>`                                 |
| `table-footer`    | `<tfoot>`                                 |
| `table-row`       | `<tr>`                                    |
| `table-head`      | `<th>`                                    |
| `table-cell`      | `<td>`                                    |

## Accessibility

- Name the table with `aria-label` (or `aria-labelledby`), which reaches the `<table>`, so a screen reader can tell several tables apart
- The header checkbox is named "Select all rows" and shows a mixed state while only some rows are selected
- Row checkboxes are named "Select row N" unless `getRowLabel` (or a composed checkbox's `label`) names them
- The actions column's header holds a visually hidden "Row actions" label
- An action button's `tooltip` is its accessible name

## See Also

- [Card](../../../cards/src/card/README.md) - The surface `TableContainer` renders
- [Menu](../../../navigation/src/menu/README.md) - The overflow menu behind `actions.secondary`
- [Checkbox](../../../forms/src/checkbox/README.md) - The selection control
