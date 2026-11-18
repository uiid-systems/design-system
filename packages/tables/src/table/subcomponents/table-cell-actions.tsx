import { Button } from "@uiid/buttons";
import { Group } from "@uiid/layout";

import type {
  TableProps,
  TableActionsProps,
  TableVariants,
} from "../table.types";
import { TableCell } from "./table-cell";
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
  icon: Icon,
  tooltip,
}: ActionButtonProps<T>): React.ReactElement {
  const button = (
    <Button
      tooltip={tooltip}
      size={size}
      variant="ghost"
      shape="square"
      onClick={onClick ? () => onClick(item) : undefined}
    >
      <Icon />
    </Button>
  );

  return wrapper ? wrapper(button, item) : button;
}

export function TableCellActions<T extends Record<string, unknown>>({
  actions,
  item,
  size,
}: TableCellActionsProps<T>): React.ReactElement {
  const { secondary } = actions;

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
        {secondary && (
          <TableCellDropdown
            size={size}
            {...secondary}
            items={
              typeof secondary.items === "function"
                ? secondary.items(item)
                : secondary.items
            }
          />
        )}
      </Group>
    </TableCell>
  );
}
TableCellActions.displayName = "TableCellActions";
