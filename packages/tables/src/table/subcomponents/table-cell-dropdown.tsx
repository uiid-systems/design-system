import { Menu } from "@uiid/interactive";

import { Button } from "@uiid/buttons";
import { Ellipsis } from "@uiid/icons";

import { TableCell } from "./table-cell";

import styles from "./table-cell-dropdown.module.css";

export const TableCellDropdown = () => {
  return (
    <TableCell className={styles["table-cell-dropdown"]}>
      <Menu
        align="start"
        trigger={
          <Button
            variant="subtle"
            size="icon"
            icon={<Ellipsis size={14} />}
            aria-label="More options"
          />
        }
        items={[
          { label: "Edit", value: "edit" },
          { label: "Delete", value: "delete" },
        ]}
      />
    </TableCell>
  );
};
TableCellDropdown.displayName = "TableCellDropdown";
