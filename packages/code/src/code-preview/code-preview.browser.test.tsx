import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { CodeBlock } from "../code-block";
import {
  getBlock,
  mountSized,
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
    expect(canvas.right - button.right).toBeLessThan(16);
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
    const canvas = query(
      container,
      '[data-slot="code-preview-canvas"]',
    ).getBoundingClientRect();
    const example = query(container, "[data-example]").getBoundingClientRect();
    const button = query(
      container,
      '[data-slot="code-preview-reset-button"]',
    ).getBoundingClientRect();
    expect(example.width).toBeGreaterThan(canvas.width / 2);
    expect(gap(example, button).y).toBeGreaterThan(0);
    // The room is reserved above and below alike, so the example stays centred.
    expect(example.top - canvas.top).toBeCloseTo(
      canvas.bottom - example.bottom,
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
    const after = button.getBoundingClientRect();
    expect(after.left).toBe(before.left);
    expect(after.top).toBe(before.top);
    expect(frame.getBoundingClientRect().right - after.right).toBeLessThan(16);
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
    expect(button.getBoundingClientRect().height).toBe(32);
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
    bar: style("code-preview-bar").backgroundColor,
    panel: style("code-preview-panel").backgroundColor,
    code: pre && getComputedStyle(pre).backgroundColor,
  };
};

describe("CodePreview composed from its parts", () => {
  it("looks the same as the assembled preview, and highlights once open", async () => {
    const assembled = mountSized(<Examples.Default />);
    const composed = mountSized(<Examples.Composed />);

    for (const root of [assembled, composed]) {
      await userEvent.click(
        page.getByRole("button", { name: "Show code" }).first(),
      );
      await waitForHighlight(root);
    }

    const look = readLook(composed);
    expect(look).toEqual(readLook(assembled));
    // The two zones differ, and the frame has a border.
    expect(look.canvas).not.toBe(look.code);
    expect(look.border).not.toMatch(/^0px/);
  });
});

describe("CodePreview zones", () => {
  for (const theme of ["light", "dark"]) {
    it(`paints the canvas apart from the code and the bar in the ${theme} theme`, async () => {
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
      expect(look.canvas).not.toBe(look.bar);
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
      const width = () => frame.getBoundingClientRect().width;
      const trigger = page.getByRole("button", { name: /^(show|hide) code$/i });

      const closed = width();
      await userEvent.click(trigger);
      await waitForHighlight(container);
      await frames();
      const open = width();
      await userEvent.click(trigger);
      await frames();
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
    await frames();
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
    await frames();
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
