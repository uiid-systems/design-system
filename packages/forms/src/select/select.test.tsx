import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, it, expect, expectTypeOf, vi } from "vitest";

import { Select } from "./select";
import type { SelectItemProps, SelectProps } from "./select.types";
import { SelectItem } from "./subcomponents";

import inputStyles from "../input/input.module.css";
import styles from "./select.module.css";

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

  it("hands an action to its field's label row", () => {
    const { container } = render(
      <Select
        items={defaultItems}
        label="Choose option"
        action={<button type="button">Reset</button>}
      />,
    );
    const action = container.querySelector("[data-slot='field-action']");
    expect(action).toBeInTheDocument();
    expect(action?.querySelector("button")?.textContent).toBe("Reset");
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

/* Base UI's Root owns the hidden input, the field registration and the
   validation props, and Field dims the label off its own root, so `disabled`
   has to reach both rather than the trigger alone. */
describe("Select hands disabled to Root and Field", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("leaves a disabled select out of form submission", () => {
    const { container } = render(
      <form>
        <Select items={items} name="pick" defaultValue="b" disabled />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).getAll("pick")).toEqual([]);
  });

  it("leaves a disabled multiple select out of form submission", () => {
    const { container } = render(
      <form>
        <Select
          multiple
          items={items}
          name="pick"
          defaultValue={["a", "b"]}
          disabled
        />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).getAll("pick")).toEqual([]);
  });

  it("submits an enabled select's value", () => {
    const { container } = render(
      <form>
        <Select items={items} name="pick" defaultValue="b" />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(new FormData(form).getAll("pick")).toEqual(["b"]);
  });

  it("dims the label and description with a disabled select", () => {
    render(
      <Select items={items} label="Pick" description="One only" disabled />,
    );
    expect(screen.getByText("Pick")).toHaveAttribute("data-disabled");
    expect(screen.getByText("One only")).toHaveAttribute("data-disabled");
  });

  it("leaves the label and description undimmed while enabled", () => {
    render(<Select items={items} label="Pick" description="One only" />);
    expect(screen.getByText("Pick")).not.toHaveAttribute("data-disabled");
    expect(screen.getByText("One only")).not.toHaveAttribute("data-disabled");
  });

  it("makes the trigger inert while disabled", async () => {
    const user = userEvent.setup();
    render(<Select items={items} disabled />);

    const trigger = screen.getByRole("combobox");
    expect(trigger).toBeDisabled();
    expect(trigger).toHaveAttribute("data-disabled");

    await user.click(trigger);

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("keeps a required disabled select out of validation", () => {
    const { container } = render(
      <form>
        <Select
          items={items}
          name="pick"
          placeholder="Pick one"
          required
          disabled
        />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(true);
  });

  it("still validates a required select while enabled", () => {
    const { container } = render(
      <form>
        <Select items={items} name="pick" placeholder="Pick one" required />
      </form>,
    );
    const form = container.querySelector("form") as HTMLFormElement;
    expect(form.checkValidity()).toBe(false);
  });
});

describe("Select disabled items", () => {
  const items: SelectItemProps[] = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B", disabled: true },
  ];

  it("disables only the flagged row in an enabled select", async () => {
    const user = userEvent.setup();
    render(<Select items={items} />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("option", { name: /option b/i })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
    expect(
      screen.getByRole("option", { name: /option a/i }),
    ).not.toHaveAttribute("aria-disabled", "true");
  });

  it("does not select a disabled row", async () => {
    const user = userEvent.setup();
    render(<Select items={items} />);

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option b/i }));

    expect(screen.getByRole("combobox")).toHaveTextContent("Option A");
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

  /* The trigger renders through `Group`, whose Box reset outranks the
     surface's edge, so it takes Input's restated one or its border is zero
     wide — which also hid the invalid edge. */
  it("restates the edge the layout primitive would otherwise zero", () => {
    render(<Select items={items} label="Pick" />);
    expect(screen.getByRole("combobox").className).toMatch(/input-edge/);
  });
});

/*
 * Base UI hands Select.List's render element a `base-ui-disable-scrollbar`
 * class. List used to let that replace its own `.list`, so the `marker="none"`
 * rule stopped matching and every option drew a disc bullet — visible once
 * `alignItemWithTrigger: false` drops the overflow that had clipped them.
 */
describe("Select list markers", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("keeps List's own class alongside the one Base UI passes", async () => {
    const user = userEvent.setup();
    render(
      <Select
        multiple
        items={items}
        PositionerProps={{ alignItemWithTrigger: false }}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    const list = document.querySelector("[data-slot='select-list']");
    expect(list).toHaveAttribute("data-marker", "none");
    expect(list?.className).toMatch(/(^|\s)_list_/);
  });
});

describe("Select color", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("tints the trigger with the palette hue", () => {
    render(<Select items={items} label="Pick" color="blue" />);

    const trigger = screen.getByRole("combobox");

    expect(trigger).toHaveClass("palette-blue");
    expect(trigger.className).toMatch(/composes-field-surface-color/);
  });

  it("leaves the trigger on the plain surface with no color", () => {
    render(<Select items={items} label="Pick" />);

    expect(screen.getByRole("combobox").className).not.toMatch(
      /composes-field-surface-color/,
    );
  });

  /*
   * The popup is portalled out of the trigger's subtree, so no class on the
   * trigger can reach it — the hue has to arrive as a prop.
   */
  it("tints the popup with the same hue", async () => {
    const user = userEvent.setup();
    render(<Select items={items} label="Pick" color="blue" />);

    await user.click(screen.getByRole("combobox"));

    expect(document.querySelector("[data-slot='select-popup']")).toHaveClass(
      "palette-blue",
    );
  });

  /* Card is always a palette hue; an unset `color` must land on its default. */
  it("leaves the popup on Card's neutral hue with no color", async () => {
    const user = userEvent.setup();
    render(<Select items={items} label="Pick" />);

    await user.click(screen.getByRole("combobox"));

    expect(document.querySelector("[data-slot='select-popup']")).toHaveClass(
      "palette-neutral",
    );
  });
});

/*
 * A row can draw an element instead of the `icon` / `label` / `description`
 * block. `label` keeps its other two jobs — the trigger's text and the
 * typeahead key — which is why it stays a required string rather than widening
 * to a node.
 */
describe("Select item children", () => {
  const items: SelectItemProps[] = [
    {
      value: "a",
      label: "Option A",
      children: <span data-testid="custom-row">Drawn by children</span>,
    },
    { value: "b", label: "Option B" },
  ];

  it("draws the node inside the row", async () => {
    const user = userEvent.setup();
    render(<Select items={items} placeholder="Pick one" />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByTestId("custom-row")).toBeInTheDocument();
  });

  /* The popup lays the indicator out against the row wrapper as a direct
     child, so children must go through it rather than replace it. */
  it("keeps the row wrapper the indicator is laid out against", async () => {
    const user = userEvent.setup();
    render(<Select items={items} placeholder="Pick one" />);

    await user.click(screen.getByRole("combobox"));

    const row = screen
      .getByTestId("custom-row")
      .closest("[data-slot='list-item']");

    expect(row?.parentElement).toHaveAttribute("data-slot", "select-item");
  });

  it("shows the item's label in the trigger, not the node", async () => {
    const user = userEvent.setup();
    render(<Select items={items} placeholder="Pick one" />);

    await user.click(screen.getByRole("combobox"));
    await user.click(
      screen.getByRole("option", { name: /drawn by children/i }),
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Option A");
    expect(trigger).not.toHaveTextContent("Drawn by children");
  });

  it("leaves rows without children on the default label block", async () => {
    const user = userEvent.setup();
    render(<Select items={items} placeholder="Pick one" />);

    await user.click(screen.getByRole("combobox"));

    expect(
      screen.getByRole("option", { name: /option b/i }),
    ).toBeInTheDocument();
  });

  it("renders children passed to a composed SelectItem", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Pick one">
        <SelectItem value="a" label="Option A">
          <span data-testid="composed-row">Drawn by children</span>
        </SelectItem>
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByTestId("composed-row")).toBeInTheDocument();
  });
});

/*
 * Base UI resolves the trigger's text from Root's `items` alone, so a select
 * composed from `SelectItem` children used to fall through to the raw value.
 * The labels are right there on the children; Select reads them off.
 */
describe("Select composed label resolution", () => {
  /* Shaped like a `SelectItem` and claiming the same value, to prove the walk
     stops at the row rather than descending into what the row draws. */
  const Decoy = ({ label }: { value: string; label: string }) => (
    <span>{label}</span>
  );

  it("shows the child's label in the trigger, not the raw value", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Pick one">
        <SelectItem value="sans" label="Sans-serif" />
        <SelectItem value="mono" label="Monospace" />
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /monospace/i }));

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Monospace");
    expect(trigger).not.toHaveTextContent("mono,");
  });

  /* Children arrive wrapped in fragments as often as not. */
  it("reads labels through a fragment", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Pick one">
        <>
          <SelectItem value="sans" label="Sans-serif" />
          <SelectItem value="mono" label="Monospace" />
        </>
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /monospace/i }));

    expect(screen.getByRole("combobox")).toHaveTextContent("Monospace");
  });

  it("joins resolved labels in multiple mode", async () => {
    const user = userEvent.setup();
    render(
      <Select multiple placeholder="Pick some">
        <SelectItem value="sans" label="Sans-serif" />
        <SelectItem value="mono" label="Monospace" />
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /sans-serif/i }));
    await user.click(screen.getByRole("option", { name: /monospace/i }));

    expect(screen.getByRole("combobox")).toHaveTextContent(
      "Sans-serif, Monospace",
    );
  });

  /* A custom row's own markup must not be mistaken for an item. */
  it("ignores value/label props inside a row's children", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Pick one">
        <SelectItem value="sans" label="Sans-serif">
          <Decoy value="sans" label="Decoy" />
        </SelectItem>
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /decoy/i }));

    expect(screen.getByRole("combobox")).toHaveTextContent("Sans-serif");
    expect(screen.getByRole("combobox")).not.toHaveTextContent("Decoy");
  });

  it("still opens empty rather than preselecting the first child", () => {
    render(
      <Select placeholder="Pick one">
        <SelectItem value="sans" label="Sans-serif" />
      </Select>,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Pick one");
  });
});

describe("Select item description", () => {
  it("accepts a node, not just a string", async () => {
    const user = userEvent.setup();
    const items: SelectItemProps[] = [
      {
        value: "a",
        label: "Option A",
        description: <em data-testid="node-description">Rendered</em>,
      },
    ];

    render(<Select items={items} placeholder="Pick one" />);

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByTestId("node-description")).toBeInTheDocument();
  });
});

describe("Select DOM attributes reach the trigger", () => {
  const defaultItems = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("names the trigger from a top-level aria-label", () => {
    render(<Select items={defaultItems} aria-label="Die 1" />);
    expect(screen.getByRole("combobox")).toHaveAccessibleName("Die 1");
  });

  it("tells two selects under one shared label apart", () => {
    render(
      <>
        <Select items={defaultItems} aria-label="Die 1" />
        <Select items={defaultItems} aria-label="Die 2" />
      </>,
    );

    const [first, second] = screen.getAllByRole("combobox");
    expect(first).toHaveAccessibleName("Die 1");
    expect(second).toHaveAccessibleName("Die 2");
  });

  it("puts a data-* hook on the trigger", () => {
    render(<Select items={defaultItems} data-testid="die-1" />);
    expect(screen.getByTestId("die-1")).toHaveAttribute(
      "data-slot",
      "select-trigger",
    );
  });

  it("lets TriggerProps win over a top-level attribute", () => {
    render(
      <Select
        items={defaultItems}
        aria-label="Outer"
        TriggerProps={{ "aria-label": "Inner" }}
      />,
    );
    expect(screen.getByRole("combobox")).toHaveAccessibleName("Inner");
  });

  it("still routes Root's own props to Root", () => {
    render(<Select items={defaultItems} defaultValue="b" aria-label="Die 1" />);
    expect(screen.getByText("Option B")).toBeInTheDocument();
  });
});

describe("Select backdrop", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("renders no backdrop while closed", () => {
    render(<Select items={items} />);
    expect(
      document.querySelector('[data-slot="select-backdrop"]'),
    ).not.toBeInTheDocument();
  });

  it("dims the page by default when opened", async () => {
    const user = userEvent.setup();
    render(<Select items={items} />);

    await user.click(screen.getByRole("combobox"));

    expect(
      document.querySelector('[data-slot="select-backdrop"]'),
    ).toBeInTheDocument();
  });

  it("omits the backdrop when opted out", async () => {
    const user = userEvent.setup();
    render(<Select items={items} backdrop={false} />);

    await user.click(screen.getByRole("combobox"));

    // The popup still opens — only the dimming is gone.
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="select-backdrop"]'),
    ).not.toBeInTheDocument();
  });

  it("forwards BackdropProps to the backdrop element", async () => {
    const user = userEvent.setup();
    render(
      <Select
        items={items}
        BackdropProps={{ "data-testid": "dim" } as never}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByTestId("dim")).toHaveAttribute(
      "data-slot",
      "select-backdrop",
    );
  });
});

describe("Select popup layout props", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const popup = () =>
    document.querySelector<HTMLElement>("[data-slot='select-popup']");

  it("keeps the popup's rows flush by default", async () => {
    const user = userEvent.setup();
    render(<Select items={items} label="Pick" />);

    await user.click(screen.getByRole("combobox"));

    expect(popup()).toHaveAttribute("data-ui-gap", "0");
    expect(popup()).toHaveAttribute("data-ui-fullwidth");
  });

  /*
   * Base UI merges the render element's own props over the part's, so a
   * default written as a literal on the `Card` would beat these.
   */
  it("forwards layout props from PopupProps to the popup Card", async () => {
    const user = userEvent.setup();
    render(
      <Select
        items={items}
        label="Pick"
        PopupProps={{ gap: 2, fullwidth: false }}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    expect(popup()).toHaveAttribute("data-ui-gap", "2");
    expect(popup()).not.toHaveAttribute("data-ui-fullwidth");
  });
});

/*
 * Base UI accepts `className` as a function of the part's state. Merging it
 * with `cx` dropped the function, so the caller's class never reached the DOM;
 * each part must resolve it with real state and keep its own class beside it.
 */
describe("Select state-function className", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("resolves a state-function className on the trigger alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Select
        items={items}
        TriggerProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );

    const trigger = document.querySelector("[data-slot='select-trigger']");
    expect(trigger).toHaveClass("fn-closed", inputStyles["input"]);

    await user.click(screen.getByRole("combobox"));
    expect(trigger).toHaveClass("fn-open", inputStyles["input"]);
  });

  it("resolves a state-function className on the value alongside its own class", () => {
    render(
      <Select
        items={items}
        placeholder="Pick one"
        ValueProps={{
          className: (state) =>
            state.placeholder ? "fn-placeholder" : "fn-value",
        }}
      />,
    );

    const value = document.querySelector("[data-slot='select-value']");
    expect(value).toHaveClass("fn-placeholder", styles["select-value"]);
  });

  it("resolves a state-function className on the icon alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Select
        items={items}
        IconProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    const icon = document.querySelector("[data-slot='select-icon']");
    expect(icon).toHaveClass("fn-open", styles["select-icon"]);
  });

  it("resolves a state-function className on the positioner alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Select
        items={items}
        PositionerProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    const positioner = document.querySelector(
      "[data-slot='select-positioner']",
    );
    expect(positioner).toHaveClass("fn-open", styles["select-positioner"]);
  });

  it("resolves a state-function className on the popup alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Select
        items={items}
        PopupProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    const popup = document.querySelector("[data-slot='select-popup']");
    expect(popup).toHaveClass("fn-open", styles["select-popup"]);
  });

  it("resolves a state-function className on the backdrop alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Select
        items={items}
        BackdropProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    const backdrop = document.querySelector("[data-slot='select-backdrop']");
    expect(backdrop).toHaveClass("fn-open", styles["select-backdrop"]);
  });
});

/*
 * Base UI's `itemToStringLabel` formats the trigger's text from the value and
 * wins over the item labels. The trigger used to format its own text from a
 * label map, so the prop reached Root but never the trigger.
 */
describe("Select itemToStringLabel", () => {
  const items: SelectItemProps[] = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];
  const itemToStringLabel = (value: string) => `Code ${value.toUpperCase()}`;

  it("formats the trigger's text from the value", () => {
    render(
      <Select
        items={items}
        defaultValue="a"
        itemToStringLabel={itemToStringLabel}
      />,
    );

    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveTextContent("Code A");
    expect(trigger).not.toHaveTextContent("Option A");
  });

  it("formats each value of a multiple selection", () => {
    render(
      <Select
        multiple
        items={items}
        defaultValue={["a", "b"]}
        itemToStringLabel={itemToStringLabel}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Code A, Code B");
  });

  it("formats a composed select's trigger too", () => {
    render(
      <Select
        placeholder="Pick one"
        defaultValue="b"
        itemToStringLabel={itemToStringLabel}
      >
        <SelectItem value="a" label="Option A" />
        <SelectItem value="b" label="Option B" />
      </Select>,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Code B");
  });

  it("leaves the rows on their own labels", async () => {
    const user = userEvent.setup();
    render(
      <Select
        items={items}
        placeholder="Pick one"
        itemToStringLabel={itemToStringLabel}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    expect(
      screen.getByRole("option", { name: /option a/i }),
    ).toBeInTheDocument();
  });

  it("still shows the placeholder with nothing selected", () => {
    render(
      <Select
        items={items}
        placeholder="Pick one"
        itemToStringLabel={itemToStringLabel}
      />,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Pick one");
  });
});

/*
 * `SelectItem` used to take only `value`/`label`/`disabled` plus its own
 * additions, so Base UI's Item props were rejected or dropped, and `value` was
 * a string whatever `Select`'s `Value` was.
 */
describe("SelectItem mirrors Base UI's Item", () => {
  it("merges a className with its own", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Pick one">
        <SelectItem value="a" label="Option A" className="custom" />
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));

    const option = screen.getByRole("option", { name: /option a/i });
    expect(option).toHaveClass("custom");
    expect(option).toHaveClass(styles["select-item"]);
  });

  it("resolves a state-function className", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Pick one">
        <SelectItem
          value="a"
          label="Option A"
          className={(state) => (state.disabled ? "off" : "on")}
        />
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));

    const option = screen.getByRole("option", { name: /option a/i });
    expect(option).toHaveClass("on");
    expect(option).toHaveClass(styles["select-item"]);
  });

  it("forwards a ref to the item element", async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLDivElement>();
    render(
      <Select placeholder="Pick one">
        <SelectItem value="a" label="Option A" ref={ref} />
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));

    expect(ref.current).toBe(screen.getByRole("option", { name: /option a/i }));
  });

  it("calls an onClick handler", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Select placeholder="Pick one">
        <SelectItem value="a" label="Option A" onClick={onClick} />
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /option a/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("passes data attributes through", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Pick one">
        <SelectItem value="a" label="Option A" data-testid="row-a" />
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByTestId("row-a")).toHaveAttribute(
      "data-slot",
      "select-item",
    );
  });

  it("forwards Base UI props set on an items entry", async () => {
    const user = userEvent.setup();
    render(
      <Select
        placeholder="Pick one"
        items={[{ value: "a", label: "Option A", className: "from-items" }]}
      />,
    );

    await user.click(screen.getByRole("combobox"));

    expect(screen.getByRole("option", { name: /option a/i })).toHaveClass(
      "from-items",
    );
  });
});

describe("Select with a non-string Value", () => {
  const items: SelectItemProps<number>[] = [
    { value: 1, label: "One" },
    { value: 2, label: "Two" },
  ];

  it("selects a number and reports it unchanged", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Select<number>
        items={items}
        placeholder="Pick one"
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /two/i }));

    expect(onValueChange).toHaveBeenCalledWith(2, expect.anything());
    expect(screen.getByRole("combobox")).toHaveTextContent("Two");
  });

  it("resolves the trigger's label from a composed number item", () => {
    render(
      <Select<number> defaultValue={2}>
        <SelectItem value={1} label="One" />
        <SelectItem value={2} label="Two" />
      </Select>,
    );

    expect(screen.getByRole("combobox")).toHaveTextContent("Two");
  });

  it("selects an object value", async () => {
    type Currency = { code: string };
    const usd: Currency = { code: "USD" };
    const eur: Currency = { code: "EUR" };
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(
      <Select<Currency>
        placeholder="Pick one"
        items={[
          { value: usd, label: "US Dollar" },
          { value: eur, label: "Euro" },
        ]}
        onValueChange={onValueChange}
      />,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: /euro/i }));

    expect(onValueChange).toHaveBeenCalledWith(eur, expect.anything());
  });

  it("types items and SelectItem by the select's Value", () => {
    expectTypeOf<SelectProps<number>["items"]>().toEqualTypeOf<
      SelectItemProps<number>[] | undefined
    >();
    expectTypeOf<SelectItemProps<number>["value"]>().toEqualTypeOf<number>();
    expectTypeOf<SelectItemProps["value"]>().toEqualTypeOf<string>();

    // @ts-expect-error a string value is not a `Select<number>` item
    const wrong: SelectProps<number>["items"] = [{ value: "1", label: "One" }];
    void wrong;
  });
});
