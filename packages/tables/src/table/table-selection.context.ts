"use client";

import { createContext, useContext } from "react";

import type { TableRowId } from "./table.types";

/** Selection state and actions shared by a `TableSelectionProvider`. */
export type TableSelectionContextValue = {
  /** True when there is at least one row and every row is selected. */
  allSelected: boolean;
  /** True when at least one row is selected and `allSelected` is false. */
  someSelected: boolean;
  /** Whether the row with this id (its index, when keyed by `count`) is selected. */
  isSelected: (id: TableRowId) => boolean;
  /** Selects every row, or clears the selection. */
  toggleAll: (checked: boolean) => void;
  /** Selects or deselects the row with this id. */
  toggleRow: (id: TableRowId, checked: boolean) => void;
};

export const TableSelectionContext =
  createContext<TableSelectionContextValue | null>(null);

/**
 * Reads the row selection of the nearest `TableSelectionProvider`: whether all
 * or some rows are selected, whether a given row is, and the actions that
 * toggle one row or all of them. `TableCellCheckbox` is built on it; call it
 * directly for selection-aware UI such as a bulk-action bar. Rows are identified
 * by the provider's row ids, or by index when it is given a `count`. Throws when no `TableSelectionProvider` is above the caller.
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
