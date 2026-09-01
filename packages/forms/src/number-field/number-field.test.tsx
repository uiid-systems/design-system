import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { NumberField } from "./number-field";

describe("NumberField", () => {
  it("renders an input element", () => {
    render(<NumberField />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders increase and decrease buttons", () => {
    render(<NumberField />);
    expect(
      screen.getByRole("button", { name: /increase/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease/i }),
    ).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<NumberField />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "data-slot",
      "number-field-input",
    );
  });

  it("supports custom defaultValue", () => {
    render(<NumberField defaultValue={50} />);
    expect(screen.getByRole("textbox")).toHaveValue("50");
  });

  it("increments value when clicking increase button", async () => {
    const user = userEvent.setup();
    render(<NumberField defaultValue={10} />);

    const input = screen.getByRole("textbox");
    const increase = screen.getByRole("button", { name: /increase/i });

    await user.click(increase);
    expect(input).toHaveValue("11");
  });

  it("decrements value when clicking decrease button", async () => {
    const user = userEvent.setup();
    render(<NumberField defaultValue={10} />);

    const input = screen.getByRole("textbox");
    const decrease = screen.getByRole("button", { name: /decrease/i });

    await user.click(decrease);
    expect(input).toHaveValue("9");
  });

  it("supports controlled value", async () => {
    const handleChange = vi.fn();

    const ControlledNumberField = () => {
      const [value, setValue] = useState<number | null>(50);
      return (
        <NumberField
          value={value}
          onValueChange={(v) => {
            setValue(v);
            handleChange(v);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledNumberField />);

    const increase = screen.getByRole("button", { name: /increase/i });
    await user.click(increase);

    expect(handleChange).toHaveBeenCalledWith(51);
  });

  it("respects min value", async () => {
    const user = userEvent.setup();
    render(<NumberField defaultValue={0} min={0} />);

    const input = screen.getByRole("textbox");
    const decrease = screen.getByRole("button", { name: /decrease/i });

    await user.click(decrease);
    expect(input).toHaveValue("0");
  });

  it("respects max value", async () => {
    const user = userEvent.setup();
    render(<NumberField defaultValue={100} max={100} />);

    const input = screen.getByRole("textbox");
    const increase = screen.getByRole("button", { name: /increase/i });

    await user.click(increase);
    expect(input).toHaveValue("100");
  });

  it("increments by step value", async () => {
    const user = userEvent.setup();
    render(<NumberField defaultValue={0} step={5} />);

    const input = screen.getByRole("textbox");
    const increase = screen.getByRole("button", { name: /increase/i });

    await user.click(increase);
    expect(input).toHaveValue("5");
  });

  it("renders data-slot attributes on buttons", () => {
    render(<NumberField />);
    expect(screen.getByRole("button", { name: /increase/i })).toHaveAttribute(
      "data-slot",
      "number-field-increment",
    );
    expect(screen.getByRole("button", { name: /decrease/i })).toHaveAttribute(
      "data-slot",
      "number-field-decrement",
    );
  });
});

describe("NumberField render target", () => {
  it("merges Base UI's input props onto the input, not the field wrapper", () => {
    const { container } = render(<NumberField />);
    const input = screen.getByRole("textbox");
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("data-slot", "number-field-input");
    // The guard this test exists for: the input's own slot must not land on
    // the field wrapper or the control group.
    expect(
      container.querySelector("[data-slot='field-root']"),
    ).not.toHaveAttribute("data-slot", "number-field-input");
    expect(
      container.querySelector("[data-slot='number-field-group']"),
    ).not.toBeNull();
  });
});

describe("NumberField name forwarding", () => {
  it("submits the value once, not once per registered control", async () => {
    const user = userEvent.setup();
    const submitted = vi.fn();

    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted(new FormData(event.currentTarget).getAll("qty"));
        }}
      >
        <NumberField name="qty" label="Qty" defaultValue={3} />
        <button type="submit">Submit</button>
      </form>,
    );

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(submitted).toHaveBeenCalledWith(["3"]);
  });
});

describe("NumberField size variant", () => {
  const groupClassName = (container: HTMLElement) =>
    container.querySelector("[data-slot='number-field-group']")?.className ??
    "";

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the %s control tier on the group the steppers size off",
    (size) => {
      const { container } = render(<NumberField size={size} />);
      expect(groupClassName(container)).toContain(`size-${size}`);
    },
  );

  it("falls back to the medium tier", () => {
    const { container } = render(<NumberField />);
    expect(groupClassName(container)).toContain("size-medium");
  });

  it("applies one tier at a time", () => {
    const { container } = render(<NumberField size="large" />);
    expect(groupClassName(container)).not.toContain("size-small");
    expect(groupClassName(container)).not.toContain("size-medium");
  });

  it("sizes the input from the same prop", () => {
    render(<NumberField size="large" />);
    expect(screen.getByRole("textbox").className).toContain("size-large");
  });

  it("lets GroupProps override the tier", () => {
    const { container } = render(
      <NumberField size="small" GroupProps={{ size: "large" }} />,
    );
    expect(groupClassName(container)).toContain("size-large");
  });
});

describe("NumberField stepper surface", () => {
  const stepper = (container: HTMLElement, part: "decrement" | "increment") =>
    container.querySelector(`[data-slot='number-field-${part}']`)?.className ??
    "";

  it.each(["decrement", "increment"] as const)(
    "paints the %s stepper from the shared field surface, not a private copy",
    (part) => {
      const { container } = render(<NumberField />);
      expect(stepper(container, part)).toMatch(/composes-field-surface/);
    },
  );

  it.each(["decrement", "increment"] as const)(
    "gives the %s stepper the shared disabled treatment",
    (part) => {
      const { container } = render(<NumberField />);
      expect(stepper(container, part)).toMatch(/composes-disabled/);
    },
  );

  /* Base UI disables the stepper that would leave the range, which is exactly
     the case the container-scoped disabled composition must not be used for:
     one stepper being out does not put the field out. */
  it("does not dim the whole group when a stepper disables at the boundary", () => {
    const { container } = render(<NumberField min={0} defaultValue={0} />);
    expect(
      container.querySelector("[data-slot='number-field-decrement']"),
    ).toBeDisabled();
    const group = container.querySelector("[data-slot='number-field-group']");
    expect(group?.className).not.toMatch(/composes-disabled/);
  });
});

describe("NumberField color", () => {
  const group = (container: HTMLElement) =>
    container.querySelector("[data-slot='number-field-group']");

  /*
   * The hue lands on the group for the same reason `size` does: it dresses the
   * cluster. The treatment remaps custom properties, and those inherit, so the
   * two steppers pick it up without a prop of their own.
   */
  it("tints the group the steppers sit in", () => {
    const { container } = render(<NumberField color="blue" />);

    expect(group(container)).toHaveClass("palette-blue");
    expect(group(container)?.className).toMatch(/composes-field-surface-color/);
  });

  /* The input takes the hue a second time. The shared surface sets `color` on
     the element itself, which an inherited value could never outrank. */
  it("tints the input directly, not only by inheritance", () => {
    render(<NumberField color="blue" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("palette-blue");
    expect(input.className).toMatch(/composes-field-surface-color/);
  });

  it("leaves the cluster on the plain surface with no color", () => {
    const { container } = render(<NumberField />);

    expect(group(container)?.className).not.toMatch(
      /composes-field-surface-color/,
    );
    expect(screen.getByRole("textbox").className).not.toMatch(
      /composes-field-surface-color/,
    );
  });
});
