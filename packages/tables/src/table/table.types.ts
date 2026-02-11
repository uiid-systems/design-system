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
};
