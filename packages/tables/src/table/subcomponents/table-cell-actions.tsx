import { TableCell } from "@uiid/tables";
import { Group } from "@uiid/layout";
import { Button } from "@uiid/buttons";
import { TableCellDropdown } from "./table-cell-dropdown";

import type { TableProps, TableActionsProps } from "../table.types";
import { EllipsisVertical } from "@uiid/icons";

type TableCellActionsProps<T extends Record<string, unknown>> = {
  actions: NonNullable<TableProps<T>["actions"]>;
  item: T;
};

type ActionButtonProps<T extends Record<string, unknown>> = TableActionsProps<T> & {
  item: T;
};

function ActionButton<T extends Record<string, unknown>>({
  wrapper,
  onClick,
  item,
  ...action
}: ActionButtonProps<T>): React.ReactElement {
  const button = (
    <Button
      key={action.tooltip}
      tooltip={action.tooltip}
      size="small"
      ghost
      square
      onClick={onClick ? () => onClick(item) : undefined}
    >
      {action.icon ? <action.icon /> : <EllipsisVertical size={14} />}
    </Button>
  );

  return wrapper ? wrapper(button, item) : button;
}

export function TableCellActions<T extends Record<string, unknown>>({
  actions,
  item,
}: TableCellActionsProps<T>): React.ReactElement {
  return (
    <TableCell collapse>
      <Group ax="end">
        {actions.primary?.map((action) => (
          <ActionButton key={action.tooltip} item={item} {...action} />
        ))}
        {actions.secondary && <TableCellDropdown {...actions.secondary} />}
      </Group>
    </TableCell>
  );
}
TableCellActions.displayName = "TableCellActions";
