import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, it, expect, vi } from "vitest";

import { Textarea } from "./textarea";

import styles from "./textarea.module.css";

describe("Textarea", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders a textarea element", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with a placeholder", () => {
    render(<Textarea placeholder="Enter your message..." />);
    expect(
      screen.getByPlaceholderText("Enter your message..."),
    ).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(<Textarea label="Message" />);
    expect(screen.getByLabelText("Message")).toBeInTheDocument();
  });

  it("renders with a description", () => {
    render(<Textarea description="Please provide detailed feedback." />);
    expect(
      screen.getByText("Please provide detailed feedback."),
    ).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "data-slot",
      "textarea",
    );
  });

  it("applies custom className", () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("forwards additional props to textarea element", () => {
    render(<Textarea data-testid="test-textarea" />);
    expect(screen.getByTestId("test-textarea")).toBeInTheDocument();
  });

  // ============================================
  // ROWS
  // ============================================

  it("renders with default rows", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "3");
  });

  it("renders with custom rows", () => {
    render(<Textarea rows={5} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "5");
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  it("can be disabled", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("does not allow typing when disabled", async () => {
    const user = userEvent.setup();
    render(<Textarea disabled />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello");

    expect(textarea).toHaveValue("");
  });

  // ============================================
  // REQUIRED STATE
  // ============================================

  it("renders required indicator with label", () => {
    render(<Textarea label="Message" required />);
    expect(screen.getByText("Message")).toHaveAttribute(
      "data-required",
      "true",
    );
  });

  it("has required attribute when required", () => {
    render(<Textarea required />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  // ============================================
  // INTERACTIONS
  // ============================================

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Hello, World!");

    expect(textarea).toHaveValue("Hello, World!");
  });

  it("handles multiline input", async () => {
    const user = userEvent.setup();
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "Line 1{enter}Line 2{enter}Line 3");

    expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
  });

  it("is able to be focused", async () => {
    const user = userEvent.setup();
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    await user.click(textarea);

    expect(textarea).toHaveFocus();
  });

  it("supports keyboard navigation", async () => {
    const user = userEvent.setup();
    render(<Textarea />);

    const textarea = screen.getByRole("textbox");
    await user.tab();

    expect(textarea).toHaveFocus();
  });

  // ============================================
  // CONTROLLED VALUE
  // ============================================

  it("renders with defaultValue", () => {
    render(<Textarea defaultValue="Initial content" />);
    expect(screen.getByRole("textbox")).toHaveValue("Initial content");
  });

  it("renders with controlled value", () => {
    render(<Textarea value="Controlled content" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveValue("Controlled content");
  });

  // ============================================
  // REF FORWARDING
  // ============================================

  it("forwards ref to textarea element", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });

  it("forwards ref to textarea element when label is provided", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} label="With Label" />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current?.tagName).toBe("TEXTAREA");
  });

  // ============================================
  // VARIANTS
  // ============================================

  it("applies size variant classes", () => {
    const { rerender } = render(<Textarea size="xsmall" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    rerender(<Textarea size="small" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    rerender(<Textarea size="medium" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    rerender(<Textarea size="large" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("applies resize variant", () => {
    const { rerender } = render(<Textarea resize="none" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    rerender(<Textarea resize="vertical" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    rerender(<Textarea resize="horizontal" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();

    rerender(<Textarea resize="both" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("applies fullwidth variant", () => {
    render(<Textarea fullwidth />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("applies ghost variant", () => {
    render(<Textarea variant="ghost" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

describe("Textarea single render path", () => {
  it("renders a textarea whether or not a label is given", () => {
    const { container: bare } = render(<Textarea />);
    const { container: labelled } = render(<Textarea label="Message" />);
    expect(bare.querySelector("[data-slot='textarea']")?.tagName).toBe(
      "TEXTAREA",
    );
    expect(labelled.querySelector("[data-slot='textarea']")?.tagName).toBe(
      "TEXTAREA",
    );
  });

  it("wires an unlabelled textarea into a field root", () => {
    const { container } = render(<Textarea />);
    expect(
      container.querySelector("[data-slot='field-root']"),
    ).toBeInTheDocument();
  });
});

describe("Textarea Field.Control surface", () => {
  it("supports Field.Control's onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Textarea onValueChange={onValueChange} />);
    await user.type(screen.getByRole("textbox"), "hi");
    expect(onValueChange).toHaveBeenCalled();
  });
});

describe("Textarea invalid treatment", () => {
  it("adopts the shared invalid composition", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox").className).toMatch(/composes-invalid/);
  });
});

describe("Textarea required reaches the control", () => {
  it("marks the textarea itself required", () => {
    render(<Textarea label="Bio" required />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });
});

describe("Textarea shared compositions", () => {
  const className = () => screen.getByRole("textbox").className;

  it("paints the shared field surface rather than its own copy of it", () => {
    render(<Textarea />);
    expect(className()).toMatch(/composes-field-surface(?!-)/);
  });

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "composes the shared %s tier instead of restating it",
    (size) => {
      render(<Textarea size={size} />);
      expect(className()).toMatch(new RegExp(`composes-size-${size}`));
    },
  );

  it("composes the shared ghost surface", () => {
    render(<Textarea variant="ghost" />);
    expect(className()).toMatch(/composes-field-surface-ghost/);
  });

  it("composes the shared fullwidth", () => {
    render(<Textarea fullwidth />);
    expect(className()).toMatch(/composes-fullwidth/);
  });
});

describe("Textarea color", () => {
  const className = () => screen.getByRole("textbox").className;

  it("tints the control with the palette hue", () => {
    render(<Textarea color="blue" />);

    expect(screen.getByRole("textbox")).toHaveClass("palette-blue");
    expect(className()).toMatch(/composes-field-surface-color/);
  });

  it("leaves the control on the plain surface with no color", () => {
    render(<Textarea />);
    expect(className()).not.toMatch(/composes-field-surface-color/);
  });

  /* The hue rides the same shared composition Input wears, so the two cannot
     drift apart. */
  it("wears the same shared composition Input does", () => {
    render(<Textarea color="blue" variant="ghost" />);
    expect(className()).toMatch(/composes-field-surface-color/);
    expect(className()).toMatch(/composes-field-surface-ghost/);
  });
});

describe("Textarea before/after slots", () => {
  const wrapper = (container: HTMLElement) =>
    container.querySelector("[data-slot='input-wrapper']");

  it("renders no wrapper and keeps its own surface when neither slot is set", () => {
    const { container } = render(<Textarea variant="ghost" color="blue" />);
    const textarea = screen.getByRole("textbox");

    expect(wrapper(container)).toBeNull();
    expect(textarea.className).not.toMatch(/textarea-inner/);
    expect(textarea.className).toMatch(/composes-field-surface-ghost/);
    expect(textarea).toHaveClass("palette-blue");
  });

  it("wraps the control in a vertical InputWrapper when before is set", () => {
    const { container } = render(<Textarea before="top" />);
    expect(wrapper(container)).toHaveAttribute("data-orientation", "vertical");
    expect(
      container.querySelector("[data-slot='input-before']"),
    ).toHaveTextContent("top");
    expect(container.querySelector("[data-slot='input-after']")).toBeNull();
  });

  it("wraps the control in a vertical InputWrapper when after is set", () => {
    const { container } = render(<Textarea after="bottom" />);
    expect(wrapper(container)).toHaveAttribute("data-orientation", "vertical");
    expect(container.querySelector("[data-slot='input-before']")).toBeNull();
    expect(
      container.querySelector("[data-slot='input-after']"),
    ).toHaveTextContent("bottom");
  });

  it("orders the parts as before, textarea, after", () => {
    const { container } = render(<Textarea before="top" after="bottom" />);
    const slots = Array.from(wrapper(container)?.children ?? []).map((el) =>
      el.getAttribute("data-slot"),
    );
    expect(slots).toEqual(["input-before", "textarea", "input-after"]);
  });

  it("moves variant, fullwidth and color to the wrapper", () => {
    const { container } = render(
      <Textarea before="top" variant="ghost" fullwidth color="blue" />,
    );
    const surface = wrapper(container);
    const textarea = screen.getByRole("textbox");

    expect(surface?.className).toMatch(/composes-field-surface-ghost/);
    expect(surface?.className).toMatch(/composes-fullwidth/);
    expect(surface).toHaveClass("palette-blue");
    expect(surface?.className).toMatch(/composes-field-surface-color/);

    expect(textarea.className).not.toMatch(/composes-field-surface-ghost/);
    expect(textarea.className).not.toMatch(/composes-fullwidth/);
    expect(textarea).not.toHaveClass("palette-blue");
    expect(textarea.className).not.toMatch(/composes-field-surface-color/);
  });

  it("keeps size and resize on the inner textarea and hands size to the wrapper too", () => {
    const { container } = render(
      <Textarea before="top" size="large" resize="none" />,
    );
    const textarea = screen.getByRole("textbox");

    expect(textarea).toHaveClass(styles["textarea"]);
    expect(textarea).toHaveClass(styles["textarea-inner"]);
    expect(textarea).toHaveClass(styles["size-large"]);
    expect(textarea).toHaveClass(styles["resize-none"]);
    expect(wrapper(container)?.className).toMatch(/composes-size-large/);
  });

  it("still lands ref, rows, name and className on the textarea", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(
      <Textarea
        before="top"
        ref={ref}
        rows={6}
        name="bio"
        className="custom"
      />,
    );
    const textarea = screen.getByRole("textbox");

    expect(ref.current).toBe(textarea);
    expect(textarea).toHaveAttribute("rows", "6");
    expect(textarea).toHaveAttribute("name", "bio");
    expect(textarea).toHaveClass("custom");
  });

  /* The wrapper reads disabled and invalid off the textarea through `:has()`,
     so both have to land on the slotted `<textarea>` itself. */
  it("keeps disabled and invalid on the slotted textarea for the wrapper to read", () => {
    const { container } = render(
      <Textarea before="top" disabled aria-invalid="true" />,
    );
    const textarea = screen.getByRole("textbox");

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveAttribute("aria-invalid", "true");
    expect(wrapper(container)?.contains(textarea)).toBe(true);
    expect(wrapper(container)?.className).toMatch(/composes-disabled-within/);
  });

  it("still reports onValueChange from the slotted textarea", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Textarea after="bottom" onValueChange={onValueChange} />);
    await user.type(screen.getByRole("textbox"), "hi");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("lets a button in the after slot take a click and follow the textarea in tab order", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Textarea
        after={
          <button type="button" onClick={onClick}>
            Send
          </button>
        }
      />,
    );
    const textarea = screen.getByRole("textbox");
    const button = screen.getByRole("button", { name: "Send" });

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);

    textarea.focus();
    await user.tab();
    expect(button).toHaveFocus();
  });
});
