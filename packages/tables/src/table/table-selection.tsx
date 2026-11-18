"use client";

import { useState } from "react";

import {
  TableSelectionContext,
  type TableSelectionContextValue,
} from "./table-selection.context";
import type { TableRowId } from "./table.types";

/** The rows a `TableSelectionProvider` selects from: their ids in row order,
 * or a row count, which keys each row by its index. */
type TableSelectionRows<Id extends TableRowId> =
  | {
      /** Id of every selectable row, in row order. Select-all covers these. */
      rowIds: readonly Id[];
      count?: never;
    }
  | {
      /** Number of selectable rows, keyed by index from 0 to `count - 1`. */
      count: number;
      rowIds?: never;
    };

export type TableSelectionProviderProps<Id extends TableRowId = number> =
  React.PropsWithChildren<
    TableSelectionRows<Id> & {
      /** Selected row ids, for controlled use with `onSelectedRowsChange`. */
      selectedRows?: readonly Id[];
      /** Initially selected row ids, for uncontrolled use. */
      defaultSelectedRows?: readonly Id[];
      /**
       * Called with the selected row ids, in row order, whenever a row or all
       * rows are toggled. Ids that match no current row are left out.
       */
      onSelectedRowsChange?: (selectedRows: Id[]) => void;
    }
  >;

/**
 * Client boundary for row selection. Holds (or proxies) selection state and
 * shares it with the header and row checkboxes via context, so the surrounding
 * table markup (rows, cells, data) can stay server-rendered. Selection is keyed
 * by row id: pass `rowIds`, or `count` to key rows by index. Only ids among the
 * current rows count toward the header checkbox state. Supports both controlled
 * (`selectedRows` + `onSelectedRowsChange`) and uncontrolled
 * (`defaultSelectedRows`) usage.
 *
 * `Table` renders one itself when `selectable` is set. Render it directly when
 * composing a table from `TableRoot`, `TableRow` and `TableCellCheckbox`: wrap
 * the table in it, pass the row ids (or count), and give each row's
 * `TableCellCheckbox` its `rowId` (or `index`). `TableCellCheckbox` and
 * `useTableSelection` throw without it.
 */
export const TableSelectionProvider = <Id extends TableRowId = number>({
  rowIds,
  count = 0,
  selectedRows,
  defaultSelectedRows,
  onSelectedRowsChange,
  children,
}: TableSelectionProviderProps<Id>) => {
  const ids: readonly Id[] =
    rowIds ?? (Array.from({ length: count }, (_, i) => i) as Id[]);

  const isControlled = selectedRows !== undefined;
  const [internal, setInternal] = useState<ReadonlySet<TableRowId>>(
    () => new Set(defaultSelectedRows),
  );

  const selected: ReadonlySet<TableRowId> = isControlled
    ? new Set(selectedRows)
    : internal;

  /* Ids outside the current rows (a stale index, a filtered-out record) are
     ignored, so the header state always describes the rows on screen. */
  const selectedCount = ids.filter((id) => selected.has(id)).length;
  const allSelected = ids.length > 0 && selectedCount === ids.length;

  const commit = (next: ReadonlySet<TableRowId>) => {
    const rows = ids.filter((id) => next.has(id));
    if (!isControlled) setInternal(new Set(rows));
    onSelectedRowsChange?.(rows);
  };

  const value: TableSelectionContextValue = {
    allSelected,
    someSelected: selectedCount > 0 && !allSelected,
    isSelected: (id) => selected.has(id),
    toggleAll: (checked) => commit(new Set(checked ? ids : [])),
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
