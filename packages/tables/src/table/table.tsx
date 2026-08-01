import { isValidElement } from "react";

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
import type { TableProps } from "./table.types";
import { defaultFormatHeader } from "./table.utils";

export function Table<T extends Record<string, unknown>>({
  items,
  actions,
  columns,
  formatHeader = defaultFormatHeader,
  selectable,
  striped,
  bordered,
  stickyHeader,
  stickyFooter,
  maxHeight,
  footer,
  selectedRows,
  defaultSelectedRows,
  onSelectedRowsChange,
  ...props
}: TableProps<T>): React.ReactElement {
  const displayColumns =
    columns || (items.length > 0 ? Object.keys(items[0]) : []);

  const columnCount =
    displayColumns.length + (selectable ? 1 : 0) + (actions ? 1 : 0);

  const table = (
    <TableContainer maxHeight={maxHeight}>
      <TableRoot striped={striped} bordered={bordered} {...props}>
        <TableHeader data-sticky={stickyHeader || undefined}>
          <TableRow>
            {selectable && <TableCellCheckbox head />}
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
            <TableRow key={index}>
              {selectable && <TableCellCheckbox index={index} />}
              {displayColumns.map((column) => (
                <TableCell key={String(column)}>
                  {isValidElement(item[column])
                    ? item[column]
                    : String(item[column])}
                </TableCell>
              ))}
              {actions && <TableCellActions actions={actions} item={item} />}
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
      count={items.length}
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
