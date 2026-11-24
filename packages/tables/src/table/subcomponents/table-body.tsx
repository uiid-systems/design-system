export type TableBodyProps = React.ComponentProps<"tbody">;

export const TableBody = ({ ...props }: TableBodyProps) => {
  return <tbody data-slot="table-body" {...props} />;
};
TableBody.displayName = "TableBody";
