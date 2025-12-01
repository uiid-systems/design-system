import { Menu } from "@uiid/interactive";

import { Button } from "@uiid/buttons";
import { Ellipsis } from "@uiid/icons";

import { TableCell } from "./table-cell";

import styles from "./table-cell-dropdown.module.css";

const LABEL = "More options";

export const TableCellDropdown = () => {
  return (
    <TableCell className={styles["table-cell-dropdown"]}>
      <Menu
        align="start"
        trigger={
          <Button
            tooltip={LABEL}
            aria-label={LABEL}
            icon={<Ellipsis size={14} />}
            variant="subtle"
            size="sm"
            square
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
