import { cx } from "@uiid/utils";

import type { TableRootProps } from "../table.types";

import styles from "../table.module.css";

export const TableRoot = ({
  striped,
  bordered,
  className,
  children,
  ...props
}: Omit<TableRootProps, "selectable">) => {
  return (
    <table
      data-slot="table-root"
      data-striped={striped}
      data-bordered={bordered}
      className={cx(styles["table-root"], className)}
      {...props}
    >
      {children}
    </table>
  );
};
TableRoot.displayName = "TableRoot";
