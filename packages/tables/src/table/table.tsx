import type { TableProps } from "./table.types";
import { defaultFormatHeader } from "./table.utils";

import {
  TableBody,
  TableCell,
  TableCellDropdown,
  TableContainer,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
} from "./subcomponents";

export const Table = <T extends Record<string, unknown>>({
  items,
  actions,
  columns,
  formatHeader,
  striped,
  bordered,
  ...props
}: TableProps<T>) => {
  const displayColumns =
    columns ||
    (items.length > 0 ? (Object.keys(items[0]) as Array<keyof T>) : []);

  const headerFormatter = formatHeader || defaultFormatHeader;

  return (
    <TableContainer>
      <TableRoot striped={striped} bordered={bordered} {...props}>
        <TableHeader>
          <TableRow>
            {displayColumns.map((column) => (
              <TableHead key={String(column)}>
                {headerFormatter(column)}
              </TableHead>
            ))}
            {actions && (
              <TableHead>
                <span className="sr-only">{actions.tooltip}</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              {displayColumns.map((column) => (
                <TableCell key={String(column)}>
                  {String(item[column])}
                </TableCell>
              ))}
              {actions && <TableCellDropdown {...actions} />}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </TableContainer>
  );
};
Table.displayName = "Table";
