import { Button } from "@uiid/buttons";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { Group } from "@uiid/layout";
import { TableCell } from "@uiid/tables";

import type {
  TableProps,
  TableActionsProps,
  TableVariants,
} from "../table.types";
import { TableCellDropdown } from "./table-cell-dropdown";

type TableCellActionsProps<T extends Record<string, unknown>> = {
  actions: NonNullable<TableProps<T>["actions"]>;
  item: T;
  /** Control tier of the buttons; `Table` passes its own `size`. A control
   * of the row's tier fits the row without growing it. */
  size?: TableVariants["size"];
};

type ActionButtonProps<T extends Record<string, unknown>> =
  TableActionsProps<T> & {
    item: T;
    size?: TableVariants["size"];
  };

function ActionButton<T extends Record<string, unknown>>({
  wrapper,
  onClick,
  item,
  size = "small",
  ...action
}: ActionButtonProps<T>): React.ReactElement {
  const button = (
    <Button
      key={action.tooltip}
      tooltip={action.tooltip}
      size={size}
      variant="ghost"
      shape="square"
      onClick={onClick ? () => onClick(item) : undefined}
    >
      {action.icon ? <action.icon /> : <EllipsisVerticalIcon size={14} />}
    </Button>
  );

  return wrapper ? wrapper(button, item) : button;
}

export function TableCellActions<T extends Record<string, unknown>>({
  actions,
  item,
  size,
}: TableCellActionsProps<T>): React.ReactElement {
  return (
    <TableCell collapse>
      <Group ax="end">
        {actions.primary?.map((action) => (
          <ActionButton
            key={action.tooltip}
            item={item}
            size={size}
            {...action}
          />
        ))}
        {actions.secondary && (
          <TableCellDropdown size={size} {...actions.secondary} />
        )}
      </Group>
    </TableCell>
  );
}
TableCellActions.displayName = "TableCellActions";
