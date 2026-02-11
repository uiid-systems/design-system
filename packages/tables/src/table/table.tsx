import { isValidElement } from "react";

import type { TableProps } from "./table.types";
import { defaultFormatHeader } from "./table.utils";

import {
  TableContainer,
  TableRoot,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  TableCellActions,
  TableCellCheckbox,
} from "./subcomponents";

export function Table<T extends Record<string, unknown>>({
  items,
  actions,
  columns,
  formatHeader = defaultFormatHeader,
  selectable,
  striped,
  bordered,
  ...props
}: TableProps<T>): React.ReactElement {
  const displayColumns =
    columns || (items.length > 0 ? Object.keys(items[0]) : []);

  return (
    <TableContainer>
      <TableRoot striped={striped} bordered={bordered} {...props}>
        <TableHeader>
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
              {selectable && <TableCellCheckbox />}
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

        {/** @todo: Add table footer */}
      </TableRoot>
    </TableContainer>
  );
}
Table.displayName = "Table";
