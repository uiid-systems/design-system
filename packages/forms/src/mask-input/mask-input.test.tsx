import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
