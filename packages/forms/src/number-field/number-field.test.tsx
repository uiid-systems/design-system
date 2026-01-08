import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NumberField } from "./number-field";

describe("NumberField", () => {
  it("renders an input element", () => {
    render(<NumberField />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders increase and decrease buttons", () => {
    render(<NumberField />);
    expect(screen.getByRole("button", { name: /increase/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /decrease/i })).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<NumberField />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
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
