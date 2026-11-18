import {
  TableContainer,
  TableRoot,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableFooter,
  TableCell,
  TableCellActions,
  TableCellCheckbox,
} from "./subcomponents";
import { TableSelectionProvider } from "./table-selection";
import { TABLE_DEFAULT_SIZE } from "./table.constants";
import type { TableProps } from "./table.types";
import { defaultFormatCell, defaultFormatHeader } from "./table.utils";

const indexRowId = (_item: unknown, index: number) => index;

export function Table<T extends Record<string, unknown>>({
  items,
  actions,
  columns,
  formatHeader = defaultFormatHeader,
  formatCell = defaultFormatCell,
  selectable,
  size = TABLE_DEFAULT_SIZE,
  striped,
  bordered,
  stickyHeader,
  stickyFooter,
  maxHeight,
  footer,
  getRowId = indexRowId,
  getRowLabel,
  selectedRows,
  defaultSelectedRows,
  onSelectedRowsChange,
  ...props
}: TableProps<T>): React.ReactElement {
  const rowIds = items.map(getRowId);

  const displayColumns =
    columns || (items.length > 0 ? Object.keys(items[0]) : []);

  const columnCount =
    displayColumns.length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  const table = (
    <TableContainer maxHeight={maxHeight}>
      <TableRoot size={size} striped={striped} bordered={bordered} {...props}>
        <TableHeader data-sticky={stickyHeader || undefined}>
          <TableRow>
            {selectable && <TableCellCheckbox head size={size} />}
            {displayColumns.map((column) => (
              <TableHead key={String(column)}>{formatHeader(column)}</TableHead>
            ))}
            {actions && (
              <TableHead>
                <span className="sr-only">Row actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {items.map((item, index) => (
            <TableRow key={rowIds[index]}>
              {selectable && (
                <TableCellCheckbox
                  index={index}
                  rowId={rowIds[index]}
                  label={getRowLabel?.(item, index)}
                  size={size}
                />
              )}
              {displayColumns.map((column) => (
                <TableCell key={String(column)}>
                  {formatCell(item[column], column, item)}
                </TableCell>
              ))}
              {actions && (
                <TableCellActions actions={actions} item={item} size={size} />
              )}
            </TableRow>
          ))}
        </TableBody>

        {footer && (
          <TableFooter data-sticky={stickyFooter || undefined}>
            <TableRow>
              <TableCell colSpan={columnCount}>{footer}</TableCell>
            </TableRow>
          </TableFooter>
        )}
      </TableRoot>
    </TableContainer>
  );

  return selectable ? (
    <TableSelectionProvider
      rowIds={rowIds}
      selectedRows={selectedRows}
      defaultSelectedRows={defaultSelectedRows}
      onSelectedRowsChange={onSelectedRowsChange}
    >
      {table}
    </TableSelectionProvider>
  ) : (
    table
  );
}
Table.displayName = "Table";
