import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Form } from "../form/form";
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

describe("Autocomplete name forwarding", () => {
  const items = ["apple", "banana", "cherry"];

  it("surfaces a Form error keyed to the name", () => {
    const { container } = render(
      <Form errors={{ fruit: "Pick a fruit" }}>
        <Autocomplete name="fruit" label="Fruit" items={items} />
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
        <Autocomplete name="fruit" label="Fruit" items={items} />
        <button type="submit">Submit</button>
      </form>,
    );

    await user.type(screen.getByRole("combobox"), "banana");
    await user.keyboard("{Escape}");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    // Exactly one entry: the root submits the value, and the visible input is
    // not a second, separately named control.
    expect(submitted).toHaveBeenCalledWith(["banana"]);
  });

  it("lets InputProps override the name the field matches on", () => {
    const { container } = render(
      <Form errors={{ produce: "Pick a fruit" }}>
        <Autocomplete
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

describe("Autocomplete size variant", () => {
  const items = ["apple", "banana"];

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the %s control tier on the input",
    (size) => {
      render(<Autocomplete items={items} size={size} />);
      expect(screen.getByRole("combobox").className).toContain(`size-${size}`);
    },
  );

  it("falls back to the medium tier, matching Input", () => {
    render(<Autocomplete items={items} />);
    expect(screen.getByRole("combobox").className).toContain("size-medium");
  });

  it("moves the tier onto the wrapper when a slot is present", () => {
    const { container } = render(
      <Autocomplete items={items} size="large" before="$" />,
    );
    const wrapper = container.querySelector("[data-slot='input-wrapper']");
    expect(wrapper?.className).toContain("size-large");
  });
});

describe("Autocomplete color", () => {
  const items = ["apple", "banana"];

  /*
   * Autocomplete renders no slots by default, so `InputWrapper` collapses to a
   * fragment and the `<input>` is the element wearing the surface.
   */
  it("tints the bare input when there is no wrapper", () => {
    const { container } = render(<Autocomplete items={items} color="blue" />);

    expect(container.querySelector("[data-slot='input-wrapper']")).toBeNull();
    expect(screen.getByRole("combobox")).toHaveClass("palette-blue");
    expect(screen.getByRole("combobox").className).toMatch(
      /composes-field-surface-color/,
    );
  });

  /* Pass a slot and the wrapper appears and carries the surface instead. */
  it("tints the wrapper once slots bring one into existence", () => {
    const { container } = render(
      <Autocomplete items={items} color="blue" before="@" />,
    );

    const wrapper = container.querySelector("[data-slot='input-wrapper']");

    expect(wrapper).toHaveClass("palette-blue");
    expect(wrapper?.className).toMatch(/composes-field-surface-color/);
  });

  it("leaves the input on the plain surface with no color", () => {
    render(<Autocomplete items={items} />);
    expect(screen.getByRole("combobox").className).not.toMatch(
      /composes-field-surface-color/,
    );
  });

  /* The popup is portalled out of the input's subtree, so no class on the
     input can reach it — the hue has to arrive as a prop. Autocomplete opens
     on input rather than on click, so the list needs a query to filter. */
  it("tints the popup with the same hue", async () => {
    const user = userEvent.setup();
    render(<Autocomplete items={items} color="blue" />);

    await user.type(screen.getByRole("combobox"), "a");

    expect(
      document.querySelector("[data-slot='autocomplete-popup']"),
    ).toHaveClass("palette-blue");
  });

  /* Card is always a palette hue; an unset `color` must land on its default. */
  it("leaves the popup on Card's neutral hue with no color", async () => {
    const user = userEvent.setup();
    render(<Autocomplete items={items} />);

    await user.type(screen.getByRole("combobox"), "a");

    expect(
      document.querySelector("[data-slot='autocomplete-popup']"),
    ).toHaveClass("palette-neutral");
  });
});
