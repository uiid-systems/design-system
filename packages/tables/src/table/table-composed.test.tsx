import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

/* Everything comes from the barrel on purpose: a composed table may only use
   what the package exports. */
import {
  TableBody,
  TableCell,
  TableCellCheckbox,
  TableHead,
  TableHeader,
  TableRoot,
  TableRow,
  TableSelectionProvider,
  useTableSelection,
} from "../index";

const NAMES = ["Ada", "Grace", "Linus"];

const SelectionSummary = () => {
  const { allSelected, someSelected } = useTableSelection();
  return (
    <output>{allSelected ? "all" : someSelected ? "some" : "none"}</output>
  );
};

const renderComposedTable = (
  onSelectedRowsChange?: (selectedRows: number[]) => void,
) =>
  render(
    <TableSelectionProvider
      count={NAMES.length}
      onSelectedRowsChange={onSelectedRowsChange}
    >
      <SelectionSummary />
      <TableRoot>
        <TableHeader>
          <TableRow>
            <TableCellCheckbox head />
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {NAMES.map((name, index) => (
            <TableRow key={name}>
              <TableCellCheckbox index={index} />
              <TableCell>{name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </TableRoot>
    </TableSelectionProvider>,
  );

const selectAll = () =>
  screen.getByRole("checkbox", { name: "Select all rows" });
const rowCheckboxes = () =>
  screen.getAllByRole("checkbox", { name: /^Select row \d+$/ });

describe("Table composed from its exported parts", () => {
  it("toggles a single row", async () => {
    const user = userEvent.setup();
    const onSelectedRowsChange = vi.fn();
    renderComposedTable(onSelectedRowsChange);

    await user.click(rowCheckboxes()[1]);

    expect(rowCheckboxes()[1]).toHaveAttribute("aria-checked", "true");
    expect(rowCheckboxes()[0]).toHaveAttribute("aria-checked", "false");
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith([1]);

    await user.click(rowCheckboxes()[1]);

    expect(rowCheckboxes()[1]).toHaveAttribute("aria-checked", "false");
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith([]);
  });

  it("selects and clears every row from the header checkbox", async () => {
    const user = userEvent.setup();
    const onSelectedRowsChange = vi.fn();
    renderComposedTable(onSelectedRowsChange);

    await user.click(selectAll());

    for (const checkbox of rowCheckboxes()) {
      expect(checkbox).toHaveAttribute("aria-checked", "true");
    }
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith([0, 1, 2]);

    await user.click(selectAll());

    for (const checkbox of rowCheckboxes()) {
      expect(checkbox).toHaveAttribute("aria-checked", "false");
    }
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith([]);
  });

  it("shares the selection state through useTableSelection", async () => {
    const user = userEvent.setup();
    renderComposedTable();

    expect(screen.getByRole("status")).toHaveTextContent("none");

    await user.click(rowCheckboxes()[0]);
    expect(screen.getByRole("status")).toHaveTextContent("some");

    await user.click(selectAll());
    expect(screen.getByRole("status")).toHaveTextContent("all");
  });

  it("keys the selection by rowIds when given", async () => {
    const user = userEvent.setup();
    const onSelectedRowsChange = vi.fn();
    render(
      <TableSelectionProvider
        rowIds={NAMES}
        onSelectedRowsChange={onSelectedRowsChange}
      >
        <TableRoot>
          <TableHeader>
            <TableRow>
              <TableCellCheckbox head />
            </TableRow>
          </TableHeader>
          <TableBody>
            {NAMES.map((name) => (
              <TableRow key={name}>
                <TableCellCheckbox rowId={name} label={`Select ${name}`} />
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      </TableSelectionProvider>,
    );

    await user.click(screen.getByRole("checkbox", { name: "Select Linus" }));
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith(["Linus"]);
    expect(selectAll()).toBePartiallyChecked();

    await user.click(selectAll());
    expect(onSelectedRowsChange).toHaveBeenLastCalledWith(NAMES);
  });
});
