"use client";

import { useState } from "react";

import {
  TableSelectionContext,
  type TableSelectionContextValue,
} from "./table-selection.context";
import type { TableRowId } from "./table.types";

/** The rows a `TableSelectionProvider` selects from: their ids in row order,
 * or a row count, which keys each row by its index. */
type TableSelectionRows =
  | {
      /** Id of every current row, in row order. Select-all covers these. */
      rowIds: TableRowId[];
      count?: never;
    }
  | {
      /** Number of current rows, keyed by index from 0 to `count - 1`. */
      count: number;
      rowIds?: never;
    };

export type TableSelectionProviderProps = React.PropsWithChildren<
  TableSelectionRows & {
    /** Selected row ids, for controlled use with `onSelectedRowsChange`. */
    selectedRows?: TableRowId[];
    /** Initially selected row ids, for uncontrolled use. */
    defaultSelectedRows?: TableRowId[];
    /**
     * Called with the selected row ids whenever a row or all rows are toggled:
     * the current rows' ids in row order, then any selected ids that match no
     * current row (an off-screen page, a filtered-out record) in the order
     * they were selected.
     */
    onSelectedRowsChange?: (selectedRows: TableRowId[]) => void;
  }
>;

/**
 * Client boundary for row selection. Holds (or proxies) selection state and
 * shares it with the header and row checkboxes via context, so the surrounding
 * table markup (rows, cells, data) can stay server-rendered. Selection is keyed
 * by row id: pass `rowIds`, or `count` to key rows by index. Selected ids that
 * match no current row are kept, so a selection survives paging and filtering,
 * but only the current rows count toward the header checkbox state, and
 * select-all adds or removes only the current rows. Supports both controlled
 * (`selectedRows` + `onSelectedRowsChange`) and uncontrolled
 * (`defaultSelectedRows`) usage.
 *
 * `Table` renders one itself when `selectable` is set. Render it directly when
 * composing a table from `TableRoot`, `TableRow` and `TableCellCheckbox`: wrap
 * the table in it, pass the row ids (or count), and give each row's
 * `TableCellCheckbox` its `rowId` (or `index`). `TableCellCheckbox` and
 * `useTableSelection` throw without it.
 */
export const TableSelectionProvider = ({
  rowIds,
  count = 0,
  selectedRows,
  defaultSelectedRows,
  onSelectedRowsChange,
  children,
}: TableSelectionProviderProps) => {
  const ids: TableRowId[] =
    rowIds ?? Array.from({ length: count }, (_, i) => i);

  const isControlled = selectedRows !== undefined;
  const [internal, setInternal] = useState<ReadonlySet<TableRowId>>(
    () => new Set(defaultSelectedRows),
  );

  const selected: ReadonlySet<TableRowId> = isControlled
    ? new Set(selectedRows)
    : internal;

  const selectedCount = ids.filter((id) => selected.has(id)).length;
  const allSelected = ids.length > 0 && selectedCount === ids.length;

  const commit = (next: Set<TableRowId>) => {
    if (!isControlled) setInternal(next);
    const current = new Set(ids);
    onSelectedRowsChange?.([
      ...ids.filter((id) => next.has(id)),
      ...Array.from(next).filter((id) => !current.has(id)),
    ]);
  };

  const value: TableSelectionContextValue = {
    allSelected,
    someSelected: selectedCount > 0 && !allSelected,
    isSelected: (id) => selected.has(id),
    toggleAll: (checked) => {
      const next = new Set(selected);
      for (const id of ids) {
        if (checked) next.add(id);
        else next.delete(id);
      }
      commit(next);
    },
    toggleRow: (id, checked) => {
      const next = new Set(selected);
      if (checked) next.add(id);
      else next.delete(id);
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
