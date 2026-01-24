import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Field } from "./field";
import { Form } from "../form/form";
import { Input } from "../input/input";

const renderFieldWithError = (
  errorType: "inline" | "tooltip" | "absolute",
  errorMessage = "This field is required",
) => {
  return render(
    <Form errors={{ testfield: errorMessage }}>
      <Field name="testfield" label="Email" errorType={errorType}>
        <Input name="testfield" />
      </Field>
    </Form>,
  );
};

describe("Field", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders children", () => {
    render(
      <Field label="Email">
        <Input placeholder="Enter email" />
      </Field>,
    );
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(
      <Field label="Username">
        <Input />
      </Field>,
    );
    expect(screen.getByText("Username")).toBeInTheDocument();
  });

  it("renders with description", () => {
    render(
      <Field label="Email" description="We won't share your email">
        <Input />
      </Field>,
    );
    expect(screen.getByText("We won't share your email")).toBeInTheDocument();
  });

  it("renders with required indicator", () => {
    render(
      <Field label="Email" required>
        <Input />
      </Field>,
    );
    expect(screen.getByText("Email")).toHaveAttribute("data-required", "true");
  });

  it("renders with data-slot on root element", () => {
    render(
      <Field label="Email">
        <Input />
      </Field>,
    );
    expect(
      document.querySelector('[data-slot="field-root"]'),
    ).toBeInTheDocument();
  });

  // ============================================
  // ERROR TYPE: INLINE (default)
  // ============================================

  it("defaults errorType to inline", () => {
    renderFieldWithError("inline");
    expect(
      document.querySelector('[data-slot="field-error"]'),
    ).toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="field-error-tooltip"]'),
    ).not.toBeInTheDocument();
  });

  it("renders inline error message", () => {
    renderFieldWithError("inline", "Invalid email");
    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  // ============================================
  // ERROR TYPE: TOOLTIP
  // ============================================

  it("renders error tooltip with errorType='tooltip'", () => {
    renderFieldWithError("tooltip");
    const tooltipTrigger = document.querySelector(
      '[class*="field-error-tooltip"]',
    );
    expect(tooltipTrigger).toBeInTheDocument();
  });

  it("does not render inline error when errorType='tooltip'", () => {
    renderFieldWithError("tooltip");
    expect(
      document.querySelector('[data-slot="field-error"]'),
    ).not.toBeInTheDocument();
  });

  it("renders label group even without label when errorType='tooltip'", () => {
    render(
      <Form errors={{ testfield: "Error" }}>
        <Field name="testfield" errorType="tooltip">
          <Input name="testfield" />
        </Field>
      </Form>,
    );
    const tooltipTrigger = document.querySelector(
      '[class*="field-error-tooltip"]',
    );
    expect(tooltipTrigger).toBeInTheDocument();
  });

  it("renders tooltip trigger icon when field has error", () => {
    renderFieldWithError("tooltip");
    const tooltipTrigger = document.querySelector(
      '[class*="field-error-tooltip"]',
    );
    expect(tooltipTrigger).toBeInTheDocument();
    expect(tooltipTrigger?.querySelector("svg")).toBeInTheDocument();
  });

  it("shows error message in tooltip on hover", async () => {
    const user = userEvent.setup();
    renderFieldWithError("tooltip", "Email is required");

    const tooltipTrigger = document.querySelector(
      '[class*="field-error-tooltip"]',
    );
    expect(tooltipTrigger).toBeInTheDocument();

    await user.hover(tooltipTrigger!);

    await waitFor(() => {
      expect(screen.getByText("Email is required")).toBeInTheDocument();
    });
  });

  // ============================================
  // ERROR TYPE: ABSOLUTE
  // ============================================

  it("renders absolute error with errorType='absolute'", () => {
    renderFieldWithError("absolute");
    expect(
      document.querySelector('[data-slot="field-error"]'),
    ).toBeInTheDocument();
  });

  it("renders absolute error message", () => {
    renderFieldWithError("absolute", "Field required");
    expect(screen.getByText("Field required")).toBeInTheDocument();
  });

  it("does not render tooltip when errorType='absolute'", () => {
    renderFieldWithError("absolute");
    expect(
      document.querySelector('[data-slot="field-error-tooltip"]'),
    ).not.toBeInTheDocument();
  });

  it("applies floating class to root when errorType='absolute'", () => {
    render(
      <Field label="Email" errorType="absolute">
        <Input />
      </Field>,
    );
    const root = document.querySelector('[data-slot="field-root"]');
    expect(root?.className).toMatch(/field-root-floating/);
  });

  it("does not apply floating class for other errorTypes", () => {
    render(
      <Field label="Email" errorType="inline">
        <Input />
      </Field>,
    );
    const root = document.querySelector('[data-slot="field-root"]');
    expect(root?.className).not.toMatch(/field-root-floating/);
  });
});
