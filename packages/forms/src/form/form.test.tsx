import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Form } from "./form";
import { Input } from "../input/input";
import { useFormState } from "./hooks/use-form-state";

// Helper component for testing form with native form submission
// Uses a native form wrapper + Form for error context (the recommended pattern)
const TestForm = ({
  onSubmit,
  initialErrors = {},
}: {
  onSubmit?: (data: FormData) => void;
  initialErrors?: Record<string, string>;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(new FormData(e.currentTarget));
      }}
      noValidate
    >
      {/* Form is used for error context only, not as form element */}
      <Form errors={initialErrors} render={<div />}>
        <Input name="email" label="Email" />
        <Input name="password" label="Password" type="password" />
        <button type="submit">Submit</button>
      </Form>
    </form>
  );
};

describe("Form", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders children", () => {
    render(
      <Form>
        <Input name="test" label="Test" />
      </Form>,
    );
    expect(screen.getByLabelText("Test")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Form data-testid="form" />);
    expect(screen.getByTestId("form")).toHaveAttribute("data-slot", "form");
  });

  it("applies custom style", () => {
    render(<Form data-testid="form" style={{ width: "300px" }} />);
    expect(screen.getByTestId("form")).toHaveStyle({ width: "300px" });
  });

  // ============================================
  // ERROR DISPLAY
  // ============================================

  it("displays errors for fields with matching names", () => {
    render(
      <Form errors={{ email: "Invalid email" }}>
        <Input name="email" label="Email" />
      </Form>,
    );

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("displays multiple errors for different fields", () => {
    render(
      <Form
        errors={{
          email: "Invalid email",
          password: "Password too short",
        }}
      >
        <Input name="email" label="Email" />
        <Input name="password" label="Password" />
      </Form>,
    );

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
    expect(screen.getByText("Password too short")).toBeInTheDocument();
  });

  it("does not display errors for fields without matching names", () => {
    render(
      <Form errors={{ other: "Some error" }}>
        <Input name="email" label="Email" />
      </Form>,
    );

    expect(screen.queryByText("Some error")).not.toBeInTheDocument();
  });

  it("updates error display when errors prop changes", async () => {
    const { rerender } = render(
      <Form errors={{}}>
        <Input name="email" label="Email" />
      </Form>,
    );

    expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();

    rerender(
      <Form errors={{ email: "Invalid email" }}>
        <Input name="email" label="Email" />
      </Form>,
    );

    expect(screen.getByText("Invalid email")).toBeInTheDocument();
  });

  it("clears errors when errors prop becomes empty", () => {
    const { rerender } = render(
      <Form errors={{ email: "Invalid email" }}>
        <Input name="email" label="Email" />
      </Form>,
    );

    expect(screen.getByText("Invalid email")).toBeInTheDocument();

    rerender(
      <Form errors={{}}>
        <Input name="email" label="Email" />
      </Form>,
    );

    expect(screen.queryByText("Invalid email")).not.toBeInTheDocument();
  });

  // ============================================
  // FORM SUBMISSION (with native form wrapper)
  // ============================================

  it("allows form submission with native form wrapper", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TestForm onSubmit={handleSubmit} />);

    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it("captures form data on submission", async () => {
    const handleSubmit = vi.fn();
    const user = userEvent.setup();

    render(<TestForm onSubmit={handleSubmit} />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Submit" }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);

    const formData = handleSubmit.mock.calls[0][0];
    expect(formData.get("email")).toBe("test@example.com");
    expect(formData.get("password")).toBe("password123");
  });

  // ============================================
  // RENDER PROP
  // ============================================

  it("renders with custom render prop", () => {
    render(
      <Form render={<div data-testid="custom-container" />}>
        <Input name="test" label="Test" />
      </Form>,
    );

    expect(screen.getByTestId("custom-container")).toBeInTheDocument();
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("associates error messages with fields via aria-describedby", () => {
    render(
      <Form errors={{ email: "Invalid email" }}>
        <Input name="email" label="Email" />
      </Form>,
    );

    const input = screen.getByLabelText("Email");
    const errorId = input.getAttribute("aria-describedby");

    expect(errorId).toBeTruthy();
  });
});

describe("useFormState", () => {
  // Helper component to test the hook
  const TestHookComponent = ({
    onStateChange,
  }: {
    onStateChange?: (state: ReturnType<typeof useFormState>) => void;
  }) => {
    const state = useFormState();
    onStateChange?.(state);

    return (
      <div>
        <button onClick={() => state.setErrors({ test: "Error" })}>
          Set Error
        </button>
        <button onClick={() => state.setLoading(true)}>Set Loading</button>
        <button onClick={state.reset}>Reset</button>
        <span data-testid="errors">{JSON.stringify(state.errors)}</span>
        <span data-testid="loading">{String(state.loading)}</span>
      </div>
    );
  };

  it("initializes with empty errors", () => {
    render(<TestHookComponent />);
    expect(screen.getByTestId("errors")).toHaveTextContent("{}");
  });

  it("initializes with loading false", () => {
    render(<TestHookComponent />);
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });

  it("sets errors when setErrors is called", async () => {
    const user = userEvent.setup();
    render(<TestHookComponent />);

    await user.click(screen.getByRole("button", { name: "Set Error" }));

    expect(screen.getByTestId("errors")).toHaveTextContent('{"test":"Error"}');
  });

  it("sets loading when setLoading is called", async () => {
    const user = userEvent.setup();
    render(<TestHookComponent />);

    await user.click(screen.getByRole("button", { name: "Set Loading" }));

    expect(screen.getByTestId("loading")).toHaveTextContent("true");
  });

  it("resets all state when reset is called", async () => {
    const user = userEvent.setup();
    render(<TestHookComponent />);

    // Set some state
    await user.click(screen.getByRole("button", { name: "Set Error" }));
    await user.click(screen.getByRole("button", { name: "Set Loading" }));

    expect(screen.getByTestId("errors")).toHaveTextContent('{"test":"Error"}');
    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    // Reset
    await user.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByTestId("errors")).toHaveTextContent("{}");
    expect(screen.getByTestId("loading")).toHaveTextContent("false");
  });
});
