import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { CodeBlock } from "./code-block";

// The outline width, style and offset come from the global tokens.
import "@uiid/tokens/globals.css";

/* Runs in a real browser, which resolves the cascade happy-dom cannot: the
   block clips its overflow, so the expand toggle's focus ring has to be drawn
   inside the button rather than at Button's own outward offset. */
const LONG = Array.from({ length: 40 }, (_, i) => `const n${i} = ${i};`).join(
  "\n",
);

describe("CodeBlock expand toggle focus ring", () => {
  it("draws the ring inside the toggle, where the block cannot clip it", async () => {
    render(<CodeBlock code={LONG} rows={4} />);

    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();

    // Tab from the scroll area or the copy button until the toggle has focus.
    const el = toggle.element() as HTMLElement;
    for (let i = 0; i < 5 && document.activeElement !== el; i++) {
      await userEvent.tab();
    }
    expect(el).toHaveFocus();
    expect(el.matches(":focus-visible")).toBe(true);

    const style = getComputedStyle(el);
    const width = Number.parseFloat(style.outlineWidth);
    expect(style.outlineStyle).toBe("solid");
    expect(width).toBeGreaterThan(0);
    expect(Number.parseFloat(style.outlineOffset)).toBe(-width);
  });
});
