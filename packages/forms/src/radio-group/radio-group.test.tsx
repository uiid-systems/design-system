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

  it("supports horizontal orientation", () => {
    render(<RadioGroup items={defaultItems} orientation="horizontal" />);
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

describe("RadioGroup size", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const rings = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("[data-slot='radio']"));
  const rows = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("[data-slot='field-row']"));

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "carries the %s tier onto every radio and its row",
    (size) => {
      const { container } = render(<RadioGroup items={items} size={size} />);

      expect(rings(container)).toHaveLength(2);
      for (const ring of rings(container)) {
        expect(ring.className).toContain(`size-${size}`);
      }
      for (const row of rows(container)) {
        expect(row.className).toContain(`row-size-${size}`);
      }
    },
  );

  it("falls back to the medium tier", () => {
    const { container } = render(<RadioGroup items={items} />);

    for (const ring of rings(container)) {
      expect(ring.className).toContain("size-medium");
    }
  });

  it("lets RadioProps override the group's tier", () => {
    const { container } = render(
      <RadioGroup items={items} size="small" RadioProps={{ size: "large" }} />,
    );

    for (const ring of rings(container)) {
      expect(ring.className).toContain("size-large");
      expect(ring.className).not.toContain("size-small");
    }
  });
});

describe("RadioGroup fullwidth", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const root = (container: HTMLElement) =>
    container.querySelector<HTMLElement>("[data-slot='radio-group-root']");

  it.each(["vertical", "horizontal"] as const)(
    "stretches a %s group across its container",
    (orientation) => {
      const { container } = render(
        <RadioGroup items={items} orientation={orientation} fullwidth />,
      );

      expect(root(container)?.className).toMatch(/toggle-fullwidth/);
    },
  );

  it("shares a horizontal group's width evenly between its rows", () => {
    const { container } = render(
      <RadioGroup items={items} orientation="horizontal" fullwidth />,
    );

    expect(root(container)?.className).toMatch(/field-rows-evenly/);
  });

  it("stretches each row of a vertical group across it", () => {
    const { container } = render(<RadioGroup items={items} fullwidth />);

    expect(root(container)).toHaveStyle({ alignItems: "stretch" });
  });

  /*
   * A labelled field is an `inline-flex` Stack, so without its own `fullwidth`
   * the stretched group inside it could only fill the width of the label.
   */
  it("stretches the field around a labelled group", () => {
    const { container } = render(
      <RadioGroup items={items} label="Pick one" fullwidth />,
    );

    expect(
      container.querySelector("[data-slot='field-root']")?.className,
    ).toMatch(/toggle-fullwidth/);
  });

  it("leaves the group sized by its rows without fullwidth", () => {
    const { container } = render(
      <RadioGroup items={items} orientation="horizontal" />,
    );

    expect(root(container)?.className).not.toMatch(/toggle-fullwidth/);
    expect(root(container)?.className).not.toMatch(/field-rows-evenly/);
  });
});

describe("RadioGroup layout props", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  const root = (container: HTMLElement) =>
    container.querySelector<HTMLElement>("[data-slot='radio-group-root']");

  it.each(["vertical", "horizontal"] as const)(
    "keeps a %s group's own gap by default",
    (orientation) => {
      const { container } = render(
        <RadioGroup items={items} orientation={orientation} />,
      );
      expect(root(container)?.style.gap).toBe("calc(2 * var(--spacing-unit))");
    },
  );

  /*
   * The group always accepted `gap`, but the root wrote its own as a literal
   * on the `Group` or `Stack`, and Base UI merges the render element's props
   * over the part's, so the caller's was dropped.
   */
  it.each(["vertical", "horizontal"] as const)(
    "forwards a caller's gap to a %s group's root",
    (orientation) => {
      const { container } = render(
        <RadioGroup items={items} orientation={orientation} gap={4} />,
      );
      expect(root(container)?.style.gap).toBe("calc(4 * var(--spacing-unit))");
    },
  );

  it("accepts Base UI's state-function className on the root", () => {
    const { container } = render(
      <RadioGroupRoot className={(state) => `disabled-${state.disabled}`}>
        <span />
      </RadioGroupRoot>,
    );
    expect(root(container)).toHaveClass("disabled-false");
  });
});
