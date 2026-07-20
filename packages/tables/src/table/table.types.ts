import type { MenuItemType } from "@uiid/interactive";
import type { Icon } from "@uiid/icons";

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
};

export type TableRootProps = React.ComponentProps<"table"> & {
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
  /** Controlled selected row indices. Pair with `onSelectedRowsChange`. */
  selectedRows?: number[];
  /** Initial selected row indices when uncontrolled. */
  defaultSelectedRows?: number[];
  /** Called with the selected row indices whenever selection changes. */
  onSelectedRowsChange?: (selectedRows: number[]) => void;
};
