"use client";

import { createContext, useContext } from "react";

/** Selection state and actions shared by a `TableSelectionProvider`. */
export type TableSelectionContextValue = {
  /** True when the number of selected indices equals `count` and `count` is above 0. */
  allSelected: boolean;
  /** True when at least one index is selected and `allSelected` is false. */
  someSelected: boolean;
  /** Whether the row at this index is selected. */
  isSelected: (index: number) => boolean;
  /** Selects every row index from 0 to `count - 1`, or clears the selection. */
  toggleAll: (checked: boolean) => void;
  /** Selects or deselects the row at this index. */
  toggleRow: (index: number, checked: boolean) => void;
};

export const TableSelectionContext =
  createContext<TableSelectionContextValue | null>(null);

/**
 * Reads the row selection of the nearest `TableSelectionProvider`: whether all
 * or some rows are selected, whether a given row index is, and the actions that
 * toggle one row or all of them. `TableCellCheckbox` is built on it; call it
 * directly for selection-aware UI such as a bulk-action bar. Rows are identified
 * by index. Throws when no `TableSelectionProvider` is above the caller.
 */
export const useTableSelection = () => {
  const context = useContext(TableSelectionContext);
  if (!context) {
    throw new Error(
      "useTableSelection must be used within a TableSelectionProvider",
    );
  }
  return context;
};
