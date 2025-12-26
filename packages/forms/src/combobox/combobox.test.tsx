import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Combobox } from "./combobox";

describe("Combobox", () => {
  const defaultItems = ["apple", "banana", "cherry", "date", "elderberry"];

  it("renders a combobox input", () => {
    render(<Combobox items={defaultItems} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with data-slot attribute on input", () => {
    render(<Combobox items={defaultItems} />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "data-slot",
      "combobox-input",
    );
  });

  it("renders with placeholder", () => {
    render(<Combobox items={defaultItems} placeholder="Search fruits..." />);
    expect(screen.getByPlaceholderText("Search fruits...")).toBeInTheDocument();
  });

  it("opens dropdown when input is focused and arrow down pressed", async () => {
    const user = userEvent.setup();
    render(<Combobox items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("displays all items when opened", async () => {
    const user = userEvent.setup();
    render(<Combobox items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("option", { name: /apple/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /banana/i })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /cherry/i })).toBeInTheDocument();
  });

  it("filters items when typing", async () => {
    const user = userEvent.setup();
    render(<Combobox items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "ap");

    expect(screen.getByRole("option", { name: /apple/i })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /banana/i })).not.toBeInTheDocument();
  });

  it("selects item when clicked", async () => {
    const user = userEvent.setup();
    render(<Combobox items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.click(screen.getByRole("option", { name: /banana/i }));

    expect(input).toHaveValue("banana");
  });

  it("selects item with Enter key", async () => {
    const user = userEvent.setup();
    render(<Combobox items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "ban"); // Filter to banana
    await user.keyboard("{ArrowDown}"); // Highlight first match
    await user.keyboard("{Enter}");

    expect(input).toHaveValue("banana");
  });

  it("supports controlled value via RootProps", async () => {
    const handleChange = vi.fn();

    const ControlledCombobox = () => {
      const [value, setValue] = useState<string | null>(null);
      return (
        <Combobox
          items={defaultItems}
          RootProps={{
            value,
            onValueChange: (v) => {
              setValue(v);
              handleChange(v);
            },
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledCombobox />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.click(screen.getByRole("option", { name: /banana/i }));

    expect(handleChange).toHaveBeenCalledWith("banana");
  });

  it("shows empty state when no matches", async () => {
    const user = userEvent.setup();
    render(<Combobox items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "xyz");

    expect(screen.getByText("No results found.")).toBeInTheDocument();
  });

  it("closes dropdown on Escape", async () => {
    const user = userEvent.setup();
    render(<Combobox items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});

