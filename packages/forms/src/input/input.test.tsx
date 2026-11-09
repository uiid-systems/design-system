import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@uiid/buttons";
import { describe, it, expect } from "vitest";

import { matchesComposition } from "../shared/matches-composition";
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

describe("InputWrapper orientation", () => {
  it("defaults to horizontal and keeps the classes it had before orientation existed", () => {
    const { container } = render(
      <InputWrapper before="$">
        <InputControl inner />
      </InputWrapper>,
    );
    const wrapper = container.querySelector("[data-slot='input-wrapper']");

    expect(wrapper).toHaveAttribute("data-orientation", "horizontal");
    expect(wrapper).toHaveAttribute("data-ui-ay", "center");
    expect(wrapper).toHaveClass(styles["input"]);
    expect(wrapper).toHaveClass(styles["input-edge"]);
    expect(wrapper).toHaveClass(styles["input-wrapper"]);
    expect(wrapper?.className).toMatch(/composes-size-medium/);
  });

  it("stamps horizontal on the wrapper Input renders", () => {
    const { container } = render(<Input before="$" />);
    expect(
      container.querySelector("[data-slot='input-wrapper']"),
    ).toHaveAttribute("data-orientation", "horizontal");
  });

  it("stacks the slots when vertical and keeps the surface, edge and color", () => {
    const { container } = render(
      <InputWrapper
        orientation="vertical"
        before={<span>top</span>}
        after={<span>bottom</span>}
        color="blue"
      >
        <InputControl inner />
      </InputWrapper>,
    );
    const wrapper = container.querySelector("[data-slot='input-wrapper']");

    expect(wrapper).toHaveAttribute("data-orientation", "vertical");
    expect(wrapper).toHaveAttribute("data-ui-ay", "stretch");
    expect(wrapper).toHaveClass(styles["input"]);
    expect(wrapper).toHaveClass(styles["input-edge"]);
    expect(wrapper).toHaveClass(styles["input-wrapper"]);
    expect(wrapper).toHaveClass("palette-blue");
    expect(wrapper?.className).toMatch(/composes-field-surface-color/);
    expect(container.querySelector("[data-slot='input-before']")).toHaveClass(
      styles["input-slot"],
    );
    expect(container.querySelector("[data-slot='input-after']")).toHaveClass(
      styles["input-slot"],
    );
  });

  it("orders a vertical wrapper as before, control, after", () => {
    const { container } = render(
      <InputWrapper orientation="vertical" before="top" after="bottom">
        <InputControl inner />
      </InputWrapper>,
    );
    const wrapper = container.querySelector("[data-slot='input-wrapper']");
    const slots = Array.from(wrapper?.children ?? []).map((el) =>
      el.getAttribute("data-slot"),
    );

    expect(slots).toEqual(["input-before", "input", "input-after"]);
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

/* The wrapper reads disabled and invalid off its direct children only — the
   control it holds — so a disabled or invalid element inside a slot leaves
   the surface alone. */
describe("Input wrapper states", () => {
  const wrapper = (container: HTMLElement) =>
    container.querySelector("[data-slot='input-wrapper']");

  it("dims the wrapper while the input is disabled", () => {
    const { container } = render(<Input before="$" disabled />);
    expect(matchesComposition(wrapper(container), "disabled-within")).toBe(
      true,
    );
  });

  it("dims the wrapper while the input is aria-disabled, as it does a bare one", () => {
    const { container } = render(<Input before="$" aria-disabled="true" />);
    expect(matchesComposition(wrapper(container), "disabled-within")).toBe(
      true,
    );
  });

  it("leaves the wrapper undimmed and typeable while a button in a slot is disabled", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Input
        after={
          <Button disabled data-disabled="" aria-disabled="true">
            Send
          </Button>
        }
      />,
    );

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(matchesComposition(wrapper(container), "disabled-within")).toBe(
      false,
    );
    await user.type(screen.getByRole("textbox"), "hi");
    expect(screen.getByRole("textbox")).toHaveValue("hi");
  });

  it.each([
    ["data-invalid", { "data-invalid": "" }],
    ["aria-invalid", { "aria-invalid": "true" as const }],
  ])("reddens the wrapper when the input carries %s", (_, invalidProps) => {
    const { container } = render(<Input before="$" {...invalidProps} />);
    expect(matchesComposition(wrapper(container), "invalid")).toBe(true);
  });

  it("leaves the wrapper's edge alone when a control in a slot is invalid", () => {
    const { container } = render(
      <Input
        before={<input aria-label="Tag" aria-invalid="true" data-invalid="" />}
      />,
    );
    expect(matchesComposition(wrapper(container), "invalid")).toBe(false);
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

/* Field reads `disabled` off its root, not the control, so the label and
   description only dim when Input hands it up. `fullwidth` reaches the root
   as `w="full"` so the field stretches with the control it holds. */
describe("Input hands disabled and fullwidth to Field", () => {
  it("dims the label and description with a disabled input", () => {
    render(<Input label="Email" description="Work address" disabled />);
    expect(screen.getByText("Email")).toHaveAttribute("data-disabled");
    expect(screen.getByText("Work address")).toHaveAttribute("data-disabled");
  });

  it("leaves the label and description undimmed while enabled", () => {
    render(<Input label="Email" description="Work address" />);
    expect(screen.getByText("Email")).not.toHaveAttribute("data-disabled");
    expect(screen.getByText("Work address")).not.toHaveAttribute(
      "data-disabled",
    );
  });

  it("stretches the field root with fullwidth", () => {
    const { container } = render(<Input fullwidth />);
    expect(container.querySelector("[data-slot='field-root']")).toHaveAttribute(
      "data-ui-w",
      "full",
    );
  });

  it("leaves the field root at its own width without fullwidth", () => {
    const { container } = render(<Input />);
    expect(
      container.querySelector("[data-slot='field-root']"),
    ).not.toHaveAttribute("data-ui-w");
  });

  /* One excess key per literal: TypeScript reports only the first. */
  it("rejects FieldProps the control owns", () => {
    render(
      <Input
        label="Email"
        // @ts-expect-error label is owned by Input
        FieldProps={{ errorType: "tooltip", label: "Other" }}
      />,
    );
    render(
      <Input
        label="Email"
        // @ts-expect-error disabled is owned by Input
        FieldProps={{ errorType: "tooltip", disabled: true }}
      />,
    );
    expect(screen.getAllByRole("textbox")).toHaveLength(2);
  });
});
