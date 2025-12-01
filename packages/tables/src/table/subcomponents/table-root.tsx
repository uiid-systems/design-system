import { cx } from "@uiid/utils";

import type { TableProps } from "../table.types";

import styles from "./table-root.module.css";

export const TableRoot = ({
  striped,
  bordered,
  className,
  children,
  ...props
}: TableProps) => {
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
