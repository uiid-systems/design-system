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
    expect(root()?.style.gap).toBe("calc(2 * var(--spacing-unit))");
  });

  it("keeps the root flush when RootProps sets no gap", () => {
    render(<Accordion items={sampleItems} />);
    expect(root()?.style.gap).toBe("calc(0 * var(--spacing-unit))");
  });

  it("stretches the root by default and releases it on fullwidth={false}", () => {
    const { rerender } = render(<Accordion items={sampleItems} />);
    expect(root()?.className).toMatch(/toggle-fullwidth/);

    rerender(<Accordion items={sampleItems} fullwidth={false} />);
    expect(root()?.className).not.toMatch(/toggle-fullwidth/);
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
      expect(item.style.gap).toBe("calc(2 * var(--spacing-unit))");
      expect(item).toHaveStyle({ alignItems: "start" });
    });
  });

  // ============================================
  // STATE-FUNCTION CLASSNAME
  // ============================================

  // Base UI calls a function className with the part's state. `cx` used to
  // drop it silently, leaving only the wrapper's own module class.

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
