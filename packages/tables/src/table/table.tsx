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
  moreActions,
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
            {(actions || moreActions) && (
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
              {(actions || moreActions) && (
                <TableCell style={{ width: 0 }}>
                  <Group gap={2} ax="end">
                    {actions &&
                      actions.map((action) => (
                        <Button
                          key={action.tooltip}
                          aria-label={action.tooltip}
                          variant="subtle"
                          size="sm"
                          square
                          {...action}
                        />
                      ))}
                    {moreActions && <TableCellDropdown {...moreActions} />}
                  </Group>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </TableContainer>
  );
};
Table.displayName = "Table";
