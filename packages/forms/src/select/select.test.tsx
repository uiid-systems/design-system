import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
