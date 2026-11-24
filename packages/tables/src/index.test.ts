// @vitest-environment node
import { describe, expect, it } from "vitest";

import { barrelExports } from "../../../scripts/barrel-exports.mjs";
import * as tables from "./index";

// Table, its parts and their prop types, plus what a table composed from the
// parts needs: the selection provider and the hook that reads it. The default
// cell formatter is served because `formatCell` hands it the cells it does not
// handle. Constants, the variant function, the header formatter, the scroll
// hook and the mocks are internal.
const values = [
  "Table",
  "TableBody",
  "TableCell",
  "TableCellActions",
  "TableCellCheckbox",
  "TableCellDropdown",
  "TableContainer",
  "TableFooter",
  "TableHead",
  "TableHeader",
  "TableRoot",
  "TableRow",
  "TableSelectionProvider",
  "defaultFormatCell",
  "useTableSelection",
];

const types = [
  "TableActionsProps",
  "TableBodyProps",
  "TableCellActionsProps",
  "TableCellCheckboxProps",
  "TableCellDropdownItems",
  "TableCellDropdownProps",
  "TableCellProps",
  "TableContainerProps",
  "TableFooterProps",
  "TableHeadProps",
  "TableHeaderProps",
  "TableProps",
  "TableRootProps",
  "TableRowId",
  "TableRowProps",
  "TableSelectionContextValue",
  "TableSelectionProviderProps",
  "TableVariants",
];

describe("@uiid/tables barrel", () => {
  it("exports exactly the components, parts, selection and cell formatter", () => {
    expect(Object.keys(tables).sort()).toEqual(values);
  });

  it("exports exactly these names, types included", () => {
    expect(barrelExports(`${import.meta.dirname}/index.ts`)).toEqual(
      [...values, ...types].sort(),
    );
  });
});
