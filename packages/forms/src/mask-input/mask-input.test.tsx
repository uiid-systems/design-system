import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { MaskInput } from "./mask-input";

describe("MaskInput", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the component", () => {
    render(<MaskInput mask="phone" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<MaskInput mask="phone" />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "data-slot",
      "mask-input",
    );
  });

  it("applies custom className", () => {
    render(<MaskInput mask="phone" className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("forwards additional props to root element", () => {
    render(<MaskInput mask="phone" data-testid="test-input" />);
    expect(screen.getByTestId("test-input")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<MaskInput mask="phone" label="Phone Number" />);
    expect(screen.getByText("Phone Number")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(<MaskInput mask="phone" description="Enter your phone" />);
    expect(screen.getByText("Enter your phone")).toBeInTheDocument();
  });

  // ============================================
  // MASKING BEHAVIOR
  // ============================================

  it("formats phone number correctly", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="phone" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1234567890");

    expect(input).toHaveValue("(123) 456-7890");
  });

  it("formats SSN correctly", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="ssn" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "123456789");

    expect(input).toHaveValue("123-45-6789");
  });

  it("formats date correctly", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="date" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "12252024");

    expect(input).toHaveValue("12/25/2024");
  });

  it("formats time correctly", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="time" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1430");

    expect(input).toHaveValue("14:30");
  });

  it("formats credit card correctly", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="creditCard" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "4111111111111111");

    expect(input).toHaveValue("4111 1111 1111 1111");
  });

  it("formats zip code correctly", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="zipCode" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "12345");

    expect(input).toHaveValue("12345");
  });

  it("formats extended zip code correctly", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="zipCodeExtended" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "123456789");

    expect(input).toHaveValue("12345-6789");
  });

  it("formats EIN correctly", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="ein" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "123456789");

    expect(input).toHaveValue("12-3456789");
  });

  it("strips non-digit characters for numeric masks", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="phone" />);

    const input = screen.getByRole("textbox");
    await user.type(input, "abc123def456ghi7890");

    expect(input).toHaveValue("(123) 456-7890");
  });

  // ============================================
  // WITHOUT MASK MODE
  // ============================================

  it("does not apply mask when withoutMask is true", async () => {
    const user = userEvent.setup();
    render(<MaskInput mask="phone" withoutMask />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1234567890");

    expect(input).toHaveValue("1234567890");
  });

  // ============================================
  // CONTROLLED/UNCONTROLLED STATE
  // ============================================

  it("supports controlled state", async () => {
    const handleValueChange = vi.fn();

    const ControlledMaskInput = () => {
      const [value, setValue] = useState("");
      return (
        <MaskInput
          mask="phone"
          value={value}
          onValueChange={(masked, unmasked) => {
            setValue(masked);
            handleValueChange(masked, unmasked);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledMaskInput />);

    const input = screen.getByRole("textbox");
    await user.type(input, "123");

    expect(handleValueChange).toHaveBeenCalled();
    expect(input).toHaveValue("(123");
  });

  it("supports uncontrolled state with defaultValue", () => {
    render(<MaskInput mask="phone" defaultValue="(123) 456-7890" />);
    expect(screen.getByRole("textbox")).toHaveValue("(123) 456-7890");
  });

  it("calls onValueChange with masked and unmasked values", async () => {
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(<MaskInput mask="phone" onValueChange={handleValueChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1234567890");

    // Check the last call has both values
    const lastCall = handleValueChange.mock.calls.at(-1);
    expect(lastCall?.[0]).toBe("(123) 456-7890"); // masked
    expect(lastCall?.[1]).toBe("1234567890"); // unmasked
  });

  // ============================================
  // VALIDATION
  // ============================================

  it("calls onValidate with validation result on change", async () => {
    const handleValidate = vi.fn();
    const user = userEvent.setup();

    render(
      <MaskInput
        mask="phone"
        onValidate={handleValidate}
        validationMode="onChange"
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "1234567890");

    expect(handleValidate).toHaveBeenCalled();
    // Complete phone number should be valid
    const lastCall = handleValidate.mock.calls.at(-1);
    expect(lastCall?.[0]).toBe(true);
  });

  it("calls onValidate on blur when validationMode is onBlur", async () => {
    const handleValidate = vi.fn();
    const user = userEvent.setup();

    render(
      <MaskInput
        mask="phone"
        onValidate={handleValidate}
        validationMode="onBlur"
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "123");
    expect(handleValidate).not.toHaveBeenCalled();

    await user.tab(); // blur
    expect(handleValidate).toHaveBeenCalled();
  });

  it("validates phone numbers correctly", async () => {
    const handleValidate = vi.fn();
    const user = userEvent.setup();

    render(
      <MaskInput
        mask="phone"
        onValidate={handleValidate}
        validationMode="onChange"
      />,
    );

    const input = screen.getByRole("textbox");

    // Incomplete phone should be invalid
    await user.type(input, "123");
    expect(handleValidate).toHaveBeenLastCalledWith(false, "123");

    // Complete phone should be valid
    await user.clear(input);
    await user.type(input, "1234567890");
    expect(handleValidate).toHaveBeenLastCalledWith(true, "1234567890");
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  it("can be disabled", () => {
    render(<MaskInput mask="phone" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("has data-disabled attribute when disabled", () => {
    render(<MaskInput mask="phone" disabled />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-disabled", "");
  });

  // ============================================
  // READ ONLY STATE
  // ============================================

  it("can be read only", () => {
    render(<MaskInput mask="phone" readOnly defaultValue="(123) 456-7890" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("has data-readonly attribute when readOnly", () => {
    render(<MaskInput mask="phone" readOnly />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-readonly", "");
  });

  // ============================================
  // INVALID STATE
  // ============================================

  it("sets aria-invalid when invalid", () => {
    render(<MaskInput mask="phone" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("has data-invalid attribute when invalid", () => {
    render(<MaskInput mask="phone" invalid />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-invalid", "");
  });

  // ============================================
  // REQUIRED STATE
  // ============================================

  it("can be required", () => {
    render(<MaskInput mask="phone" required />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("has data-required attribute when required", () => {
    render(<MaskInput mask="phone" required />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-required", "");
  });

  // ============================================
  // INPUT MODE
  // ============================================

  it("sets numeric inputMode for numeric masks", () => {
    render(<MaskInput mask="phone" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("inputmode", "numeric");
  });

  it("sets decimal inputMode for currency mask", () => {
    render(<MaskInput mask="currency" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("inputmode", "decimal");
  });

  it("sets decimal inputMode for percentage mask", () => {
    render(<MaskInput mask="percentage" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("inputmode", "decimal");
  });

  it("allows overriding inputMode", () => {
    render(<MaskInput mask="phone" inputMode="text" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("inputmode", "text");
  });

  // ============================================
  // PLACEHOLDER
  // ============================================

  it("renders placeholder", () => {
    render(<MaskInput mask="phone" placeholder="Enter phone" />);
    expect(screen.getByPlaceholderText("Enter phone")).toBeInTheDocument();
  });

  it("shows maskPlaceholder when focused", async () => {
    const user = userEvent.setup();
    render(
      <MaskInput
        mask="phone"
        placeholder="Phone"
        maskPlaceholder="(___) ___-____"
      />,
    );

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("placeholder", "Phone");

    await user.click(input);
    expect(input).toHaveAttribute("placeholder", "(___) ___-____");
  });

  // ============================================
  // MAX LENGTH
  // ============================================

  it("calculates maxLength from pattern", () => {
    render(<MaskInput mask="phone" />);
    // Phone pattern is "(###) ###-####" = 14 characters
    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "14");
  });

  it("allows overriding maxLength", () => {
    render(<MaskInput mask="phone" maxLength={20} />);
    // When maxLength is provided, it should still use pattern length for token-based masks
    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "14");
  });

  // ============================================
  // CUSTOM MASK PATTERN
  // ============================================

  it("supports custom mask pattern", async () => {
    const user = userEvent.setup();
    render(
      <MaskInput
        mask={{
          pattern: "##-##-##",
          transform: (value) => value.replace(/\D/g, ""),
          validate: (value) => value.length === 6,
        }}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.type(input, "123456");

    expect(input).toHaveValue("12-34-56");
  });

  // ============================================
  // EVENT HANDLERS
  // ============================================

  it("calls onFocus when focused", async () => {
    const handleFocus = vi.fn();
    const user = userEvent.setup();

    render(<MaskInput mask="phone" onFocus={handleFocus} />);

    await user.click(screen.getByRole("textbox"));
    expect(handleFocus).toHaveBeenCalledTimes(1);
  });

  it("calls onBlur when blurred", async () => {
    const handleBlur = vi.fn();
    const user = userEvent.setup();

    render(<MaskInput mask="phone" onBlur={handleBlur} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.tab();

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("calls onKeyDown on keydown", async () => {
    const handleKeyDown = vi.fn();
    const user = userEvent.setup();

    render(<MaskInput mask="phone" onKeyDown={handleKeyDown} />);

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("1");

    expect(handleKeyDown).toHaveBeenCalled();
  });
});

describe("MaskInput Field.Control integration", () => {
  it("associates its label with the input", () => {
    render(<MaskInput mask="phone" label="Phone Number" />);
    expect(screen.getByLabelText("Phone Number")).toBe(
      screen.getByRole("textbox"),
    );
  });

  it("takes a node as its label and description, like the other inputs", () => {
    render(
      <MaskInput
        mask="phone"
        label={<span>Phone</span>}
        description={<em>Mobile only</em>}
      />,
    );
    expect(screen.getByLabelText("Phone")).toBe(screen.getByRole("textbox"));
    expect(
      screen
        .getByText("Mobile only")
        .closest("[data-slot='field-description']"),
    ).toBeInTheDocument();
  });

  it("takes its invalid state from Field rather than hand-rolled attributes", () => {
    render(<MaskInput mask="phone" label="Phone" invalid />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("data-invalid");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  /* FieldControl reads id and value off its own props, not the render element.
     Spreading them onto the slotted `<input>` leaves the label on a generated
     id and filled state stuck. */
  it("keeps a caller's id wired to the label", async () => {
    const user = userEvent.setup();
    render(<MaskInput id="phone" label="Phone" mask="phone" />);

    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("id", "phone");
    expect(screen.getByText("Phone")).toHaveAttribute("for", "phone");
    await user.click(screen.getByText("Phone"));
    expect(input).toHaveFocus();
  });

  it("tracks data-filled against the masked value", () => {
    const { rerender } = render(
      <MaskInput mask="phone" value="1234567890" onValueChange={() => {}} />,
    );
    const input = screen.getByRole("textbox");
    expect(input).toHaveValue("(123) 456-7890");
    expect(input).toHaveAttribute("data-filled");

    rerender(<MaskInput mask="phone" value="" onValueChange={() => {}} />);
    expect(input).not.toHaveAttribute("data-filled");
  });
});

describe("MaskInput color", () => {
  it("tints the control with the palette hue", () => {
    render(<MaskInput mask="phone" color="blue" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("palette-blue");
    expect(input.className).toMatch(/composes-field-surface-color/);
  });

  it("leaves the control on the plain surface with no color", () => {
    render(<MaskInput mask="phone" />);
    expect(screen.getByRole("textbox").className).not.toMatch(
      /composes-field-surface-color/,
    );
  });

  /* With slots the wrapper is the element wearing the surface, so it takes the
     hue too — the same split Input makes. */
  it("tints the wrapper when slots are present", () => {
    const { container } = render(
      <MaskInput mask="phone" color="blue" before="+1" />,
    );

    const wrapper = container.querySelector("[data-slot='input-wrapper']");

    expect(wrapper).toHaveClass("palette-blue");
    expect(wrapper?.className).toMatch(/composes-field-surface-color/);
  });
});

describe("MaskInput onChange", () => {
  /** Records what a consumer reads off the event at the moment it is called. */
  const recordChanges = () => {
    const seen: string[] = [];
    const handleChange = vi.fn((event: React.ChangeEvent<HTMLInputElement>) => {
      seen.push(event.target.value);
    });
    return { seen, handleChange };
  };

  it("calls a consumer onChange with the masked value on every keystroke", async () => {
    const { seen, handleChange } = recordChanges();
    const user = userEvent.setup();

    render(<MaskInput mask="phone" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1234");

    expect(seen).toEqual(["(1", "(12", "(123", "(123) 4"]);
    expect(input).toHaveValue("(123) 4");

    const event = handleChange.mock.calls.at(-1)?.[0];
    expect(event?.type).toBe("change");
    expect(event?.target).toBe(input);
  });

  it("hands onChange the masked value when characters are stripped", async () => {
    const { seen, handleChange } = recordChanges();
    const user = userEvent.setup();

    render(<MaskInput mask="phone" onChange={handleChange} />);

    await user.type(screen.getByRole("textbox"), "1a2");

    // The "a" keystroke is a real change event whose raw value is "(1a"; the
    // consumer reads the value the input goes on to display.
    expect(seen).toEqual(["(1", "(1", "(12"]);
  });

  it("calls onChange before onValueChange, once each per keystroke", async () => {
    const calls: string[] = [];
    const user = userEvent.setup();

    render(
      <MaskInput
        mask="phone"
        onChange={(event) => calls.push(`onChange:${event.target.value}`)}
        onValueChange={(masked, unmasked) =>
          calls.push(`onValueChange:${masked}|${unmasked}`)
        }
      />,
    );

    await user.type(screen.getByRole("textbox"), "12");

    expect(calls).toEqual([
      "onChange:(1",
      "onValueChange:(1|1",
      "onChange:(12",
      "onValueChange:(12|12",
    ]);
  });

  it("reports the masked value to a controlled consumer", async () => {
    const { seen, handleChange } = recordChanges();

    const ControlledMaskInput = () => {
      const [value, setValue] = useState("");
      return (
        <MaskInput
          mask="phone"
          value={value}
          onValueChange={setValue}
          onChange={handleChange}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledMaskInput />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1234");

    expect(seen).toEqual(["(1", "(12", "(123", "(123) 4"]);
    expect(input).toHaveValue("(123) 4");
  });

  it("calls onChange with the formatted value in currency mode", async () => {
    const { seen, handleChange } = recordChanges();
    const user = userEvent.setup();

    render(<MaskInput mask="currency" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1234");

    expect(seen).toEqual(["$1", "$12", "$123", "$1,234"]);
    expect(input).toHaveValue("$1,234");
  });

  it("calls onChange with the formatted value in percentage mode", async () => {
    const { seen, handleChange } = recordChanges();
    const user = userEvent.setup();

    render(<MaskInput mask="percentage" onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "12");

    expect(seen).toEqual(["1%", "12%"]);
    expect(input).toHaveValue("12%");
  });

  it("calls onChange with the raw value when withoutMask is set", async () => {
    const { seen, handleChange } = recordChanges();
    const user = userEvent.setup();

    render(<MaskInput mask="phone" withoutMask onChange={handleChange} />);

    await user.type(screen.getByRole("textbox"), "12a");

    expect(seen).toEqual(["1", "12", "12a"]);
  });

  it("reports values through the props a form library's register() returns", async () => {
    // What react-hook-form's `register("phone")` hands back: it reads the
    // field's value and name off the change event, and keeps the element.
    const values: Record<string, string> = {};
    const fields: Record<string, HTMLInputElement | null> = {};
    const handleBlur = vi.fn();
    const register = (name: string) => ({
      name,
      ref: (element: HTMLInputElement | null) => {
        fields[name] = element;
      },
      onBlur: handleBlur,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        values[event.target.name] = event.target.value;
      },
    });

    const user = userEvent.setup();
    render(<MaskInput mask="phone" {...register("phone")} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "1234567890");
    await user.tab();

    expect(values).toEqual({ phone: "(123) 456-7890" });
    expect(fields.phone).toBe(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  // ============================================
  // WHERE A NATIVE CHANGE EVENT FIRES
  // ============================================
  // onChange follows the native event. These paths leave the default action
  // alone, so the browser's own change event reaches the handler.

  it("calls onChange when Backspace removes a selection", async () => {
    const { seen, handleChange } = recordChanges();
    const user = userEvent.setup();

    render(
      <MaskInput
        mask="phone"
        defaultValue="(123) 456-7890"
        onChange={handleChange}
      />,
    );

    const input = screen.getByRole<HTMLInputElement>("textbox");
    await user.click(input);
    input.setSelectionRange(0, input.value.length);
    await user.keyboard("{Backspace}");

    expect(seen).toEqual([""]);
    expect(input).toHaveValue("");
  });

  it("calls onChange on Backspace in currency mode", async () => {
    const { seen, handleChange } = recordChanges();
    const user = userEvent.setup();

    render(
      <MaskInput mask="currency" defaultValue="$123" onChange={handleChange} />,
    );

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("{Backspace}");

    expect(seen).toEqual(["$12"]);
    expect(input).toHaveValue("$12");
  });

  it("calls onChange on paste when withoutMask is set", async () => {
    const { seen, handleChange } = recordChanges();
    const user = userEvent.setup();

    render(<MaskInput mask="phone" withoutMask onChange={handleChange} />);

    await user.click(screen.getByRole("textbox"));
    await user.paste("1234567890");

    expect(seen).toEqual(["1234567890"]);
  });

  // ============================================
  // KNOWN GAPS
  // ============================================
  // These paths cancel the default action and write the value themselves, so
  // no native change event fires and a consumer onChange is not called. Each
  // test pins today's behavior; flip it when the path learns to report.

  it("does not call onChange when a masked paste is committed", async () => {
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <MaskInput
        mask="phone"
        onChange={handleChange}
        onValueChange={handleValueChange}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.paste("1234567890");

    expect(input).toHaveValue("(123) 456-7890");
    expect(handleValueChange).toHaveBeenLastCalledWith(
      "(123) 456-7890",
      "1234567890",
    );
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not call onChange when Backspace deletes a single character", async () => {
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <MaskInput
        mask="phone"
        defaultValue="(123) 456-7890"
        onChange={handleChange}
        onValueChange={handleValueChange}
      />,
    );

    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("{Backspace}");

    expect(input).toHaveValue("(123) 456-789");
    expect(handleValueChange).toHaveBeenLastCalledWith(
      "(123) 456-789",
      "123456789",
    );
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not call onChange when Delete removes a single character", async () => {
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <MaskInput
        mask="phone"
        defaultValue="(123) 456-7890"
        onChange={handleChange}
        onValueChange={handleValueChange}
      />,
    );

    const input = screen.getByRole<HTMLInputElement>("textbox");
    await user.click(input);
    input.setSelectionRange(1, 1);
    await user.keyboard("{Delete}");

    expect(input).toHaveValue("(234) 567-890");
    expect(handleValueChange).toHaveBeenLastCalledWith(
      "(234) 567-890",
      "234567890",
    );
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("does not call onChange when composition end commits the masked value", () => {
    const { seen, handleChange } = recordChanges();
    const handleValueChange = vi.fn();

    render(
      <MaskInput
        mask="phone"
        onChange={handleChange}
        onValueChange={handleValueChange}
      />,
    );

    const input = screen.getByRole("textbox");
    fireEvent.compositionStart(input);
    fireEvent.change(input, { target: { value: "12" } });

    // Masking is suspended while composing, so the change event carries the
    // raw text, which is also what the input displays at that moment.
    expect(seen).toEqual(["12"]);
    expect(handleValueChange).not.toHaveBeenCalled();

    fireEvent.compositionEnd(input);

    expect(input).toHaveValue("(12");
    expect(handleValueChange).toHaveBeenLastCalledWith("(12", "12");
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
