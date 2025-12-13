import { cx } from "@uiid/utils";

import styles from "./table-cell.module.css";

export type TableCellProps = React.ComponentProps<"td"> & {
  collapse?: boolean;
};

export const TableCell = ({
  className,
  collapse,
  ...props
}: TableCellProps) => {
  return (
    <td
      data-slot="table-cell"
      data-collapse={collapse}
      className={cx(styles["table-cell"], className)}
      {...props}
    />
  );
};
TableCell.displayName = "TableCell";
