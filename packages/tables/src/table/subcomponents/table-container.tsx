import { Card, type CardProps } from "@uiid/cards";
import { cx } from "@uiid/utils";

import styles from "../table.module.css";

export const TableContainer = ({
  children,
  className,
  ...props
}: CardProps) => {
  return (
    <Card
      data-slot="table-container"
      className={cx(styles["table-container"], className)}
      ax="stretch"
      p={0}
      fullwidth
      InnerContainerProps={{ my: 0 }}
      {...props}
    >
      {children}
    </Card>
  );
};
TableContainer.displayName = "TableContainer";
