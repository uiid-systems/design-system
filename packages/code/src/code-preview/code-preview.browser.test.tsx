import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { userEvent } from "vitest/browser";

import { CodePreview } from "./code-preview";

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
