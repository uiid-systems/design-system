import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Radio } from "../radio/radio";
import type { RadioProps } from "../radio/radio.types";
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

  // Skipped from Base UI 1.2 for an upstream recursion in `useStableCallback`
  // when `value` and `onValueChange` were both passed. It passes on 1.9.0.
  // Composed parts are covered in radio/radio.test.tsx.
  it("follows the controlled value rather than its own clicks", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    // The parent records each request but only changes value from outside.
    const ControlledRadioGroup = () => {
      const [value, setValue] = useState("a");
      return (
        <>
          <button onClick={() => setValue("c")}>Pick C</button>
          <RadioGroup
            items={defaultItems}
            value={value}
            onValueChange={handleChange}
          />
        </>
      );
    };

    render(<ControlledRadioGroup />);

    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("data-checked");

    await user.click(radios[1]);

    expect(handleChange).toHaveBeenCalledWith("b", expect.anything());
    expect(radios[0]).toHaveAttribute("data-checked");
    expect(radios[1]).toHaveAttribute("data-unchecked");

    await user.click(screen.getByRole("button", { name: "Pick C" }));

    expect(radios[0]).toHaveAttribute("data-unchecked");
    expect(radios[2]).toHaveAttribute("data-checked");
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

  /* `RadioProps` spreads first and the group's dressing after, so the group's
     hue wins. The cast stands in for untyped code, which the slot type cannot
     stop. CheckboxGroup mirrors this. */
  it("lets the group's hue win over one in RadioProps", () => {
    const { container } = render(
      <RadioGroup
        items={items}
        color="blue"
        RadioProps={{ color: "red" } as Partial<RadioProps>}
      />,
    );

    for (const ring of rings(container)) {
      expect(ring).toHaveClass("palette-blue");
      expect(ring).not.toHaveClass("palette-red");
    }
  });

  /* An unset group hue is left out rather than spread as `undefined`, which
     once rendered these radios neutral. */
  it("keeps a hue in RadioProps when the group sets none", () => {
    const { container } = render(
      <RadioGroup
        items={items}
        RadioProps={{ color: "red" } as Partial<RadioProps>}
      />,
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

  /* The cast stands in for untyped code, which the slot type cannot stop. */
  it("lets the group's tier win over one in RadioProps", () => {
    const { container } = render(
      <RadioGroup
        items={items}
        size="small"
        RadioProps={{ size: "large" } as Partial<RadioProps>}
      />,
    );

    for (const ring of rings(container)) {
      expect(ring.className).toContain("size-small");
      expect(ring.className).not.toContain("size-large");
    }
  });
});

describe("RadioGroup w", () => {
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
        <RadioGroup items={items} orientation={orientation} w="full" />,
      );

      expect(root(container)).toHaveAttribute("data-ui-w", "full");
    },
  );

  it("shares a horizontal group's width evenly between its rows", () => {
    const { container } = render(
      <RadioGroup items={items} orientation="horizontal" w="full" />,
    );

    expect(root(container)?.className).toMatch(/field-rows-evenly/);
  });

  it("keeps a horizontal group's rows at their own width at a set w", () => {
    const { container } = render(
      <RadioGroup items={items} orientation="horizontal" w={300} />,
    );

    expect(root(container)).toHaveAttribute("data-ui-w", "300");
    expect(root(container)?.className).not.toMatch(/field-rows-evenly/);
  });

  it("stretches each row of a vertical group across it", () => {
    const { container } = render(<RadioGroup items={items} w="full" />);

    expect(root(container)).toHaveStyle({ alignItems: "stretch" });
    expect(root(container)).not.toHaveAttribute("data-ui-ay");
  });

  /*
   * A labelled field is an `inline-flex` Stack, so without its own `w`
   * the stretched group inside it could only fill the width of the label.
   */
  it("stretches the field around a labelled group", () => {
    const { container } = render(
      <RadioGroup items={items} label="Pick one" w="full" />,
    );

    expect(container.querySelector("[data-slot='field-root']")).toHaveAttribute(
      "data-ui-w",
      "full",
    );
  });

  it("leaves the group sized by its rows without w", () => {
    const { container } = render(
      <RadioGroup items={items} orientation="horizontal" />,
    );

    expect(root(container)).not.toHaveAttribute("data-ui-w");
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
      expect(root(container)).toHaveAttribute("data-ui-gap", "2");
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
      expect(root(container)).toHaveAttribute("data-ui-gap", "4");
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

describe("RadioGroup FieldProps", () => {
  it("reaches the field around it", () => {
    const { container } = render(
      <RadioGroup FieldProps={{ className: "outer", mt: 2 }} />,
    );
    const field = container.querySelector("[data-slot='field-root']");
    expect(field).toHaveClass("outer");
    expect(field).toHaveAttribute("data-ui-mt", "2");
  });

  /* The cast stands in for untyped code, which the slot type cannot stop. */
  it("lets a top-level label win over one in the slot", () => {
    render(<RadioGroup label="Top" FieldProps={{ label: "Slot" } as never} />);
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.queryByText("Slot")).not.toBeInTheDocument();
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects FieldProps the control owns", () => {
    void (
      <RadioGroup
        // @ts-expect-error -- `label` is set on RadioGroup itself
        FieldProps={{ label: "Other" }}
      />
    );
    void (
      <RadioGroup
        // @ts-expect-error -- `children` is set on RadioGroup itself
        FieldProps={{ children: "Other" }}
      />
    );
    void (
      <RadioGroup
        // @ts-expect-error -- `name` is set on RadioGroup itself
        FieldProps={{ name: "other" }}
      />
    );
    void (
      <RadioGroup
        // @ts-expect-error -- `required` is set on RadioGroup itself
        FieldProps={{ required: true }}
      />
    );
    void (
      <RadioGroup
        // @ts-expect-error -- `disabled` is set on RadioGroup itself
        FieldProps={{ disabled: true }}
      />
    );
    void (
      <RadioGroup
        // @ts-expect-error -- `w` is set on RadioGroup itself
        FieldProps={{ w: "full" }}
      />
    );
    void (
      <RadioGroup
        // @ts-expect-error -- `size` is set on RadioGroup itself
        FieldProps={{ size: "small" }}
      />
    );
  });
});

/* The precedence tests for this slot sit with the hue and the tier above. */
describe("RadioGroup RadioProps", () => {
  const items = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("reaches every radio", () => {
    render(
      <RadioGroup
        items={items}
        RadioProps={{ className: "caller", "aria-describedby": "hint" }}
      />,
    );

    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveClass("caller");
      expect(radio).toHaveAttribute("aria-describedby", "hint");
    }
  });

  it("does not let RadioProps clobber a per-item value or label", () => {
    render(
      <RadioGroup
        items={items}
        RadioProps={
          { value: "clobbered", label: "Clobbered" } as Partial<RadioProps>
        }
      />,
    );

    const [first] = screen.getAllByRole("radio");
    expect(screen.getAllByLabelText("Option A")).toContain(first);
    expect(screen.queryAllByLabelText("Clobbered")).toHaveLength(0);
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects RadioProps the control owns", () => {
    // @ts-expect-error -- `hideIndicator` is set from `hideIndicators`
    void (<RadioGroup RadioProps={{ hideIndicator: true }} />);
    // @ts-expect-error -- `size` is set on RadioGroup itself
    void (<RadioGroup RadioProps={{ size: "small" }} />);
    // @ts-expect-error -- `bordered` is set on RadioGroup itself
    void (<RadioGroup RadioProps={{ bordered: true }} />);
    // @ts-expect-error -- `reversed` is set on RadioGroup itself
    void (<RadioGroup RadioProps={{ reversed: true }} />);
    // @ts-expect-error -- `color` is set on RadioGroup itself
    void (<RadioGroup RadioProps={{ color: "blue" }} />);
    // @ts-expect-error -- `IndicatorProps` is set on RadioGroup itself
    void (<RadioGroup RadioProps={{ IndicatorProps: {} }} />);
    // @ts-expect-error -- `value` comes from each of `items`
    void (<RadioGroup RadioProps={{ value: "other" }} />);
    // @ts-expect-error -- `label` comes from each of `items`
    void (<RadioGroup RadioProps={{ label: "Other" }} />);
    // @ts-expect-error -- `disabled` is set on RadioGroup and each of `items`
    void (<RadioGroup RadioProps={{ disabled: true }} />);
  });
});
