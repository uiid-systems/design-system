import { Menu } from "@uiid/interactive";

import { Button } from "@uiid/buttons";
import { Ellipsis } from "@uiid/icons";

import type { TableCellDropdownProps } from "../table.types";

import { TableCell } from "./table-cell";

import styles from "./table-cell-dropdown.module.css";

export const TableCellDropdown = ({
  icon,
  tooltip = "More options",
  items,
}: TableCellDropdownProps) => {
  return (
    <TableCell className={styles["table-cell-dropdown"]}>
      <Menu
        align="end"
        trigger={
          <Button
            tooltip={tooltip}
            aria-label={tooltip}
            icon={icon || <Ellipsis size={14} />}
            variant="subtle"
            size="sm"
            square
          />
        }
        items={items}
      />
    </TableCell>
  );
};
TableCellDropdown.displayName = "TableCellDropdown";
