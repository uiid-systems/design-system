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

/** A CSS length, such as a token, resolved to pixels by a probe element. */
const toPx = (length: string) => {
  const probe = document.createElement("div");
  probe.style.width = length;
  document.body.append(probe);
  const width = probe.getBoundingClientRect().width;
  probe.remove();
  return width;
};

/** The boxes of an element's rendered text, one per line fragment. */
const textRects = (el: Element) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return [...range.getClientRects()].filter((r) => r.width > 0);
};

const intersects = (a: DOMRect, b: DOMRect) =>
  a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

/** Visible as a user sees it, opacity and visibility of ancestors included. */
const isShown = (el: Element) =>
  el.checkVisibility({ opacityProperty: true, visibilityProperty: true });

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

  it("is muted until hovered or focused", async () => {
    render(<CodeBlock code={LONG} html={toHtml(LONG)} rows={4} />);
    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();
    const el = toggle.element() as HTMLElement;

    const muted = getComputedStyle(el).color;
    const text = getComputedStyle(query('[data-slot="code-block"]')).color;
    expect(muted).not.toBe(text);

    await userEvent.hover(el);
    await expect.poll(() => getComputedStyle(el).color).not.toBe(muted);
    await userEvent.unhover(el);
    await expect.poll(() => getComputedStyle(el).color).toBe(muted);

    await tabTo(el);
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

    // A border style prop measures zero here for the same reason, so no other
    // element may carry one.
    const borderProps = ["b", "bx", "by", "bt", "bb", "bl", "br"];
    for (const el of block.querySelectorAll<HTMLElement>("*")) {
      for (const key of borderProps) {
        if (el === header && key === "bb") continue;
        expect(
          el.hasAttribute(`data-ui-${key}`),
          `${el.dataset.slot ?? el.tagName} data-ui-${key}`,
        ).toBe(false);
      }
    }

    // Any other border inside the frame is transparent or zero width, as are
    // the header's other three sides.
    for (const el of block.querySelectorAll<HTMLElement>("*")) {
      const style = getComputedStyle(el);
      const sides = ["Top", "Right", "Bottom", "Left"] as const;
      for (const side of sides) {
        if (el === header && side === "Bottom") continue;
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

    const size = toPx("var(--forms-size-xs-height)");
    const nameRect = name.getBoundingClientRect();
    const nameCentre = nameRect.top + nameRect.height / 2;
    for (const button of buttons) {
      const rect = button.getBoundingClientRect();
      // Not shrunk, not clipped by the header, and on the filename's row.
      expect(rect.width).toBeGreaterThanOrEqual(rect.height - 0.5);
      expect(rect.height).toBeCloseTo(size, 0);
      expect(rect.top + rect.height / 2).toBeCloseTo(nameCentre, 0);
      expect(rect.right).toBeLessThanOrEqual(headerRect.right);
    }
    // One bar tall: nothing wrapped onto a second row.
    expect(headerRect.height).toBeLessThan(2 * size);
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
    const plate = getComputedStyle(header).backgroundColor;
    expect(plate).not.toBe("rgba(0, 0, 0, 0)");
    expect(plate).not.toBe("transparent");
    expect(plate).toBe(getComputedStyle(block).backgroundColor);

    // Visible without hover, ancestors' opacity and visibility included.
    expect(isShown(header)).toBe(true);
    expect(isShown(query('[data-slot="code-block-actions"]'))).toBe(true);
    for (const button of header.querySelectorAll<HTMLElement>("button")) {
      expect(isShown(button)).toBe(true);
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

  it("reserve only the first line's end when the code cannot scroll", async () => {
    const code = `${LONG_FIRST_LINE}\n${LONG_FIRST_LINE}`;
    render(
      <div style={{ width: 360 }}>
        <CodeBlock code={code} html={toHtml(code)} defaultWrap wrappable />
      </div>,
    );

    const actions = query('[data-slot="code-block-actions"]');
    const [first, second] = [
      ...document.querySelectorAll<HTMLElement>(".line"),
    ];
    // Only the line's own bleed on the second line.
    expect(px(getComputedStyle(second).paddingInlineEnd)).toBeCloseTo(
      toPx("var(--spacing-unit)"),
      1,
    );

    // The first line's top row ends a full gap before the buttons start.
    const rows = textRects(first);
    const topRow = Math.min(...rows.map((r) => r.top));
    const actionsLeft = actions.getBoundingClientRect().left;
    const gap = toPx("var(--code-actions-gap)");
    expect(gap).toBeGreaterThan(0);
    for (const r of rows.filter((r) => Math.abs(r.top - topRow) < 1)) {
      expect(r.right).toBeLessThanOrEqual(actionsLeft - gap + 0.5);
    }
  });

  it("keep every line clear while a collapsed block scrolls beneath them", async () => {
    const code = Array.from({ length: 12 }, () => LONG_FIRST_LINE).join("\n");
    render(
      <div style={{ width: 360 }}>
        <CodeBlock
          code={code}
          html={toHtml(code)}
          rows={4}
          defaultWrap
          wrappable
        />
      </div>,
    );
    await expect
      .element(page.getByRole("button", { name: "Show more" }))
      .toBeInTheDocument();

    const scroll = query('[data-slot="code-block-scroll"]');
    const actions = query('[data-slot="code-block-actions"]');
    // Scroll a few lines down, so later lines sit where the buttons float.
    scroll.scrollTop =
      3 * toPx("calc(var(--code-font-size) * var(--code-line-height))");
    expect(scroll.scrollTop).toBeGreaterThan(0);

    const actionsRect = actions.getBoundingClientRect();
    const rects = [...document.querySelectorAll(".line")].flatMap(textRects);
    const beside = rects.filter(
      (r) => r.top < actionsRect.bottom && r.bottom > actionsRect.top,
    );
    expect(beside.length).toBeGreaterThan(0);
    for (const r of rects) {
      expect(intersects(r, actionsRect)).toBe(false);
    }
  });

  it("reserve every line's end in the fullscreen view", async () => {
    const code = `${LONG_FIRST_LINE}\nconst second = 2;`;
    render(<CodeBlock code={code} html={toHtml(code)} fullscreenable />);
    await userEvent.click(
      page.getByRole("button", { name: "Enter fullscreen" }).element(),
    );
    const dialog = page.getByRole("dialog");
    await expect.element(dialog).toBeInTheDocument();

    const lines = (dialog.element() as HTMLElement).querySelectorAll(".line");
    const first = px(getComputedStyle(lines[0]).paddingInlineEnd);
    expect(first).toBeGreaterThan(toPx("var(--spacing-unit)"));
    expect(px(getComputedStyle(lines[1]).paddingInlineEnd)).toBe(first);
  });

  it("reserve no first-line space under a header bar", async () => {
    render(<CodeBlock code="x" html={toHtml("x")} filename="a.ts" />);
    const line = query(".line");
    // Only the line's own quarter-unit inline padding.
    expect(px(getComputedStyle(line).paddingInlineEnd)).toBeLessThan(8);
  });
});
