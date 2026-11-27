import { render } from "@testing-library/react";
import { Card } from "@uiid/cards";
import { Dialog, Popover } from "@uiid/overlays";
// Types `cdp().send`, which the Playwright provider adds to vitest/browser.
import type {} from "@vitest/browser-playwright";
import { describe, expect, it, vi } from "vitest";
import { cdp, page, server, userEvent } from "vitest/browser";

import { CodeBlock } from "../code-block";
import {
  boxesDelta,
  getBlock,
  isHighlighted,
  mountSized,
  readBoxes,
  waitForHighlight,
} from "../code-block/code-block.browser.test.helpers";
import { CodePreview } from "./code-preview";
import * as Examples from "./code-preview.examples";

// The spacing, border and form-size tokens come from the global sheet.
import "@uiid/tokens/globals.css";

/* Runs in a real browser, which resolves the layout and the tooltip's
   positioning that happy-dom cannot. */

const query = (root: ParentNode, selector: string) =>
  root.querySelector<HTMLElement>(selector)!;

/** The gap between two boxes on each axis, 0 where they overlap. */
const gap = (a: DOMRect, b: DOMRect) => ({
  x: Math.max(0, a.left - b.right, b.left - a.right),
  y: Math.max(0, a.top - b.bottom, b.top - a.bottom),
});

const Example = () => (
  <span data-testid="example" data-example>
    Example
  </span>
);

describe("CodePreview reset button", () => {
  it("shows its tooltip next to the button", async () => {
    const { container } = render(
      <CodePreview code="const a = 1;" resettable>
        <Example />
      </CodePreview>,
    );
    const button = query(container, '[data-slot="code-preview-reset-button"]');
    await userEvent.hover(button);

    // The popup is portalled out of the preview, so look for it on the page.
    const findPopup = () =>
      [...document.body.querySelectorAll("span")].find(
        (el) => el.textContent === "Reset preview" && !container.contains(el),
      );
    await expect.poll(findPopup).toBeTruthy();
    // The popup box around the label, which carries its padding.
    const popup = findPopup()!.parentElement!;

    // Within the tooltip's 8px side offset of the button, and centred on it.
    await expect
      .poll(() => {
        const a = popup.getBoundingClientRect();
        const b = button.getBoundingClientRect();
        const distance = gap(a, b);
        const offCentre = Math.abs(
          a.left + a.width / 2 - (b.left + b.width / 2),
        );
        return Math.max(distance.x, distance.y, offCentre);
      })
      .toBeLessThan(16);
    await userEvent.unhover(button);
  });

  it("sits in the canvas's top-right corner", () => {
    const { container } = render(
      <CodePreview code="const a = 1;" resettable>
        <Example />
      </CodePreview>,
    );
    const canvas = query(
      container,
      '[data-slot="code-preview-canvas"]',
    ).getBoundingClientRect();
    const button = query(
      container,
      '[data-slot="code-preview-reset-button"]',
    ).getBoundingClientRect();
    expect(canvas.right - button.right).toBeGreaterThanOrEqual(0);
    expect(canvas.right - button.right).toBeLessThan(16);
    expect(button.top - canvas.top).toBeGreaterThanOrEqual(0);
    expect(button.top - canvas.top).toBeLessThan(16);
  });

  it("never overlaps an example that fills the canvas, at the default padding", () => {
    const container = mountSized(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <CodePreview code="const a = 1;" resettable>
          <div data-example style={{ width: "100%", height: 40 }} />
        </CodePreview>
      </div>,
    );
    const canvasEl = query(container, '[data-slot="code-preview-canvas"]');
    const canvas = canvasEl.getBoundingClientRect();
    // The canvas's bottom border is the rule above the footer.
    const rule = Number.parseFloat(
      getComputedStyle(canvasEl).borderBottomWidth,
    );
    const example = query(container, "[data-example]").getBoundingClientRect();
    const button = query(
      container,
      '[data-slot="code-preview-reset-button"]',
    ).getBoundingClientRect();
    expect(example.width).toBeGreaterThan(canvas.width / 2);
    expect(gap(example, button).y).toBeGreaterThan(0);
    // The room is reserved above and below alike, so the example stays centred.
    expect(example.top - canvas.top).toBeCloseTo(
      canvas.bottom - rule - example.bottom,
      1,
    );
  });

  it("stays in the frame's corner while a wide example scrolls", async () => {
    const container = mountSized(
      <CodePreview code="const a = 1;" resettable>
        <div data-example style={{ width: 1200, height: 40 }} />
      </CodePreview>,
      { width: 320 },
    );
    const frame = query(container, '[data-slot="code-preview"]');
    const canvas = query(container, '[data-slot="code-preview-canvas"]');
    const button = query(container, '[data-slot="code-preview-reset-button"]');
    const before = button.getBoundingClientRect();
    expect(canvas.scrollWidth).toBeGreaterThan(canvas.clientWidth);
    expect(frame.getBoundingClientRect().width).toBeLessThanOrEqual(320);

    canvas.scrollLeft = canvas.scrollWidth;
    await frames();
    expect(canvas.scrollLeft).toBeGreaterThan(0);
    const after = button.getBoundingClientRect();
    expect(after.left).toBe(before.left);
    expect(after.top).toBe(before.top);
    const inset = frame.getBoundingClientRect().right - after.right;
    expect(inset).toBeGreaterThanOrEqual(0);
    expect(inset).toBeLessThan(16);
  });

  it("is a subtle button, set apart from the canvas behind it", () => {
    const container = mountSized(
      <CodePreview code="const a = 1;" resettable>
        <Example />
      </CodePreview>,
    );
    const button = query(container, '[data-slot="code-preview-reset-button"]');
    const canvas = query(container, '[data-slot="code-preview-canvas"]');
    const fill = getComputedStyle(button).backgroundColor;
    expect(["rgba(0, 0, 0, 0)", "transparent"]).not.toContain(fill);
    expect(fill).not.toBe(getComputedStyle(canvas).backgroundColor);
    // Small and square.
    expect(button.getBoundingClientRect().height).toBe(32);
    expect(button.getBoundingClientRect().width).toBe(32);
  });

  it("mutes its icon until hovered or focused", async () => {
    const container = mountSized(
      <CodePreview code="const a = 1;" resettable>
        <Example />
      </CodePreview>,
    );
    const button = query(container, '[data-slot="code-preview-reset-button"]');
    const color = (value: string) => {
      const probe = document.createElement("div");
      probe.style.color = value;
      container.append(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return resolved;
    };
    const muted = color("var(--shade-muted)");
    const strong = color("var(--shade-foreground)");
    expect(muted).not.toBe(strong);
    expect(getComputedStyle(button).color).toBe(muted);
    await userEvent.hover(button);
    await expect.poll(() => getComputedStyle(button).color).toBe(strong);
    await userEvent.unhover(button);
    await expect.poll(() => getComputedStyle(button).color).toBe(muted);
    await userEvent.tab();
    expect(button).toHaveFocus();
    await expect.poll(() => getComputedStyle(button).color).toBe(strong);
  });

  it("adds no room with a caller's padding, so the example does not move", () => {
    const { container } = render(
      <div>
        <div data-preview="plain">
          <CodePreview code="const a = 1;" CanvasProps={{ gap: 8, p: 6 }}>
            <Example />
          </CodePreview>
        </div>
        <div data-preview="resettable">
          <CodePreview
            code="const a = 1;"
            CanvasProps={{ gap: 8, p: 6 }}
            resettable
          >
            <Example />
          </CodePreview>
        </div>
      </div>,
    );
    const measure = (name: string) => {
      const preview = query(container, `[data-preview="${name}"]`);
      const canvas = query(
        preview,
        '[data-slot="code-preview-canvas"]',
      ).getBoundingClientRect();
      const example = query(preview, "[data-example]").getBoundingClientRect();
      return {
        height: canvas.height,
        top: example.top - canvas.top,
        left: example.left - canvas.left,
      };
    };
    expect(measure("resettable")).toEqual(measure("plain"));
  });
});

/** A frame's look: its border, its radius and the colour of each zone. */
const readLook = (root: ParentNode) => {
  const frame = query(root, '[data-slot="code-preview"]');
  const style = (slot: string) =>
    getComputedStyle(query(frame, `[data-slot="${slot}"]`));
  const pre = frame.querySelector("pre");
  return {
    border: getComputedStyle(frame).borderTop,
    radius: getComputedStyle(frame).borderTopLeftRadius,
    overflow: getComputedStyle(frame).overflow,
    canvas: style("code-preview-canvas").backgroundColor,
    footer: style("code-preview-trigger").backgroundColor,
    panel: style("code-preview-panel").backgroundColor,
    code: pre && getComputedStyle(pre).backgroundColor,
  };
};

describe("CodePreview composed from its parts", () => {
  it("looks the same as the assembled preview, and highlights once open", async () => {
    const assembled = mountSized(<Examples.Default />);
    const composed = mountSized(<Examples.Composed />);

    for (const root of [assembled, composed]) {
      // Each preview's own trigger, found inside its own root.
      const trigger = query(root, '[data-slot="code-preview-trigger"]');
      expect(trigger).toHaveAttribute("aria-expanded", "false");
      await userEvent.click(trigger);
      expect(trigger).toHaveAttribute("aria-expanded", "true");
      await waitForHighlight(root);
    }

    // Both footers at rest, so the pointer left on the last one clicked
    // cannot colour it; Button fades its fill, so wait on the look.
    await userEvent.unhover(
      query(composed, '[data-slot="code-preview-trigger"]'),
    );
    await expect.poll(() => readLook(composed)).toEqual(readLook(assembled));
    const look = readLook(composed);
    // The two zones differ, and the frame has a border.
    expect(look.canvas).not.toBe(look.code);
    expect(look.border).not.toMatch(/^0px/);
  });
});

describe("CodePreview zones", () => {
  for (const theme of ["light", "dark"]) {
    it(`paints the canvas apart from the code and the footer in the ${theme} theme`, async () => {
      const container = mountSized(
        <div data-theme={theme}>
          <CodePreview code="const a = 1;" defaultOpen>
            <Example />
          </CodePreview>
        </div>,
      );
      const look = readLook(container);
      expect(["rgba(0, 0, 0, 0)", "transparent"]).not.toContain(look.canvas);
      expect(look.canvas).not.toBe(look.panel);
      expect(look.canvas).not.toBe(look.code);
      expect(look.canvas).not.toBe(look.footer);
      // The code surface is CodeBlock's, as the frame's border and radius are.
      const block = mountSized(
        <div data-theme={theme}>
          <CodeBlock code="const a = 1;" />
        </div>,
      );
      const frame = getBlock(block);
      expect(look.panel).toBe(getComputedStyle(frame).backgroundColor);
      expect(look.border).toBe(getComputedStyle(frame).borderTop);
      expect(look.radius).toBe(getComputedStyle(frame).borderTopLeftRadius);
    });
  }
});

/** Two animation frames, so a style change and any work it schedules have run. */
const frames = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

const WIDE_LINE =
  'export const label = "a line of code wider than the example above it";';

describe("CodePreview frame width", () => {
  const cases = [
    { name: "code narrower than the example", code: "const a = 1;" },
    { name: "code wider than the example", code: WIDE_LINE },
    {
      name: "code wider than the parent",
      code: `${WIDE_LINE} ${WIDE_LINE} ${WIDE_LINE}`,
    },
  ];

  for (const { name, code } of cases) {
    it(`stays the same closed, open and closed again, with ${name}`, async () => {
      // A flex row sizes its child to fit, as a docs page column might.
      const container = mountSized(
        <div style={{ display: "flex", alignItems: "flex-start" }}>
          <CodePreview
            code={code}
            language="tsx"
            PanelProps={{ instant: true }}
          >
            <Example />
          </CodePreview>
        </div>,
        { width: 720 },
      );
      const frame = query(container, '[data-slot="code-preview"]');
      const panel = query(frame, '[data-slot="code-preview-panel"]');
      const width = () => frame.getBoundingClientRect().width;
      const trigger = page.getByRole("button", { name: /^(show|hide) code$/i });

      const closed = width();
      await userEvent.click(trigger);
      await waitForHighlight(container);
      // Read each width once the panel has reached that state.
      await expect.poll(() => panel.hasAttribute("hidden")).toBe(false);
      await expect
        .poll(() => panel.getBoundingClientRect().height)
        .toBeGreaterThan(0);
      const open = width();
      await userEvent.click(trigger);
      await expect.poll(() => panel.hasAttribute("hidden")).toBe(true);
      const closedAgain = width();

      const detail = JSON.stringify({ closed, open, closedAgain });
      expect(Math.abs(open - closed), detail).toBeLessThan(0.5);
      expect(Math.abs(closedAgain - closed), detail).toBeLessThan(0.5);
      expect(closed).toBeLessThanOrEqual(720);
    });
  }

  it("fills a parent that stretches it, whether open or closed", async () => {
    const container = mountSized(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <CodePreview code="const a = 1;" PanelProps={{ instant: true }}>
          <Example />
        </CodePreview>
      </div>,
    );
    const frame = query(container, '[data-slot="code-preview"]');
    expect(frame.getBoundingClientRect().width).toBe(480);
    await userEvent.click(page.getByRole("button", { name: "Show code" }));
    const panel = query(frame, '[data-slot="code-preview-panel"]');
    await expect
      .poll(() => panel.getBoundingClientRect().height)
      .toBeGreaterThan(0);
    expect(frame.getBoundingClientRect().width).toBe(480);
  });
});

describe("CodePreview closed panel", () => {
  it("stays mounted but out of sight, the tab order and the accessibility tree", async () => {
    // Code wider than the frame, so the content is a scrolling tab stop.
    const container = mountSized(
      <CodePreview code={`${WIDE_LINE} ${WIDE_LINE}`} copyable={false}>
        <Example />
      </CodePreview>,
      { width: 320 },
    );
    const panel = query(container, '[data-slot="code-preview-panel"]');
    const content = query(panel, '[data-slot="code-block-content"]');
    // The code overflows even while closed, so the content really is a named
    // tab stop: only `visibility: hidden` keeps it from focus and the tree.
    await expect.poll(() => content.getAttribute("tabindex")).toBe("0");
    expect(content).toHaveAttribute("role", "group");
    expect(content).toHaveAttribute("aria-label", "Code");
    expect(panel.checkVisibility({ visibilityProperty: true })).toBe(false);
    expect(panel.getBoundingClientRect().height).toBe(0);
    // Nothing in the closed panel takes focus, by keyboard or by script.
    content.focus();
    expect(content).not.toHaveFocus();
    await userEvent.tab();
    expect(document.activeElement).toHaveAttribute(
      "data-slot",
      "code-preview-trigger",
    );
    await userEvent.tab();
    expect(panel.contains(document.activeElement)).toBe(false);
    // And no named group a screen reader could land on.
    await expect
      .element(page.getByRole("group", { name: "Code" }))
      .not.toBeInTheDocument();
  });
});

const SOURCE = [
  'import { useState } from "react";',
  "",
  "export function Counter({ start = 0 }: { start?: number }) {",
  "  const [count, setCount] = useState(start);",
  "  return <button onClick={() => setCount(count + 1)}>{count}</button>;",
  "}",
].join("\n");

describe("CodePreview when highlighting lands", () => {
  for (const showLineNumbers of [false, true]) {
    it(`moves nothing in the frame${showLineNumbers ? " with line numbers" : ""}`, async () => {
      const container = mountSized(
        <CodePreview
          code={SOURCE}
          language="tsx"
          showLineNumbers={showLineNumbers}
          defaultOpen
        >
          <Example />
        </CodePreview>,
      );
      const frame = query(container, '[data-slot="code-preview"]');
      // The first paint is the fallback: Shiki has not answered yet.
      expect(isHighlighted(container)).toBe(false);
      const before = readBoxes(frame);
      expect(before.lines).toHaveLength(SOURCE.split("\n").length);

      await waitForHighlight(container);
      const after = readBoxes(frame);
      const delta = boxesDelta(before, after);
      const detail = JSON.stringify({ before, after });
      expect(delta.y, detail).toBe(0);
      // Shiki's token spans snap to the layout grid, so a line's end can
      // drift by a fraction of a pixel; a lost indent would be several.
      expect(delta.x, detail).toBeLessThan(0.5);
    });
  }
});

describe("CodePreview at a 320px viewport", () => {
  it("causes no horizontal page scroll, open or closed", async () => {
    const { innerWidth, innerHeight } = window;
    await page.viewport(320, 640);
    try {
      expect(window.innerWidth).toBe(320);
      const container = document.createElement("div");
      document.body.append(container);
      render(
        <CodePreview code={`${WIDE_LINE}\n${SOURCE}`} language="tsx" resettable>
          <div style={{ width: 600, height: 40 }} />
        </CodePreview>,
        { container },
      );
      const frame = query(container, '[data-slot="code-preview"]');
      const root = document.documentElement;
      const check = () => {
        expect(root.scrollWidth).toBe(root.clientWidth);
        const right = frame.getBoundingClientRect().right;
        expect(right).toBeLessThanOrEqual(320);
        // The frame clips, so hold every button to it too.
        for (const button of frame.querySelectorAll("button")) {
          expect(button.getBoundingClientRect().right).toBeLessThanOrEqual(
            right,
          );
        }
      };

      check();
      await userEvent.click(page.getByRole("button", { name: "Show code" }));
      await waitForHighlight(container);
      check();
      // The long line scrolls inside the code, and the wide example inside
      // the canvas.
      const content = query(frame, '[data-slot="code-block-content"]');
      expect(content.scrollWidth).toBeGreaterThan(content.clientWidth);
      const canvas = query(frame, '[data-slot="code-preview-canvas"]');
      expect(canvas.scrollWidth).toBeGreaterThan(canvas.clientWidth);
    } finally {
      await page.viewport(innerWidth, innerHeight);
    }
  });
});

describe("CodePreview under a theme change", () => {
  it("recolours every zone in place when data-theme changes", async () => {
    const container = mountSized(
      <div data-theme="light">
        <CodePreview code={SOURCE} language="tsx" defaultOpen resettable>
          <Example />
        </CodePreview>
      </div>,
    );
    const themed = query(container, "[data-theme]");
    await waitForHighlight(container);
    const frame = query(container, '[data-slot="code-preview"]');
    const markup = frame.innerHTML;
    const read = () => ({
      ...readLook(container),
      token: getComputedStyle(query(frame, ".line span")).color,
      reset: getComputedStyle(
        query(frame, '[data-slot="code-preview-reset-button"]'),
      ).backgroundColor,
    });
    const light = read();

    themed.dataset.theme = "dark";
    // Wait on each colour rather than a fixed delay: Button transitions its
    // background, so the reset button's colour moves over the transition, and
    // a slow runner can read any zone before the new theme has applied.
    const keys = [
      "canvas",
      "footer",
      "panel",
      "code",
      "token",
      "reset",
    ] as const;
    for (const key of keys) {
      await expect
        .poll(() => read()[key], { message: key })
        .not.toBe(light[key]);
    }
    // CSS did all of it: not one node changed.
    expect(frame.innerHTML).toBe(markup);
  });
});

describe("CodePreview inside UIID containers", () => {
  /** The frame fits `container`, and only its own boxes scroll sideways. */
  const expectContained = (frame: HTMLElement, container: HTMLElement) => {
    const outer = container.getBoundingClientRect();
    const rect = frame.getBoundingClientRect();
    expect(rect.width).toBeGreaterThan(0);
    expect(rect.left).toBeGreaterThanOrEqual(outer.left - 0.5);
    expect(rect.right).toBeLessThanOrEqual(outer.right + 0.5);
    expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth);
    const content = query(frame, '[data-slot="code-block-content"]');
    expect(content.scrollWidth).toBeGreaterThan(content.clientWidth);
  };

  it("renders inside a Card, fitting its body", async () => {
    const container = mountSized(
      <Card title="Example" data-testid="card">
        <CodePreview code={`${WIDE_LINE} ${WIDE_LINE}`} defaultOpen>
          <Example />
        </CodePreview>
      </Card>,
      { width: 360 },
    );
    await waitForHighlight(container);
    const card = query(container, '[data-testid="card"]');
    expectContained(query(card, '[data-slot="code-preview"]'), card);
  });

  it("scrolls a wide example inside the canvas in a Card", () => {
    const container = mountSized(
      <Card title="Example" data-testid="card">
        <CodePreview code="const a = 1;">
          <div style={{ width: 900, height: 40 }} />
        </CodePreview>
      </Card>,
      { width: 360 },
    );
    const card = query(container, '[data-testid="card"]');
    const frame = query(card, '[data-slot="code-preview"]');
    expect(card.getBoundingClientRect().right).toBeLessThanOrEqual(
      container.getBoundingClientRect().right + 0.5,
    );
    expect(frame.getBoundingClientRect().right).toBeLessThanOrEqual(
      card.getBoundingClientRect().right,
    );
    const canvas = query(frame, '[data-slot="code-preview-canvas"]');
    expect(canvas.scrollWidth).toBeGreaterThan(canvas.clientWidth);
  });

  it("renders inside a Dialog, fitting its popup", async () => {
    mountSized(
      <Dialog title="Example" size="small" RootProps={{ defaultOpen: true }}>
        <CodePreview code={`${WIDE_LINE} ${WIDE_LINE}`} defaultOpen>
          <Example />
        </CodePreview>
      </Dialog>,
    );
    const dialog = page.getByRole("dialog", { name: "Example" });
    await expect.element(dialog).toBeVisible();
    const popup = dialog.element() as HTMLElement;
    await waitForHighlight(popup);
    const frame = query(popup, '[data-slot="code-preview"]');
    // The open transition scales the popup, so compare unscaled boxes.
    expect(frame.offsetWidth).toBeGreaterThan(0);
    expect(frame.offsetWidth).toBeLessThanOrEqual(popup.clientWidth);
    expect(popup.scrollWidth).toBeLessThanOrEqual(popup.clientWidth);
    const content = query(frame, '[data-slot="code-block-content"]');
    expect(content.scrollWidth).toBeGreaterThan(content.clientWidth);
  });
});

describe("CodePreview with an example that opens a portal", () => {
  /* Reset is never pressed with the pointer here: a press outside a popover
     dismisses it on its own, so it would pass whether or not reset works. */
  const mountPopover = () => {
    const onReset = vi.fn();
    mountSized(
      <CodePreview code="const a = 1;" resettable onReset={onReset}>
        <Popover trigger="Open popover" title="Details">
          Inside the popover
        </Popover>
      </CodePreview>,
    );
    const opener = () =>
      page.getByRole("button", { name: "Open popover" }).element();
    const reset = page
      .getByRole("button", { name: "Reset preview" })
      .element() as HTMLElement;
    return { onReset, opener, reset };
  };

  it("opens a popover from the example, and reset from the keyboard closes it", async () => {
    const { onReset, opener, reset } = mountPopover();
    const before = opener();
    await userEvent.click(before);
    const popover = page.getByRole("dialog", { name: "Details" });
    await expect.element(popover).toBeVisible();

    reset.focus();
    expect(reset).toHaveFocus();
    await expect.element(popover).toBeVisible();
    await userEvent.keyboard("{Enter}");

    expect(onReset).toHaveBeenCalledTimes(1);
    await expect.element(popover).not.toBeInTheDocument();
    // The example remounted: its trigger is a new node.
    expect(opener()).not.toBe(before);
    expect(reset).toHaveFocus();
  });

  it("moves focus from inside the popover to reset when a click leaves it there", async () => {
    const { onReset, opener, reset } = mountPopover();
    const before = opener();
    await userEvent.click(before);
    const popover = page.getByRole("dialog", { name: "Details" });
    await expect.element(popover).toBeVisible();
    await expect
      .poll(() => popover.element().contains(document.activeElement))
      .toBe(true);

    // A click that does not focus the button, as in Safari, and is no
    // pointer press outside the popover.
    reset.click();

    expect(onReset).toHaveBeenCalledTimes(1);
    await expect.element(popover).not.toBeInTheDocument();
    expect(opener()).not.toBe(before);
    expect(reset).toHaveFocus();
  });

  it("opens a dialog from the example outside the frame's clip, and closes it", async () => {
    const container = mountSized(
      <CodePreview code="const a = 1;" resettable>
        <Dialog trigger="Open dialog" title="Details">
          Inside the dialog
        </Dialog>
      </CodePreview>,
    );
    await userEvent.click(page.getByRole("button", { name: "Open dialog" }));
    const dialog = page.getByRole("dialog", { name: "Details" });
    await expect.element(dialog).toBeVisible();
    // Portalled out of the frame, so its `overflow: hidden` cannot clip it.
    expect(container.contains(dialog.element())).toBe(false);
    await userEvent.keyboard("{Escape}");
    await expect.element(dialog).not.toBeInTheDocument();
  });

  it("closes a non-modal dialog left open when reset is pressed from the keyboard", async () => {
    mountSized(
      <CodePreview code="const a = 1;" resettable>
        <Dialog trigger="Open dialog" title="Details" modal={false}>
          Inside the dialog
        </Dialog>
      </CodePreview>,
    );
    const opener = () =>
      page.getByRole("button", { name: "Open dialog" }).element();
    const before = opener();
    await userEvent.click(before);
    const dialog = page.getByRole("dialog", { name: "Details" });
    await expect.element(dialog).toBeVisible();

    // The dialog's backdrop takes the pointer, but a non-modal dialog lets
    // focus leave it, so the keyboard reaches reset.
    const reset = page
      .getByRole("button", { name: "Reset preview" })
      .element() as HTMLElement;
    reset.focus();
    expect(reset).toHaveFocus();
    await frames();
    await expect.element(dialog).toBeVisible();
    await userEvent.keyboard("{Enter}");
    await expect.element(dialog).not.toBeInTheDocument();
    // The click Enter fires counts as an outside press, which closes the
    // dialog by itself, so prove the example remounted too.
    expect(opener()).not.toBe(before);
    expect(reset).toHaveFocus();
  });
});

describe.skipIf(server.browser !== "chromium")(
  "CodePreview under reduced motion",
  () => {
    const setReducedMotion = (value: "reduce" | "no-preference") =>
      cdp().send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value }],
      });

    it("animates the panel open, and snaps it open under reduced motion", async () => {
      const container = mountSized(
        <CodePreview code={SOURCE}>
          <Example />
        </CodePreview>,
      );
      const panel = query(container, '[data-slot="code-preview-panel"]');
      try {
        await setReducedMotion("no-preference");
        expect(getComputedStyle(panel).transitionProperty).toContain("height");

        await setReducedMotion("reduce");
        expect(matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(
          true,
        );
        const durations = (el: Element) =>
          getComputedStyle(el)
            .transitionDuration.split(",")
            .map((d) => Number.parseFloat(d));
        expect(Math.max(...durations(panel))).toBe(0);

        // Opened under reduce, the panel reaches full height. With the
        // durations above at 0 there is no animation; the poll only waits for
        // Base UI to measure the panel, not for a fixed number of frames.
        await userEvent.click(page.getByRole("button", { name: "Show code" }));
        const content = query(panel, '[data-slot="code-block-content"]');
        await expect
          .poll(() => panel.getBoundingClientRect().height)
          .toBeGreaterThan(0);
        await expect
          .poll(
            () =>
              panel.getBoundingClientRect().height -
              content.getBoundingClientRect().height,
          )
          .toBeGreaterThanOrEqual(0);
      } finally {
        await setReducedMotion("no-preference");
      }
    });
  },
);

/** Open a preview from its own trigger and wait until the panel has height. */
const openPreview = async (root: ParentNode) => {
  const trigger = query(root, '[data-slot="code-preview-trigger"]');
  const panel = query(root, '[data-slot="code-preview-panel"]');
  await userEvent.click(trigger);
  await expect.poll(() => trigger.getAttribute("aria-expanded")).toBe("true");
  await expect
    .poll(() => panel.getBoundingClientRect().height)
    .toBeGreaterThan(0);
  return panel;
};

/** The box of a line's text, without the padding its line box reserves. */
const lineTextRect = (line: Element) => {
  const range = document.createRange();
  range.selectNodeContents(line);
  return range.getBoundingClientRect();
};

describe("CodePreview copy button", () => {
  it("floats in the panel's top-right corner, clear of the code", async () => {
    const container = mountSized(
      <CodePreview code={SOURCE} language="tsx" PanelProps={{ instant: true }}>
        <Example />
      </CodePreview>,
      { width: 720 },
    );
    const panel = await openPreview(container);
    await waitForHighlight(container);
    const copy = query(panel, '[data-slot="code-block-copy-button"]');
    const box = panel.getBoundingClientRect();
    const rect = copy.getBoundingClientRect();
    expect(box.right - rect.right).toBeGreaterThanOrEqual(0);
    expect(box.right - rect.right).toBeLessThan(16);
    expect(rect.top - box.top).toBeGreaterThanOrEqual(0);
    expect(rect.top - box.top).toBeLessThan(16);
    // The frame sizes to the code and the room each line keeps for the
    // button, so no line's text runs under it.
    for (const line of panel.querySelectorAll(".line")) {
      const text = lineTextRect(line);
      if (text.width === 0) continue;
      expect(gap(text, rect).x + gap(text, rect).y).toBeGreaterThan(0);
    }
  });

  it("cannot be focused while the panel is closed, and can once it opens", async () => {
    const container = mountSized(
      <CodePreview code={SOURCE} PanelProps={{ instant: true }}>
        <Example />
      </CodePreview>,
    );
    const copy = query(container, '[data-slot="code-block-copy-button"]');
    const trigger = query(container, '[data-slot="code-preview-trigger"]');
    copy.focus();
    expect(copy).not.toHaveFocus();
    // Tabbing from the trigger leaves the preview without reaching it.
    trigger.focus();
    await userEvent.tab();
    expect(container.contains(document.activeElement)).toBe(false);
    await expect
      .element(page.getByRole("button", { name: "Copy code" }))
      .not.toBeInTheDocument();

    await openPreview(container);
    copy.focus();
    expect(copy).toHaveFocus();
  });
});

describe("CodePreview footer toggle", () => {
  it("is a full-width strip with its text centred and no icon", () => {
    const container = mountSized(
      <CodePreview code={SOURCE}>
        <Example />
      </CodePreview>,
    );
    const frame = query(container, '[data-slot="code-preview"]');
    const trigger = query(frame, '[data-slot="code-preview-trigger"]');
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger.querySelector("svg")).toBeNull();
    expect(trigger.getBoundingClientRect().width).toBe(frame.clientWidth);
    const text = lineTextRect(trigger);
    const box = trigger.getBoundingClientRect();
    expect(
      Math.abs(text.left + text.width / 2 - (box.left + box.width / 2)),
    ).toBeLessThan(1);
    // It sits last, at the frame's bottom edge.
    expect(frame.lastElementChild).toBe(trigger);
  });

  it("matches CodeBlock's expand toggle on the styles that define its look", async () => {
    const container = mountSized(
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <CodePreview code={SOURCE}>
          <Example />
        </CodePreview>
        <CodeBlock code={SOURCE} rows={2} />
      </div>,
    );
    const footer = query(container, '[data-slot="code-preview-trigger"]');
    // CodeBlock shows its toggle once it has measured that the code overflows.
    await expect
      .poll(() =>
        container.querySelector('[data-slot="code-block-expand-toggle"]'),
      )
      .not.toBeNull();
    const toggle = query(container, '[data-slot="code-block-expand-toggle"]');
    const read = (el: HTMLElement) => {
      const style = getComputedStyle(el);
      return {
        background: style.backgroundColor,
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        height: el.getBoundingClientRect().height,
        paddingInline: `${style.paddingLeft} ${style.paddingRight}`,
        borderWidth: style.borderTopWidth,
        borderColor: style.borderTopColor,
        radius: `${style.borderTopLeftRadius} ${style.borderTopRightRadius} ${style.borderBottomRightRadius} ${style.borderBottomLeftRadius}`,
        justify: style.justifyContent,
        alignText: style.textAlign,
        scale: style.scale,
      };
    };
    // Both at rest: an earlier test can leave the pointer over this spot.
    await userEvent.unhover(footer);
    await userEvent.unhover(toggle);
    await expect.poll(() => read(footer)).toEqual(read(toggle));
  });
});

describe("CodePreview canvas height", () => {
  const canvasOf = (root: ParentNode) =>
    query(root, '[data-slot="code-preview-canvas"]');
  const rem = (n: number) =>
    n * Number.parseFloat(getComputedStyle(document.documentElement).fontSize);

  it("is at least 7.5rem tall with a short example, centred within it", () => {
    const container = mountSized(
      <CodePreview code="const a = 1;">
        <div data-example style={{ width: 40, height: 20 }} />
      </CodePreview>,
    );
    const canvas = canvasOf(container);
    const rule = Number.parseFloat(getComputedStyle(canvas).borderBottomWidth);
    const box = canvas.getBoundingClientRect();
    const example = query(container, "[data-example]").getBoundingClientRect();
    expect(box.height).toBeCloseTo(rem(7.5), 1);
    expect(example.top - box.top).toBeCloseTo(
      box.bottom - rule - example.bottom,
      1,
    );
  });

  it("does not add the reset button's room on top of the minimum", () => {
    const container = mountSized(
      <CodePreview code="const a = 1;" resettable>
        <div data-example style={{ width: 40, height: 20 }} />
      </CodePreview>,
    );
    const canvas = canvasOf(container);
    const rule = Number.parseFloat(getComputedStyle(canvas).borderBottomWidth);
    const box = canvas.getBoundingClientRect();
    const example = query(container, "[data-example]").getBoundingClientRect();
    // 48px of room above and below a 20px example fits inside the minimum.
    expect(box.height).toBeCloseTo(rem(7.5), 1);
    expect(example.top - box.top).toBeCloseTo(
      box.bottom - rule - example.bottom,
      1,
    );
    const button = query(
      container,
      '[data-slot="code-preview-reset-button"]',
    ).getBoundingClientRect();
    expect(gap(example, button).y).toBeGreaterThan(0);
  });

  it("grows past the minimum with a tall example", () => {
    const container = mountSized(
      <CodePreview code="const a = 1;">
        <div data-example style={{ width: 40, height: 300 }} />
      </CodePreview>,
    );
    const box = canvasOf(container).getBoundingClientRect();
    expect(box.height).toBeGreaterThan(rem(7.5));
    expect(box.height).toBeGreaterThanOrEqual(300);
  });

  it("takes a caller's minimum height through CanvasProps", () => {
    const container = mountSized(
      <CodePreview code="const a = 1;" CanvasProps={{ minh: 240 }}>
        <div style={{ width: 40, height: 20 }} />
      </CodePreview>,
    );
    // `minh` is in pixels.
    expect(canvasOf(container).getBoundingClientRect().height).toBeCloseTo(
      240,
      1,
    );
  });
});

describe("CodePreview canvas alignment", () => {
  it("lets a wide example be scrolled to both its start and end edges", async () => {
    const container = mountSized(
      <CodePreview code="const a = 1;">
        <div data-example style={{ width: 1200, height: 40 }} />
      </CodePreview>,
      { width: 320 },
    );
    const canvas = query(container, '[data-slot="code-preview-canvas"]');
    const example = query(container, "[data-example]");
    expect(canvas.scrollWidth).toBeGreaterThan(canvas.clientWidth);

    // At the start, the example's start edge is inside the canvas, not cut
    // off past it as plain `center` would leave it.
    canvas.scrollLeft = 0;
    await expect.poll(() => canvas.scrollLeft).toBe(0);
    expect(example.getBoundingClientRect().left).toBeGreaterThanOrEqual(
      canvas.getBoundingClientRect().left,
    );

    // At the end, its end edge is inside too.
    canvas.scrollLeft = canvas.scrollWidth;
    await expect.poll(() => canvas.scrollLeft).toBeGreaterThan(0);
    expect(example.getBoundingClientRect().right).toBeLessThanOrEqual(
      canvas.getBoundingClientRect().right,
    );
  });

  it("centres a narrow example on both axes", () => {
    const container = mountSized(
      <CodePreview code="const a = 1;">
        <div data-example style={{ width: 40, height: 20 }} />
      </CodePreview>,
    );
    const canvas = query(container, '[data-slot="code-preview-canvas"]');
    const rule = Number.parseFloat(getComputedStyle(canvas).borderBottomWidth);
    const box = canvas.getBoundingClientRect();
    const example = query(container, "[data-example]").getBoundingClientRect();
    expect(example.left - box.left).toBeCloseTo(box.right - example.right, 1);
    expect(example.top - box.top).toBeCloseTo(
      box.bottom - rule - example.bottom,
      1,
    );
  });

  it("takes a caller's alignment through CanvasProps", () => {
    const container = mountSized(
      <div style={{ display: "flex", flexDirection: "column" }}>
        <CodePreview code="const a = 1;" CanvasProps={{ ax: "start" }}>
          <div data-example style={{ width: 40, height: 20 }} />
        </CodePreview>
      </div>,
    );
    const canvas = query(container, '[data-slot="code-preview-canvas"]');
    const box = canvas.getBoundingClientRect();
    const example = query(container, "[data-example]").getBoundingClientRect();
    // The default padding (24px) is all that sits before it.
    expect(example.left - box.left).toBeCloseTo(24, 0);
  });
});
