import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

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

  // UPSTREAM BUG (open): passing `value` + `onValueChange` triggers infinite
  // recursion in @base-ui/react's `useStableCallback` trampoline. Uncontrolled
  // usage (no `value` prop) works fine. The same skip exists in
  // radio-group/radio-group.test.tsx. Do not un-skip without first confirming
  // the upstream bug is resolved.
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
