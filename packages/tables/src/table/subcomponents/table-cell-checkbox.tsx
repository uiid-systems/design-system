"use client";

import { Checkbox, type CheckboxProps } from "@uiid/forms";
import { SwitchRender } from "@uiid/layout";

import { useTableSelection } from "../table-selection.context";
import type { TableRowId, TableVariants } from "../table.types";
import { TableCell } from "./table-cell";
import { TableHead } from "./table-head";

export type TableCellCheckboxProps = {
  head?: boolean;
  /** Row index. Keys the selection when `rowId` is not given, and numbers the
   * default label. */
  index?: number;
  /** Row id, matching one of the provider's `rowIds`. Takes precedence over
   * `index` as the selection key. */
  rowId?: TableRowId;
  /** Accessible name of a row checkbox. Defaults to "Select row N" from
   * `index`, or "Select row" without one. */
  label?: string;
  /** Control tier of the checkbox; `Table` passes its own `size`. */
  size?: TableVariants["size"];
};

export const TableCellCheckbox = ({
  head = false,
  index,
  rowId,
  label,
  size,
}: TableCellCheckboxProps) => {
  const selection = useTableSelection();
  const id = rowId ?? index;

  const checkboxProps: CheckboxProps = head
    ? {
        "aria-label": "Select all rows",
        checked: selection.allSelected,
        indeterminate: selection.someSelected,
        onCheckedChange: (checked) => selection.toggleAll(Boolean(checked)),
      }
    : {
        "aria-label":
          label ??
          (index === undefined ? "Select row" : `Select row ${index + 1}`),
        checked: id !== undefined && selection.isSelected(id),
        onCheckedChange: (checked) =>
          id !== undefined && selection.toggleRow(id, Boolean(checked)),
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
