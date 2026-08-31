import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Form } from "../form/form";
import { Checkbox } from "./checkbox";

describe("Checkbox", () => {
  it("renders a checkbox element", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "data-slot",
      "checkbox",
    );
  });

  it("renders with a label", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getByText("Accept terms")).toBeInTheDocument();
  });

  it("renders with a description", () => {
    render(<Checkbox label="Newsletter" description="Weekly updates" />);
    expect(screen.getByText("Weekly updates")).toBeInTheDocument();
  });

  it("can be toggled by clicking", async () => {
    const user = userEvent.setup();
    render(<Checkbox />);

    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toHaveAttribute("data-unchecked");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-checked");

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute("data-unchecked");
  });

  it("supports controlled checked state", async () => {
    const handleChange = vi.fn();

    const ControlledCheckbox = () => {
      const [checked, setChecked] = useState(false);
      return (
        <Checkbox
          checked={checked}
          onCheckedChange={(value) => {
            setChecked(value);
            handleChange(value);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledCheckbox />);

    const checkbox = screen.getByRole("checkbox");
    await user.click(checkbox);

    expect(handleChange).toHaveBeenCalledWith(true);
    expect(checkbox).toHaveAttribute("data-checked");
  });

  it("supports defaultChecked for uncontrolled usage", () => {
    render(<Checkbox defaultChecked />);
    expect(screen.getByRole("checkbox")).toHaveAttribute("data-checked");
  });
});

describe("Checkbox field row scoping", () => {
  it("renders the control inside the field row, not before it", () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    const row = container.querySelector("[data-slot='field-row']");
    expect(row).toBeInTheDocument();
    expect(row).toContainElement(screen.getByRole("checkbox"));
  });

  it("associates the label with its own control", () => {
    render(<Checkbox label="Accept terms" />);
    expect(screen.getAllByLabelText("Accept terms")).toContain(
      screen.getByRole("checkbox"),
    );
  });

  it("renders no row presentation when there is no label or description", () => {
    const { container } = render(<Checkbox />);
    const row = container.querySelector("[data-slot='field-row']");
    expect(row?.className).toMatch(/field-row-bare/);
  });
});

describe("Checkbox invalid treatment", () => {
  it("adopts the shared invalid composition", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox").className).toMatch(/composes-invalid/);
  });
});

describe("Checkbox size variant", () => {
  const rowClassName = (container: HTMLElement) =>
    container.querySelector("[data-slot='field-row']")?.className ?? "";

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the %s control tier on the box",
    (size) => {
      render(<Checkbox size={size} />);
      expect(screen.getByRole("checkbox").className).toContain(`size-${size}`);
    },
  );

  it("falls back to the medium tier, matching Input", () => {
    render(<Checkbox />);
    expect(screen.getByRole("checkbox").className).toContain("size-medium");
  });

  it("applies one tier at a time", () => {
    render(<Checkbox size="large" />);
    expect(screen.getByRole("checkbox").className).not.toContain("size-small");
    expect(screen.getByRole("checkbox").className).not.toContain("size-medium");
  });

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "carries the %s tier onto the row, which is what scales bordered padding",
    (size) => {
      const { container } = render(
        <Checkbox bordered size={size} label="Accept terms" />,
      );
      expect(rowClassName(container)).toContain(`row-size-${size}`);
    },
  );
});

describe("Checkbox form errors", () => {
  /*
   * The row leaves its `Field.Root` unnamed and lets Base UI fall back to the
   * name of the control registered against it, so a standalone box still
   * matches the form's error map. See `FieldRow`.
   */
  it("surfaces a form error published under its own name", () => {
    const { container } = render(
      <Form errors={{ terms: "You must accept the terms" }}>
        <Checkbox name="terms" label="I accept the terms" />
      </Form>,
    );

    const errors = container.querySelectorAll("[data-slot='field-error']");
    expect(errors).toHaveLength(1);
    expect(errors[0]).toHaveTextContent("You must accept the terms");
  });

  it("leaves a box named for another field alone", () => {
    const { container } = render(
      <Form errors={{ other: "Something else went wrong" }}>
        <Checkbox name="terms" label="I accept the terms" />
      </Form>,
    );

    expect(
      container.querySelectorAll("[data-slot='field-error']"),
    ).toHaveLength(0);
  });
});

describe("Checkbox row disabled treatment", () => {
  it("reads disabled off the box, using the shared container composition", () => {
    const { container } = render(<Checkbox label="Accept terms" />);
    expect(
      container.querySelector("[data-slot='field-row']")?.className,
    ).toMatch(/composes-disabled-within/);
  });
});
