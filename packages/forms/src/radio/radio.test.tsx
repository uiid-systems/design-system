import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { RadioGroup } from "../radio-group/radio-group";
import { RadioGroupRoot } from "../radio-group/subcomponents";
import { Radio } from "./radio";
import type { RadioProps } from "./radio.types";

import checkboxStyles from "../checkbox/checkbox.module.css";
import fieldStyles from "../field/field.module.css";
import styles from "./radio.module.css";

describe("Radio", () => {
  const defaultItems = [
    { value: "a", label: "Option A" },
    { value: "b", label: "Option B" },
  ];

  it("renders radio elements within a group", () => {
    render(<RadioGroup items={defaultItems} />);
    expect(screen.getAllByRole("radio")).toHaveLength(2);
  });

  it("renders with data-slot attribute", () => {
    render(<RadioGroup items={[{ value: "a", label: "Option A" }]} />);
    expect(screen.getByRole("radio")).toHaveAttribute("data-slot", "radio");
  });

  it("renders with labels", () => {
    render(<RadioGroup items={defaultItems} />);
    expect(screen.getByText("Option A")).toBeInTheDocument();
    expect(screen.getByText("Option B")).toBeInTheDocument();
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
  });

  it("can change selection by clicking", async () => {
    const user = userEvent.setup();
    render(<RadioGroup items={defaultItems} />);

    const radios = screen.getAllByRole("radio");
    await user.click(radios[0]);
    expect(radios[0]).toHaveAttribute("data-checked");
    expect(radios[1]).toHaveAttribute("data-unchecked");

    await user.click(radios[1]);
    expect(radios[0]).toHaveAttribute("data-unchecked");
    expect(radios[1]).toHaveAttribute("data-checked");
  });

  // Skipped from Base UI 1.2 for an upstream recursion in `useStableCallback`
  // when `value` and `onValueChange` were both passed. It passes on 1.9.0. The
  // RadioGroup monolith has its own controlled test.
  it("keeps composed radios on a controlled value the parent does not change", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <RadioGroupRoot value="a" onValueChange={handleChange}>
        <Radio value="a" label="Option A" />
        <Radio value="b" label="Option B" />
      </RadioGroupRoot>,
    );

    const radios = screen.getAllByRole("radio");
    expect(radios[0]).toHaveAttribute("data-checked");

    await user.click(radios[1]);

    expect(handleChange).toHaveBeenCalledWith("b", expect.anything());
    expect(radios[0]).toHaveAttribute("data-checked");
    expect(radios[1]).toHaveAttribute("data-unchecked");
  });

  it("supports horizontal orientation", () => {
    render(<RadioGroup items={defaultItems} orientation="horizontal" />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(2);
  });
});

describe("Radio field row", () => {
  it("builds its row on the shared field row rather than CheckboxField", () => {
    const { container } = render(
      <RadioGroup
        items={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />,
    );
    expect(container.querySelectorAll("[data-slot='field-row']").length).toBe(
      2,
    );
  });

  it("scopes each label to its own radio", () => {
    render(
      <RadioGroup
        items={[
          { value: "a", label: "Option A" },
          { value: "b", label: "Option B" },
        ]}
      />,
    );
    expect(screen.getByLabelText("Option A")).not.toBe(
      screen.getByLabelText("Option B"),
    );
  });
});

describe("Radio surface", () => {
  /* The unchecked ring paints the same fill, hover and focus ring as Input and
     Select's trigger, rather than a private copy of them. */
  it("wears the shared field surface, matching Input", () => {
    const { container } = render(
      <RadioGroupRoot>
        <Radio value="a" label="Option A" />
      </RadioGroupRoot>,
    );
    expect(container.querySelector("[data-slot='radio']")?.className).toMatch(
      /composes-field-surface(\s|$)/,
    );
  });
});

describe("Radio size variant", () => {
  const radioClassName = (container: HTMLElement) =>
    container.querySelector("[data-slot='radio']")?.className ?? "";

  const renderRadio = (props: React.ComponentProps<typeof Radio>) =>
    render(
      <RadioGroupRoot defaultValue="a">
        <Radio {...props} />
      </RadioGroupRoot>,
    );

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the %s control tier on the root",
    (size) => {
      const { container } = renderRadio({ value: "a", size });
      expect(radioClassName(container)).toContain(`size-${size}`);
    },
  );

  it("falls back to the medium tier, matching Input", () => {
    const { container } = renderRadio({ value: "a" });
    expect(radioClassName(container)).toContain("size-medium");
  });

  it("applies one tier at a time", () => {
    const { container } = renderRadio({ value: "a", size: "large" });
    expect(radioClassName(container)).not.toContain("size-small");
    expect(radioClassName(container)).not.toContain("size-medium");
  });

  /* The box scales with Checkbox's tier class, but the indicator dot is
     Radio's own, so both have to land. The assertions above match either one
     by substring and would still pass if Radio's dropped off. */
  it.each(["xsmall", "small", "medium", "large"] as const)(
    "pairs the shared %s box tier with Radio's own dot tier",
    (size) => {
      const { container } = renderRadio({ value: "a", size });
      const className = radioClassName(container);

      expect(className).toContain(checkboxStyles[`size-${size}`]);
      expect(className).toContain(styles[`size-${size}`]);
      expect(checkboxStyles[`size-${size}`]).not.toBe(styles[`size-${size}`]);
    },
  );
});

describe("Radio color", () => {
  const ringClassName = (container: HTMLElement) =>
    container.querySelector("[data-slot='radio']")?.className ?? "";

  it("carries the palette hue and the fill treatment on the ring", () => {
    const { container } = render(
      <RadioGroupRoot defaultValue="on">
        <Radio value="on" color="blue" label="On" />
      </RadioGroupRoot>,
    );

    expect(container.querySelector("[data-slot='radio']")).toHaveClass(
      "palette-blue",
    );
    expect(ringClassName(container)).toMatch(/composes-control-fill-color/);
  });

  it("leaves the ring on the shade scale with no color", () => {
    const { container } = render(
      <RadioGroupRoot defaultValue="on">
        <Radio value="on" label="On" />
      </RadioGroupRoot>,
    );
    expect(ringClassName(container)).not.toMatch(/composes-control-fill-color/);
  });
});

/* A part's `className` is a string, merged with its own module class. Its
   state is styled through the `data-*` attributes Base UI sets. */
describe("Radio className", () => {
  it("merges a caller's className on the root with its own class and marks its state", () => {
    const { container } = render(
      <RadioGroupRoot defaultValue="a">
        <Radio value="a" className="caller" />
      </RadioGroupRoot>,
    );
    const radio = container.querySelector("[data-slot='radio']");

    expect(radio).toHaveClass("caller");

    expect(radio).toHaveAttribute("data-checked");
    expect(radio).toHaveClass(styles["radio"]);
  });

  it("merges a caller's className on the indicator with its own class and marks its state", () => {
    const { container } = render(
      <RadioGroupRoot defaultValue="a">
        <Radio value="a" IndicatorProps={{ className: "caller" }} />
      </RadioGroupRoot>,
    );
    const indicator = container.querySelector("[data-slot='radio-indicator']");

    expect(indicator).toHaveClass("caller");

    expect(indicator).toHaveAttribute("data-checked");
    expect(indicator).toHaveClass(styles["indicator"]);
  });
});

describe("Radio reversed", () => {
  it("shares the reversed row class with Checkbox", () => {
    const { container } = render(
      <RadioGroup>
        <Radio reversed value="a" label="A" />
      </RadioGroup>,
    );
    expect(container.querySelector("[data-slot='field-row']")).toHaveClass(
      checkboxStyles["toggle-reversed"],
    );
  });
});

/* `FieldProps` is typed as the row's own props, which include `className`. A
   caller's class has to join the row's classes rather than replace them, or the
   bordered frame, the reversed layout and the disabled dimming all drop off. */
describe("Radio FieldProps className", () => {
  it("merges a FieldProps className with the row's own classes", () => {
    const { container } = render(
      <RadioGroupRoot>
        <Radio
          bordered
          reversed
          value="a"
          label="A"
          FieldProps={{ className: "custom-row" }}
        />
      </RadioGroupRoot>,
    );
    const row = container.querySelector("[data-slot='field-row']");

    expect(row).toHaveClass("custom-row");
    expect(row).toHaveClass(checkboxStyles["checkbox-label"]);
    expect(row).toHaveClass(checkboxStyles["toggle-bordered"]);
    expect(row).toHaveClass(checkboxStyles["toggle-reversed"]);
  });

  /* A row with no label or description paints no frame, so the frame classes
     stay off it. The caller's class is not part of that frame and stays on. */
  it("keeps a FieldProps className on a row with no label or description", () => {
    const { container } = render(
      <RadioGroupRoot>
        <Radio
          bordered
          reversed
          value="a"
          FieldProps={{ className: "custom-row" }}
        />
      </RadioGroupRoot>,
    );
    const row = container.querySelector("[data-slot='field-row']");

    expect(row).toHaveClass("custom-row");
    expect(row).toHaveClass(fieldStyles["field-row-bare"]);
    expect(row).not.toHaveClass(checkboxStyles["checkbox-label"]);
    expect(row).not.toHaveClass(checkboxStyles["toggle-bordered"]);
    expect(row).not.toHaveClass(checkboxStyles["toggle-reversed"]);
  });
});

describe("Radio FieldProps", () => {
  // Untyped on purpose: the types reject these keys, so this pins what a
  // caller without the types gets.
  const untyped = <T,>(slot: Record<string, unknown>) => slot as T;

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects FieldProps the control owns", () => {
    // @ts-expect-error -- `label` is set on Radio itself
    void (<Radio value="a" FieldProps={{ label: "Other" }} />);
    // @ts-expect-error -- `description` is set on Radio itself
    void (<Radio value="a" FieldProps={{ description: "Other" }} />);
    // @ts-expect-error -- `size` is set on Radio itself
    void (<Radio value="a" FieldProps={{ size: "small" }} />);
  });

  it("lets the top-level values win over the same keys in FieldProps", () => {
    const { container } = render(
      <RadioGroupRoot>
        <Radio
          value="a"
          label="Top"
          description="Top help"
          size="large"
          FieldProps={untyped<RadioProps["FieldProps"]>({
            label: "Slot",
            description: "Slot help",
            size: "small",
          })}
        />
      </RadioGroupRoot>,
    );
    const row = container.querySelector("[data-slot='field-row']");

    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.getByText("Top help")).toBeInTheDocument();
    expect(screen.queryByText(/Slot/)).not.toBeInTheDocument();
    expect(row?.className).toContain("row-size-large");
  });
});
