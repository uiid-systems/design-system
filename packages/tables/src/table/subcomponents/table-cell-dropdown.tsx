import { Menu } from "@uiid/interactive";

import { Button } from "@uiid/buttons";
import { EllipsisVertical } from "@uiid/icons";

import type { TableCellDropdownProps } from "../table.types";

export const TableCellDropdown = ({
  icon: Icon,
  tooltip = "More options",
  items,
}: TableCellDropdownProps) => {
  return (
    <Menu
      align="end"
      trigger={
        <Button
          tooltip={tooltip}
          aria-label={tooltip}
          variant="ghost"
          size="sm"
          square
        >
          {Icon ? <Icon /> : <EllipsisVertical size={14} />}
        </Button>
      }
      items={items}
    />
  );
};
TableCellDropdown.displayName = "TableCellDropdown";
