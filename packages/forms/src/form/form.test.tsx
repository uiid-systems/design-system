import {
  act,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Input } from "../input/input";
import { Form } from "./form";
import { useFormSubmit } from "./hooks/use-form-state";

import styles from "./form.module.css";

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

  it("clears errors when errors prop becomes empty", async () => {
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

    await waitFor(() =>
      expect(screen.queryByText("Invalid email")).not.toBeInTheDocument(),
    );
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

  // ============================================
  // CLASSNAME
  // ============================================

  // A part's `className` is a string, merged with its own module class.
  it("merges a caller's className on the form with its own class", () => {
    const { container } = render(<Form className="caller" />);
    const form = container.querySelector("[data-slot='form']");

    expect(form).toHaveClass("caller", styles["form"]);
  });
});

describe("useFormSubmit state setters", () => {
  // Helper component to test the hook
  const TestHookComponent = ({
    onStateChange,
  }: {
    onStateChange?: (
      state: ReturnType<typeof useFormSubmit<Record<string, unknown>>>,
    ) => void;
  }) => {
    const state = useFormSubmit();
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

  it("sets success and result and calls onSuccess when setResult is called", () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onSuccess }));

    act(() => result.current.setErrors({ name: "Taken" }));
    act(() => result.current.setResult({ id: 1 }));

    expect(result.current.success).toBe(true);
    expect(result.current.result).toEqual({ id: 1 });
    expect(result.current.errors).toEqual({});
    expect(onSuccess).toHaveBeenCalledExactlyOnceWith({ id: 1 });
  });
});

describe("useFormSubmit", () => {
  type Response = { errors?: Record<string, string>; result?: { id: number } };
  const deferred = () => {
    let resolve!: (value: Response) => void;
    const promise = new Promise<Response>((r) => (resolve = r));
    return { promise, resolve };
  };

  it("stays loading when an earlier submit settles before the latest one", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onSuccess, onError }));
    const first = deferred();
    const second = deferred();

    let firstPending!: Promise<void>;
    let secondPending!: Promise<void>;
    act(() => {
      firstPending = result.current.handleSubmit(() => first.promise);
    });
    act(() => {
      secondPending = result.current.handleSubmit(() => second.promise);
    });

    await act(async () => {
      first.resolve({ errors: { name: "Taken" } });
      await firstPending;
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.errors).toEqual({});
    expect(onError).not.toHaveBeenCalled();

    await act(async () => {
      second.resolve({ result: { id: 2 } });
      await secondPending;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.result).toEqual({ id: 2 });
    expect(onSuccess).toHaveBeenCalledExactlyOnceWith({ id: 2 });
  });

  it("ignores an earlier submit that settles after the latest one", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onSuccess, onError }));
    const first = deferred();
    const second = deferred();

    let firstPending!: Promise<void>;
    let secondPending!: Promise<void>;
    act(() => {
      firstPending = result.current.handleSubmit(() => first.promise);
    });
    act(() => {
      secondPending = result.current.handleSubmit(() => second.promise);
    });

    await act(async () => {
      second.resolve({ result: { id: 2 } });
      await secondPending;
    });
    await act(async () => {
      first.resolve({ errors: { name: "Taken" } });
      await firstPending;
    });

    expect(result.current.success).toBe(true);
    expect(result.current.result).toEqual({ id: 2 });
    expect(result.current.errors).toEqual({});
    expect(onSuccess).toHaveBeenCalledOnce();
    expect(onError).not.toHaveBeenCalled();
  });

  it("ignores a pending submit that settles after reset", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onSuccess }));
    const pendingResponse = deferred();

    let pending!: Promise<void>;
    act(() => {
      pending = result.current.handleSubmit(() => pendingResponse.promise);
    });
    act(() => result.current.reset());

    await act(async () => {
      pendingResponse.resolve({ result: { id: 1 } });
      await pending;
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.result).toBeNull();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("keeps a manual setResult when a pending submit settles later", async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onError }));
    const pendingResponse = deferred();

    let pending!: Promise<void>;
    act(() => {
      pending = result.current.handleSubmit(() => pendingResponse.promise);
    });
    act(() => result.current.setResult({ id: 1 }));

    expect(result.current.loading).toBe(false);

    await act(async () => {
      pendingResponse.resolve({ errors: { name: "Taken" } });
      await pending;
    });

    expect(result.current.success).toBe(true);
    expect(result.current.result).toEqual({ id: 1 });
    expect(result.current.errors).toEqual({});
    expect(onError).not.toHaveBeenCalled();
  });

  it("skips the submit of a call superseded during its delay", async () => {
    vi.useFakeTimers();
    try {
      const first = vi.fn(async () => ({ result: { id: 1 } }));
      const second = vi.fn(async () => ({ result: { id: 2 } }));
      const { result } = renderHook(() => useFormSubmit({ delay: 300 }));

      await act(async () => {
        void result.current.handleSubmit(first);
      });
      await act(async () => {
        void result.current.handleSubmit(second);
      });
      await act(() => vi.advanceTimersByTimeAsync(300));

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledOnce();
      expect(result.current.result).toEqual({ id: 2 });
      expect(result.current.loading).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });

  it("sets success and result when the submit returns a result", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onSuccess }));

    await act(() =>
      result.current.handleSubmit(async () => ({ result: { id: 1 } })),
    );

    expect(result.current.success).toBe(true);
    expect(result.current.result).toEqual({ id: 1 });
    expect(onSuccess).toHaveBeenCalledExactlyOnceWith({ id: 1 });
  });

  it("calls onSuccess for a falsy result", async () => {
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useFormSubmit<number>({ onSuccess }));

    await act(() => result.current.handleSubmit(async () => ({ result: 0 })));

    expect(result.current.success).toBe(true);
    expect(result.current.result).toBe(0);
    expect(onSuccess).toHaveBeenCalledExactlyOnceWith(0);
  });

  it("sets errors and calls onError only with the returned errors", async () => {
    const onError = vi.fn();
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onError, onSuccess }));

    await act(() =>
      result.current.handleSubmit(async () => ({
        errors: { email: "Required" },
      })),
    );

    expect(result.current.errors).toEqual({ email: "Required" });
    expect(result.current.success).toBe(false);
    expect(result.current.result).toBeNull();
    expect(onError).toHaveBeenCalledExactlyOnceWith({ email: "Required" });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("does not call onError on a successful submit", async () => {
    const onError = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onError }));

    await act(() => result.current.handleSubmit(async () => ({ result: {} })));

    expect(onError).not.toHaveBeenCalled();
  });

  it("clears previous errors, success and result when a new submit starts", async () => {
    const { result } = renderHook(() => useFormSubmit());

    await act(() =>
      result.current.handleSubmit(async () => ({ result: { id: 1 } })),
    );
    expect(result.current.success).toBe(true);

    let resolve!: (value: { errors: Record<string, string> }) => void;
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.handleSubmit(
        () => new Promise((r) => (resolve = r)),
      );
    });

    expect(result.current.success).toBe(false);
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve({ errors: { name: "Taken" } });
      await pending;
    });

    expect(result.current.errors).toEqual({ name: "Taken" });
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it("rejects and resets loading, success and result when the submit throws", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const { result } = renderHook(() => useFormSubmit({ onSuccess, onError }));

    await act(() =>
      result.current.handleSubmit(async () => ({ result: { id: 1 } })),
    );
    onSuccess.mockClear();

    const failure = new Error("Network down");
    await act(async () => {
      await expect(
        result.current.handleSubmit(async () => {
          throw failure;
        }),
      ).rejects.toBe(failure);
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.result).toBeNull();
    expect(onSuccess).not.toHaveBeenCalled();
    expect(onError).not.toHaveBeenCalled();
  });

  it("is loading until the submit settles", async () => {
    const { result } = renderHook(() => useFormSubmit());
    const submitFn = vi.fn(async () => ({ result: {} }));

    let resolve!: () => void;
    const gate = new Promise<void>((r) => (resolve = r));
    let pending!: Promise<void>;
    act(() => {
      pending = result.current.handleSubmit(async () => {
        await gate;
        return submitFn();
      });
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolve();
      await pending;
    });

    expect(submitFn).toHaveBeenCalledOnce();
    expect(result.current.loading).toBe(false);
  });

  it("calls the submit immediately when no delay is set", async () => {
    vi.useFakeTimers();
    try {
      const submitFn = vi.fn(async () => ({ result: {} }));
      const { result } = renderHook(() => useFormSubmit());

      await act(async () => {
        void result.current.handleSubmit(submitFn);
      });

      expect(submitFn).toHaveBeenCalledOnce();
    } finally {
      vi.useRealTimers();
    }
  });

  it("waits for an explicit delay before calling the submit", async () => {
    vi.useFakeTimers();
    try {
      const submitFn = vi.fn(async () => ({ result: {} }));
      const { result } = renderHook(() => useFormSubmit({ delay: 300 }));

      await act(async () => {
        void result.current.handleSubmit(submitFn);
      });
      expect(submitFn).not.toHaveBeenCalled();

      await act(() => vi.advanceTimersByTimeAsync(300));
      expect(submitFn).toHaveBeenCalledOnce();
      expect(result.current.success).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });

  it("keeps handleSubmit stable across renders with inline options", () => {
    const { result, rerender } = renderHook(() =>
      useFormSubmit({ onSuccess: () => {} }),
    );
    const first = result.current.handleSubmit;

    rerender();

    expect(result.current.handleSubmit).toBe(first);
  });

  it("calls the latest onSuccess after a rerender", async () => {
    const first = vi.fn();
    const second = vi.fn();
    const { result, rerender } = renderHook(
      ({ onSuccess }) => useFormSubmit({ onSuccess }),
      { initialProps: { onSuccess: first } },
    );

    rerender({ onSuccess: second });
    await act(() => result.current.handleSubmit(async () => ({ result: {} })));

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });
});

/* Type-level only: `pnpm typecheck` fails if the directive goes unused. */
describe("className", () => {
  it("takes a string, not a function of the part's state", () => {
    // @ts-expect-error -- style a state through its `data-*` attribute instead
    void (<Form className={() => "from-fn"} />);
  });
});
