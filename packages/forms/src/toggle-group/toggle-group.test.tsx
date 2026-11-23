import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { afterEach, describe, it, expect, vi } from "vitest";

import { Toggle, ToggleGroup } from "./toggle-group";

import styles from "./toggle-group.module.css";

const SIZES = ["xsmall", "small", "medium", "large"] as const;

const renderGroup = (props: React.ComponentProps<typeof ToggleGroup> = {}) =>
  render(
    <ToggleGroup {...props}>
      <Toggle value="monthly">Monthly</Toggle>
      <Toggle value="yearly">Yearly</Toggle>
    </ToggleGroup>,
  );

describe("ToggleGroup size", () => {
  it.each(SIZES)("marks the panel with the %s tier", (size) => {
    const { container } = renderGroup({ size });
    expect(
      container.querySelector(`[data-size="${size}"]`),
    ).toBeInTheDocument();
  });

  it.each(SIZES)(
    "hands the %s tier to every toggle, not just the panel",
    (size) => {
      renderGroup({ size });
      for (const toggle of screen.getAllByRole("button")) {
        expect(toggle.className).toMatch(new RegExp(`composes-size-${size}`));
      }
    },
  );

  it("defaults to the medium tier, matching the other form controls", () => {
    const { container } = renderGroup();
    expect(container.querySelector('[data-size="medium"]')).toBeInTheDocument();
    expect(screen.getAllByRole("button")[0].className).toMatch(
      /composes-size-medium/,
    );
  });

  it("keeps a consumer's own className alongside the tier", () => {
    render(
      <ToggleGroup size="large">
        <Toggle value="monthly" className="custom">
          Monthly
        </Toggle>
      </ToggleGroup>,
    );
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveClass("custom");
    expect(toggle.className).toMatch(/composes-size-large/);
  });
});

describe("ToggleGroup disabled", () => {
  it("gives every toggle the shared disabled treatment to dim against", () => {
    renderGroup();
    for (const toggle of screen.getAllByRole("button")) {
      expect(toggle.className).toMatch(/composes-disabled/);
    }
  });

  it("marks every toggle disabled when the group is", () => {
    renderGroup({ disabled: true });
    for (const toggle of screen.getAllByRole("button")) {
      expect(toggle).toBeDisabled();
      expect(toggle).toHaveAttribute("data-disabled");
    }
  });

  it("leaves the siblings of a single disabled toggle pressable", () => {
    render(
      <ToggleGroup defaultValue={["monthly"]}>
        <Toggle value="monthly">Monthly</Toggle>
        <Toggle value="yearly" disabled>
          Yearly
        </Toggle>
      </ToggleGroup>,
    );
    const [monthly, yearly] = screen.getAllByRole("button");
    expect(yearly).toBeDisabled();
    expect(yearly).toHaveAttribute("data-disabled");
    expect(monthly).toBeEnabled();
    expect(monthly).not.toHaveAttribute("data-disabled");
  });
});

describe("ToggleGroup multiple", () => {
  const renderFormatting = (props = {}) =>
    render(
      <ToggleGroup multiple defaultValue={["bold"]} {...props}>
        <Toggle value="bold">Bold</Toggle>
        <Toggle value="italic">Italic</Toggle>
      </ToggleGroup>,
    );

  it("drops the indicator, which cannot sit behind several toggles at once", () => {
    const { container } = renderFormatting();
    expect(
      container.querySelector('[data-slot="toggle-group-indicator"]'),
    ).not.toBeInTheDocument();
  });

  it("keeps the indicator for a single-selection group", () => {
    const { container } = renderGroup({ defaultValue: ["monthly"] });
    expect(
      container.querySelector('[data-slot="toggle-group-indicator"]'),
    ).toBeInTheDocument();
  });

  it("marks the panel so the toggles can paint their own pressed background", () => {
    const { container } = renderFormatting();
    expect(container.querySelector("[data-multiple]")).toBeInTheDocument();
  });

  it("holds every pressed toggle, not just the first", async () => {
    const user = userEvent.setup();
    renderFormatting();
    const [bold, italic] = screen.getAllByRole("button");

    await user.click(italic);

    expect(bold).toHaveAttribute("data-pressed");
    expect(italic).toHaveAttribute("data-pressed");
  });

  it("releases a pressed toggle when it is pressed again", async () => {
    const user = userEvent.setup();
    renderFormatting();
    const [bold] = screen.getAllByRole("button");

    await user.click(bold);

    expect(bold).not.toHaveAttribute("data-pressed");
  });
});

/* A single-selection group that holds a value keeps one. Base UI releases the
   pressed toggle when it is pressed again, so the group refuses that change
   itself, for the keyboard as well as the pointer. */
describe("ToggleGroup single selection", () => {
  const indicator = (container: HTMLElement) =>
    container.querySelector('[data-slot="toggle-group-indicator"]');

  it.each([
    ["Space", " "],
    ["Enter", "{Enter}"],
  ])("keeps the pressed toggle pressed on %s", async (_name, key) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { container } = renderGroup({
      defaultValue: ["monthly"],
      onValueChange,
    });
    const [monthly, yearly] = screen.getAllByRole("button");

    monthly.focus();
    await user.keyboard(key);

    expect(monthly).toHaveAttribute("aria-pressed", "true");
    expect(yearly).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange).not.toHaveBeenCalled();
    expect(indicator(container)).toBeInTheDocument();
  });

  it("keeps the pressed toggle pressed when it is clicked", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderGroup({ defaultValue: ["monthly"], onValueChange });
    const monthly = screen.getByRole("button", { name: "Monthly" });

    await user.click(monthly);

    expect(monthly).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  /* A controlled parent that stores whatever it is handed would empty the
     group itself, so the refused change must never reach its handler. */
  it("keeps a controlled value when its pressed toggle is pressed again", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();

    const Billing = () => {
      const [plan, setPlan] = useState(["monthly"]);

      return (
        <ToggleGroup
          value={plan}
          onValueChange={(next, details) => {
            onValueChange(next, details);
            setPlan(next);
          }}
        >
          <Toggle value="monthly">Monthly</Toggle>
          <Toggle value="yearly">Yearly</Toggle>
        </ToggleGroup>
      );
    };
    render(<Billing />);
    const monthly = screen.getByRole("button", { name: "Monthly" });

    monthly.focus();
    await user.keyboard(" ");

    expect(monthly).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([
    ["Space", " "],
    ["Enter", "{Enter}"],
  ])("still switches to a different toggle on %s", async (_name, key) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    renderGroup({ defaultValue: ["monthly"], onValueChange });
    const [monthly, yearly] = screen.getAllByRole("button");

    yearly.focus();
    await user.keyboard(key);

    expect(monthly).toHaveAttribute("aria-pressed", "false");
    expect(yearly).toHaveAttribute("aria-pressed", "true");
    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(onValueChange.mock.calls[0][0]).toEqual(["yearly"]);
  });

  it("lets a multiple group be emptied from the keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ToggleGroup
        multiple
        defaultValue={["bold"]}
        onValueChange={onValueChange}
      >
        <Toggle value="bold">Bold</Toggle>
        <Toggle value="italic">Italic</Toggle>
      </ToggleGroup>,
    );
    const bold = screen.getByRole("button", { name: "Bold" });

    bold.focus();
    await user.keyboard(" ");

    expect(bold).toHaveAttribute("aria-pressed", "false");
    expect(onValueChange.mock.calls[0][0]).toEqual([]);
  });

  it("shows no indicator while a group that starts empty has no value", async () => {
    const user = userEvent.setup();
    const { container } = renderGroup();

    expect(indicator(container)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Yearly" }));

    expect(indicator(container)).toBeInTheDocument();
  });

  it("shows no indicator for a controlled group with an empty value", () => {
    const { container, rerender } = render(
      <ToggleGroup value={["monthly"]}>
        <Toggle value="monthly">Monthly</Toggle>
      </ToggleGroup>,
    );
    expect(indicator(container)).toBeInTheDocument();

    rerender(
      <ToggleGroup value={[]}>
        <Toggle value="monthly">Monthly</Toggle>
      </ToggleGroup>,
    );

    expect(indicator(container)).not.toBeInTheDocument();
  });
});

describe("ToggleGroup orientation", () => {
  const renderOriented = (orientation?: "horizontal" | "vertical") =>
    render(
      <ToggleGroup orientation={orientation} defaultValue={["a"]}>
        <Toggle value="a">A</Toggle>
        <Toggle value="b">B</Toggle>
      </ToggleGroup>,
    );

  it("reports its orientation on the panel, horizontal included", () => {
    const { container } = renderOriented();
    expect(container.firstElementChild).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("reports a vertical orientation on the panel", () => {
    const { container } = renderOriented("vertical");
    expect(container.firstElementChild).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("walks a horizontal group with the horizontal arrow keys", async () => {
    const user = userEvent.setup();
    renderOriented("horizontal");
    const [a, b] = screen.getAllByRole("button");

    a.focus();
    await user.keyboard("{ArrowRight}");
    expect(b).toHaveFocus();
  });

  it("walks a vertical group with the vertical arrow keys", async () => {
    const user = userEvent.setup();
    renderOriented("vertical");
    const [a, b] = screen.getAllByRole("button");

    a.focus();
    await user.keyboard("{ArrowDown}");
    expect(b).toHaveFocus();
  });

  it("ignores the cross-axis arrow keys in a vertical group", async () => {
    const user = userEvent.setup();
    renderOriented("vertical");
    const [a] = screen.getAllByRole("button");

    a.focus();
    await user.keyboard("{ArrowRight}");
    expect(a).toHaveFocus();
  });
});

describe("ToggleGroup fullwidth", () => {
  it.each(["horizontal", "vertical"] as const)(
    "stretches a %s panel with the shared fullwidth composition",
    (orientation) => {
      const { container } = renderGroup({ fullwidth: true, orientation });
      const panel = container.firstElementChild;
      expect(panel).toHaveAttribute("data-orientation", orientation);
      expect(panel?.className).toMatch(/composes-fullwidth/);
    },
  );

  it("shrink-wraps its toggles by default", () => {
    const { container } = renderGroup();
    expect(container.firstElementChild?.className).not.toMatch(
      /composes-fullwidth/,
    );
  });

  it("stretches the panel, not the toggles inside it", () => {
    renderGroup({ fullwidth: true });
    for (const toggle of screen.getAllByRole("button")) {
      expect(toggle.className).not.toMatch(/composes-fullwidth/);
    }
  });
});

/* The group clones each Toggle to add its own classes, merged with the child's
   string `className`. A toggle's state is styled through `data-pressed`. */
describe("ToggleGroup child className", () => {
  /* Type-level only: `pnpm typecheck` fails if the directive goes unused. The
     group's `cx` merge would drop a function, so the type rejects one. */
  it("types a Toggle's className as a string, not a function of its state", () => {
    // @ts-expect-error -- style a toggle's state through `data-pressed` instead
    void (<Toggle value="a" className={() => "from-fn"} />);
  });

  it("merges a child Toggle's className with its own class and marks its state", () => {
    render(
      <ToggleGroup defaultValue={["monthly"]}>
        <Toggle value="monthly" className="caller">
          Monthly
        </Toggle>
        <Toggle value="yearly" className="caller">
          Yearly
        </Toggle>
      </ToggleGroup>,
    );
    const pressed = screen.getByRole("button", { name: "Monthly" });
    const unpressed = screen.getByRole("button", { name: "Yearly" });

    expect(pressed).toHaveClass("caller", styles["toggle-group-button"]);
    expect(pressed).toHaveAttribute("data-pressed");
    expect(unpressed).toHaveClass("caller", styles["toggle-group-button"]);
    expect(unpressed).not.toHaveAttribute("data-pressed");
  });
});

/* The root owns a class, a ref and a slot of its own. A consumer's `className`
   and `ref` arrive with the rest of the props, so they have to merge with the
   group's rather than replace them. */
describe("ToggleGroup root", () => {
  it("marks the root with its data-slot", () => {
    const { container } = renderGroup();
    expect(container.firstElementChild).toHaveAttribute(
      "data-slot",
      "toggle-group",
    );
  });

  it("keeps the panel and variant classes alongside a consumer className", () => {
    const { container } = renderGroup({ className: "custom", fullwidth: true });
    const panel = container.firstElementChild;

    expect(panel).toHaveClass("custom");
    expect(panel).toHaveClass(styles["toggle-group-panel"]);
    expect(panel?.className).toMatch(/composes-fullwidth/);
  });

  it("marks a disabled root with data-disabled alongside a consumer className", () => {
    const { container } = renderGroup({
      className: "custom",
      disabled: true,
      fullwidth: true,
    });
    const panel = container.firstElementChild;

    expect(panel).toHaveClass("custom", styles["toggle-group-panel"]);
    expect(panel).toHaveAttribute("data-disabled");
    expect(panel?.className).toMatch(/composes-fullwidth/);
  });

  /* happy-dom has no layout, so every measured rect is zero. What this can
     show is that the indicator still wrote its geometry onto the panel, which
     it only does while its own ref holds the element. */
  it("hands the root element to a consumer ref and still measures the indicator", () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = renderGroup({ ref, defaultValue: ["monthly"] });
    const panel = container.firstElementChild as HTMLElement;

    expect(ref.current).toBe(panel);
    expect(panel.style.getPropertyValue("--active-toggle-width")).toBe("0px");
    expect(panel.style.getPropertyValue("--active-toggle-left")).toBe("-1px");
  });

  it("hands each Toggle to its own ref and still measures the pressed one", () => {
    const objectRef = createRef<HTMLButtonElement>();
    const callbackRef = vi.fn();
    const { container } = render(
      <ToggleGroup defaultValue={["yearly"]}>
        <Toggle value="monthly" ref={objectRef}>
          Monthly
        </Toggle>
        <Toggle value="yearly" ref={callbackRef}>
          Yearly
        </Toggle>
      </ToggleGroup>,
    );
    const [monthly, yearly] = screen.getAllByRole("button");
    const panel = container.firstElementChild as HTMLElement;

    expect(objectRef.current).toBe(monthly);
    expect(callbackRef).toHaveBeenCalledWith(yearly);
    // Sanity check only: the group measured before it kept a Toggle's own ref
    // too, so this shows the two coexist, not that anything was fixed.
    expect(panel.style.getPropertyValue("--active-toggle-width")).toBe("0px");
  });

  /* React detaches and re-attaches a ref whose identity changes, so the ref
     the group composes for a Toggle has to stay the same function between
     renders for as long as the caller's own ref does. */
  it("attaches a Toggle's stable callback ref once, across re-renders", async () => {
    const user = userEvent.setup();
    const callbackRef = vi.fn();
    const { unmount } = render(
      <ToggleGroup defaultValue={["monthly"]}>
        <Toggle value="monthly" ref={callbackRef}>
          Monthly
        </Toggle>
        <Toggle value="yearly">Yearly</Toggle>
      </ToggleGroup>,
    );
    const [monthly, yearly] = screen.getAllByRole("button");

    await user.click(yearly);
    expect(yearly).toHaveAttribute("data-pressed");

    expect(callbackRef).toHaveBeenCalledTimes(1);
    expect(callbackRef).toHaveBeenCalledWith(monthly);

    unmount();
    expect(callbackRef).toHaveBeenCalledTimes(2);
    expect(callbackRef).toHaveBeenLastCalledWith(null);
  });

  it("runs a Toggle ref's cleanup only on unmount, not on re-render", async () => {
    const user = userEvent.setup();
    const cleanup = vi.fn();
    const callbackRef = vi.fn(() => cleanup);
    const { unmount } = render(
      <ToggleGroup defaultValue={["monthly"]}>
        <Toggle value="monthly" ref={callbackRef}>
          Monthly
        </Toggle>
        <Toggle value="yearly">Yearly</Toggle>
      </ToggleGroup>,
    );

    await user.click(screen.getByRole("button", { name: "Yearly" }));

    expect(callbackRef).toHaveBeenCalledTimes(1);
    expect(cleanup).not.toHaveBeenCalled();

    unmount();
    expect(callbackRef).toHaveBeenCalledTimes(1);
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  /* happy-dom measures nothing, but it can show which elements the indicator
     asks: a Toggle that has left the group must not be measured again. */
  it("stops measuring a Toggle once it unmounts", () => {
    const { rerender } = render(
      <ToggleGroup value={["yearly"]}>
        <Toggle value="monthly">Monthly</Toggle>
        <Toggle value="yearly">Yearly</Toggle>
      </ToggleGroup>,
    );
    const yearly = screen.getByRole("button", { name: "Yearly" });
    const measure = vi.spyOn(yearly, "getBoundingClientRect");

    rerender(
      <ToggleGroup value={["yearly"]}>
        <Toggle value="monthly">Monthly</Toggle>
      </ToggleGroup>,
    );

    expect(yearly).not.toBeInTheDocument();
    expect(measure).not.toHaveBeenCalled();
  });
});

describe("ToggleGroup indicator with changing toggles", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  /* happy-dom has no layout, so each button is given a rect of its own, keyed
     off its label, and the panel keeps happy-dom's zero one. */
  const BUTTON_RECTS: Record<string, Partial<DOMRect>> = {
    Monthly: { top: 4, left: 10, width: 80, height: 24 },
    Yearly: { top: 40, left: 100, width: 120, height: 32 },
  };
  const stubButtonRects = () =>
    vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const rect = (this.tagName === "BUTTON" &&
          BUTTON_RECTS[this.textContent ?? ""]) || {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
        };
        return rect as DOMRect;
      });

  it("measures a pressed toggle that mounts after the group", async () => {
    stubButtonRects();
    const Pricing = ({ showYearly }: { showYearly: boolean }) => (
      <ToggleGroup defaultValue={["yearly"]}>
        <Toggle value="monthly">Monthly</Toggle>
        {showYearly && <Toggle value="yearly">Yearly</Toggle>}
      </ToggleGroup>
    );
    const { container, rerender } = render(<Pricing showYearly={false} />);
    const panel = container.firstElementChild as HTMLElement;
    expect(panel.style.getPropertyValue("--active-toggle-width")).toBe("");

    rerender(<Pricing showYearly />);

    await waitFor(() =>
      expect(panel.style.getPropertyValue("--active-toggle-width")).toBe(
        "120px",
      ),
    );
    expect(panel.style.getPropertyValue("--active-toggle-left")).toBe("99px");
  });

  it("clears the indicator when the pressed toggle unmounts", async () => {
    stubButtonRects();
    const { container, rerender } = render(
      <ToggleGroup value={["yearly"]}>
        <Toggle value="monthly">Monthly</Toggle>
        <Toggle value="yearly">Yearly</Toggle>
      </ToggleGroup>,
    );
    const panel = container.firstElementChild as HTMLElement;
    expect(panel.style.getPropertyValue("--active-toggle-width")).toBe("120px");

    rerender(
      <ToggleGroup value={["yearly"]}>
        <Toggle value="monthly">Monthly</Toggle>
      </ToggleGroup>,
    );

    await waitFor(() =>
      expect(panel.style.getPropertyValue("--active-toggle-width")).toBe(""),
    );
    expect(panel.style.getPropertyValue("--active-toggle-left")).toBe("");
  });

  it("clears a vertical indicator when the pressed toggle unmounts", async () => {
    stubButtonRects();
    const { container, rerender } = render(
      <ToggleGroup orientation="vertical" value={["yearly"]}>
        <Toggle value="monthly">Monthly</Toggle>
        <Toggle value="yearly">Yearly</Toggle>
      </ToggleGroup>,
    );
    const panel = container.firstElementChild as HTMLElement;
    expect(panel.style.getPropertyValue("--active-toggle-top")).toBe("39px");
    expect(panel.style.getPropertyValue("--active-toggle-height")).toBe("32px");

    rerender(
      <ToggleGroup orientation="vertical" value={["yearly"]}>
        <Toggle value="monthly">Monthly</Toggle>
      </ToggleGroup>,
    );

    await waitFor(() =>
      expect(panel.style.getPropertyValue("--active-toggle-height")).toBe(""),
    );
    expect(panel.style.getPropertyValue("--active-toggle-top")).toBe("");
  });
});

describe("ToggleGroup Fragment children", () => {
  it("styles toggles inside a Fragment without a React warning", () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    render(
      <ToggleGroup defaultValue={["monthly"]}>
        <>
          <Toggle value="monthly">Monthly</Toggle>
          <Toggle value="yearly">Yearly</Toggle>
        </>
      </ToggleGroup>,
    );

    for (const button of screen.getAllByRole("button")) {
      expect(button).toHaveClass(styles["toggle-group-button"]);
    }
    expect(error).not.toHaveBeenCalled();
    error.mockRestore();
  });
});

describe("ToggleGroup onValueChange", () => {
  it("hands the handler Base UI's event details alongside the value", async () => {
    const onValueChange = vi.fn();
    renderGroup({ defaultValue: ["monthly"], onValueChange });

    await userEvent.click(screen.getByRole("button", { name: "Yearly" }));

    expect(onValueChange).toHaveBeenCalledTimes(1);
    const [value, details] = onValueChange.mock.calls[0];
    expect(value).toEqual(["yearly"]);
    expect(details.reason).toBe("none");
    expect(details.event).toBeInstanceOf(Event);
    expect(details.cancel).toBeTypeOf("function");
  });

  it("leaves the pressed toggle alone when the handler cancels the change", async () => {
    renderGroup({
      defaultValue: ["monthly"],
      onValueChange: (_value, details) => details.cancel(),
    });
    const monthly = screen.getByRole("button", { name: "Monthly" });
    const yearly = screen.getByRole("button", { name: "Yearly" });

    await userEvent.click(yearly);

    expect(monthly).toHaveAttribute("aria-pressed", "true");
    expect(yearly).toHaveAttribute("aria-pressed", "false");
  });

  /* happy-dom measures nothing, but it can show which toggle the indicator
     asks: a cancelled change must not send it to the toggle that was refused. */
  it("keeps the indicator on the pressed toggle when the change is cancelled", async () => {
    renderGroup({
      defaultValue: ["monthly"],
      onValueChange: (_value, details) => details.cancel(),
    });
    const yearly = screen.getByRole("button", { name: "Yearly" });
    const measure = vi.spyOn(yearly, "getBoundingClientRect");

    await userEvent.click(yearly);

    expect(measure).not.toHaveBeenCalled();
  });

  /* A parent that holds `value` and ignores the change is the controlled way
     to refuse one: the handler still hears about it, and `value` still wins. */
  it("stays on a controlled value the parent does not update", async () => {
    const onValueChange = vi.fn();
    renderGroup({ value: ["monthly"], onValueChange });
    const monthly = screen.getByRole("button", { name: "Monthly" });
    const yearly = screen.getByRole("button", { name: "Yearly" });
    const measure = vi.spyOn(yearly, "getBoundingClientRect");

    await userEvent.click(yearly);

    expect(onValueChange).toHaveBeenCalledTimes(1);
    expect(monthly).toHaveAttribute("aria-pressed", "true");
    expect(yearly).toHaveAttribute("aria-pressed", "false");
    expect(measure).not.toHaveBeenCalled();
  });

  /* The assertion a type error would break is the build's, which typechecks
     this file: a narrowed value has to reach the handler as that union, so a
     typed state setter can be passed straight in. */
  it("carries a narrowed value type through to the handler", async () => {
    type Plan = "monthly" | "yearly";

    const Billing = () => {
      const [plan, setPlan] = useState<Plan[]>(["monthly"]);

      return (
        <ToggleGroup value={plan} onValueChange={setPlan}>
          <Toggle value="monthly">Monthly</Toggle>
          <Toggle value="yearly">Yearly</Toggle>
        </ToggleGroup>
      );
    };
    render(<Billing />);

    await userEvent.click(screen.getByRole("button", { name: "Yearly" }));

    expect(screen.getByRole("button", { name: "Yearly" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
