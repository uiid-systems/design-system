import { cx } from "@uiid/utils";

import styles from "../table.module.css";

export const TableFooter = ({
  className,
  ...props
}: React.ComponentProps<"tfoot">) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cx(styles["table-footer"], className)}
      {...props}
    />
  );
};
TableFooter.displayName = "TableFooter";
