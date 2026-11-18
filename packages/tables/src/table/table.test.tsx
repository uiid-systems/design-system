import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EllipsisVerticalIcon } from "@uiid/icons/ellipsis-vertical";
import { describe, expect, it, vi } from "vitest";

/* Imported from the barrel on purpose, to cover the defaultFormatCell export. */
import { defaultFormatCell, Table, TableCellDropdown } from "../index";
import { TABLE_MOCK_DATA } from "./table.mocks";

/** happy-dom reports every box as zero-sized, so the scroll metrics the
 * affordance reads have to be stood up by hand. */
const setScrollMetrics = (
  element: HTMLElement,
  metrics: { scrollLeft: number; clientWidth: number; scrollWidth: number },
) => {
  for (const [key, value] of Object.entries(metrics)) {
    Object.defineProperty(element, key, {
      configurable: true,
      writable: true,
      value,
    });
  }
};

const renderTable = () => {
  render(<Table items={TABLE_MOCK_DATA} />);

  const scroller = document.querySelector<HTMLElement>(
    '[data-slot="table-scroller"]',
  );
  if (!scroller) throw new Error("table scroller not found");

  return { container: scroller.parentElement as HTMLElement, scroller };
};

describe("Table", () => {
  it("renders its rows", () => {
    renderTable();
    expect(screen.getByText("Alex Thompson")).toBeInTheDocument();
  });

  it("sets no minimum width by default", () => {
    renderTable();
    expect(screen.getByRole("table")).not.toHaveAttribute("data-ui-minw");
  });

  it("floors the table width when minw is given", () => {
    render(<Table items={TABLE_MOCK_DATA} minw={768} />);
    expect(screen.getByRole("table")).toHaveAttribute("data-ui-minw", "768");
  });

  it("defaults to the medium size", () => {
    renderTable();
    expect(screen.getByRole("table").className).toContain("size-medium");
  });

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "applies size=%s",
    (size) => {
      render(<Table items={TABLE_MOCK_DATA} size={size} />);
      expect(screen.getByRole("table").className).toContain(`size-${size}`);
    },
  );

  it("passes its size to the built-in controls", () => {
    render(
      <Table
        items={TABLE_MOCK_DATA}
        size="large"
        selectable
        actions={{ primary: [{ icon: EllipsisVerticalIcon, tooltip: "Edit" }] }}
      />,
    );
    expect(
      screen.getAllByRole("checkbox")[0].closest('[data-slot="checkbox"]')
        ?.className,
    ).toContain("size-large");
    expect(
      screen.getAllByRole("button", { name: "Edit" })[0].className,
    ).toContain("size-large");
  });

  it("marks the scroll container with a data-slot", () => {
    const { scroller } = renderTable();
    expect(scroller).toHaveAttribute("data-slot", "table-scroller");
  });

  it("shows no edge shadows when the table fits", async () => {
    const { container, scroller } = renderTable();

    setScrollMetrics(scroller, {
      scrollLeft: 0,
      clientWidth: 800,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).not.toHaveAttribute("data-scroll-start");
      expect(container).not.toHaveAttribute("data-scroll-end");
    });
  });

  it("shows only the end shadow when content overflows to the right", async () => {
    const { container, scroller } = renderTable();

    setScrollMetrics(scroller, {
      scrollLeft: 0,
      clientWidth: 400,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).not.toHaveAttribute("data-scroll-start");
      expect(container).toHaveAttribute("data-scroll-end");
    });
  });

  it("shows both shadows mid-scroll", async () => {
    const { container, scroller } = renderTable();

    setScrollMetrics(scroller, {
      scrollLeft: 200,
      clientWidth: 400,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).toHaveAttribute("data-scroll-start");
      expect(container).toHaveAttribute("data-scroll-end");
    });
  });

  it("shows only the start shadow at the far end", async () => {
    const { container, scroller } = renderTable();

    setScrollMetrics(scroller, {
      scrollLeft: 400,
      clientWidth: 400,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).toHaveAttribute("data-scroll-start");
      expect(container).not.toHaveAttribute("data-scroll-end");
    });
  });

  it("treats a negative scroll offset as distance from the start", async () => {
    const { container, scroller } = renderTable();

    /* RTL counts scrollLeft down from zero, so the sign carries no meaning. */
    setScrollMetrics(scroller, {
      scrollLeft: -200,
      clientWidth: 400,
      scrollWidth: 800,
    });
    scroller.dispatchEvent(new Event("scroll"));

    await waitFor(() => {
      expect(container).toHaveAttribute("data-scroll-start");
      expect(container).toHaveAttribute("data-scroll-end");
    });
  });

  describe("cell values", () => {
    const cells = () =>
      screen.getAllByRole("cell").map((cell) => cell.textContent);

    it("renders strings and numbers as text", () => {
      render(<Table items={[{ name: "Ada", age: 36, score: 0 }]} />);
      expect(cells()).toEqual(["Ada", "36", "0"]);
    });

    it("renders a React element as itself", () => {
      render(<Table items={[{ name: <strong>Ada</strong> }]} />);
      expect(screen.getByText("Ada").tagName).toBe("STRONG");
    });

    it("renders null as an empty cell", () => {
      render(<Table items={[{ name: "Ada", email: null }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders undefined as an empty cell", () => {
      render(<Table items={[{ name: "Ada", email: undefined }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders an empty cell for a key a later row is missing", () => {
      const items: Record<string, unknown>[] = [
        { name: "Ada", email: "ada@example.com" },
        { name: "Grace" },
      ];
      render(<Table items={items} />);
      expect(cells()).toEqual(["Ada", "ada@example.com", "Grace", ""]);
    });

    it("renders an object as an empty cell", () => {
      render(<Table items={[{ name: "Ada", address: { city: "London" } }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders an object with no string form of its own as an empty cell", () => {
      const bare = Object.create(null) as Record<string, unknown>;
      render(<Table items={[{ name: "Ada", meta: bare }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders an array of strings as its joined text", () => {
      render(<Table items={[{ name: "Ada", tags: ["a", "b"] }]} />);
      expect(cells()).toEqual(["Ada", "a,b"]);
    });

    it("renders an array holding a plain object as an empty cell", () => {
      render(<Table items={[{ name: "Ada", homes: [{ city: "London" }] }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders an array of React elements as an empty cell", () => {
      const tags = [<em key="a">a</em>, <em key="b">b</em>];
      render(<Table items={[{ name: "Ada", tags }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders an array holding a nested array as an empty cell", () => {
      render(<Table items={[{ name: "Ada", grid: [1, [2, 3]] }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders an array of Dates as an empty cell", () => {
      const dates = [new Date(2024, 0, 15), new Date(2025, 5, 2)];
      render(<Table items={[{ name: "Ada", dates }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders a symbol as an empty cell", () => {
      render(<Table items={[{ name: "Ada", token: Symbol("token") }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders a function as an empty cell", () => {
      render(<Table items={[{ name: "Ada", onSelect: () => "picked" }]} />);
      expect(cells()).toEqual(["Ada", ""]);
    });

    it("renders a bigint as text", () => {
      render(<Table items={[{ name: "Ada", visits: 9007199254740993n }]} />);
      expect(cells()).toEqual(["Ada", "9007199254740993"]);
    });

    it("renders a URL as its string form", () => {
      const site = new URL("https://example.com/ada");
      render(<Table items={[{ name: "Ada", site }]} />);
      expect(cells()).toEqual(["Ada", "https://example.com/ada"]);
    });

    it("renders a Date as its string form", () => {
      const joined = new Date(2024, 0, 15);
      render(<Table items={[{ name: "Ada", joined }]} />);
      expect(cells()).toEqual(["Ada", String(joined)]);
    });

    it("renders a boolean as text", () => {
      render(<Table items={[{ name: "Ada", active: false }]} />);
      expect(cells()).toEqual(["Ada", "false"]);
    });

    it("renders what formatCell returns", () => {
      render(
        <Table
          items={[{ name: "Ada", tags: ["a", "b"], email: null }]}
          formatCell={(value) =>
            Array.isArray(value) ? value.join(", ") : String(value ?? "—")
          }
        />,
      );
      expect(cells()).toEqual(["Ada", "a, b", "—"]);
    });

    it("lets formatCell fall back to defaultFormatCell", () => {
      const joined = new Date(2024, 0, 15);
      render(
        <Table
          items={[{ name: "Ada", joined, email: null }]}
          formatCell={(value, column) =>
            column === "joined" && value instanceof Date
              ? String(value.getFullYear())
              : defaultFormatCell(value)
          }
        />,
      );
      expect(cells()).toEqual(["Ada", "2024", ""]);
    });

    it("calls formatCell with the value, the column and the row", () => {
      const item = { name: "Ada", address: { city: "London" } };
      const formatCell = vi.fn(() => "x");
      render(<Table items={[item]} formatCell={formatCell} />);

      expect(formatCell).toHaveBeenCalledWith("Ada", "name", item);
      expect(formatCell).toHaveBeenCalledWith(item.address, "address", item);
    });

    it("lets formatCell render an element", () => {
      render(
        <Table
          items={[{ name: "Ada" }]}
          formatCell={(value) => <em>{String(value)}</em>}
        />,
      );
      expect(screen.getByText("Ada").tagName).toBe("EM");
    });
  });

  describe("selection", () => {
    const ITEMS = [{ name: "Ada" }, { name: "Grace" }, { name: "Linus" }];

    const selectAll = () =>
      screen.getByRole("checkbox", { name: "Select all rows" });
    const rowCheckboxes = () =>
      screen.getAllByRole("checkbox", { name: "Select row" });

    it("renders no checkboxes unless selectable is set", () => {
      render(<Table items={ITEMS} />);
      expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    });

    it("renders a header checkbox and one checkbox per row", () => {
      render(<Table items={ITEMS} selectable />);
      expect(selectAll()).not.toBeChecked();
      expect(rowCheckboxes()).toHaveLength(ITEMS.length);
    });

    it("reports the selected rows in ascending order", async () => {
      const user = userEvent.setup();
      const onSelectedRowsChange = vi.fn();
      render(
        <Table
          items={ITEMS}
          selectable
          onSelectedRowsChange={onSelectedRowsChange}
        />,
      );

      await user.click(rowCheckboxes()[2]);
      await user.click(rowCheckboxes()[0]);

      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([0, 2]);
      expect(rowCheckboxes()[0]).toBeChecked();
      expect(rowCheckboxes()[1]).not.toBeChecked();
      expect(rowCheckboxes()[2]).toBeChecked();
    });

    it("marks the header checkbox mixed while only some rows are selected", async () => {
      const user = userEvent.setup();
      render(<Table items={ITEMS} selectable />);

      await user.click(rowCheckboxes()[1]);

      expect(selectAll()).toBePartiallyChecked();
    });

    it("selects every row when the mixed header checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onSelectedRowsChange = vi.fn();
      render(
        <Table
          items={ITEMS}
          selectable
          defaultSelectedRows={[1]}
          onSelectedRowsChange={onSelectedRowsChange}
        />,
      );

      await user.click(selectAll());

      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([0, 1, 2]);
      expect(selectAll()).toBeChecked();
      expect(selectAll()).not.toBePartiallyChecked();
      for (const checkbox of rowCheckboxes()) {
        expect(checkbox).toBeChecked();
      }
    });

    it("checks the header checkbox once every row is selected one by one", async () => {
      const user = userEvent.setup();
      render(<Table items={ITEMS} selectable />);

      for (const checkbox of rowCheckboxes()) {
        await user.click(checkbox);
      }

      expect(selectAll()).toBeChecked();
    });

    it("leaves the header checkbox unchecked for an empty table", () => {
      render(<Table items={[]} columns={["name"]} selectable />);
      expect(selectAll()).not.toBeChecked();
      expect(selectAll()).not.toBePartiallyChecked();
    });

    it("starts from defaultSelectedRows when uncontrolled", () => {
      render(<Table items={ITEMS} selectable defaultSelectedRows={[0, 2]} />);

      expect(rowCheckboxes()[0]).toBeChecked();
      expect(rowCheckboxes()[1]).not.toBeChecked();
      expect(rowCheckboxes()[2]).toBeChecked();
      expect(selectAll()).toBePartiallyChecked();
    });

    it("waits for the parent to update selectedRows when controlled", async () => {
      const user = userEvent.setup();
      const onSelectedRowsChange = vi.fn();
      const { rerender } = render(
        <Table
          items={ITEMS}
          selectable
          selectedRows={[]}
          onSelectedRowsChange={onSelectedRowsChange}
        />,
      );

      await user.click(rowCheckboxes()[1]);

      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([1]);
      expect(rowCheckboxes()[1]).not.toBeChecked();

      rerender(
        <Table
          items={ITEMS}
          selectable
          selectedRows={[1]}
          onSelectedRowsChange={onSelectedRowsChange}
        />,
      );

      expect(rowCheckboxes()[1]).toBeChecked();
      expect(selectAll()).toBePartiallyChecked();
    });

    it("builds the next selection from the controlled selectedRows", async () => {
      const user = userEvent.setup();
      const onSelectedRowsChange = vi.fn();
      render(
        <Table
          items={ITEMS}
          selectable
          selectedRows={[2]}
          onSelectedRowsChange={onSelectedRowsChange}
        />,
      );

      await user.click(rowCheckboxes()[0]);
      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([0, 2]);

      await user.click(rowCheckboxes()[2]);
      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([]);
    });

    it("clears every row when the checked header checkbox is clicked", async () => {
      const user = userEvent.setup();
      const onSelectedRowsChange = vi.fn();
      render(
        <Table
          items={ITEMS}
          selectable
          onSelectedRowsChange={onSelectedRowsChange}
        />,
      );

      await user.click(selectAll());
      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([0, 1, 2]);

      await user.click(selectAll());
      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([]);
      expect(selectAll()).not.toBeChecked();
      for (const checkbox of rowCheckboxes()) {
        expect(checkbox).not.toBeChecked();
      }
    });

    it("reports select-all without changing a controlled selection", async () => {
      const user = userEvent.setup();
      const onSelectedRowsChange = vi.fn();
      const { rerender } = render(
        <Table
          items={ITEMS}
          selectable
          selectedRows={[1]}
          onSelectedRowsChange={onSelectedRowsChange}
        />,
      );

      await user.click(selectAll());

      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([0, 1, 2]);
      expect(selectAll()).toBePartiallyChecked();

      rerender(
        <Table
          items={ITEMS}
          selectable
          selectedRows={[0, 1, 2]}
          onSelectedRowsChange={onSelectedRowsChange}
        />,
      );

      expect(selectAll()).toBeChecked();
      await user.click(selectAll());
      expect(onSelectedRowsChange).toHaveBeenLastCalledWith([]);
      expect(selectAll()).toBeChecked();
    });

    it("ignores defaultSelectedRows when selectedRows is set", () => {
      render(
        <Table
          items={ITEMS}
          selectable
          selectedRows={[0]}
          defaultSelectedRows={[1, 2]}
        />,
      );

      expect(rowCheckboxes()[0]).toBeChecked();
      expect(rowCheckboxes()[1]).not.toBeChecked();
      expect(rowCheckboxes()[2]).not.toBeChecked();
    });
  });

  describe("actions", () => {
    const ITEMS = [{ name: "Ada" }, { name: "Grace" }];

    it("labels the actions column for assistive technology", () => {
      render(
        <Table
          items={ITEMS}
          actions={{
            primary: [{ icon: EllipsisVerticalIcon, tooltip: "Edit" }],
          }}
        />,
      );
      expect(
        screen.getByRole("columnheader", { name: "Row actions" }),
      ).toBeInTheDocument();
    });

    it("renders no actions column without actions", () => {
      render(<Table items={ITEMS} />);
      expect(
        screen.queryByRole("columnheader", { name: "Row actions" }),
      ).not.toBeInTheDocument();
    });

    it("calls a primary action with its row's item", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Table
          items={ITEMS}
          actions={{
            primary: [{ icon: EllipsisVerticalIcon, tooltip: "Edit", onClick }],
          }}
        />,
      );

      await user.click(screen.getAllByRole("button", { name: "Edit" })[1]);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick).toHaveBeenCalledWith(ITEMS[1]);
    });

    it("passes each action button and its row's item to wrapper", () => {
      render(
        <Table
          items={ITEMS}
          actions={{
            primary: [
              {
                icon: EllipsisVerticalIcon,
                tooltip: "Edit",
                wrapper: (button, item) => (
                  <div role="group" aria-label={`Edit ${item.name}`}>
                    {button}
                  </div>
                ),
              },
            ],
          }}
        />,
      );

      const group = screen.getByRole("group", { name: "Edit Grace" });
      expect(
        within(group).getByRole("button", { name: "Edit" }),
      ).toBeInTheDocument();
    });

    it("opens the secondary menu with its items", async () => {
      const user = userEvent.setup();
      render(
        <Table
          items={ITEMS}
          actions={{
            secondary: {
              tooltip: "Settings",
              items: [
                { label: "Rename", value: "rename" },
                { label: "Delete", value: "delete" },
              ],
            },
          }}
        />,
      );

      await user.click(screen.getAllByRole("button", { name: "Settings" })[0]);

      expect(
        await screen.findByRole("menuitem", { name: "Rename" }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole("menuitem", { name: "Delete" }),
      ).toBeInTheDocument();
    });

    it("calls a standalone TableCellDropdown's items function with its item", async () => {
      const user = userEvent.setup();
      const items = vi.fn((row: { name: string }) => [
        { label: `Delete ${row.name}`, value: "delete" },
      ]);
      render(
        <TableCellDropdown tooltip="Settings" item={ITEMS[0]} items={items} />,
      );

      await user.click(screen.getByRole("button", { name: "Settings" }));

      expect(
        await screen.findByRole("menuitem", { name: "Delete Ada" }),
      ).toBeInTheDocument();
      expect(items).toHaveBeenCalledWith(ITEMS[0]);
    });

    it("passes the row's item to a secondary items function", async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();
      render(
        <Table
          items={ITEMS}
          actions={{
            secondary: {
              tooltip: "Settings",
              items: (item) => [
                {
                  label: `Delete ${item.name}`,
                  value: "delete",
                  onClick: () => onDelete(item),
                },
              ],
            },
          }}
        />,
      );

      await user.click(screen.getAllByRole("button", { name: "Settings" })[1]);
      await user.click(
        await screen.findByRole("menuitem", { name: "Delete Grace" }),
      );

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith(ITEMS[1]);
    });
  });

  describe("footer", () => {
    const ITEMS = [{ name: "Ada", email: "ada@example.com" }];
    const cellTexts = () =>
      screen.getAllByRole("cell").map((cell) => cell.textContent);

    it("renders no footer by default", () => {
      render(<Table items={ITEMS} />);
      expect(cellTexts()).toEqual(["Ada", "ada@example.com"]);
    });

    it("renders footer content in a cell spanning every column", () => {
      render(
        <Table
          items={ITEMS}
          selectable
          actions={{
            primary: [{ icon: EllipsisVerticalIcon, tooltip: "Edit" }],
          }}
          footer="1 member"
        />,
      );

      const cell = screen.getByRole("cell", { name: "1 member" });
      /* Two data columns, plus the checkbox and actions columns. */
      expect(cell).toHaveAttribute("colspan", "4");
    });
  });
});
