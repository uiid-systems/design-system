import { cx } from "@uiid/utils";

import styles from "./table-head.module.css";

export type TableHeadProps = React.ComponentProps<"th">;

export const TableHead = ({ className, ...props }: TableHeadProps) => {
  return (
    <th
      data-slot="table-head"
      className={cx(styles["table-head"], className)}
      {...props}
    />
  );
};
TableHead.displayName = "TableHead";
