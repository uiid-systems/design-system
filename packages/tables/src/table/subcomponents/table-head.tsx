import { cx } from "@uiid/utils";

import styles from "./table-head.module.css";

export type TableHeadProps = React.ComponentProps<"th"> & {
  collapse?: boolean;
};

export const TableHead = ({
  className,
  collapse,
  ...props
}: TableHeadProps) => {
  return (
    <th
      data-slot="table-head"
      data-collapse={collapse}
      className={cx(styles["table-head"], className)}
      {...props}
    />
  );
};
TableHead.displayName = "TableHead";
