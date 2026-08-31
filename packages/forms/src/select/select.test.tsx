import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Select } from "./select";

describe("Select", () => {
  const defaultItems = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
  ];

  it("renders a combobox element", () => {
    render(<Select items={defaultItems} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Select items={defaultItems} />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "data-slot",
      "select-trigger",
    );
  });

  it("displays first item label by default", () => {
    render(<Select items={defaultItems} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
  });

  it("supports defaultValue", () => {
    render(<Select items={defaultItems} defaultValue="b" />);
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });

  it("supports placeholder", () => {
    render(<Select items={defaultItems} placeholder="Select an option..." />);
    expect(screen.getByText("Select an option...")).toBeInTheDocument();
  });

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup();
    render(<Select items={defaultItems} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("displays all items when opened", async () => {
    const user = userEvent.setup();
    render(<Select items={defaultItems} />);

    await user.click(screen.getByRole("combobox"));

    expect(
      screen.getByRole("option", { name: /option a/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /option b/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /option c/i }),
    ).toBeInTheDocument();
  });

  it("selects item when clicked", async () => {
    const user = userEvent.setup();
    render(<Select items={defaultItems} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option b/i }));

    // Selected value is displayed in the trigger
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Option B");
  });

  it("supports controlled value via RootProps", async () => {
    const handleChange = vi.fn();

    const ControlledSelect = () => {
      const [value, setValue] = useState("a");
      return (
        <Select
          items={defaultItems}
          RootProps={{
            value,
            onValueChange: (v) => {
              setValue(v as string);
              handleChange(v);
            },
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledSelect />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option b/i }));

    expect(handleChange).toHaveBeenCalledWith("b");
  });

  it("renders with label", () => {
    render(<Select items={defaultItems} label="Choose option" />);
    expect(screen.getByText("Choose option")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(<Select items={defaultItems} description="Helper text" />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });
});

describe("Select multiple", () => {
  const defaultItems = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
  ];

  // ============================================
  // RENDERING
  // ============================================

  it("renders a combobox element", () => {
    render(<Select multiple items={defaultItems} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Select multiple items={defaultItems} />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "data-slot",
      "select-trigger",
    );
  });

  it("starts with no selection by default", () => {
    render(<Select multiple items={defaultItems} />);
    const trigger = screen.getByRole("combobox");
    expect(trigger).not.toHaveTextContent("Option A");
    expect(trigger).not.toHaveTextContent("Option B");
    expect(trigger).not.toHaveTextContent("Option C");
  });

  it("supports placeholder", () => {
    render(
      <Select multiple items={defaultItems} placeholder="Select options..." />,
    );
    expect(screen.getByText("Select options...")).toBeInTheDocument();
  });

  it("supports defaultValue with single item", () => {
    render(<Select multiple items={defaultItems} defaultValue={["b"]} />);
    expect(screen.getByRole("combobox")).toHaveTextContent("Option B");
  });

  it("supports defaultValue with multiple items", () => {
    render(<Select multiple items={defaultItems} defaultValue={["a", "c"]} />);
    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Option A, Option C",
    );
  });

  // ============================================
  // INTERACTIONS
  // ============================================

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup();
    render(<Select multiple items={defaultItems} />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("displays all items when opened", async () => {
    const user = userEvent.setup();
    render(<Select multiple items={defaultItems} />);

    await user.click(screen.getByRole("combobox"));

    expect(
      screen.getByRole("option", { name: /option a/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /option b/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /option c/i }),
    ).toBeInTheDocument();
  });

  it("selects item when clicked", async () => {
    const user = userEvent.setup();
    render(<Select multiple items={defaultItems} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option b/i }));

    expect(screen.getByRole("combobox")).toHaveTextContent("Option B");
  });

  it("allows selecting multiple items", async () => {
    const user = userEvent.setup();
    render(<Select multiple items={defaultItems} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option a/i }));
    await user.click(screen.getByRole("option", { name: /option c/i }));

    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Option A, Option C",
    );
  });

  it("deselects item when clicked again", async () => {
    const user = userEvent.setup();
    render(<Select multiple items={defaultItems} defaultValue={["a", "b"]} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option a/i }));

    const trigger = screen.getByRole("combobox");
    expect(trigger).not.toHaveTextContent("Option A");
    expect(trigger).toHaveTextContent("Option B");
  });

  // ============================================
  // CONTROLLED STATE
  // ============================================

  it("supports controlled value via RootProps", async () => {
    const handleChange = vi.fn();

    const ControlledSelectMultiple = () => {
      const [value, setValue] = useState<string[]>(["a"]);
      return (
        <Select
          multiple
          items={defaultItems}
          RootProps={{
            value,
            onValueChange: (v) => {
              setValue(v as string[]);
              handleChange(v);
            },
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledSelectMultiple />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option b/i }));

    expect(handleChange).toHaveBeenCalledWith(["a", "b"]);
  });

  // ============================================
  // FIELD INTEGRATION
  // ============================================

  it("renders with label", () => {
    render(<Select multiple items={defaultItems} label="Choose options" />);
    expect(screen.getByText("Choose options")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(<Select multiple items={defaultItems} description="Helper text" />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });
});

describe("Select required reaches the control", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("marks the submitted control required", () => {
    const { container } = render(
      <Select items={items} label="Pick" placeholder="Pick one" required />,
    );

    expect(container.querySelector("input[required]")).not.toBeNull();
  });

  it("still renders the label's required marker", () => {
    const { container } = render(
      <Select items={items} label="Pick" required />,
    );

    expect(
      container.querySelector("[data-slot='field-label'][data-required]"),
    ).not.toBeNull();
  });
});

describe("Select control surface", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("paints the trigger from the shared field surface", () => {
    render(<Select items={items} label="Pick" />);
    expect(screen.getByRole("combobox").className).toMatch(
      /composes-field-surface/,
    );
  });

  it("keeps the value out of the surface, so it paints no second one", () => {
    const { container } = render(<Select items={items} label="Pick" />);
    expect(
      container.querySelector("[data-slot='select-value']")?.className,
    ).not.toMatch(/composes-field-surface/);
  });

  it("renders the trigger as a real button", () => {
    render(<Select items={items} label="Pick" />);
    expect(screen.getByRole("combobox").tagName).toBe("BUTTON");
  });
});
