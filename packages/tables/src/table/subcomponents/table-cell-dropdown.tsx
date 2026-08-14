import { Button } from "@uiid/buttons";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { Menu } from "@uiid/interactive";

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
          size="small"
          variant="ghost"
          shape="square"
        >
          {Icon ? <Icon /> : <EllipsisVerticalIcon size={14} />}
        </Button>
      }
      items={items}
    />
  );
};
TableCellDropdown.displayName = "TableCellDropdown";
