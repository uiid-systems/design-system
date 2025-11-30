export const TableFooter = ({ ...props }: React.ComponentProps<"tfoot">) => {
  return <tfoot data-slot="table-footer" {...props} />;
};
TableFooter.displayName = "TableFooter";
