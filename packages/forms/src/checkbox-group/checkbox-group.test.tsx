import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Checkbox } from "../checkbox/checkbox";
import { Form } from "../form/form";
import { CheckboxGroup } from "./checkbox-group";
import { CheckboxGroupRoot } from "./subcomponents";

describe("CheckboxGroup", () => {
  const defaultItems = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
  ];

  it("renders checkbox elements", () => {
    render(<CheckboxGroup items={defaultItems} />);
    expect(screen.getAllByRole("checkbox")).toHaveLength(3);
  });

  it("renders labels for each item", () => {
    render(<CheckboxGroup items={defaultItems} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("starts with no items checked by default", () => {
    render(<CheckboxGroup items={defaultItems} />);
    const checkboxes = screen.getAllByRole("checkbox");

    checkboxes.forEach((checkbox) => {
      expect(checkbox).toHaveAttribute("data-unchecked");
    });
  });

  it("supports defaultValue", () => {
    render(<CheckboxGroup items={defaultItems} defaultValue={["a", "c"]} />);
    const checkboxes = screen.getAllByRole("checkbox");

    expect(checkboxes[0]).toHaveAttribute("data-checked");
    expect(checkboxes[1]).toHaveAttribute("data-unchecked");
    expect(checkboxes[2]).toHaveAttribute("data-checked");
  });

  it("can toggle checkboxes by clicking", async () => {
    const user = userEvent.setup();
    render(<CheckboxGroup items={defaultItems} />);

    const checkboxes = screen.getAllByRole("checkbox");

    await user.click(checkboxes[0]);
    expect(checkboxes[0]).toHaveAttribute("data-checked");

    await user.click(checkboxes[1]);
    expect(checkboxes[1]).toHaveAttribute("data-checked");

    await user.click(checkboxes[0]);
    expect(checkboxes[0]).toHaveAttribute("data-unchecked");
  });

  it("supports controlled value", async () => {
    const handleChange = vi.fn();

    const ControlledCheckboxGroup = () => {
      const [value, setValue] = useState<string[]>([]);
      return (
        <CheckboxGroup
          items={defaultItems}
          value={value}
          onValueChange={(v) => {
            setValue(v);
            handleChange(v);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledCheckboxGroup />);

    const checkboxes = screen.getAllByRole("checkbox");
    await user.click(checkboxes[0]);

    expect(handleChange).toHaveBeenCalledWith(["a"]);
  });

  it("supports horizontal direction", () => {
    render(<CheckboxGroup items={defaultItems} direction="horizontal" />);
    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(3);
  });
});

describe("CheckboxGroup per-item label scoping", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("scopes each item's label to its own control", () => {
    render(<CheckboxGroup items={items} />);
    const [first, second] = screen.getAllByRole("checkbox");
    expect(screen.getAllByLabelText("Option A")).toContain(first);
    expect(screen.getAllByLabelText("Option B")).toContain(second);
  });

  it("gives each item its own field row", () => {
    const { container } = render(<CheckboxGroup items={items} />);
    expect(container.querySelectorAll("[data-slot='field-row']").length).toBe(
      2,
    );
  });
});

describe("CheckboxGroup disabled propagation", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C", disabled: true },
  ];

  /* Each box is a native button, so disabled lands on the element itself
     rather than as `aria-disabled` — the same assertion RadioGroup makes. */
  it("disables every checkbox when the group is disabled", () => {
    render(<CheckboxGroup items={items} disabled />);

    for (const box of screen.getAllByRole("checkbox")) {
      expect(box).toBeDisabled();
    }
  });

  it("honours per-item disabled without disabling the rest", () => {
    render(<CheckboxGroup items={items} />);
    const [a, b, c] = screen.getAllByRole("checkbox");

    expect(a).not.toBeDisabled();
    expect(b).not.toBeDisabled();
    expect(c).toBeDisabled();
  });

  it("does not let CheckboxProps clobber a per-item value or label", () => {
    render(
      <CheckboxGroup
        items={items}
        CheckboxProps={{ value: "clobbered", label: "Clobbered" }}
      />,
    );

    const [first] = screen.getAllByRole("checkbox");
    expect(screen.getAllByLabelText("Option A")).toContain(first);
    expect(screen.queryAllByLabelText("Clobbered")).toHaveLength(0);
  });
});

describe("CheckboxGroup compound API", () => {
  it("renders composed children when no items are given", () => {
    render(
      <CheckboxGroup name="fruits" label="Fruits">
        <Checkbox value="apple" label="Apple" />
        <Checkbox value="pear" label="Pear" />
      </CheckboxGroup>,
    );

    const boxes = screen.getAllByRole("checkbox");
    expect(boxes).toHaveLength(2);
    expect(screen.getAllByLabelText("Apple")).toContain(boxes[0]);
    expect(screen.getAllByLabelText("Pear")).toContain(boxes[1]);
  });

  it("matches defaultValue against composed children", () => {
    render(
      <CheckboxGroup name="fruits" defaultValue={["pear"]}>
        <Checkbox value="apple" label="Apple" />
        <Checkbox value="pear" label="Pear" />
      </CheckboxGroup>,
    );

    const [apple, pear] = screen.getAllByRole("checkbox");
    expect(apple).toHaveAttribute("aria-checked", "false");
    expect(pear).toHaveAttribute("aria-checked", "true");
  });

  it("exposes the group root with a data-slot", () => {
    const { container } = render(
      <CheckboxGroupRoot>
        <Checkbox value="apple" label="Apple" />
      </CheckboxGroupRoot>,
    );

    expect(
      container.querySelector("[data-slot='checkbox-group-root']"),
    ).not.toBeNull();
  });
});

describe("CheckboxGroup required is label-only by design", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("marks the label required", () => {
    const { container } = render(
      <CheckboxGroup items={items} label="Pick some" required />,
    );

    expect(
      container.querySelector("[data-slot='field-label'][data-required]"),
    ).not.toBeNull();
  });

  it("does not make every box individually required", () => {
    render(<CheckboxGroup items={items} label="Pick some" required />);

    // Base UI's CheckboxGroup has no `required`, and HTML cannot express
    // "at least one of these". Marking each box required would demand all of
    // them, which is the opposite of what the marker promises.
    for (const box of screen.getAllByRole("checkbox")) {
      expect(box).not.toHaveAttribute("aria-required", "true");
    }
  });
});

describe("CheckboxGroup form errors", () => {
  const items = [
    { value: "email", label: "Email" },
    { value: "sms", label: "SMS" },
  ];

  it("renders a form error once, not once per box", () => {
    const { container } = render(
      <Form errors={{ channels: "Choose at least one channel" }}>
        <CheckboxGroup name="channels" label="Channels" items={items} />
      </Form>,
    );

    const errors = Array.from(
      container.querySelectorAll("[data-slot='field-error']"),
    ).filter((el) => el.textContent?.includes("Choose at least one channel"));

    expect(errors).toHaveLength(1);
  });

  it("still names every box so the group submits", () => {
    const { container } = render(
      <CheckboxGroup name="channels" label="Channels" items={items} />,
    );

    expect(container.querySelectorAll('input[name="channels"]')).toHaveLength(
      2,
    );
  });
});

describe("CheckboxGroup color", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const boxes = () => screen.getAllByRole("checkbox");

  it("dresses every item with the group's hue", () => {
    render(<CheckboxGroup items={items} color="blue" />);

    expect(boxes()).toHaveLength(2);
    for (const box of boxes()) {
      expect(box).toHaveClass("palette-blue");
      expect(box.className).toMatch(/composes-control-fill-color/);
    }
  });

  /* `CheckboxProps` is spread below the group's dressing, so a shared override
     reaches the items. RadioGroup mirrors this. */
  it("lets CheckboxProps override the group's hue", () => {
    render(<CheckboxGroup items={items} CheckboxProps={{ color: "red" }} />);

    for (const box of boxes()) {
      expect(box).toHaveClass("palette-red");
    }
  });

  it("leaves the items on the shade scale with no color", () => {
    render(<CheckboxGroup items={items} />);

    for (const box of boxes()) {
      expect(box.className).not.toMatch(/composes-control-fill-color/);
    }
  });
});

describe("CheckboxGroup size", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const boxes = () => screen.getAllByRole("checkbox");
  const rows = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("[data-slot='field-row']"));

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "carries the %s tier onto every box and its row",
    (size) => {
      const { container } = render(<CheckboxGroup items={items} size={size} />);

      expect(boxes()).toHaveLength(2);
      for (const box of boxes()) {
        expect(box.className).toContain(`size-${size}`);
      }
      for (const row of rows(container)) {
        expect(row.className).toContain(`row-size-${size}`);
      }
    },
  );

  it("falls back to the medium tier", () => {
    render(<CheckboxGroup items={items} />);

    for (const box of boxes()) {
      expect(box.className).toContain("size-medium");
    }
  });

  it("lets CheckboxProps override the group's tier", () => {
    render(
      <CheckboxGroup
        items={items}
        size="small"
        CheckboxProps={{ size: "large" }}
      />,
    );

    for (const box of boxes()) {
      expect(box.className).toContain("size-large");
      expect(box.className).not.toContain("size-small");
    }
  });
});

describe("CheckboxGroup fullwidth", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const root = (container: HTMLElement) =>
    container.querySelector<HTMLElement>("[data-slot='checkbox-group-root']");

  it.each(["vertical", "horizontal"] as const)(
    "stretches a %s group across its container",
    (direction) => {
      const { container } = render(
        <CheckboxGroup items={items} direction={direction} fullwidth />,
      );

      expect(root(container)?.className).toMatch(/toggle-fullwidth/);
    },
  );

  it("shares a horizontal group's width evenly between its rows", () => {
    const { container } = render(
      <CheckboxGroup items={items} direction="horizontal" fullwidth />,
    );

    expect(root(container)?.className).toMatch(/field-rows-evenly/);
  });

  it("stretches each row of a vertical group across it", () => {
    const { container } = render(<CheckboxGroup items={items} fullwidth />);

    expect(root(container)).toHaveStyle({ alignItems: "stretch" });
  });

  /*
   * A labelled field is an `inline-flex` Stack, so without its own `fullwidth`
   * the stretched group inside it could only fill the width of the label.
   */
  it("stretches the field around a labelled group", () => {
    const { container } = render(
      <CheckboxGroup items={items} label="Pick some" fullwidth />,
    );

    expect(
      container.querySelector("[data-slot='field-root']")?.className,
    ).toMatch(/toggle-fullwidth/);
  });

  it("leaves the group sized by its rows without fullwidth", () => {
    const { container } = render(
      <CheckboxGroup items={items} direction="horizontal" />,
    );

    expect(root(container)?.className).not.toMatch(/toggle-fullwidth/);
    expect(root(container)?.className).not.toMatch(/field-rows-evenly/);
  });
});
