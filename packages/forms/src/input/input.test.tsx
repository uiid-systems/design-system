import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with a placeholder", () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText("Enter text...")).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders with a description", () => {
    render(<Input description="We'll never share your email." />);
    expect(
      screen.getByText("We'll never share your email."),
    ).toBeInTheDocument();
  });

  it("wraps input in a Field when error is provided", () => {
    render(<Input error="This field is required" />);
    const input = screen.getByRole("textbox");
    // The input should be inside a Field component (data-slot="field")
    expect(input.closest('[data-slot="field"]')).toBeInTheDocument();
  });

  it("applies size data attribute", () => {
    render(<Input size="lg" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-size", "lg");
  });

  it("defaults to md size", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-size", "md");
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("forwards disabled prop", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("forwards required prop", () => {
    render(<Input required />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello, World!");

    expect(input).toHaveValue("Hello, World!");
  });

  it("renders with input slot data attribute", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
  });
});
