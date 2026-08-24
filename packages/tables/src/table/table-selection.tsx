"use client";

import { useState } from "react";

import {
  TableSelectionContext,
  type TableSelectionContextValue,
} from "./table-selection.context";

export type TableSelectionProviderProps = React.PropsWithChildren<{
  count: number;
  selectedRows?: number[];
  defaultSelectedRows?: number[];
  onSelectedRowsChange?: (selectedRows: number[]) => void;
}>;

/**
 * Client boundary for row selection. Holds (or proxies) selection state and
 * shares it with the header and row checkboxes via context, so the surrounding
 * table markup (rows, cells, data) can stay server-rendered. Selection is keyed
 * by row index. Supports both controlled (`selectedRows` + `onSelectedRowsChange`)
 * and uncontrolled (`defaultSelectedRows`) usage.
 */
export const TableSelectionProvider = ({
  count,
  selectedRows,
  defaultSelectedRows,
  onSelectedRowsChange,
  children,
}: TableSelectionProviderProps) => {
  const isControlled = selectedRows !== undefined;
  const [internal, setInternal] = useState<Set<number>>(
    () => new Set(defaultSelectedRows),
  );

  const selected = isControlled ? new Set(selectedRows) : internal;

  const commit = (next: Set<number>) => {
    if (!isControlled) setInternal(next);
    onSelectedRowsChange?.(Array.from(next).sort((a, b) => a - b));
  };

  const allSelected = count > 0 && selected.size === count;

  const value: TableSelectionContextValue = {
    allSelected,
    someSelected: selected.size > 0 && !allSelected,
    isSelected: (index) => selected.has(index),
    toggleAll: (checked) =>
      commit(
        checked
          ? new Set(Array.from({ length: count }, (_, i) => i))
          : new Set(),
      ),
    toggleRow: (index, checked) => {
      const next = new Set(selected);
      if (checked) next.add(index);
      else next.delete(index);
      commit(next);
    },
  };

  return (
    <TableSelectionContext.Provider value={value}>
      {children}
    </TableSelectionContext.Provider>
  );
};
TableSelectionProvider.displayName = "TableSelectionProvider";
