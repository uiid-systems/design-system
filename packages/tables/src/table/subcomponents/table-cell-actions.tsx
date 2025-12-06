import { TableCell } from "@uiid/tables";
import { Group } from "@uiid/layout";
import { Button } from "@uiid/buttons";
import { TableCellDropdown } from "./table-cell-dropdown";

import type { TableProps, TableActionsProps } from "../table.types";

type TableCellActionsProps = Required<Pick<TableProps, "actions">>;

const ActionButton = ({ wrapper, ...action }: TableActionsProps) => {
  const button = (
    <Button
      key={action.tooltip}
      aria-label={action.tooltip}
      variant="ghost"
      size="sm"
      square
      {...action}
    />
  );

  return wrapper ? wrapper(button) : button;
};

export const TableCellActions = ({ actions }: TableCellActionsProps) => {
  return (
    <TableCell style={{ width: 0 }}>
      <Group ax="end">
        {actions.primary?.map((action) => (
          <ActionButton key={action.tooltip} {...action} />
        ))}
        {actions.secondary && <TableCellDropdown {...actions.secondary} />}
      </Group>
    </TableCell>
  );
};
TableCellActions.displayName = "TableCellActions";
