import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { NumberField } from "./number-field";
import type {
  NumberFieldGroupProps,
  NumberFieldInputProps,
} from "./number-field.types";
import {
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldRoot,
  NumberFieldScrubArea,
} from "./subcomponents";

import styles from "./number-field.module.css";

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

  /* The cast stands in for untyped code, which the slot type cannot stop. */
  it("lets the top-level tier win over one in GroupProps", () => {
    const { container } = render(
      <NumberField
        size="small"
        GroupProps={{ size: "large" } as NumberFieldGroupProps}
      />,
    );
    expect(groupClassName(container)).toContain("size-small");
    expect(groupClassName(container)).not.toContain("size-large");
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

/* The monolithic NumberField destructures a fixed prop list and spreads the
   rest, so both change signals reach Base UI only by falling through
   `...props`. Adding either to that destructure would swallow it silently —
   and a swallowed `onValueCommitted` sends callers back to the handler that
   fires per keystroke and per scrub step. */
describe("NumberField change signals", () => {
  const stepUp = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.click(screen.getByRole("textbox"));
    await user.keyboard("{ArrowUp}");
  };

  it("forwards onValueChange to the root", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    render(<NumberField defaultValue={1} onValueChange={onValueChange} />);
    await stepUp(user);

    expect(onValueChange).toHaveBeenCalled();
  });

  it("forwards onValueCommitted to the root", async () => {
    const user = userEvent.setup();
    const onValueCommitted = vi.fn();

    render(
      <NumberField defaultValue={1} onValueCommitted={onValueCommitted} />,
    );
    await stepUp(user);

    expect(onValueCommitted).toHaveBeenCalled();
  });

  it("forwards both through RootProps as well", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueCommitted = vi.fn();

    render(
      <NumberField
        defaultValue={1}
        RootProps={{ onValueChange, onValueCommitted }}
      />,
    );
    await stepUp(user);

    expect(onValueChange).toHaveBeenCalled();
    expect(onValueCommitted).toHaveBeenCalled();
  });
});

describe("NumberField group layout props", () => {
  it("forwards layout props from GroupProps to the group", () => {
    const { container } = render(
      <NumberField GroupProps={{ gap: 2, ay: "end" }} />,
    );
    const group = container.querySelector<HTMLElement>(
      "[data-slot='number-field-group']",
    );
    expect(group).toHaveAttribute("data-ui-gap", "2");
    expect(group).toHaveAttribute("data-ui-ay", "end");
  });
});

/* A part's `className` is a string, merged with its own module class. Its
   state is styled through the `data-*` attributes Base UI sets. Every part
   shares the root's state, so each one marks the root's `disabled`. */
describe("NumberField className", () => {
  const part = (container: HTMLElement, slot: string) =>
    container.querySelector(`[data-slot='number-field-${slot}']`);

  it("merges a caller's className on the group with its own class and marks its state", () => {
    const { container } = render(
      <NumberField
        disabled
        defaultValue={7}
        GroupProps={{ className: "caller" }}
      />,
    );

    expect(part(container, "group")).toHaveClass("caller");

    expect(part(container, "group")).toHaveAttribute("data-disabled");
    expect(part(container, "group")).toHaveClass(styles["number-field"]);
  });

  it("merges a caller's className on the input with its own class and marks its state", () => {
    const { container } = render(
      <NumberField
        disabled
        defaultValue={7}
        InputProps={{ className: "caller" }}
      />,
    );

    expect(part(container, "input")).toHaveClass("caller");

    expect(part(container, "input")).toHaveAttribute("data-disabled");
    expect(part(container, "input")).toHaveClass(styles["number-field-input"]);
  });

  it("merges a caller's className on the increment with its own class and marks its state", () => {
    const { container } = render(
      <NumberField
        disabled
        defaultValue={7}
        IncrementProps={{ className: "caller" }}
      />,
    );

    expect(part(container, "increment")).toHaveClass("caller");

    expect(part(container, "increment")).toHaveAttribute("data-disabled");
    expect(part(container, "increment")).toHaveClass(
      styles["number-field-increment"],
    );
  });

  it("merges a caller's className on the decrement with its own class and marks its state", () => {
    const { container } = render(
      <NumberField
        disabled
        defaultValue={7}
        DecrementProps={{ className: "caller" }}
      />,
    );

    expect(part(container, "decrement")).toHaveClass("caller");

    expect(part(container, "decrement")).toHaveAttribute("data-disabled");
    expect(part(container, "decrement")).toHaveClass(
      styles["number-field-decrement"],
    );
  });

  it("merges a caller's className on the scrub area with its own class and marks its state", () => {
    const { container } = render(
      <NumberFieldRoot disabled defaultValue={7}>
        <NumberFieldScrubArea className="caller">Amount</NumberFieldScrubArea>
        <NumberFieldGroup>
          <NumberFieldInput />
        </NumberFieldGroup>
      </NumberFieldRoot>,
    );

    expect(part(container, "scrub-area")).toHaveClass("caller");

    expect(part(container, "scrub-area")).toHaveAttribute("data-disabled");
    expect(part(container, "scrub-area")).toHaveClass(
      styles["number-field-scrub-area"],
    );
  });
});

describe("NumberField RootProps precedence", () => {
  const root = (container: HTMLElement) =>
    container.querySelector("[data-slot='number-field-root']");

  it("lets a top-level prop win over the same key in RootProps", () => {
    const { container } = render(
      <NumberField aria-label="top" RootProps={{ "aria-label": "slot" }} />,
    );
    expect(root(container)).toHaveAttribute("aria-label", "top");
  });

  it("lets a top-level name win over RootProps.name", () => {
    const { container } = render(
      <NumberField name="top" RootProps={{ name: "slot" }} />,
    );
    expect(container.querySelector("input[name='top']")).toBeInTheDocument();
    expect(container.querySelector("input[name='slot']")).toBeNull();
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    const { container } = render(<NumberField RootProps={{ name: "slot" }} />);
    expect(container.querySelector("input[name='slot']")).toBeInTheDocument();
  });
});

describe("NumberField FieldProps", () => {
  it("reaches the field around it", () => {
    const { container } = render(
      <NumberField FieldProps={{ className: "outer", w: "full" }} />,
    );
    const field = container.querySelector("[data-slot='field-root']");
    expect(field).toHaveClass("outer");
    expect(field).toHaveAttribute("data-ui-w", "full");
  });

  /* The cast stands in for untyped code, which the slot type cannot stop. */
  it("lets a top-level label win over one in the slot", () => {
    render(<NumberField label="Top" FieldProps={{ label: "Slot" } as never} />);
    expect(screen.getByText("Top")).toBeInTheDocument();
    expect(screen.queryByText("Slot")).not.toBeInTheDocument();
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects FieldProps the control owns", () => {
    void (
      <NumberField
        // @ts-expect-error -- `label` is set on NumberField itself
        FieldProps={{ label: "Other" }}
      />
    );
    void (
      <NumberField
        // @ts-expect-error -- `name` is set on NumberField itself
        FieldProps={{ name: "other" }}
      />
    );
    void (
      <NumberField
        // @ts-expect-error -- `required` is set on NumberField itself
        FieldProps={{ required: true }}
      />
    );
    void (
      <NumberField
        // @ts-expect-error -- `disabled` is set on NumberField itself
        FieldProps={{ disabled: true }}
      />
    );
    void (
      <NumberField
        // @ts-expect-error -- `size` is set on NumberField itself
        FieldProps={{ size: "small" }}
      />
    );
  });
});

/*
 * Each slot leaves out the keys NumberField sets on that part itself. The
 * casts in the precedence tests stand in for untyped code, which the slot type
 * cannot stop: the top-level value still wins at runtime.
 */
describe("NumberField GroupProps", () => {
  it("reaches the group", () => {
    render(
      <NumberField
        aria-label="Quantity"
        GroupProps={{ id: "cluster", "aria-describedby": "hint" }}
      />,
    );
    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("data-slot", "number-field-group");
    expect(group).toHaveAttribute("id", "cluster");
    expect(group).toHaveAttribute("aria-describedby", "hint");
  });

  it("lets a top-level color win over one in the slot", () => {
    render(
      <NumberField
        color="blue"
        GroupProps={{ color: "red" } as NumberFieldGroupProps}
      />,
    );
    const group = screen.getByRole("group");
    expect(group).toHaveClass("palette-blue");
    expect(group).not.toHaveClass("palette-red");
  });

  /* `size` always has a value at the top level, so `color` is the key an
     unset top level can leave to the slot. */
  it("keeps a color in the slot when the top level sets none", () => {
    render(
      <NumberField GroupProps={{ color: "red" } as NumberFieldGroupProps} />,
    );
    expect(screen.getByRole("group")).toHaveClass("palette-red");
  });

  /* A behaviour pin, not a precedence test: JSX children follow every spread,
     so a slot `children` never won. The `@ts-expect-error` below is the guard
     that matters. */
  it("renders the steppers and the input whatever the slot passes as children", () => {
    render(
      <NumberField
        GroupProps={{ children: "Slot" } as NumberFieldGroupProps}
      />,
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /increase/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /decrease/i }),
    ).toBeInTheDocument();
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects GroupProps the control owns", () => {
    // @ts-expect-error -- `size` is set on NumberField itself
    void (<NumberField GroupProps={{ size: "small" }} />);
    // @ts-expect-error -- `color` is set on NumberField itself
    void (<NumberField GroupProps={{ color: "blue" }} />);
    // @ts-expect-error -- NumberField renders the steppers and the input itself
    void (<NumberField GroupProps={{ children: "Other" }} />);
  });
});

describe("NumberField InputProps", () => {
  it("reaches the input", () => {
    render(
      <NumberField InputProps={{ "aria-label": "Quantity", id: "qty" }} />,
    );
    const input = screen.getByRole("textbox", { name: "Quantity" });
    expect(input).toHaveAttribute("data-slot", "number-field-input");
    expect(input).toHaveAttribute("id", "qty");
  });

  it("forwards a ref to the input", () => {
    const ref = createRef<HTMLInputElement>();
    render(<NumberField InputProps={{ ref }} />);
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });

  it("lets top-level values win over the same keys in the slot", () => {
    render(
      <NumberField
        placeholder="Top"
        color="blue"
        InputProps={
          { placeholder: "Slot", color: "red" } as NumberFieldInputProps
        }
      />,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Top");
    expect(input).toHaveClass("palette-blue");
    expect(input).not.toHaveClass("palette-red");
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects InputProps the control owns", () => {
    // @ts-expect-error -- `size` is set on NumberField itself
    void (<NumberField InputProps={{ size: "small" }} />);
    // @ts-expect-error -- `color` is set on NumberField itself
    void (<NumberField InputProps={{ color: "blue" }} />);
    // @ts-expect-error -- `placeholder` is set on NumberField itself
    void (<NumberField InputProps={{ placeholder: "Other" }} />);
    // @ts-expect-error -- `required` is set on NumberField itself
    void (<NumberField InputProps={{ required: true }} />);
  });
});
