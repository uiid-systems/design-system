import { Button } from "@uiid/buttons";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { Menu } from "@uiid/navigation";

import type { TableCellDropdownProps } from "../table.types";

type TableCellDropdownComponentProps<T> = TableCellDropdownProps<T> & {
  /** The row the menu acts on, passed to an `items` function. */
  item?: T;
};

export function TableCellDropdown<T = Record<string, unknown>>({
  icon: Icon,
  tooltip = "More options",
  items,
  item,
  size = "small",
}: TableCellDropdownComponentProps<T>): React.ReactElement {
  return (
    <Menu
      align="end"
      trigger={
        <Button tooltip={tooltip} size={size} variant="ghost" shape="square">
          {Icon ? <Icon /> : <EllipsisVerticalIcon size={14} />}
        </Button>
      }
      items={typeof items === "function" ? items(item as T) : items}
    />
  );
}
TableCellDropdown.displayName = "TableCellDropdown";
