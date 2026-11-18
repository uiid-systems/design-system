import type { Icon } from "@uiid/icons";
import type { MenuItemType } from "@uiid/navigation";
import type { VariantProps } from "@uiid/utils";

import type { tableVariants } from "./table.variants";

export type TableVariants = VariantProps<typeof tableVariants>;

/** Identifies a row for selection: a stable id from `getRowId`, or its index. */
export type TableRowId = string | number;

export type TableActionsProps<T = Record<string, unknown>> = {
  icon: Icon;
  tooltip: string;
  onClick?: (item: T) => void;
  wrapper?: (button: React.ReactElement, item: T) => React.ReactElement;
};

export type TableCellDropdownProps = {
  icon?: Icon;
  tooltip?: string;
  items: MenuItemType[];
  /** Control tier of the trigger button; `Table` passes its own `size`. */
  size?: TableVariants["size"];
};

export type TableRootProps = React.ComponentProps<"table"> &
  TableVariants & {
    /** Minimum width, in px. Floors the table so a narrower container scrolls
     * it horizontally instead of squashing the columns. Off by default: the
     * table is as wide as its container. */
    minw?: number;
    selectable?: boolean;
    striped?: boolean;
    bordered?: boolean;
    /** Highlight rows on hover. */
    highlightOnHover?: boolean;
  };

export type TableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = Omit<TableRootProps, "children"> & {
  items: T[];
  columns?: string[];
  actions?: {
    primary?: TableActionsProps<T>[];
    secondary?: TableCellDropdownProps;
  };
  formatHeader?: (key: keyof T | string) => React.ReactNode;
  /** Render a cell from its value, column key and row. Defaults to
   * `defaultFormatCell`; call it for cells you don't handle. */
  formatCell?: (value: unknown, column: string, item: T) => React.ReactNode;
  /** Pin the header to the top of the scroll container while the body scrolls.
   * Requires a bounded height — pass `maxHeight` (or constrain the container). */
  stickyHeader?: boolean;
  /** Pin the footer to the bottom of the scroll container while the body
   * scrolls. Requires `footer` content and a bounded height (`maxHeight`). */
  stickyFooter?: boolean;
  /** Bound the scroll container's height so it scrolls vertically. */
  maxHeight?: React.CSSProperties["maxHeight"];
  /** Footer content, rendered in a <tfoot> cell spanning all columns. */
  footer?: React.ReactNode;
  /** Stable id of a row, keying its selection and its React key, so a
   * selection follows its record when `items` are sorted, filtered or paged.
   * Ids must be unique among `items`. Defaults to the row index. */
  getRowId?: (item: T, index: number) => TableRowId;
  /** Accessible name of a row's checkbox. Defaults to "Select row N". */
  getRowLabel?: (item: T, index: number) => string;
  /** Controlled selected row ids (indices without `getRowId`). Pair with
   * `onSelectedRowsChange`. Ids that match no current row stay selected but
   * don't count toward the header checkbox. */
  selectedRows?: TableRowId[];
  /** Initial selected row ids (indices without `getRowId`) when uncontrolled. */
  defaultSelectedRows?: TableRowId[];
  /** Called with the selected row ids whenever selection changes: the current
   * rows' ids in row order, then ids that match no current row (an off-screen
   * page, a filtered-out record) in the order they were selected. */
  onSelectedRowsChange?: (selectedRows: TableRowId[]) => void;
};
