import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RadioGroup } from "../radio-group/radio-group";

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

  it("selects first item by default", () => {
    render(<RadioGroup items={defaultItems} />);
    const radios = screen.getAllByRole("radio");

    expect(radios[0]).toHaveAttribute("data-checked");
    expect(radios[1]).toHaveAttribute("data-unchecked");
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
    expect(radios[0]).toHaveAttribute("data-checked");
    expect(radios[1]).toHaveAttribute("data-unchecked");

    await user.click(radios[1]);
    expect(radios[0]).toHaveAttribute("data-unchecked");
    expect(radios[1]).toHaveAttribute("data-checked");
  });

  // BUG: @base-ui/react useStableCallback trampoline causes infinite recursion
  // with controlled RadioGroup. See AGENTS.md for details.
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
    expect(radios).toHaveLength(2);
  });
});
