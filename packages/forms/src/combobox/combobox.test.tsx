import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Form } from "../form/form";
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
    expect(
      screen.queryByRole("option", { name: /banana/i }),
    ).not.toBeInTheDocument();
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

describe("Combobox render target", () => {
  const items = ["apple", "banana", "cherry"];

  it("keeps the combobox role on the input when a label is passed", () => {
    render(<Combobox items={items} label="Fruit" />);
    const input = screen.getByRole("combobox");
    expect(input.tagName).toBe("INPUT");
  });

  it("associates the label with the input itself", () => {
    render(<Combobox items={items} label="Fruit" />);
    expect(screen.getByLabelText("Fruit")).toBe(screen.getByRole("combobox"));
  });

  it("puts aria-expanded on the input, not the field wrapper", () => {
    render(<Combobox items={items} label="Fruit" />);
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded");
  });

  it("still targets the input when a description is passed", () => {
    render(<Combobox items={items} description="Pick one" />);
    expect(screen.getByRole("combobox").tagName).toBe("INPUT");
  });
});

describe("Combobox FieldProps routing", () => {
  const items = ["apple", "banana", "cherry"];

  it("routes FieldProps to the field root instead of the DOM", () => {
    const { container } = render(
      <Combobox
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

describe("Combobox name forwarding", () => {
  const items = ["apple", "banana", "cherry"];

  it("surfaces a Form error keyed to the name", () => {
    const { container } = render(
      <Form errors={{ fruit: "Pick a fruit" }}>
        <Combobox name="fruit" label="Fruit" items={items} />
      </Form>,
    );
    expect(
      container.querySelector("[data-slot='field-error']"),
    ).toHaveTextContent("Pick a fruit");
  });

  it("still reaches the root, so the value submits under the name", async () => {
    const user = userEvent.setup();
    const submitted = vi.fn();

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted(new FormData(event.currentTarget).getAll("fruit"));
        }}
      >
        <Combobox name="fruit" label="Fruit" items={items} />
        <button type="submit">Submit</button>
      </form>,
    );

    const input = screen.getByRole("combobox");
    await user.click(input);
    await user.keyboard("{ArrowDown}");
    await user.click(screen.getByRole("option", { name: /banana/i }));
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Exactly one entry: the root submits the value, and the visible input is
    // not a second, separately named control.
    expect(submitted).toHaveBeenCalledWith(["banana"]);
  });

  it("lets InputProps override the name the field matches on", () => {
    const { container } = render(
      <Form errors={{ produce: "Pick a fruit" }}>
        <Combobox
          name="fruit"
          label="Fruit"
          items={items}
          InputProps={{ name: "produce" }}
        />
      </Form>,
    );
    expect(
      container.querySelector("[data-slot='field-error']"),
    ).toHaveTextContent("Pick a fruit");
  });
});

describe("Combobox size variant", () => {
  const items = ["apple", "banana"];

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the %s control tier on the input",
    (size) => {
      render(<Combobox items={items} size={size} />);
      expect(screen.getByRole("combobox").className).toContain(`size-${size}`);
    },
  );

  it("falls back to the medium tier, matching Input", () => {
    render(<Combobox items={items} />);
    expect(screen.getByRole("combobox").className).toContain("size-medium");
  });

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "carries the %s tier onto the input group, which sizes the action strip",
    (size) => {
      const { container } = render(<Combobox items={items} size={size} />);
      const group = container.querySelector(
        "[data-slot='combobox-input-group']",
      );
      expect(group?.className).toContain(`size-${size}`);
    },
  );

  it("moves the tier onto the wrapper when a slot is present", () => {
    const { container } = render(
      <Combobox items={items} size="large" before="$" />,
    );
    const wrapper = container.querySelector("[data-slot='input-wrapper']");
    expect(wrapper?.className).toContain("size-large");
  });
});
