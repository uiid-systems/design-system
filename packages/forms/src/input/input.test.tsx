import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@uiid/buttons";
import React from "react";
import { createPortal } from "react-dom";
import { describe, it, expect, vi } from "vitest";

import { matchesComposition } from "../shared/matches-composition";
import { Input } from "./input";
import { INPUT_SLOT_INTERACTIVE } from "./input.constants";
import { inputControlClassName } from "./input.styles";
import { hasInputSlots } from "./input.utils";
import { inputWrapperVariants } from "./input.variants";
import { InputControl, InputWrapper } from "./subcomponents";

import styles from "./input.module.css";
import inputCss from "./input.module.css?raw";
import compositionsCss from "@uiid/tokens/compositions.css?raw";

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

  it("stays mounted as a bare box when neither slot is passed", () => {
    const { container } = render(
      <InputWrapper>
        <InputControl />
      </InputWrapper>,
    );
    const wrapper = container.querySelector("[data-slot='input-wrapper']");

    expect(wrapper).toHaveClass(styles["input-wrapper-bare"]);
    expect(wrapper).not.toHaveClass(styles["input-wrapper"]);
    expect(wrapper).not.toHaveAttribute("data-orientation");
    expect(wrapper?.className).not.toMatch(/composes-field-surface/);
    expect(wrapper).toContainElement(screen.getByRole("textbox"));
  });

  it("keeps a caller's className on the bare wrapper", () => {
    const { container } = render(
      <InputWrapper className="caller">
        <InputControl />
      </InputWrapper>,
    );
    expect(container.querySelector("[data-slot='input-wrapper']")).toHaveClass(
      "caller",
      styles["input-wrapper-bare"],
    );
  });

  it.each([null, false, ""])("treats a %j slot as no slot", (empty) => {
    const { container } = render(
      <InputWrapper before={empty} after={empty}>
        <InputControl />
      </InputWrapper>,
    );

    expect(container.querySelector("[data-slot='input-wrapper']")).toHaveClass(
      styles["input-wrapper-bare"],
    );
    expect(container.querySelector("[data-slot='input-before']")).toBeNull();
  });

  /* One element and child shape in both states, so a slot coming or going
     keeps the control's node, and with it its focus and typed text. */
  it("keeps the control mounted and focused when a slot comes and goes", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Input aria-label="Amount" />);
    const input = screen.getByRole("textbox");

    await user.type(input, "12");
    rerender(<Input aria-label="Amount" before="$" />);

    expect(screen.getByRole("textbox")).toBe(input);
    expect(input).toHaveFocus();
    expect(input).toHaveValue("12");

    rerender(<Input aria-label="Amount" />);
    expect(screen.getByRole("textbox")).toBe(input);
    expect(input).toHaveFocus();
  });
});

describe("hasInputSlots", () => {
  it.each([
    [{}, false],
    [{ before: null, after: undefined }, false],
    [{ before: false, after: "" }, false],
    [{ before: "$" }, true],
    [{ after: 0 }, true],
    [{ after: <span /> }, true],
  ])("reads %j as %s", (slots, expected) => {
    expect(hasInputSlots(slots)).toBe(expected);
  });
});

describe("inputWrapperVariants", () => {
  it.each(["xsmall", "small", "medium", "large"] as const)(
    "sizes the wrapper by its own %s tier, not the shared composition",
    (size) => {
      const className = inputWrapperVariants({ size });
      expect(className).toContain(styles[`size-${size}`]);
      expect(className).not.toMatch(/composes-size-/);
    },
  );

  it("defaults to the medium tier", () => {
    expect(inputWrapperVariants()).toContain(styles["size-medium"]);
  });

  /* The slots and the inner control read the tier's height and inline padding
     off the wrapper, so all three share one size source. */
  it.each([
    ["xsmall", "xs"],
    ["small", "sm"],
    ["medium", "md"],
    ["large", "lg"],
  ])("publishes the %s height, inline padding and icon size", (size, tier) => {
    const rule = inputCss.match(
      new RegExp(`\\.size-${size}\\s*\\{([^}]*)\\}`),
    )?.[1];

    expect(rule).toContain(
      `--input-wrapper-height: var(--forms-size-${tier}-height)`,
    );
    expect(rule).toContain(
      `--input-wrapper-padding-x: var(--forms-size-${tier}-padding-x)`,
    );
    expect(rule).toContain(
      `--forms-icon-size: var(--forms-size-${tier}-icon-size)`,
    );
  });

  /* The fallback keeps an `inner` control padded outside a sized wrapper. */
  it("pads the slots and the inner control from the published var", () => {
    for (const selector of ["input-slot", "input-inner"]) {
      const rule = inputCss.match(
        new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`),
      )?.[1];
      expect(rule).toContain(
        "padding-inline: var(--input-wrapper-padding-x, var(--forms-size-md-padding-x))",
      );
    }
  });
});

describe("InputWrapper orientation", () => {
  it("defaults to horizontal and paints the surface itself", () => {
    const { container } = render(
      <InputWrapper before="$">
        <InputControl inner />
      </InputWrapper>,
    );
    const wrapper = container.querySelector("[data-slot='input-wrapper']");

    expect(wrapper).toHaveAttribute("data-orientation", "horizontal");
    expect(wrapper).toHaveAttribute("data-ui-ay", "center");
    expect(wrapper).toHaveClass(styles["input-edge"]);
    expect(wrapper).toHaveClass(styles["input-wrapper"]);
    expect(wrapper).toHaveClass(styles["size-medium"]);
    expect(wrapper).not.toHaveClass(styles["input"]);
    expect(wrapper?.className).not.toMatch(/composes-size-/);
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
  it("renders text the same way with and without slots", () => {
    const { rerender } = render(<Input />);
    expect(screen.getByRole("textbox").className).toMatch(/composes-text/);
    rerender(<Input before="$" />);
    expect(screen.getByRole("textbox").className).toMatch(/composes-text/);
  });

  /* The control's node persists across a slot toggle, so its classes swap in
     place. A layout property in the transition would animate the swap. */
  it("transitions only paint properties on the shared surface", () => {
    const rule = compositionsCss.match(
      /\.composes-field-surface\s*\{([^}]*?)&/,
    )?.[1];
    expect(rule).toMatch(
      /transition-property:\s*background-color,\s*border-color,\s*outline-color,\s*color;/,
    );
    expect(rule).not.toMatch(/transition:\s*all/);
  });

  it("paints the surface, invalid edge and focus ring on the wrapper", () => {
    const { container } = render(<Input before="$" />);
    const className = container.querySelector(
      "[data-slot='input-wrapper']",
    )?.className;

    expect(className).toMatch(/composes-field-surface(?!-)/);
    expect(className).toMatch(/composes-invalid/);
  });

  /* The wrapper paints every surface treatment once; a second copy on the
     inner control would compound the disabled opacity and double the edge. */
  it("drops every surface composition from the inner control", () => {
    render(<Input before="$" />);
    const input = screen.getByRole("textbox");

    expect(input).toHaveClass(styles["input-inner"]);
    expect(input).not.toHaveClass(styles["input"]);
    expect(input.className).not.toMatch(
      /composes-(field-surface|invalid|disabled|size)/,
    );
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

    expect(screen.getByRole("button", { name: "Send" })).toBeDisabledForUser();
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

  /* With slots the wrapper wears the surface and takes the hue. The inner
     control paints no surface, so it inherits the wrapper's text colour. */
  it("tints only the wrapper when slots are present", () => {
    const { container } = render(<Input before="$" color="blue" />);

    const wrapper = container.querySelector("[data-slot='input-wrapper']");
    const input = screen.getByRole("textbox");

    expect(wrapper).toHaveClass("palette-blue");
    expect(wrapper?.className).toMatch(/composes-field-surface-color/);
    expect(input).not.toHaveClass("palette-blue");
    expect(input.className).not.toMatch(/composes-field-surface-color/);
  });

  it("leaves the bare wrapper untinted, so the input alone wears the hue", () => {
    const { container } = render(<Input color="blue" />);
    expect(
      container.querySelector("[data-slot='input-wrapper']"),
    ).not.toHaveClass("palette-blue");
    expect(screen.getByRole("textbox")).toHaveClass("palette-blue");
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

describe("Input slot click-to-focus", () => {
  it("focuses the input when plain slot content is pressed", async () => {
    const user = userEvent.setup();
    render(<Input before={<span>https://</span>} />);

    await user.click(screen.getByText("https://"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("focuses the input when the wrapper's own padding is pressed", async () => {
    const user = userEvent.setup();
    const { container } = render(<Input before="$" />);

    await user.click(
      container.querySelector<HTMLElement>("[data-slot='input-wrapper']")!,
    );
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("leaves a press on a button in a slot to the button", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Input
        after={
          <button type="button" onClick={onClick}>
            Action
          </button>
        }
      />,
    );

    await user.click(screen.getByRole("button", { name: "Action" }));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("textbox")).not.toHaveFocus();
  });

  /* A dialog popup carries `tabindex="-1"`, which an unscoped `closest` would
     mistake for interactive slot content. */
  it("focuses the input from slot content inside a tabindex ancestor", async () => {
    const user = userEvent.setup();
    render(
      <div role="dialog" tabIndex={-1}>
        <Input before={<span>https://</span>} />
      </div>,
    );

    await user.click(screen.getByText("https://"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("leaves a press in a slot's portal to the portal", async () => {
    const user = userEvent.setup();
    render(
      <Input
        aria-label="Query"
        after={createPortal(<span>No results</span>, document.body)}
      />,
    );

    await user.click(screen.getByText("No results"));
    expect(screen.getByRole("textbox", { name: "Query" })).not.toHaveFocus();
  });
});

describe("Input inert slots", () => {
  it("makes the slots inert while the input is disabled", () => {
    const { container } = render(
      <Input before="$" after={<button type="button">Go</button>} disabled />,
    );

    expect(
      container.querySelector("[data-slot='input-before']"),
    ).toHaveAttribute("inert");
    expect(
      container.querySelector("[data-slot='input-after']"),
    ).toHaveAttribute("inert");
  });

  it("leaves the slots interactive while the input is enabled", () => {
    const { container } = render(<Input before="$" after="USD" />);

    expect(
      container.querySelector("[data-slot='input-before']"),
    ).not.toHaveAttribute("inert");
    expect(
      container.querySelector("[data-slot='input-after']"),
    ).not.toHaveAttribute("inert");
  });
});

describe("Input slot pointer events", () => {
  /* The slot turns pointer events off and back on only for interactive
     content. A selector missing from that list never receives the press, so
     it falls through to the wrapper and focuses the control instead. */
  it("re-enables pointer events for every selector the wrapper leaves alone", () => {
    const rule = compositionsCss.match(
      /\.composes-field-slot\s*\{[\s\S]*?&:where\(\s*:has\(([\s\S]*?)\)\s*\)\s*\{/,
    );
    expect(rule).not.toBeNull();
    const reEnabled = rule![1].split(/,\s*/).map((selector) => selector.trim());
    expect(reEnabled).toEqual(expect.arrayContaining(INPUT_SLOT_INTERACTIVE));
  });
});

describe("InputControl", () => {
  it("renders an input carrying the input slot", () => {
    render(<InputControl />);
    expect(screen.getByRole("textbox").tagName).toBe("INPUT");
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "input");
  });

  it("forwards its ref to the input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<InputControl ref={ref} />);
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });

  it("reports onValueChange as the user types", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<InputControl onValueChange={onValueChange} />);

    await user.type(screen.getByRole("textbox"), "hi");
    expect(onValueChange).toHaveBeenLastCalledWith("hi", expect.anything());
  });

  it("keeps a string className alongside its own", () => {
    render(<InputControl className="extra" />);
    expect(screen.getByRole("textbox")).toHaveClass(styles["input"], "extra");
  });

  it("keeps the hue off the native color attribute", () => {
    render(<InputControl color="blue" />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("color");
  });
});

describe("inputControlClassName", () => {
  it("returns the bare surface at the medium tier by default", () => {
    // Composed modules resolve to several space-separated names, so match substrings.
    const classes = inputControlClassName();
    expect(classes).toContain(styles["input"]);
    expect(classes).toContain(styles["input-size-medium"]);
  });

  it("returns only the inner treatment, plus a className, when inner", () => {
    expect(
      inputControlClassName({
        inner: true,
        size: "large",
        color: "blue",
        className: "extra",
      }),
    ).toBe(`${styles["input-inner"]} extra`);
  });
});

describe("Input props and state", () => {
  it("forwards additional props to the input", () => {
    render(<Input type="email" maxLength={20} autoComplete="email" />);
    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("maxlength", "20");
    expect(input).toHaveAttribute("autocomplete", "email");
  });

  it("forwards its ref to the input, with or without a label", () => {
    const bare = React.createRef<HTMLInputElement>();
    const labelled = React.createRef<HTMLInputElement>();
    render(
      <>
        <Input ref={bare} aria-label="Bare" />
        <Input ref={labelled} label="Labelled" />
      </>,
    );
    expect(bare.current).toBe(screen.getByLabelText("Bare"));
    expect(labelled.current).toBe(screen.getByLabelText("Labelled"));
  });

  it("is reached by keyboard", async () => {
    const user = userEvent.setup();
    render(<Input />);

    await user.tab();
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("renders with defaultValue", () => {
    render(<Input defaultValue="Initial" />);
    expect(screen.getByRole("textbox")).toHaveValue("Initial");
  });

  it("drives a controlled value through onValueChange", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = React.useState("");
      return <Input value={value} onValueChange={setValue} />;
    };
    render(<Controlled />);

    await user.type(screen.getByRole("textbox"), "hi");
    expect(screen.getByRole("textbox")).toHaveValue("hi");
  });

  it("drops data-filled when a controlled value is cleared from outside", () => {
    const { rerender } = render(<Input value="hi" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-filled");

    rerender(<Input value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).not.toHaveAttribute("data-filled");
  });

  it("takes no typing while disabled, and disables the field around it", async () => {
    const user = userEvent.setup();
    const { container } = render(<Input label="Email" disabled />);

    await user.type(screen.getByRole("textbox"), "hi");

    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(container.querySelector("[data-slot='field-root']")).toHaveAttribute(
      "data-disabled",
    );
  });

  it("can be read only", async () => {
    const user = userEvent.setup();
    render(<Input readOnly defaultValue="Fixed" />);

    await user.type(screen.getByRole("textbox"), "!");
    expect(screen.getByRole("textbox")).toHaveValue("Fixed");
  });
});

describe("Input field chrome", () => {
  it("describes the input with its description", () => {
    render(<Input label="Email" description="We never share it." />);
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "We never share it.",
    );
  });

  it("renders an action beside the label", () => {
    render(<Input label="Password" action={<a href="#reset">Forgot?</a>} />);
    expect(
      screen
        .getByRole("link", { name: "Forgot?" })
        .closest("[data-slot='field-action']"),
    ).not.toBeNull();
  });

  it("keeps a caller's id wired to the label", async () => {
    const user = userEvent.setup();
    render(<Input id="email" label="Email" />);

    expect(screen.getByRole("textbox")).toHaveAttribute("id", "email");
    await user.click(screen.getByText("Email"));
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("reaches the field around it through FieldProps", () => {
    const { container } = render(<Input FieldProps={{ className: "outer" }} />);
    expect(container.querySelector("[data-slot='field-root']")).toHaveClass(
      "outer",
    );
  });

  it("is marked invalid, with the error shown, when the field is driven invalid", () => {
    render(
      <Input
        label="Email"
        FieldProps={{
          invalid: true,
          ErrorProps: { match: true, children: "Enter an email" },
        }}
      />,
    );
    const input = screen.getByRole("textbox");

    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("data-invalid");
    expect(screen.getByText("Enter an email")).toHaveAttribute(
      "data-slot",
      "field-error",
    );
  });

  it("reads invalid and disabled states off the bare input", () => {
    render(<Input disabled aria-invalid="true" />);
    const input = screen.getByRole("textbox");

    expect(matchesComposition(input, "invalid")).toBe(true);
    expect(matchesComposition(input, "disabled")).toBe(true);
  });
});

/*
 * react-hook-form's `register` hands back `name`, `onChange`, `onBlur` and a
 * callback `ref`, spread straight onto the control.
 */
describe("Input with a register-shaped spread", () => {
  it.each([
    ["Input", Input],
    ["InputControl", InputControl],
  ])(
    "lands name, ref and the change and blur handlers on %s",
    async (_, Component) => {
      const user = userEvent.setup();
      const onChange = vi.fn();
      const onBlur = vi.fn();
      let registered: HTMLInputElement | null = null;
      const ref = (element: HTMLInputElement | null) => {
        registered = element;
      };

      render(<Component {...{ name: "email", onChange, onBlur, ref }} />);
      const input = screen.getByRole("textbox");
      await user.type(input, "hi");
      await user.tab();

      expect(registered).toBe(input);
      expect(input).toHaveAttribute("name", "email");
      expect(onChange).toHaveBeenLastCalledWith(
        expect.objectContaining({ target: input }),
      );
      expect(onBlur).toHaveBeenCalled();
    },
  );
});

describe("Input before/after slots", () => {
  it("treats an empty list as no slot", () => {
    const { container } = render(<Input before={[]} after={[null, false]} />);

    expect(container.querySelector("[data-slot='input-wrapper']")).toHaveClass(
      styles["input-wrapper-bare"],
    );
    expect(screen.getByRole("textbox")).not.toHaveClass(styles["input-inner"]);
  });

  it("renders 0 inside the slot rather than beside it", () => {
    const { container } = render(<Input after={0} />);
    expect(
      container.querySelector("[data-slot='input-after']"),
    ).toHaveTextContent("0");
  });

  it("orders the parts as before, input, after", () => {
    const { container } = render(<Input before="$" after="USD" />);
    const parts = Array.from(
      container.querySelector("[data-slot='input-wrapper']")?.children ?? [],
    ).map((el) => el.getAttribute("data-slot"));

    expect(parts).toEqual(["input-before", "input", "input-after"]);
  });

  it("still lands ref, name and className on the input", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input before="$" ref={ref} name="amount" className="custom" />);
    const input = screen.getByRole("textbox");

    expect(ref.current).toBe(input);
    expect(input).toHaveAttribute("name", "amount");
    expect(input).toHaveClass("custom");
  });

  it("keeps the label and description wired to the slotted input", () => {
    render(
      <Input before="$" after="USD" label="Amount" description="Before tax." />,
    );

    expect(screen.getByLabelText("Amount")).toBe(screen.getByRole("textbox"));
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(
      "Before tax.",
    );
  });

  it("still reports onValueChange from the slotted input", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Input after="USD" onValueChange={onValueChange} />);

    await user.type(screen.getByRole("textbox"), "12");
    expect(onValueChange).toHaveBeenLastCalledWith("12", expect.anything());
  });

  it("puts a button in the after slot next in tab order", async () => {
    const user = userEvent.setup();
    render(<Input after={<button type="button">Action</button>} />);

    screen.getByRole("textbox").focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Action" })).toHaveFocus();
  });
});
