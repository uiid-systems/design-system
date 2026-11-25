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

  it("fills the root's width with w by default, which RootProps can override", () => {
    const { rerender } = render(<Accordion items={sampleItems} />);
    expect(root()).toHaveAttribute("data-ui-w", "full");
    expect(root()).not.toHaveAttribute("data-ui-fullwidth");

    rerender(<Accordion items={sampleItems} RootProps={{ w: 320 }} />);
    expect(root()).toHaveAttribute("data-ui-w", "320");
  });

  it("fills each item's width with w by default, which ItemProps can override", () => {
    const items = () =>
      document.querySelectorAll<HTMLElement>("[data-slot='accordion-item']");
    const { rerender } = render(<Accordion items={sampleItems} />);
    expect(items()).toHaveLength(sampleItems.length);
    items().forEach((item) => {
      expect(item).toHaveAttribute("data-ui-w", "full");
      expect(item).not.toHaveAttribute("data-ui-fullwidth");
    });

    rerender(<Accordion items={sampleItems} ItemProps={{ w: 240 }} />);
    items().forEach((item) => expect(item).toHaveAttribute("data-ui-w", "240"));
  });

  it("releases the root's and items' default fill with w={null}", () => {
    render(
      <Accordion
        items={sampleItems}
        RootProps={{ w: null }}
        ItemProps={{ w: null }}
      />,
    );
    expect(root()).not.toHaveAttribute("data-ui-w");
    const items = document.querySelectorAll<HTMLElement>(
      "[data-slot='accordion-item']",
    );
    expect(items).toHaveLength(sampleItems.length);
    items.forEach((item) => expect(item).not.toHaveAttribute("data-ui-w"));
  });

  it("takes no top-level fullwidth prop", () => {
    // @ts-expect-error -- the root fills by default; set `w` through RootProps
    void (<Accordion items={sampleItems} fullwidth={false} />);
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
  // CLASSNAME AND STATE
  // ============================================

  // A part's `className` is a string, merged with its own module class. Its
  // state is styled through the `data-*` attributes Base UI sets.

  it("merges a caller's className on the root with its own class", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        RootProps={{ className: "caller" }}
      />,
    );
    const root = document.querySelector("[data-slot='accordion-root']");
    expect(root).toHaveClass("caller", styles["accordion-root"]);
  });

  it("merges a caller's className on the item with its own class and marks its state", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        ItemProps={{ className: "caller" }}
      />,
    );
    const [open, closed] = document.querySelectorAll(
      "[data-slot='accordion-item']",
    );
    expect(open).toHaveClass("caller", styles["accordion-item"]);
    expect(open).toHaveAttribute("data-open");
    expect(closed).toHaveClass("caller", styles["accordion-item"]);
    expect(closed).not.toHaveAttribute("data-open");
  });

  /* The header is Base UI's own part with no class of its own, so its
     `className` is still Base UI's and may be a function of its state. */
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

  it("merges a caller's className on the trigger with its own class and marks its state", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        TriggerProps={{ className: "caller" }}
      />,
    );
    const [open, closed] = document.querySelectorAll(
      "[data-slot='accordion-trigger']",
    );
    expect(open).toHaveClass("caller", styles["accordion-trigger"]);
    expect(open).toHaveAttribute("data-panel-open");
    expect(closed).toHaveClass("caller", styles["accordion-trigger"]);
    expect(closed).not.toHaveAttribute("data-panel-open");
  });

  it("merges a caller's className on the panel with its own class and marks its state", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-1"]}
        PanelProps={{ keepMounted: true, className: "caller" }}
      />,
    );
    const [open, closed] = document.querySelectorAll(
      "[data-slot='accordion-panel']",
    );
    expect(open).toHaveClass("caller", styles["accordion-panel"]);
    expect(open).toHaveAttribute("data-open");
    expect(closed).toHaveClass("caller", styles["accordion-panel"]);
    expect(closed).toHaveAttribute("data-closed");
  });
});

describe("Accordion RootProps precedence", () => {
  const expanded = (name: string) =>
    screen.getByRole("button", { name }).getAttribute("aria-expanded");

  it("lets a top-level prop win over the same key in RootProps", () => {
    render(
      <Accordion
        items={sampleItems}
        defaultValue={["item-2"]}
        RootProps={{ defaultValue: ["item-3"] }}
      />,
    );
    expect(expanded("Second")).toBe("true");
    expect(expanded("Third")).toBe("false");
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    render(
      <Accordion
        items={sampleItems}
        RootProps={{ defaultValue: ["item-3"] }}
      />,
    );
    expect(expanded("Third")).toBe("true");
  });
});

/* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
describe("Accordion slot props", () => {
  it("rejects a key Accordion owns in TriggerProps", () => {
    void (
      <Accordion
        items={sampleItems}
        // @ts-expect-error -- `size` is set on Accordion itself
        TriggerProps={{ size: "small" }}
      />
    );
  });

  it("rejects the trigger's icon in TriggerProps, which comes from each item", () => {
    void (
      <Accordion
        items={sampleItems}
        // @ts-expect-error -- each item owns its trigger's icon
        TriggerProps={{ icon: undefined }}
      />
    );
  });

  it("rejects the trigger's children in TriggerProps, which come from each item", () => {
    void (
      <Accordion
        items={sampleItems}
        // @ts-expect-error -- each item's `trigger` is its trigger's content
        TriggerProps={{ children: "Other" }}
      />
    );
  });

  it("rejects a key Accordion owns in PanelProps", () => {
    void (
      <Accordion
        items={sampleItems}
        // @ts-expect-error -- `size` is set on Accordion itself
        PanelProps={{ size: "small" }}
      />
    );
  });

  it("rejects the panel's children in PanelProps, which come from each item", () => {
    void (
      <Accordion
        items={sampleItems}
        // @ts-expect-error -- each item's `content` fills its panel
        PanelProps={{ children: "Other" }}
      />
    );
  });
});
