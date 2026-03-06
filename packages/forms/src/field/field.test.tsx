import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Field } from "./field";

describe("Field", () => {
  it("renders children", () => {
    render(
      <Field>
        <input data-testid="child" />
      </Field>,
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    const { container } = render(<Field>content</Field>);
    expect(container.querySelector("[data-slot='field-root']")).toBeInTheDocument();
  });

  it("renders with a label", () => {
    render(
      <Field label="Email">
        <input />
      </Field>,
    );
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("renders with a description", () => {
    render(
      <Field description="We'll never share your email.">
        <input />
      </Field>,
    );
    expect(
      screen.getByText("We'll never share your email."),
    ).toBeInTheDocument();
  });

  it("shows required indicator on label", () => {
    render(
      <Field label="Email" required>
        <input />
      </Field>,
    );
    expect(screen.getByText("Email")).toHaveAttribute("data-required", "true");
  });

  it("does not show required indicator when not required", () => {
    render(
      <Field label="Email">
        <input />
      </Field>,
    );
    expect(screen.getByText("Email")).not.toHaveAttribute("data-required");
  });

  it("applies floating class when errorType is absolute", () => {
    const { container } = render(
      <Field label="Email" errorType="absolute">
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).toMatch(/field-root-floating/);
  });

  it("does not apply floating class for inline error", () => {
    const { container } = render(
      <Field label="Email" errorType="inline">
        <input />
      </Field>,
    );
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).not.toMatch(/field-root-floating/);
  });

  it("forwards className to root", () => {
    const { container } = render(
      <Field RootProps={{ className: "custom-field" }}>
        <input />
      </Field>,
    );
    expect(
      container.querySelector("[data-slot='field-root']"),
    ).toHaveClass("custom-field");
  });
});
