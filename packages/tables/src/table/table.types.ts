import type { ButtonProps } from "@uiid/buttons";
import type { MenuItem } from "@uiid/interactive";

export type TableCellDropdownProps = {
  icon?: ButtonProps["icon"];
  tooltip?: string;
  items: MenuItem[];
};

export type TableRootProps = React.ComponentProps<"table"> & {
  striped?: boolean;
  bordered?: boolean;
};

export type TableProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = Omit<TableRootProps, "children"> & {
  items: T[];
  columns?: Array<keyof T>;
  actions?: TableCellDropdownProps;
  formatHeader?: (key: keyof T) => React.ReactNode;
};
