import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Input } from "./input";
import { InputControl, InputWrapper } from "./subcomponents";

import styles from "./input.module.css";

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

  it("hands its size to the field so the chrome scales with the control", () => {
    const { container } = render(<Input label="Email" size="small" />);
    const root = container.querySelector("[data-slot='field-root']");
    expect(root?.className).toMatch(/size-small/);
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

  /* The wrapper renders through `Group`, whose Box reset outranks the
     surface's edge, so it restates the edge or its border is zero wide. */
  it("restates the edge on the wrapper the layout primitive would zero", () => {
    const { container } = render(<Input before="$" />);
    expect(
      container.querySelector("[data-slot='input-wrapper']")?.className,
    ).toMatch(/input-edge/);
  });

  /* A bare input has no primitive to fight, and restating its edge would tie
     with rules that trim it from other modules (`.number-field-input`). */
  it("keeps a bare input off the restated edge", () => {
    render(<Input />);
    expect(screen.getByRole("textbox").className).not.toMatch(/input-edge/);
  });
});

describe("Input color", () => {
  it("tints the control with the palette hue", () => {
    render(<Input color="blue" />);

    const input = screen.getByRole("textbox");

    expect(input).toHaveClass("palette-blue");
    expect(input.className).toMatch(/composes-field-surface-color/);
  });

  it("leaves the control on the plain surface with no color", () => {
    render(<Input />);
    expect(screen.getByRole("textbox").className).not.toMatch(
      /composes-field-surface-color/,
    );
  });

  /*
   * With slots the wrapper is the element wearing the surface, so it takes the
   * hue. The inner input still needs its own copy: the shared surface sets
   * `color` on the element directly, which an inherited value could not outrank.
   */
  it("tints the wrapper and the inner control when slots are present", () => {
    const { container } = render(<Input before="$" color="blue" />);

    const wrapper = container.querySelector("[data-slot='input-wrapper']");

    expect(wrapper).toHaveClass("palette-blue");
    expect(wrapper?.className).toMatch(/composes-field-surface-color/);
    expect(screen.getByRole("textbox").className).toMatch(
      /composes-field-surface-color/,
    );
  });
});

/* Base UI calls a function `className` with the part's state. The wrapper's
   own classes have to merge with what it returns, not drop it. */
describe("Input state-function className", () => {
  it("resolves a state-function className on the control alongside its own class", () => {
    const { container } = render(
      <Input
        disabled
        className={(state) => (state.disabled ? "fn-disabled" : "fn-enabled")}
      />,
    );
    const input = container.querySelector("[data-slot='input']");

    expect(input).toHaveClass("fn-disabled");
    expect(input).toHaveClass(styles["input"]);
  });
});
