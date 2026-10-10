"use client";

import { Checkbox, type CheckboxProps } from "@uiid/forms";
import { SwitchRender } from "@uiid/layout";

import { useTableSelection } from "../table-selection.context";
import type { TableVariants } from "../table.types";
import { TableCell } from "./table-cell";
import { TableHead } from "./table-head";

type TableCellCheckboxProps = {
  head?: boolean;
  index?: number;
  /** Control tier of the checkbox; `Table` passes its own `size`. */
  size?: TableVariants["size"];
};

export const TableCellCheckbox = ({
  head = false,
  index,
  size,
}: TableCellCheckboxProps) => {
  const selection = useTableSelection();

  const checkboxProps: CheckboxProps = head
    ? {
        "aria-label": "Select all rows",
        checked: selection.allSelected,
        indeterminate: selection.someSelected,
        onCheckedChange: (checked) => selection.toggleAll(Boolean(checked)),
      }
    : {
        "aria-label": "Select row",
        checked: index !== undefined && selection.isSelected(index),
        onCheckedChange: (checked) =>
          index !== undefined && selection.toggleRow(index, Boolean(checked)),
      };

  return (
    <SwitchRender
      condition={head}
      render={{
        true: <TableHead collapse />,
        false: <TableCell collapse />,
      }}
    >
      <Checkbox size={size} {...checkboxProps} />
    </SwitchRender>
  );
};
TableCellCheckbox.displayName = "TableCellCheckbox";
