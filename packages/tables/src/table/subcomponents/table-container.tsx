import { Card, type CardProps } from "@uiid/cards";
import { cx } from "@uiid/utils";

import styles from "../table.module.css";

type TableContainerProps = CardProps & {
  maxHeight?: React.CSSProperties["maxHeight"];
};

export const TableContainer = ({
  children,
  className,
  maxHeight,
  style,
  ...props
}: TableContainerProps) => {
  return (
    <Card
      data-slot="table-container"
      className={cx(styles["table-container"], className)}
      ax="stretch"
      p={0}
      fullwidth
      InnerContainerProps={{ my: 0 }}
      style={maxHeight != null ? { maxHeight, ...style } : style}
      {...props}
    >
      {children}
    </Card>
  );
};
TableContainer.displayName = "TableContainer";
