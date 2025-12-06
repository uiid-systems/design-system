import { Checkbox } from "@uiid/forms";
import { SwitchRender } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "./table-cell-checkbox.module.css";
import { TableCell, type TableCellProps } from "./table-cell";
import { TableHead, type TableHeadProps } from "./table-head";

type TableCellCheckboxProps = (TableCellProps | TableHeadProps) & {
  head?: boolean;
};

export const TableCellCheckbox = ({
  head = false,
  className,
  ...props
}: TableCellCheckboxProps) => {
  return (
    <SwitchRender
      condition={head}
      render={{
        true: <TableHead />,
        false: <TableCell />,
      }}
      className={cx(styles["table-cell-checkbox"], className)}
      {...props}
    >
      <Checkbox size="sm" />
    </SwitchRender>
  );
};
TableCellCheckbox.displayName = "TableCellCheckbox";
