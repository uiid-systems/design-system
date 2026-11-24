import { cx } from "@uiid/utils";

import styles from "../table.module.css";

export type TableFooterProps = React.ComponentProps<"tfoot">;

export const TableFooter = ({ className, ...props }: TableFooterProps) => {
  return (
    <tfoot
      data-slot="table-footer"
      className={cx(styles["table-footer"], className)}
      {...props}
    />
  );
};
TableFooter.displayName = "TableFooter";
