export const TableBody = ({ ...props }: React.ComponentProps<"tbody">) => {
  return <tbody data-slot="table-body" {...props} />;
};
TableBody.displayName = "TableBody";
