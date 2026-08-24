"use client";

import { createContext, useContext } from "react";

export type TableSelectionContextValue = {
  allSelected: boolean;
  someSelected: boolean;
  isSelected: (index: number) => boolean;
  toggleAll: (checked: boolean) => void;
  toggleRow: (index: number, checked: boolean) => void;
};

export const TableSelectionContext =
  createContext<TableSelectionContextValue | null>(null);

export const useTableSelection = () => {
  const context = useContext(TableSelectionContext);
  if (!context) {
    throw new Error(
      "useTableSelection must be used within a TableSelectionProvider",
    );
  }
  return context;
};
