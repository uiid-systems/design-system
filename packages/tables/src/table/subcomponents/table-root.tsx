import { cx, prepareComponentProps } from "@uiid/utils";

import type { TableRootProps } from "../table.types";
import { tableVariants } from "../table.variants";

import styles from "../table.module.css";

export const TableRoot = ({
  striped,
  bordered,
  highlightOnHover,
  size,
  className,
  children,
  ...props
}: Omit<TableRootProps, "selectable">) => {
  const preparedProps = prepareComponentProps({
    componentName: "table-root",
    styleProps: ["minw"],
    props,
  });

  return (
    <table
      data-striped={striped}
      data-bordered={bordered}
      data-hover={highlightOnHover}
      {...preparedProps}
      className={cx(styles["table-root"], tableVariants({ size }), className)}
    >
      {children}
    </table>
  );
};
TableRoot.displayName = "TableRoot";
