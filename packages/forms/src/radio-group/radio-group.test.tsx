import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Radio } from "../radio/radio";
import { RadioGroup } from "./radio-group";
import { RadioGroupRoot } from "./subcomponents";

describe("RadioGroup", () => {
  const defaultItems = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C" },
  ];

  it("renders radio elements", () => {
    render(<RadioGroup items={defaultItems} />);
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("renders labels for each item", () => {
    render(<RadioGroup items={defaultItems} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
    expect(screen.getByText("Option C")).toBeInTheDocument();
  });

  it("renders nothing selected by default", () => {
    render(<RadioGroup items={defaultItems} />);

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("data-unchecked");
    }
  });

  it("supports defaultValue", () => {
    render(<RadioGroup items={defaultItems} defaultValue="b" />);
    const radios = screen.getAllByRole("radio");

    expect(radios[0]).toHaveAttribute("data-unchecked");
    expect(radios[1]).toHaveAttribute("data-checked");
    expect(radios[2]).toHaveAttribute("data-unchecked");
  });

  it("can change selection by clicking", async () => {
    const user = userEvent.setup();
    render(<RadioGroup items={defaultItems} />);

    const radios = screen.getAllByRole("radio");

    await user.click(radios[1]);
    expect(radios[0]).toHaveAttribute("data-unchecked");
    expect(radios[1]).toHaveAttribute("data-checked");

    await user.click(radios[2]);
    expect(radios[1]).toHaveAttribute("data-unchecked");
    expect(radios[2]).toHaveAttribute("data-checked");
  });

  // UPSTREAM BUG (open): passing `value` + `onValueChange` triggers infinite
  // recursion in @base-ui/react's `useStableCallback` trampoline. Uncontrolled
  // usage (no `value` prop) works fine. The same skip exists in
  // radio/radio.test.tsx. Do not un-skip without first confirming the upstream
  // bug is resolved.
  it.skip("supports controlled value", async () => {
    const handleChange = vi.fn();

    const ControlledRadioGroup = () => {
      const [value, setValue] = useState("a");
      return (
        <RadioGroup
          items={defaultItems}
          value={value}
          onValueChange={(v) => {
            setValue(v as string);
            handleChange(v);
          }}
        />
      );
    };

    render(<ControlledRadioGroup />);

    const radios = screen.getAllByRole("radio");
    radios[1].click();

    expect(handleChange).toHaveBeenCalledWith("b");
  });

  it("supports horizontal direction", () => {
    render(<RadioGroup items={defaultItems} direction="horizontal" />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
  });
});

describe("RadioGroup disabled and required forwarding", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
    { value: "c", label: "Option C", disabled: true },
  ];

  it("disables every radio when the group is disabled", () => {
    render(<RadioGroup items={items} disabled />);

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("honours per-item disabled without disabling the rest", () => {
    render(<RadioGroup items={items} />);
    const [a, b, c] = screen.getAllByRole("radio");

    expect(a).not.toBeDisabled();
    expect(b).not.toBeDisabled();
    expect(c).toBeDisabled();
  });

  it("forwards required to the field so the label is marked", () => {
    const { container } = render(
      <RadioGroup items={items} label="Pick one" required />,
    );

    expect(
      container.querySelector("[data-slot='field-label'][data-required]"),
    ).not.toBeNull();
  });
});

describe("RadioGroup compound API", () => {
  it("renders composed children when no items are given", () => {
    render(
      <RadioGroup name="size" label="Size">
        <Radio value="s" label="Small" />
        <Radio value="m" label="Medium" />
      </RadioGroup>,
    );

    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("honours defaultValue against composed children", () => {
    render(
      <RadioGroup name="size" defaultValue="m">
        <Radio value="s" label="Small" />
        <Radio value="m" label="Medium" />
      </RadioGroup>,
    );

    const [small, medium] = screen.getAllByRole("radio");
    expect(small).toHaveAttribute("data-unchecked");
    expect(medium).toHaveAttribute("data-checked");
  });

  it("exposes the group root with a data-slot", () => {
    const { container } = render(
      <RadioGroupRoot>
        <Radio value="s" label="Small" />
      </RadioGroupRoot>,
    );

    expect(
      container.querySelector("[data-slot='radio-group-root']"),
    ).not.toBeNull();
  });
});

describe("RadioGroup required reaches the group", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("marks the radio group required, not just the label", () => {
    const { container } = render(
      <RadioGroup items={items} label="Pick one" required />,
    );

    const group = container.querySelector("[data-slot='radio-group-root']");
    expect(group).toHaveAttribute("aria-required", "true");
  });
});

describe("RadioGroup color", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const rings = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("[data-slot='radio']"));

  it("dresses every item with the group's hue", () => {
    const { container } = render(<RadioGroup items={items} color="blue" />);

    expect(rings(container)).toHaveLength(2);
    for (const ring of rings(container)) {
      expect(ring).toHaveClass("palette-blue");
      expect(ring.className).toMatch(/composes-control-fill-color/);
    }
  });

  /*
   * `RadioProps` is spread below the group's dressing, so a shared override
   * reaches the items. Spread above it, an unset group-level `color` still won
   * and this silently rendered neutral radios — the same shape CheckboxGroup
   * has always had.
   */
  it("lets RadioProps override the group's hue", () => {
    const { container } = render(
      <RadioGroup items={items} RadioProps={{ color: "red" }} />,
    );

    for (const ring of rings(container)) {
      expect(ring).toHaveClass("palette-red");
    }
  });

  it("leaves the items on the shade scale with no color", () => {
    const { container } = render(<RadioGroup items={items} />);

    for (const ring of rings(container)) {
      expect(ring.className).not.toMatch(/composes-control-fill-color/);
    }
  });
});
