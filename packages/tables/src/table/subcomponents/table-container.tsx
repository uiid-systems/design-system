import { cx } from "@uiid/utils";

import styles from "../table.module.css";

export const TableContainer = ({
  children,
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      data-slot="table-container"
      className={cx(styles["table-container"], className)}
      {...props}
    >
      {children}
    </div>
  );
};
TableContainer.displayName = "TableContainer";
