import { Menu } from "@uiid/interactive";

import { Button } from "@uiid/buttons";
import { EllipsisVertical } from "@uiid/icons";

import type { TableCellDropdownProps } from "../table.types";

export const TableCellDropdown = ({
  icon,
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
          icon={icon || <EllipsisVertical size={14} />}
          variant="subtle"
          size="sm"
          square
        />
      }
      items={items}
    />
  );
};
TableCellDropdown.displayName = "TableCellDropdown";
