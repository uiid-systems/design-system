import { TableCell } from "@uiid/tables";
import { Group } from "@uiid/layout";
import { Button } from "@uiid/buttons";
import { TableCellDropdown } from "./table-cell-dropdown";

import type { TableProps } from "../table.types";

type TableCellActionsProps = Required<Pick<TableProps, "actions">>;

export const TableCellActions = ({ actions }: TableCellActionsProps) => {
  return (
    <TableCell style={{ width: 0 }}>
      <Group ax="end">
        {actions.primary &&
          actions.primary.map((action) => (
            <Button
              key={action.tooltip}
              aria-label={action.tooltip}
              variant="ghost"
              size="sm"
              square
              {...action}
            />
          ))}
        {actions.secondary && <TableCellDropdown {...actions.secondary} />}
      </Group>
    </TableCell>
  );
};
TableCellActions.displayName = "TableCellActions";
