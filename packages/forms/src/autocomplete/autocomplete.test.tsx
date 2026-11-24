import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { describe, it, expect, expectTypeOf, vi } from "vitest";

import { Form } from "../form/form";
import { Autocomplete } from "./autocomplete";
import type {
  AutocompleteInputProps,
  AutocompleteItemProps,
  AutocompletePopupProps,
  AutocompleteProps,
} from "./autocomplete.types";
import { AutocompleteInput, AutocompleteRoot } from "./subcomponents";

import inputStyles from "../input/input.module.css";
import inputGroupStyles from "../shared/input-group/input-group.module.css";

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

  /* A forwarding wrapper passes an unset attribute as `undefined`. */
  it("keeps the InputProps name when the top-level attribute is undefined", () => {
    render(
      <Autocomplete
        items={defaultItems}
        aria-label={undefined}
        InputProps={{ "aria-label": "Search" }}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveAccessibleName("Search");
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

  /* The cast stands in for untyped code, which the slot type cannot stop. */
  it("lets the top-level name win over one in InputProps", () => {
    const { container } = render(
      <Form errors={{ fruit: "Pick a fruit", produce: "Wrong field" }}>
        <Autocomplete
          name="fruit"
          label="Fruit"
          items={items}
          InputProps={{ name: "produce" } as AutocompleteInputProps}
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
   * Autocomplete renders no slots by default, so `InputWrapper` is a box-less
   * `display: contents` and the `<input>` is the element wearing the surface.
   */
  it("tints the bare input when the wrapper paints nothing", () => {
    const { container } = render(<Autocomplete items={items} color="blue" />);

    const wrapper = container.querySelector("[data-slot='input-wrapper']");
    expect(wrapper).toHaveClass(inputStyles["input-wrapper-bare"]);
    expect(wrapper).not.toHaveClass("palette-blue");
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

describe("Autocomplete DOM attributes reach the input", () => {
  const defaultItems = ["apple", "banana", "cherry"];

  it("names the input from a top-level aria-label", () => {
    render(<Autocomplete items={defaultItems} aria-label="Fruit" />);
    expect(screen.getByRole("combobox")).toHaveAccessibleName("Fruit");
  });

  it("puts a data-* hook on the input", () => {
    render(<Autocomplete items={defaultItems} data-testid="fruit" />);
    expect(screen.getByTestId("fruit")).toHaveAttribute(
      "data-slot",
      "autocomplete-input",
    );
  });

  it("lets a top-level attribute win over the same key in InputProps", () => {
    render(
      <Autocomplete
        items={defaultItems}
        aria-label="Outer"
        InputProps={{ "aria-label": "Inner" }}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveAccessibleName("Outer");
  });
});

describe("Autocomplete popup layout props", () => {
  const items = ["apple", "banana"];

  /*
   * Base UI merges the render element's own props over the part's, so a
   * default written as a literal on the `Card` would beat these.
   */
  it("forwards layout props from PopupProps to the popup Card", async () => {
    const user = userEvent.setup();
    render(<Autocomplete items={items} PopupProps={{ gap: 2 }} />);

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("a");

    expect(
      document.querySelector<HTMLElement>("[data-slot='autocomplete-popup']"),
    ).toHaveAttribute("data-ui-gap", "2");
  });
});

/*
 * A part's `className` is a string, merged with its own module class. Its
 * state is styled through the `data-*` attributes Base UI sets. The popup
 * layer Autocomplete shares with Combobox is covered in Combobox's tests; the
 * input and input group carry Autocomplete's own slots.
 */
describe("Autocomplete className", () => {
  const items = ["apple", "banana"];

  it("merges a caller's className on the input with its own class and marks its state", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete
        items={items}
        InputProps={{
          className: "caller",
        }}
      />,
    );

    const input = document.querySelector("[data-slot='autocomplete-input']");
    expect(input).toHaveClass("caller", inputStyles["input"]);
    expect(input).not.toHaveAttribute("data-popup-open");

    await user.type(screen.getByRole("combobox"), "a");

    expect(input).toHaveClass("caller", inputStyles["input"]);
    expect(input).toHaveAttribute("data-popup-open");
  });

  it("merges a caller's className on the input group with its own class and marks its state", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete
        items={items}
        InputGroupProps={{
          className: "caller",
        }}
      />,
    );

    const group = document.querySelector(
      "[data-slot='autocomplete-input-group']",
    );
    expect(group).toHaveClass("caller", inputGroupStyles["input-group-root"]);
    expect(group).not.toHaveAttribute("data-popup-open");

    await user.type(screen.getByRole("combobox"), "a");

    expect(group).toHaveClass("caller", inputGroupStyles["input-group-root"]);
    expect(group).toHaveAttribute("data-popup-open");
  });
});

describe("Autocomplete input group", () => {
  const items = ["apple", "banana"];

  it("wraps the input in an input group", () => {
    render(<Autocomplete items={items} />);
    const group = document.querySelector(
      "[data-slot='autocomplete-input-group']",
    );
    expect(group).toContainElement(screen.getByRole("combobox"));
  });

  /* Base UI anchors the popup to the group, so the group must hold the
     control row alone: wrapping the Field put the label, description and
     error inside the anchor and the group's press handler. */
  it("wraps the control row only, leaving the label and description outside", () => {
    render(<Autocomplete items={items} label="Fruit" description="Pick one" />);
    const group = document.querySelector(
      "[data-slot='autocomplete-input-group']",
    );
    expect(group).toContainElement(
      document.querySelector<HTMLElement>("[data-slot='input-wrapper']"),
    );
    expect(group).not.toContainElement(screen.getByText("Fruit"));
    expect(group).not.toContainElement(screen.getByText("Pick one"));
  });

  /* Both props reach the one group the Input part renders, so neither may
     drop the other: the nested value wins a conflict, and classes join. */
  it("merges InputGroupProps with the InputGroupProps nested in InputProps", () => {
    render(
      <Autocomplete
        items={items}
        InputGroupProps={{ className: "outer", id: "outer-id", title: "kept" }}
        InputProps={{
          InputGroupProps: { className: "inner", id: "inner-id" },
        }}
      />,
    );
    const group = document.querySelector(
      "[data-slot='autocomplete-input-group']",
    );
    expect(group).toHaveClass("outer", "inner");
    expect(group).toHaveAttribute("id", "inner-id");
    expect(group).toHaveAttribute("title", "kept");
  });

  it("renders a single group around a composed input", () => {
    render(
      <AutocompleteRoot items={items}>
        <AutocompleteInput label="Fruit" />
      </AutocompleteRoot>,
    );
    expect(screen.getAllByRole("group")).toHaveLength(1);
    expect(screen.getByRole("group")).toContainElement(
      screen.getByRole("combobox"),
    );
  });

  it("forwards InputGroupProps passed to AutocompleteInput", () => {
    render(
      <AutocompleteRoot items={items}>
        <AutocompleteInput
          InputGroupProps={{ className: "mine", size: "large" }}
        />
      </AutocompleteRoot>,
    );
    const group = document.querySelector(
      "[data-slot='autocomplete-input-group']",
    );
    expect(group).toHaveClass("mine");
    expect(group?.className).toContain("size-large");
  });

  it("leaves the inline error outside the group", () => {
    render(
      <Form errors={{ fruit: "Pick a fruit" }}>
        <Autocomplete name="fruit" label="Fruit" items={items} />
      </Form>,
    );
    const group = document.querySelector(
      "[data-slot='autocomplete-input-group']",
    );
    const error = document.querySelector<HTMLElement>(
      "[data-slot='field-error']",
    );
    expect(error).toHaveTextContent("Pick a fruit");
    expect(group).not.toContainElement(error);
  });

  it("spans the row it sits in", () => {
    render(<Autocomplete items={items} />);
    expect(
      document.querySelector("[data-slot='autocomplete-input-group']"),
    ).toHaveAttribute("data-ui-w", "full");
  });

  it("forwards InputGroupProps to the input group", () => {
    render(
      <Autocomplete items={items} InputGroupProps={{ className: "mine" }} />,
    );
    expect(
      document.querySelector("[data-slot='autocomplete-input-group']"),
    ).toHaveClass("mine");
  });

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "carries the %s tier onto the input group",
    (size) => {
      render(<Autocomplete items={items} size={size} />);
      const group = document.querySelector(
        "[data-slot='autocomplete-input-group']",
      );
      expect(group?.className).toContain(`size-${size}`);
    },
  );
});

/* Field reads `disabled` off its root, not the control, so the label and
   description only dim when the input hands it up. */
describe("Autocomplete hands disabled to Field", () => {
  const items = ["apple", "banana"];

  it("makes caller slot content inert while disabled", () => {
    const { container } = render(
      <Autocomplete
        items={items}
        before="$"
        after={<button type="button">Go</button>}
        disabled
      />,
    );
    expect(
      container.querySelector("[data-slot='input-before']"),
    ).toHaveAttribute("inert");
    expect(
      container.querySelector("[data-slot='input-after']"),
    ).toHaveAttribute("inert");
  });

  it("leaves slot content interactive while enabled", () => {
    const { container } = render(
      <Autocomplete
        items={items}
        before="$"
        after={<button type="button">Go</button>}
      />,
    );
    expect(
      container.querySelector("[data-slot='input-before']"),
    ).not.toHaveAttribute("inert");
  });

  it("dims the label and description with a disabled autocomplete", () => {
    render(
      <Autocomplete
        items={items}
        label="Fruit"
        description="Pick one"
        disabled
      />,
    );
    expect(screen.getByText("Fruit")).toHaveAttribute("data-disabled");
    expect(screen.getByText("Pick one")).toHaveAttribute("data-disabled");
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("dims the label of a composed disabled AutocompleteInput", () => {
    render(
      <AutocompleteRoot items={items}>
        <AutocompleteInput label="Fruit" disabled />
      </AutocompleteRoot>,
    );
    expect(screen.getByText("Fruit")).toHaveAttribute("data-disabled");
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("leaves the label and description undimmed while enabled", () => {
    render(<Autocomplete items={items} label="Fruit" description="Pick one" />);
    expect(screen.getByText("Fruit")).not.toHaveAttribute("data-disabled");
    expect(screen.getByText("Pick one")).not.toHaveAttribute("data-disabled");
  });
});

/* Field paints the label's marker, Root marks the input. `required` has to
   reach both, and the monolith used to hand it to Root alone. */
describe("Autocomplete required reaches the label and the control", () => {
  const items = ["apple", "banana"];

  it("renders the label's required marker", () => {
    const { container } = render(
      <Autocomplete items={items} label="Fruit" required />,
    );

    expect(
      container.querySelector("[data-slot='field-label'][data-required]"),
    ).not.toBeNull();
    expect(container.querySelector("[data-slot='field-root']")).toHaveAttribute(
      "data-required",
    );
  });

  it("still marks the submitted control required", () => {
    render(<Autocomplete items={items} label="Fruit" name="fruit" required />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("name", "fruit");
    expect(input).toHaveAttribute("required");
    expect(input).toHaveAttribute("aria-required", "true");
  });

  it("renders no marker when not required", () => {
    const { container } = render(<Autocomplete items={items} label="Fruit" />);

    expect(
      container.querySelector("[data-slot='field-label'][data-required]"),
    ).toBeNull();
    expect(screen.getByRole("combobox")).not.toHaveAttribute("required");
  });

  it("marks the label from a composed AutocompleteInput", () => {
    const { container } = render(
      <AutocompleteRoot items={items}>
        <AutocompleteInput label="Fruit" required />
      </AutocompleteRoot>,
    );

    expect(
      container.querySelector("[data-slot='field-label'][data-required]"),
    ).not.toBeNull();
    expect(screen.getByRole("combobox")).toHaveAttribute("required");
  });
});

/* Base UI types Autocomplete's Root by its item value; the monolith must carry
   it through rather than pinning it to `string`. Autocomplete's Root has no
   `itemToStringLabel`: its `itemToStringValue` is the text a row shows and
   fills the input with. */
describe("Autocomplete generics", () => {
  type User = { id: number; name: string };
  const users: User[] = [
    { id: 1, name: "Ada Lovelace" },
    { id: 2, name: "Grace Hopper" },
  ];

  it("renders an object item's text from itemToStringValue", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete items={users} itemToStringValue={(item) => item.name} />,
    );

    await user.type(screen.getByRole("combobox"), "a");

    expect(
      screen.getByRole("option", { name: "Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("[object Object]")).not.toBeInTheDocument();
  });

  it("fills the input with an object item's text on press", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete items={users} itemToStringValue={(item) => item.name} />,
    );

    await user.type(screen.getByRole("combobox"), "grace");
    await user.click(screen.getByRole("option", { name: "Grace Hopper" }));

    expect(screen.getByRole("combobox")).toHaveValue("Grace Hopper");
  });

  it("renders a { value, label } item's label without itemToStringValue", async () => {
    const user = userEvent.setup();
    render(
      <Autocomplete
        items={[
          { value: "ada", label: "Ada Lovelace" },
          { value: "grace", label: "Grace Hopper" },
        ]}
      />,
    );

    await user.type(screen.getByRole("combobox"), "a");

    expect(
      screen.getByRole("option", { name: "Ada Lovelace" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("[object Object]")).not.toBeInTheDocument();
  });

  it("types items by the autocomplete's Value", () => {
    expectTypeOf<AutocompleteProps<User>["items"]>().toEqualTypeOf<
      readonly User[] | undefined
    >();
    expectTypeOf<AutocompleteProps["items"]>().toEqualTypeOf<
      readonly string[] | undefined
    >();
    expectTypeOf<AutocompleteItemProps<User>["value"]>().toEqualTypeOf<
      User | undefined
    >();
    expectTypeOf<AutocompleteItemProps["value"]>().toEqualTypeOf<
      string | undefined
    >();

    // @ts-expect-error a string is not an `Autocomplete<User>` item
    const wrong: AutocompleteProps<User>["items"] = ["Ada"];
    void wrong;

    void (
      <Autocomplete items={users} itemToStringValue={(item) => item.name} />
    );
    void (
      <Autocomplete
        items={users}
        // @ts-expect-error `Value` is `User`, which has no `title`
        itemToStringValue={(item) => item.title}
      />
    );
  });
});

/* Matches Select: `variant` and `fullwidth` shape the control surface. The
   control spans its row unless told otherwise, as it always has. */
describe("Autocomplete variant and fullwidth", () => {
  const items = ["apple", "banana", "cherry"];
  const field = () =>
    screen.getByRole("combobox").closest("[data-slot='field-root']");
  const group = () =>
    document.querySelector("[data-slot='autocomplete-input-group']");
  const wrapper = () => document.querySelector("[data-slot='input-wrapper']");

  it("spans its row by default", () => {
    render(<Autocomplete items={items} after="kg" />);
    expect(field()).toHaveAttribute("data-ui-fullwidth");
    expect(group()).toHaveAttribute("data-ui-w", "full");
    expect(wrapper()).toHaveClass(inputStyles["toggle-fullwidth"]);
  });

  it("sizes to its content with fullwidth={false}", () => {
    render(<Autocomplete items={items} after="kg" fullwidth={false} />);
    expect(field()).not.toHaveAttribute("data-ui-fullwidth");
    expect(group()).not.toHaveAttribute("data-ui-w");
    expect(wrapper()).not.toHaveClass(inputStyles["toggle-fullwidth"]);
    expect(screen.getByRole("combobox")).not.toHaveClass(
      inputStyles["toggle-fullwidth"],
    );
  });

  it("paints the ghost variant on the slotted wrapper", () => {
    render(<Autocomplete items={items} after="kg" variant="ghost" />);
    expect(wrapper()).toHaveClass(inputStyles["variant-ghost"]);
  });

  it("paints the ghost variant on a bare input part", () => {
    render(
      <AutocompleteRoot items={items}>
        <AutocompleteInput variant="ghost" fullwidth={false} />
      </AutocompleteRoot>,
    );
    const input = screen.getByRole("combobox");
    expect(input).toHaveClass(inputStyles["variant-ghost"]);
    expect(input).not.toHaveClass(inputStyles["toggle-fullwidth"]);
  });
});

describe("Autocomplete RootProps precedence", () => {
  const items = ["apple", "banana"];
  const submit = (container: HTMLElement, name: string) =>
    new FormData(container.querySelector("form") as HTMLFormElement).getAll(
      name,
    );

  it("lets a top-level prop win over the same key in RootProps", () => {
    const { container } = render(
      <form>
        <Autocomplete
          items={items}
          name="top"
          defaultValue="apple"
          RootProps={{ name: "slot" }}
        />
      </form>,
    );
    expect(submit(container, "top")).toContain("apple");
    expect(submit(container, "slot")).toEqual([]);
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    const { container } = render(
      <form>
        <Autocomplete
          items={items}
          RootProps={{ name: "slot", defaultValue: "apple" }}
        />
      </form>,
    );
    expect(submit(container, "slot")).toContain("apple");
  });

  it("marks the label from RootProps.required", () => {
    const { container } = render(
      <Autocomplete
        items={items}
        label="Fruit"
        RootProps={{ required: true }}
      />,
    );
    expect(
      container.querySelector("[data-slot='field-label'][data-required]"),
    ).not.toBeNull();
  });

  it("surfaces a Form error keyed to RootProps.name", () => {
    const { container } = render(
      <Form errors={{ fruit: "Pick a fruit" }}>
        <Autocomplete
          items={items}
          label="Fruit"
          RootProps={{ name: "fruit" }}
        />
      </Form>,
    );
    expect(
      container.querySelector("[data-slot='field-error']"),
    ).toHaveTextContent("Pick a fruit");
  });
});

/*
 * Each slot leaves out the keys Autocomplete sets on that part itself. The
 * casts in the precedence tests stand in for untyped code, which the slot type
 * cannot stop: the top-level value still wins at runtime.
 */
describe("Autocomplete InputProps", () => {
  const items = ["apple", "banana"];

  it("reaches the input", () => {
    render(
      <Autocomplete
        items={items}
        InputProps={{ id: "fruit", "aria-describedby": "hint" }}
      />,
    );
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("data-slot", "autocomplete-input");
    expect(input).toHaveAttribute("id", "fruit");
    expect(input).toHaveAttribute("aria-describedby", "hint");
  });

  it("forwards a ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<Autocomplete items={items} InputProps={{ ref }} />);
    expect(ref.current).toBe(screen.getByRole("combobox"));
  });

  it("lets top-level values win over the same keys in the slot", () => {
    render(
      <Autocomplete
        items={items}
        placeholder="Top"
        color="blue"
        InputProps={
          { placeholder: "Slot", color: "red" } as AutocompleteInputProps
        }
      />,
    );
    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("placeholder", "Top");
    expect(input).toHaveClass("palette-blue");
    expect(input).not.toHaveClass("palette-red");
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects InputProps the control owns", () => {
    // @ts-expect-error -- `name` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ name: "other" }} />);
    // @ts-expect-error -- `placeholder` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ placeholder: "Other" }} />);
    // @ts-expect-error -- `label` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ label: "Other" }} />);
    // @ts-expect-error -- `description` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ description: "Other" }} />);
    // @ts-expect-error -- `action` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ action: "Other" }} />);
    // @ts-expect-error -- `before` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ before: "Other" }} />);
    // @ts-expect-error -- `after` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ after: "Other" }} />);
    // @ts-expect-error -- `size` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ size: "small" }} />);
    // @ts-expect-error -- `variant` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ variant: "ghost" }} />);
    // @ts-expect-error -- `fullwidth` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ fullwidth: false }} />);
    // @ts-expect-error -- `color` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ color: "blue" }} />);
    // @ts-expect-error -- `disabled` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ disabled: true }} />);
    // @ts-expect-error -- `required` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ required: true }} />);
    // @ts-expect-error -- `onFocus` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ onFocus: () => {} }} />);
    // @ts-expect-error -- `onBlur` is set on Autocomplete itself
    void (<Autocomplete InputProps={{ onBlur: () => {} }} />);
  });
});

describe("Autocomplete PopupProps", () => {
  const items = ["apple", "banana"];
  const open = async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox"));
    await user.keyboard("a");
  };

  it("reaches the popup", async () => {
    render(
      <Autocomplete items={items} PopupProps={{ "aria-label": "Fruits" }} />,
    );

    await open();

    expect(
      document.querySelector("[data-slot='autocomplete-popup']"),
    ).toHaveAttribute("aria-label", "Fruits");
  });

  it("lets a top-level color win over one in the slot", async () => {
    render(
      <Autocomplete
        items={items}
        color="blue"
        PopupProps={{ color: "red" } as AutocompletePopupProps}
      />,
    );

    await open();

    const popup = document.querySelector("[data-slot='autocomplete-popup']");
    expect(popup).toHaveClass("palette-blue");
    expect(popup).not.toHaveClass("palette-red");
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects PopupProps the control owns", () => {
    // @ts-expect-error -- `color` is set on Autocomplete itself
    void (<Autocomplete PopupProps={{ color: "blue" }} />);
    // @ts-expect-error -- Autocomplete renders the popup's list itself
    void (<Autocomplete PopupProps={{ children: "Other" }} />);
  });
});

describe("AutocompleteInput FieldProps", () => {
  const items = ["apple", "banana"];

  it("lets the part's own label win over one in FieldProps", () => {
    render(
      <AutocompleteRoot items={items}>
        <AutocompleteInput
          label="Top"
          FieldProps={{ label: "Slot" } as AutocompleteInputProps["FieldProps"]}
        />
      </AutocompleteRoot>,
    );
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.queryByText("Slot")).not.toBeInTheDocument();
  });
});
