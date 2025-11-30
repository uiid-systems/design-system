import { cx } from "@uiid/utils";

import styles from "./table-cell.module.css";

export type TableCellProps = React.ComponentProps<"td">;

export const TableCell = ({ className, ...props }: TableCellProps) => {
  return (
    <td
      data-slot="table-cell"
      className={cx(styles["table-cell"], className)}
      {...props}
    />
  );
};
TableCell.displayName = "TableCell";
