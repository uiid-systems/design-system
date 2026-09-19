import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Select } from "./select";
import type { SelectItemProps } from "./select.types";
import { SelectItem } from "./subcomponents";

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
