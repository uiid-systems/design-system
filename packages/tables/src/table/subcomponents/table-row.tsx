import { Box, type BoxProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "../table.module.css";

export const TableRow = ({
  className,
  render = <tr />,
  ...props
}: BoxProps) => {
  return (
    <Box
      data-slot="table-row"
      className={cx(styles["table-row"], className)}
      render={render}
      {...props}
    />
  );
};
TableRow.displayName = "TableRow";
