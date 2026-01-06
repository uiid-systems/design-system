import { Checkbox } from "@uiid/forms";
import { SwitchRender } from "@uiid/layout";

import { TableCell, type TableCellProps } from "./table-cell";
import { TableHead, type TableHeadProps } from "./table-head";

type TableCellCheckboxProps = (TableCellProps | TableHeadProps) & {
  head?: boolean;
};

export const TableCellCheckbox = ({
  head = false,
  ...props
}: TableCellCheckboxProps) => {
  return (
    <SwitchRender
      condition={head}
      render={{
        true: <TableHead collapse />,
        false: <TableCell collapse />,
      }}
      {...props}
    >
      <Checkbox />
    </SwitchRender>
  );
};
TableCellCheckbox.displayName = "TableCellCheckbox";
