export type TableProps = React.ComponentProps<"table"> & {
  striped?: boolean;
  bordered?: boolean;
};

export type DataTableProps<T extends Record<string, unknown>> = Omit<
  TableProps,
  "children"
> & {
  items: T[];
  columns?: Array<keyof T>;
  formatHeader?: (key: keyof T) => React.ReactNode;
};
