import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup } from "./radio-group";

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

  it("selects first item by default", () => {
    render(<RadioGroup items={defaultItems} />);
    const radios = screen.getAllByRole("radio");

    expect(radios[0]).toHaveAttribute("data-checked");
    expect(radios[1]).toHaveAttribute("data-unchecked");
    expect(radios[2]).toHaveAttribute("data-unchecked");
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

  it("supports controlled value", async () => {
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

    const user = userEvent.setup();
    render(<ControlledRadioGroup />);

    const radios = screen.getAllByRole("radio");
    await user.click(radios[1]);

    expect(handleChange).toHaveBeenCalledWith("b");
  });

  it("supports horizontal direction", () => {
    render(<RadioGroup items={defaultItems} direction="horizontal" />);
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(3);
  });
});

