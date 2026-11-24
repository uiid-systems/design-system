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
}: TableRootProps) => {
  const preparedProps = prepareComponentProps({
    componentName: "table-root",
    styleProps: ["minw"],
    props,
  });

  return (
    <table
      {...preparedProps}
      className={cx(
        styles["table-root"],
        tableVariants({ size, striped, bordered, highlightOnHover }),
        className,
      )}
    >
      {children}
    </table>
  );
};
TableRoot.displayName = "TableRoot";
