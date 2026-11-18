import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Accordion } from "./accordion";
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
} from "./subcomponents";

import styles from "./accordion.module.css";
import css from "./accordion.module.css?raw";

const sampleItems = [
  { value: "item-1", trigger: "First", content: "First content" },
  { value: "item-2", trigger: "Second", content: "Second content" },
  { value: "item-3", trigger: "Third", content: "Third content" },
];

describe("Accordion", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the component", () => {
    render(<Accordion items={sampleItems} />);
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.getByText("Third")).toBeInTheDocument();
  });

  it("renders with data-slot attributes", () => {
    render(<Accordion items={sampleItems} />);
    expect(screen.getByRole("button", { name: "First" })).toHaveAttribute(
      "data-slot",
      "accordion-trigger",
    );
  });

  it("applies custom className to root", () => {
    render(
      <Accordion
        items={sampleItems}
        RootProps={{ className: "custom-class" }}
      />,
    );
    expect(document.querySelector(".custom-class")).toBeInTheDocument();
  });

  // ============================================
  // INTERACTIONS
  // ============================================

  it("expands panel on click", async () => {
    const user = userEvent.setup();
    render(<Accordion items={sampleItems} />);

    const trigger = screen.getByRole("button", { name: "First" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("data-panel-open");
  });

  it("supports keyboard interaction", async () => {
    const user = userEvent.setup();
    render(<Accordion items={sampleItems} />);

    const trigger = screen.getByRole("button", { name: "First" });
    trigger.focus();
    await user.keyboard("{Enter}");

    expect(trigger).toHaveAttribute("data-panel-open");
  });

  // Base UI removed roving focus from Accordion in 1.6.0 to follow the APG,
  // which no longer recommends it (w3c/aria-practices#3434). Triggers are now
  // plain tab stops: Tab moves between them and arrow keys do not.
  it("moves focus between triggers with Tab", async () => {
    const user = userEvent.setup();
    render(<Accordion items={sampleItems} />);

    const firstTrigger = screen.getByRole("button", { name: "First" });
    const secondTrigger = screen.getByRole("button", { name: "Second" });

    firstTrigger.focus();
    await user.tab();

    expect(secondTrigger).toHaveFocus();
  });

  it("does not move focus between triggers with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Accordion items={sampleItems} />);

    const firstTrigger = screen.getByRole("button", { name: "First" });

    firstTrigger.focus();
    await user.keyboard("{ArrowDown}");

    expect(firstTrigger).toHaveFocus();
  });

  // ============================================
  // CONTROLLED/UNCONTROLLED STATE
  // ============================================

  it("supports uncontrolled state with defaultValue", async () => {
    render(<Accordion items={sampleItems} defaultValue={["item-1"]} />);

    const trigger = screen.getByRole("button", { name: "First" });
    expect(trigger).toHaveAttribute("data-panel-open");
  });

  it("supports controlled state", async () => {
    const handleChange = vi.fn();

    const ControlledAccordion = () => {
      const [value, setValue] = useState<string[]>([]);
      return (
        <Accordion
          items={sampleItems}
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            handleChange(newValue);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledAccordion />);

    await user.click(screen.getByRole("button", { name: "First" }));
    expect(handleChange).toHaveBeenCalledWith(["item-1"]);
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  it("can be disabled", () => {
    render(<Accordion items={sampleItems} disabled />);

    const trigger = screen.getByRole("button", { name: "First" });
    expect(trigger).toHaveAttribute("data-disabled");
  });

  it("supports disabled individual items", () => {
    const itemsWithDisabled = [
      ...sampleItems.slice(0, 2),
      {
        value: "item-3",
        trigger: "Third",
        content: "Third content",
        disabled: true,
      },
    ];
    render(<Accordion items={itemsWithDisabled} />);

    const disabledTrigger = screen.getByRole("button", { name: "Third" });
    expect(disabledTrigger).toHaveAttribute("data-disabled");
  });

  // ============================================
  // SUBCOMPONENTS
  // ============================================

  it("renders composed subcomponents", async () => {
    const user = userEvent.setup();
    render(
      <AccordionRoot>
        <AccordionItem value="test">
          <AccordionHeader>
            <AccordionTrigger>Test Trigger</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Test Content</AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    );

    expect(
      screen.getByRole("button", { name: "Test Trigger" }),
    ).toBeInTheDocument();

    // Panel content is rendered after opening
    await user.click(screen.getByRole("button", { name: "Test Trigger" }));
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  it("expands composed accordion on click", async () => {
    const user = userEvent.setup();
    render(
      <AccordionRoot>
        <AccordionItem value="test">
          <AccordionHeader>
            <AccordionTrigger>Test Trigger</AccordionTrigger>
          </AccordionHeader>
          <AccordionPanel>Test Content</AccordionPanel>
        </AccordionItem>
      </AccordionRoot>,
    );

    const trigger = screen.getByRole("button", { name: "Test Trigger" });
    await user.click(trigger);

    expect(trigger).toHaveAttribute("data-panel-open");
  });

  // ============================================
  // SIZE
  // ============================================

  /*
   * happy-dom applies no stylesheet, so nothing here measures padding. The
   * first test proves the DOM half: `size` puts a tier class on the panel. The
   * rest read the module source for the CSS half: each tier sets the two vars,
   * and the content element is what reads them. The tiers used to target
   * `.accordion-panel-content`, a class no element carries, so they did nothing.
   */
  const SIZES = ["small", "medium", "large"] as const;

  /** The declarations of a top-level rule, up to its first closing brace. */
  const ruleBody = (selector: string) =>
    css.match(new RegExp(`^\\.${selector}\\s*\\{([^}]*)\\}`, "m"))?.[1] ?? "";

  it.each(SIZES)("puts the %s tier class on the panel", (size) => {
    render(
      <Accordion items={sampleItems} size={size} defaultValue={["item-1"]} />,
    );
    const panel = document.querySelector("[data-slot='accordion-panel']");
    const others = SIZES.filter((other) => other !== size);

    expect(panel).toHaveClass(styles[`panel-size-${size}`]);
    others.forEach((other) => {
      expect(panel).not.toHaveClass(styles[`panel-size-${other}`]);
    });
  });

  it("defaults the panel to the medium tier", () => {
    render(<Accordion items={sampleItems} defaultValue={["item-1"]} />);
    expect(document.querySelector("[data-slot='accordion-panel']")).toHaveClass(
      styles["panel-size-medium"],
    );
  });

  // Inline is the trigger's inline padding at that size; block is twice its
  // block padding. Exact, so a tier carrying another size's tokens fails.
  it.each([
    ["small", "sm"],
    ["medium", "md"],
    ["large", "lg"],
  ] as const)(
    "sets the %s tier's padding vars from the %s size tokens",
    (size, key) => {
      const declarations = ruleBody(`panel-size-${size}`)
        .split(";")
        .map((declaration) => declaration.trim().replace(/\s+/g, " "))
        .filter(Boolean);

      expect(declarations).toEqual([
        `--accordion-panel-padding-x: var(--accordion-size-${key}-padding-x)`,
        `--accordion-panel-padding-y: calc(var(--accordion-size-${key}-padding-y) * 2)`,
      ]);
    },
  );

  it("reads the panel padding vars on the content element", () => {
    const body = ruleBody("accordion-content");
    expect(body).toMatch(
      /padding-inline:\s*var\(--accordion-panel-padding-x\)/,
    );
    expect(body).toMatch(/padding-block:\s*var\(--accordion-panel-padding-y\)/);

    render(<Accordion items={sampleItems} defaultValue={["item-1"]} />);
    const content = document.querySelector("[data-slot='accordion-content']");
    expect(content).toHaveClass(styles["accordion-content"]);
    expect(content?.closest("[data-slot='accordion-panel']")).not.toBeNull();
  });

  it("has no .accordion-panel-content or .toggle-fullwidth selector in the module", () => {
    expect(css).not.toMatch(/\.accordion-panel-content\b/);
    expect(css).not.toMatch(/\.toggle-fullwidth\b/);
  });

  // ============================================
  // LAYOUT PROPS
  // ============================================

  const root = () =>
    document.querySelector<HTMLElement>("[data-slot='accordion-root']");

  /*
   * The root's flush `gap` and `p` used to be literals on its `Card`. Base UI
   * merges the render element's own props over the part's, so they silently
   * beat the caller's. Only `gap` is asserted: happy-dom drops a `padding`
   * shorthand whose value holds `var()`, so `p` never reaches `style` here.
   */
  it("forwards gap from RootProps to the root Card", () => {
    render(<Accordion items={sampleItems} RootProps={{ gap: 2 }} />);
    expect(root()).toHaveAttribute("data-ui-gap", "2");
  });

  it("keeps the root flush when RootProps sets no gap", () => {
    render(<Accordion items={sampleItems} />);
    expect(root()).toHaveAttribute("data-ui-gap", "0");
  });

  it("stretches the root by default and releases it on fullwidth={false}", () => {
    const { rerender } = render(<Accordion items={sampleItems} />);
    expect(root()).toHaveAttribute("data-ui-fullwidth");

    rerender(<Accordion items={sampleItems} fullwidth={false} />);
    expect(root()).not.toHaveAttribute("data-ui-fullwidth");
  });

  it("forwards layout props from ItemProps to each item Stack", () => {
    render(
      <Accordion items={sampleItems} ItemProps={{ gap: 2, ax: "start" }} />,
    );
    const items = document.querySelectorAll<HTMLElement>(
      "[data-slot='accordion-item']",
    );
    expect(items).toHaveLength(sampleItems.length);
    items.forEach((item) => {
      expect(item).toHaveAttribute("data-ui-gap", "2");
      expect(item).toHaveAttribute("data-ui-ay", "start");
    });
  });

  // ============================================
  // STATE-FUNCTION CLASSNAME
  // ============================================

  // Base UI calls a function className with the part's state. `cx` used to
  // drop it silently, leaving only the wrapper's own module class.

  it("resolves a state-function className on the root alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        RootProps={{
          className: (state) => (state.value.length ? "fn-open" : "fn-closed"),
        }}
      />,
    );
    const root = document.querySelector("[data-slot='accordion-root']");
    expect(root).toHaveClass("fn-open", styles["accordion-root"]);

    await user.click(screen.getByRole("button", { name: "First" }));
    expect(root).toHaveClass("fn-closed", styles["accordion-root"]);
  });

  it("resolves a state-function className on the item alongside its own class", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        ItemProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );
    const [open, closed] = document.querySelectorAll(
      "[data-slot='accordion-item']",
    );
    expect(open).toHaveClass("fn-open", styles["accordion-item"]);
    expect(closed).toHaveClass("fn-closed", styles["accordion-item"]);
  });

  it("resolves a state-function className on the header", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        HeaderProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );
    const [open, closed] = document.querySelectorAll(
      "[data-slot='accordion-header']",
    );
    expect(open).toHaveClass("fn-open");
    expect(closed).toHaveClass("fn-closed");
  });

  it("resolves a state-function className on the trigger alongside its own class", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        TriggerProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );
    const [open, closed] = document.querySelectorAll(
      "[data-slot='accordion-trigger']",
    );
    expect(open).toHaveClass("fn-open", styles["accordion-trigger"]);
    expect(closed).toHaveClass("fn-closed", styles["accordion-trigger"]);
  });

  it("resolves a state-function className on the panel alongside its own class", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        PanelProps={{
          keepMounted: true,
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      />,
    );
    const [open, closed] = document.querySelectorAll(
      "[data-slot='accordion-panel']",
    );
    expect(open).toHaveClass("fn-open", styles["accordion-panel"]);
    expect(closed).toHaveClass("fn-closed", styles["accordion-panel"]);
  });
});
