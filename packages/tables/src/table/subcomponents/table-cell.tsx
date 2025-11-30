import { cx } from "@uiid/utils";

import styles from "./table-cell.module.css";

export const TableCell = ({
  className,
  ...props
}: React.ComponentProps<"td">) => {
  return (
    <td
      data-slot="table-cell"
      className={cx(styles["table-cell"], className)}
      {...props}
    />
  );
};
TableCell.displayName = "TableCell";
