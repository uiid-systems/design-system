import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Input } from "./input";
import { InputControl, InputWrapper } from "./subcomponents";

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

  it("renders with data-slot attribute", () => {
    render(<Input />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
  });

  it("applies custom className", () => {
    render(<Input className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("forwards disabled prop", () => {
    render(<Input disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("renders required indicator with label", () => {
    render(<Input label="Email" required />);
    expect(screen.getByText("Email")).toHaveAttribute("data-required", "true");
  });

  it("handles user input", async () => {
    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByRole("textbox");
    await user.type(input, "Hello, World!");

    expect(input).toHaveValue("Hello, World!");
  });

  it("is able to be focused", async () => {
    const user = userEvent.setup();
    render(<Input />);

    const input = screen.getByRole("textbox");
    await user.click(input);

    expect(input).toHaveFocus();
  });
});

describe("Input field wiring", () => {
  it("wires an unlabelled input into a field root", () => {
    const { container } = render(<Input />);
    expect(
      container.querySelector("[data-slot='field-root']"),
    ).toBeInTheDocument();
  });

  it("keeps an unlabelled input out of layout via a bare field root", () => {
    const { container } = render(<Input />);
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).toMatch(/field-root-bare/);
  });
});

describe("Input invalid treatment", () => {
  it("adopts the shared invalid composition", () => {
    render(<Input />);
    expect(screen.getByRole("textbox").className).toMatch(/composes-invalid/);
  });
});

describe("InputWrapper composition", () => {
  it("is composable on its own with before and after slots", () => {
    const { container } = render(
      <InputWrapper before={<span>before</span>} after={<span>after</span>}>
        <InputControl inner />
      </InputWrapper>,
    );

    expect(
      container.querySelector("[data-slot='input-wrapper']"),
    ).not.toBeNull();
    expect(
      container.querySelector("[data-slot='input-before']"),
    ).not.toBeNull();
    expect(container.querySelector("[data-slot='input-after']")).not.toBeNull();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders children bare when neither slot is passed", () => {
    const { container } = render(
      <InputWrapper>
        <InputControl />
      </InputWrapper>,
    );

    expect(container.querySelector("[data-slot='input-wrapper']")).toBeNull();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });
});

describe("Input required reaches the control", () => {
  it("marks the input itself required, not just the label", () => {
    render(<Input label="Email" required />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });

  it("still renders the label's required marker", () => {
    const { container } = render(<Input label="Email" required />);
    expect(
      container.querySelector("[data-slot='field-label'][data-required]"),
    ).not.toBeNull();
  });

  it("leaves the control unrequired when the prop is absent", () => {
    render(<Input label="Email" />);
    expect(screen.getByRole("textbox")).not.toBeRequired();
  });
});

describe("Input shared compositions", () => {
  it("paints the shared field surface", () => {
    render(<Input />);
    expect(screen.getByRole("textbox").className).toMatch(
      /composes-field-surface(?!-)/,
    );
  });

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "lets the %s tier reach a bare input, which the surface no longer outranks",
    (size) => {
      render(<Input size={size} />);
      expect(screen.getByRole("textbox").className).toMatch(
        new RegExp(`composes-size-${size}`),
      );
    },
  );

  it("reads disabled off the control it wraps", () => {
    const { container } = render(<Input before="$" />);
    expect(
      container.querySelector("[data-slot='input-wrapper']")?.className,
    ).toMatch(/composes-disabled-within/);
  });
});
