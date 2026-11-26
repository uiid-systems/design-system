import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import {
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

  it("does not move the example or change the canvas's height", () => {
    const { container } = render(
      <div>
        <div data-preview="plain">
          <CodePreview code="const a = 1;" CanvasProps={{ gap: 8 }}>
            <Example />
          </CodePreview>
        </div>
        <div data-preview="resettable">
          <CodePreview code="const a = 1;" CanvasProps={{ gap: 8 }} resettable>
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
