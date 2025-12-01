import type { TableProps } from "./table.types";

import { TableContainer, TableRoot } from "./subcomponents";

export const Table = ({
  striped,
  bordered,
  children,
  ...props
}: TableProps) => {
  return (
    <TableContainer>
      <TableRoot striped={striped} bordered={bordered} {...props}>
        {children}
      </TableRoot>
    </TableContainer>
  );
};
Table.displayName = "Table";
