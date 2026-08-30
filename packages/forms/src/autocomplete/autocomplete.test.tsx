import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Autocomplete } from "./autocomplete";

describe("Autocomplete", () => {
  const defaultItems = ["apple", "banana", "cherry", "date", "elderberry"];

  it("renders an autocomplete input", () => {
    render(<Autocomplete items={defaultItems} />);
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with data-slot attribute on input", () => {
    render(<Autocomplete items={defaultItems} />);
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "data-slot",
      "autocomplete-input",
    );
  });

  it("renders with placeholder", () => {
    render(
      <Autocomplete items={defaultItems} placeholder="Search fruits..." />,
    );
    expect(screen.getByPlaceholderText("Search fruits...")).toBeInTheDocument();
  });

  it("opens dropdown when typing", async () => {
    const user = userEvent.setup();
    render(<Autocomplete items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "a");

    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("shows empty state when no matches", async () => {
    const user = userEvent.setup();
    render(<Autocomplete items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "xyz");

    // Base UI appends an invisible Word Joiner (U+2060) to the empty-state text
    // for ~200ms so Safari VoiceOver announces the polite live region. Match
    // loosely so the marker does not break the assertion.
    expect(screen.getByText(/No results found\./)).toBeInTheDocument();
  });

  it("closes dropdown on Escape", async () => {
    const user = userEvent.setup();
    render(<Autocomplete items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "a");

    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("allows free-form text input", async () => {
    const user = userEvent.setup();
    render(<Autocomplete items={defaultItems} />);

    const input = screen.getByRole("combobox");
    await user.type(input, "custom value");

    // Unlike Combobox, Autocomplete allows free-form text
    expect(input).toHaveValue("custom value");
  });

  it("forwards InputProps to input element", () => {
    render(
      <Autocomplete
        items={defaultItems}
        InputProps={{ "aria-label": "Search" }}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveAttribute(
      "aria-label",
      "Search",
    );
  });
});

describe("Autocomplete render target", () => {
  const items = ["apple", "banana", "cherry"];

  it("keeps the combobox role on the input when a label is passed", () => {
    render(<Autocomplete items={items} label="Fruit" />);
    const input = screen.getByRole("combobox");
    expect(input.tagName).toBe("INPUT");
  });

  it("associates the label with the input itself", () => {
    render(<Autocomplete items={items} label="Fruit" />);
    expect(screen.getByLabelText("Fruit")).toBe(screen.getByRole("combobox"));
  });

  it("puts aria-expanded on the input, not the field wrapper", () => {
    render(<Autocomplete items={items} label="Fruit" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded");
  });
});

describe("Autocomplete FieldProps routing", () => {
  const items = ["apple", "banana", "cherry"];

  it("routes FieldProps to the field root instead of the DOM", () => {
    const { container } = render(
      <Autocomplete
        items={items}
        label="Fruit"
        InputProps={{ FieldProps: { className: "custom-field" } }}
      />,
    );
    expect(container.querySelector("[data-slot='field-root']")).toHaveClass(
      "custom-field",
    );
  });
});
