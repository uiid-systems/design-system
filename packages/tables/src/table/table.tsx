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
import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";

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
                <span className="sr-only">Row actions</span>
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
              {actions && (
                <TableCell style={{ width: 0 }}>
                  <Group gap={2} ax="end">
                    {actions.primary &&
                      actions.primary.map((action) => (
                        <Button
                          key={action.tooltip}
                          aria-label={action.tooltip}
                          variant="subtle"
                          size="sm"
                          square
                          {...action}
                        />
                      ))}
                    {actions.secondary && (
                      <TableCellDropdown {...actions.secondary} />
                    )}
                  </Group>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>

        {/** @todo: Add table footer */}
      </TableRoot>
    </TableContainer>
  );
};
Table.displayName = "Table";
