import { cx } from "@uiid/utils";

import styles from "../table.module.css";

export type TableHeaderProps = React.ComponentProps<"thead">;

export const TableHeader = ({ className, ...props }: TableHeaderProps) => {
  return (
    <thead
      data-slot="table-header"
      className={cx(styles["table-header"], className)}
      {...props}
    />
  );
};
TableHeader.displayName = "TableHeader";
