import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { CodeBlock } from "./code-block";

// The outline, spacing and form-size tokens come from the global sheet.
import "@uiid/tokens/globals.css";

/* Runs in a real browser, which resolves the cascade and layout happy-dom
   cannot. Prerendered `html` keeps every measurement off the async Shiki load. */
const LONG = Array.from({ length: 40 }, (_, i) => `const n${i} = ${i};`).join(
  "\n",
);

const LONG_FIRST_LINE =
  "const message = 'a first line long enough to reach the corner where the buttons float';";

const toHtml = (code: string) =>
  `<pre class="shiki"><code>${code
    .split("\n")
    .map((line) => `<span class="line">${line}</span>`)
    .join("\n")}</code></pre>`;

const px = (value: string) => Number.parseFloat(value);

const query = (selector: string) =>
  document.querySelector<HTMLElement>(selector)!;

/** Tab until `el` has focus, so a change in the tab order cannot break it. */
const tabTo = async (el: HTMLElement) => {
  for (let i = 0; i < 20 && document.activeElement !== el; i++) {
    await userEvent.tab();
  }
  expect(el).toHaveFocus();
  expect(el.matches(":focus-visible")).toBe(true);
};

/** The block's padding box: the region its `overflow: hidden` clips to. */
const clipBox = (block: HTMLElement) => {
  const rect = block.getBoundingClientRect();
  const border = px(getComputedStyle(block).borderTopWidth);
  return {
    top: rect.top + border,
    right: rect.right - border,
    bottom: rect.bottom - border,
    left: rect.left + border,
  };
};

describe("CodeBlock expand toggle", () => {
  it("draws the ring inside the toggle, where the block cannot clip it", async () => {
    render(<CodeBlock code={LONG} html={toHtml(LONG)} rows={4} />);

    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();

    const el = toggle.element() as HTMLElement;
    await tabTo(el);

    const style = getComputedStyle(el);
    const width = px(style.outlineWidth);
    expect(style.outlineStyle).toBe("solid");
    expect(width).toBeGreaterThan(0);
    expect(px(style.outlineOffset)).toBe(-width);

    // The ring's rounded corners follow the same radius the block clips to.
    const block = query('[data-slot="code-block"]');
    const blockStyle = getComputedStyle(block);
    const innerRadius =
      px(blockStyle.borderBottomLeftRadius) - px(blockStyle.borderTopWidth);
    expect(px(style.borderBottomLeftRadius)).toBeCloseTo(innerRadius, 1);
    expect(px(style.borderBottomRightRadius)).toBeCloseTo(innerRadius, 1);
  });

  it("spans the frame's full width along its bottom edge", async () => {
    render(<CodeBlock code={LONG} html={toHtml(LONG)} rows={4} />);
    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();

    const box = clipBox(query('[data-slot="code-block"]'));
    const rect = (toggle.element() as HTMLElement).getBoundingClientRect();
    expect(rect.left).toBeCloseTo(box.left, 0);
    expect(rect.right).toBeCloseTo(box.right, 0);
    expect(rect.bottom).toBeCloseTo(box.bottom, 0);
  });

  it("is muted until hovered", async () => {
    render(<CodeBlock code={LONG} html={toHtml(LONG)} rows={4} />);
    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();
    const el = toggle.element() as HTMLElement;

    const muted = getComputedStyle(el).color;
    const text = getComputedStyle(query('[data-slot="code-block"]')).color;
    expect(muted).not.toBe(text);

    await userEvent.hover(el);
    await expect.poll(() => getComputedStyle(el).color).not.toBe(muted);
  });

  it("fades the last collapsed line, and only while collapsed", async () => {
    render(<CodeBlock code={LONG} html={toHtml(LONG)} rows={4} />);
    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();

    const scroll = query('[data-slot="code-block-scroll"]');
    expect(getComputedStyle(scroll).maskImage).toContain("linear-gradient");

    await toggle.click();
    await expect
      .element(page.getByRole("button", { name: "Show less" }))
      .toBeInTheDocument();
    expect(getComputedStyle(scroll).maskImage).toBe("none");
  });

  it("draws no fade when the code fits in its rows", async () => {
    render(
      <CodeBlock code="const a = 1;" html={toHtml("const a = 1;")} rows={4} />,
    );
    const scroll = query('[data-slot="code-block-scroll"]');
    expect(scroll).toHaveAttribute("data-collapsed");
    expect(getComputedStyle(scroll).maskImage).toBe("none");
  });
});

describe("CodeBlock frame", () => {
  it("has one border, and no inner rule but the header bar's bottom border", async () => {
    render(
      <CodeBlock
        code={LONG}
        html={toHtml(LONG)}
        filename="a.ts"
        rows={4}
        wrappable
      />,
    );
    await expect
      .element(page.getByRole("button", { name: "Show more" }))
      .toBeInTheDocument();

    const block = query('[data-slot="code-block"]');
    const header = query('[data-slot="code-block-header"]');
    expect(px(getComputedStyle(block).borderTopWidth)).toBeGreaterThan(0);
    // Tests load CSS modules unlayered, so Box's `border-width: 0` outranks
    // the `bb` style prop here; in a build the props layer wins. Check the prop.
    expect(header).toHaveAttribute("data-ui-bb", "1");

    // Any other border inside the frame is transparent or zero width.
    for (const el of block.querySelectorAll<HTMLElement>("*")) {
      if (el === header) continue;
      const style = getComputedStyle(el);
      for (const side of ["Top", "Right", "Bottom", "Left"] as const) {
        const width = px(style[`border${side}Width`]);
        const color = style[`border${side}Color`];
        const visible =
          width > 0 &&
          style[`border${side}Style`] !== "none" &&
          color !== "rgba(0, 0, 0, 0)" &&
          color !== "transparent";
        expect(visible, `${el.dataset.slot ?? el.tagName} ${side}`).toBe(false);
      }
    }
  });
});

describe("CodeBlock header with a long filename", () => {
  it("truncates the filename while the buttons keep their size and row", async () => {
    const filename = `${"deeply/nested/".repeat(8)}component.tsx`;
    render(
      <div data-testid="narrow" style={{ width: 280 }}>
        <CodeBlock
          code="x"
          html={toHtml("x")}
          filename={filename}
          language="tsx"
          wrappable
          fullscreenable
        />
      </div>,
    );

    const name = page.getByText(filename).element() as HTMLElement;
    expect(name.scrollWidth).toBeGreaterThan(name.clientWidth);
    expect(getComputedStyle(name).textOverflow).toBe("ellipsis");

    const header = query('[data-slot="code-block-header"]');
    const headerRect = header.getBoundingClientRect();
    const buttons = [...header.querySelectorAll<HTMLElement>("button")];
    expect(buttons).toHaveLength(3);

    const size = px(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--forms-size-xs-height",
      ),
    );
    const top = buttons[0].getBoundingClientRect().top;
    for (const button of buttons) {
      const rect = button.getBoundingClientRect();
      // Not shrunk, not wrapped onto a second row, not clipped by the header.
      expect(rect.width).toBeGreaterThanOrEqual(rect.height - 0.5);
      expect(rect.height).toBeCloseTo(size * 16, 0);
      expect(rect.top).toBeCloseTo(top, 0);
      expect(rect.right).toBeLessThanOrEqual(headerRect.right);
    }
  });
});

describe("CodeBlock floating buttons", () => {
  it("sit in the top-right corner over the code, on the block's surface", async () => {
    render(<CodeBlock code="x" html={toHtml("x")} wrappable />);

    const block = query('[data-slot="code-block"]');
    const header = query('[data-slot="code-block-header"]');
    expect(header).toHaveAttribute("data-floating");

    const box = clipBox(block);
    const rect = header.getBoundingClientRect();
    const firstLine = query(".line").getBoundingClientRect();

    expect(getComputedStyle(header).position).toBe("absolute");
    // Right-aligned near the corner and centred on the first line.
    expect(box.right - rect.right).toBeGreaterThan(0);
    expect(box.right - rect.right).toBeLessThan(16);
    const lineCentre = firstLine.top + firstLine.height / 2;
    expect(rect.top + rect.height / 2).toBeCloseTo(lineCentre, 0);

    // An opaque plate in the block's own surface colour: the code never shows
    // through the icons, which keep the block's foreground contrast.
    expect(getComputedStyle(header).backgroundColor).toBe(
      getComputedStyle(block).backgroundColor,
    );

    // Visible without hover.
    for (const button of header.querySelectorAll<HTMLElement>("button")) {
      const style = getComputedStyle(button);
      expect(style.visibility).toBe("visible");
      expect(Number(style.opacity)).toBe(1);
    }
  });

  it("keep each button's focus ring inside the clipped frame", async () => {
    render(<CodeBlock code="x" html={toHtml("x")} wrappable fullscreenable />);
    const box = clipBox(query('[data-slot="code-block"]'));

    for (const name of ["Toggle line wrap", "Copy code", "Enter fullscreen"]) {
      const el = page.getByRole("button", { name }).element() as HTMLElement;
      await tabTo(el);
      const style = getComputedStyle(el);
      const reach = px(style.outlineOffset) + px(style.outlineWidth);
      const rect = el.getBoundingClientRect();
      expect(rect.top - reach).toBeGreaterThanOrEqual(box.top);
      expect(rect.right + reach).toBeLessThanOrEqual(box.right);
    }
  });

  it("reserve the first line's end, so a wrapped first line breaks before them", async () => {
    const code = `${LONG_FIRST_LINE}\nconst second = 2;`;
    render(
      <div style={{ width: 360 }}>
        <CodeBlock code={code} html={toHtml(code)} defaultWrap wrappable />
      </div>,
    );

    const actions = query('[data-slot="code-block-actions"]');
    const [first, second] = [
      ...document.querySelectorAll<HTMLElement>(".line"),
    ];
    expect(px(getComputedStyle(first).paddingInlineEnd)).toBeGreaterThan(0);
    expect(px(getComputedStyle(second).paddingInlineEnd)).toBeLessThan(
      px(getComputedStyle(first).paddingInlineEnd),
    );

    // Every glyph of the first line's top row ends before the buttons start.
    const range = document.createRange();
    range.selectNodeContents(first);
    const rows = [...range.getClientRects()];
    const topRow = Math.min(...rows.map((r) => r.top));
    const actionsLeft = actions.getBoundingClientRect().left;
    for (const r of rows.filter((r) => Math.abs(r.top - topRow) < 1)) {
      expect(r.right).toBeLessThanOrEqual(actionsLeft);
    }
  });

  it("reserve no first-line space under a header bar", async () => {
    render(<CodeBlock code="x" html={toHtml("x")} filename="a.ts" />);
    const line = query(".line");
    // Only the line's own quarter-unit inline padding.
    expect(px(getComputedStyle(line).paddingInlineEnd)).toBeLessThan(8);
  });
});
