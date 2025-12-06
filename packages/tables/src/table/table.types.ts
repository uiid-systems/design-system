import type { ButtonProps } from "@uiid/buttons";
import type { MenuItem } from "@uiid/interactive";

export type TableActionsProps = {
  icon: ButtonProps["icon"];
  tooltip: string;
  onClick?: () => void;
  wrapper?: (button: React.ReactElement) => React.ReactElement;
};

export type TableCellDropdownProps = {
  icon?: ButtonProps["icon"];
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
