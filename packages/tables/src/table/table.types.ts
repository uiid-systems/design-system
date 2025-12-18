import type { MenuItem } from "@uiid/interactive";
import type { Icon } from "@uiid/icons";

export type TableActionsProps = {
  icon: Icon;
  tooltip: string;
  onClick?: () => void;
  wrapper?: (button: React.ReactElement) => React.ReactElement;
};

export type TableCellDropdownProps = {
  icon?: Icon;
  tooltip?: string;
  items: MenuItem[];
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
    primary?: TableActionsProps[];
    secondary?: TableCellDropdownProps;
  };
  formatHeader?: (key: keyof T) => React.ReactNode;
};
