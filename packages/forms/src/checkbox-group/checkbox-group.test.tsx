import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Checkbox } from "../checkbox/checkbox";
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

  it("disables every checkbox when the group is disabled", () => {
    render(<CheckboxGroup items={items} disabled />);

    for (const box of screen.getAllByRole("checkbox")) {
      expect(box).toHaveAttribute("aria-disabled", "true");
    }
  });

  it("honours per-item disabled without disabling the rest", () => {
    render(<CheckboxGroup items={items} />);
    const [a, b, c] = screen.getAllByRole("checkbox");

    expect(a).not.toHaveAttribute("aria-disabled", "true");
    expect(b).not.toHaveAttribute("aria-disabled", "true");
    expect(c).toHaveAttribute("aria-disabled", "true");
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
