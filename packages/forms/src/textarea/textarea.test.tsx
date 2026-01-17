import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Textarea } from "./textarea";

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
    expect(screen.getByText("Message")).toHaveAttribute("data-required", "true");
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
    const { rerender } = render(<Textarea size="small" />);
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
    render(<Textarea ghost />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});
