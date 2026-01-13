import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SelectMultiple } from "./select-multiple";

describe("SelectMultiple", () => {
  const defaultItems = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
  ];

  // ============================================
  // RENDERING
  // ============================================

  it("renders a combobox element", () => {
    render(<SelectMultiple items={defaultItems} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<SelectMultiple items={defaultItems} />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "data-slot",
      "select-trigger",
    );
  });

  it("starts with no selection by default", () => {
    render(<SelectMultiple items={defaultItems} />);
    const trigger = screen.getByRole("combobox");
    // Should be empty or have placeholder behavior
    expect(trigger).not.toHaveTextContent("Option A");
    expect(trigger).not.toHaveTextContent("Option B");
    expect(trigger).not.toHaveTextContent("Option C");
  });

  it("supports placeholder", () => {
    render(
      <SelectMultiple items={defaultItems} placeholder="Select options..." />,
    );
    expect(screen.getByText("Select options...")).toBeInTheDocument();
  });

  it("supports defaultValue with single item", () => {
    render(<SelectMultiple items={defaultItems} defaultValue={["b"]} />);
    const trigger = screen.getByRole("combobox");
    // Multi-select displays comma-separated labels
    expect(trigger).toHaveTextContent("Option B");
  });

  it("supports defaultValue with multiple items", () => {
    render(<SelectMultiple items={defaultItems} defaultValue={["a", "c"]} />);
    const trigger = screen.getByRole("combobox");
    // Multi-select displays comma-separated labels
    expect(trigger).toHaveTextContent("Option A, Option C");
  });

  // ============================================
  // INTERACTIONS
  // ============================================

  it("opens dropdown when clicked", async () => {
    const user = userEvent.setup();
    render(<SelectMultiple items={defaultItems} />);

    const trigger = screen.getByRole("combobox");
    await user.click(trigger);

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("displays all items when opened", async () => {
    const user = userEvent.setup();
    render(<SelectMultiple items={defaultItems} />);

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
    render(<SelectMultiple items={defaultItems} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option b/i }));

    // Selected label is displayed in the trigger
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Option B");
  });

  it("allows selecting multiple items", async () => {
    const user = userEvent.setup();
    render(<SelectMultiple items={defaultItems} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option a/i }));
    await user.click(screen.getByRole("option", { name: /option c/i }));

    const trigger = screen.getByRole("combobox");
    // Multi-select displays comma-separated labels
    expect(trigger).toHaveTextContent("Option A, Option C");
  });

  it("deselects item when clicked again", async () => {
    const user = userEvent.setup();
    render(<SelectMultiple items={defaultItems} defaultValue={["a", "b"]} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option a/i }));

    // Option A should be deselected, only Option B remains
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
        <SelectMultiple
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
    render(<SelectMultiple items={defaultItems} label="Choose options" />);
    expect(screen.getByText("Choose options")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(<SelectMultiple items={defaultItems} description="Helper text" />);
    expect(screen.getByText("Helper text")).toBeInTheDocument();
  });
});
