import { cx } from "@uiid/utils";

import styles from "./table-row.module.css";

export const TableRow = ({
  className,
  ...props
}: React.ComponentProps<"tr">) => {
  return (
    <tr
      data-slot="table-row"
      className={cx(styles["table-row"], className)}
      {...props}
    />
  );
};
TableRow.displayName = "TableRow";
