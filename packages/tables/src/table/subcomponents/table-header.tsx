import { cx } from "@uiid/utils";

import styles from "./table-header.module.css";

export const TableHeader = ({
  className,
  ...props
}: React.ComponentProps<"thead">) => {
  return (
    <thead
      data-slot="table-header"
      className={cx(styles["table-header"], className)}
      {...props}
    />
  );
};
TableHeader.displayName = "TableHeader";
