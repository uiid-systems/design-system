import { cx } from "@uiid/utils";

import styles from "./table-head.module.css";

export const TableHead = ({
  className,
  ...props
}: React.ComponentProps<"th">) => {
  return (
    <th
      data-slot="table-head"
      className={cx(styles["table-head"], className)}
      {...props}
    />
  );
};
TableHead.displayName = "TableHead";
