import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
