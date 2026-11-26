import { render } from "@testing-library/react";
// Types `cdp().send`, which the Playwright provider adds to vitest/browser.
import type {} from "@vitest/browser-playwright";
import { act } from "react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { cdp, page, server, userEvent } from "vitest/browser";

import { highlight } from "../highlighter/highlighter";
import { CodeBlock } from "./code-block";
import {
  boxesDelta,
  getBlock,
  isHighlighted,
  mountSized,
  readBoxes,
  waitForHighlight,
} from "./code-block.browser.test.helpers";

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
  `<pre class="shiki" style="--shiki-light-bg:#ffffff;--shiki-dark-bg:#000000"><code>${code
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

/** A CSS colour, such as a token, resolved by a probe element. */
const toColor = (color: string) => {
  const probe = document.createElement("div");
  probe.style.color = color;
  document.body.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
};

const TRANSPARENT = new Set(["rgba(0, 0, 0, 0)", "transparent"]);

/** The boxes of an element's rendered text, one per line fragment. */
const textRects = (el: Element) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return [...range.getClientRects()].filter((r) => r.width > 0);
};

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

    const muted = toColor("var(--shade-muted)");
    const foreground = toColor("var(--shade-foreground)");
    expect(muted).not.toBe(foreground);
    await expect.poll(() => getComputedStyle(el).color).toBe(muted);

    await userEvent.hover(el);
    await expect.poll(() => getComputedStyle(el).color).toBe(foreground);
    await userEvent.unhover(el);
    await expect.poll(() => getComputedStyle(el).color).toBe(muted);

    await tabTo(el);
    await expect.poll(() => getComputedStyle(el).color).toBe(foreground);
  });

  it("fades the last collapsed line, and only while collapsed", async () => {
    render(<CodeBlock code={LONG} html={toHtml(LONG)} rows={4} />);
    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();

    const scroll = query('[data-slot="code-block-scroll"]');
    const fade = () => getComputedStyle(scroll, "::after");
    expect(fade().backgroundImage).toContain("linear-gradient");
    // The fade covers the last row.
    const row = toPx("calc(var(--code-font-size) * var(--code-line-height))");
    expect(px(fade().height)).toBeCloseTo(row, 1);

    // The collapsed area ends on the last row's bottom edge: its rows plus the
    // top padding, with the toggle directly beneath and no padding band.
    const rows = 4;
    expect(scroll.getBoundingClientRect().height).toBeCloseTo(
      rows * row + toPx("var(--code-padding)"),
      0,
    );
    const toggleBox = query(
      '[data-slot="code-block-expand-toggle"]',
    ).getBoundingClientRect();
    expect(toggleBox.top).toBeCloseTo(scroll.getBoundingClientRect().bottom, 0);

    await toggle.click();
    await expect
      .element(page.getByRole("button", { name: "Show less" }))
      .toBeInTheDocument();
    expect(fade().content).toBe("none");
  });

  it("draws no fade when the code fits in its rows", async () => {
    render(
      <CodeBlock code="const a = 1;" html={toHtml("const a = 1;")} rows={4} />,
    );
    const scroll = query('[data-slot="code-block-scroll"]');
    expect(scroll).toHaveAttribute("data-collapsed");
    expect(getComputedStyle(scroll, "::after").content).toBe("none");
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

    // The frame takes the editor theme's background, so the code area and the
    // code's own <pre> are either transparent or painted in the block's colour.
    // The fixture's <pre> carries the Shiki themes' backgrounds, as real output
    // does, so this fails if the surface tokens drift from them.
    const surface = getComputedStyle(block).backgroundColor;
    expect(TRANSPARENT.has(surface)).toBe(false);
    expect(surface).toBe(
      getComputedStyle(block.querySelector("pre")!).backgroundColor,
    );
    // The bar and the toggle at rest sit on the theme's surface instead.
    const themeSurface = toColor("var(--shade-surface)");
    expect(getComputedStyle(header).backgroundColor).toBe(themeSurface);
    expect(
      getComputedStyle(query('[data-slot="code-block-expand-toggle"]'))
        .backgroundColor,
    ).toBe(themeSurface);
    const layers = [
      query('[data-slot="code-block-scroll"]'),
      query('[data-slot="code-block-content"]'),
      block.querySelector("pre")!,
    ];
    for (const el of layers) {
      const background = getComputedStyle(el).backgroundColor;
      expect(
        TRANSPARENT.has(background) || background === surface,
        `${el.dataset.slot ?? el.tagName} ${background}`,
      ).toBe(true);
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
    expect(box.right - rect.right).toBeCloseTo(
      toPx("var(--code-actions-inset)"),
      0,
    );
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
    const bleed = toPx("var(--spacing-unit)");
    // The first line reserves the buttons' space; the second has only its
    // own bleed.
    expect(px(getComputedStyle(first).paddingInlineEnd)).toBeGreaterThan(bleed);
    expect(px(getComputedStyle(second).paddingInlineEnd)).toBeCloseTo(bleed, 1);

    // The first line's top row ends a full gap before the buttons start.
    const rows = textRects(first);
    const topRow = Math.min(...rows.map((r) => r.top));
    const actionsLeft = actions.getBoundingClientRect().left;
    const gap = toPx("var(--code-actions-gap)");
    expect(gap).toBeGreaterThan(0);
    for (const r of rows.filter((r) => Math.abs(r.top - topRow) < 1)) {
      // The whole gap is the intended clearance, so no margin beyond it is
      // required; the half pixel only absorbs subpixel rounding.
      expect(r.right).toBeLessThanOrEqual(actionsLeft - gap + 0.5);
    }
  });

  it("reserve only the first line while collapsed, since it cannot scroll", async () => {
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

    const lines = document.querySelectorAll<HTMLElement>(".line");
    const bleed = toPx("var(--spacing-unit)");
    expect(px(getComputedStyle(lines[0]).paddingInlineEnd)).toBeGreaterThan(
      bleed,
    );
    expect(px(getComputedStyle(lines[1]).paddingInlineEnd)).toBeCloseTo(
      bleed,
      1,
    );
  });

  it("reserve only the first line when a block with rows fits them", async () => {
    const code = `${LONG_FIRST_LINE}\n${LONG_FIRST_LINE}`;
    render(
      <div style={{ width: 360 }}>
        <CodeBlock
          code={code}
          html={toHtml(code)}
          rows={20}
          defaultWrap
          wrappable
        />
      </div>,
    );
    const scroll = query('[data-slot="code-block-scroll"]');
    expect(scroll).toHaveAttribute("data-collapsed");
    expect(
      page.getByRole("button", { name: "Show more" }).query(),
    ).not.toBeInTheDocument();

    const second = document.querySelectorAll<HTMLElement>(".line")[1];
    expect(px(getComputedStyle(second).paddingInlineEnd)).toBeCloseTo(
      toPx("var(--spacing-unit)"),
      1,
    );
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
    // Only the line's own bleed.
    expect(px(getComputedStyle(line).paddingInlineEnd)).toBeCloseTo(
      toPx("var(--spacing-unit)"),
      1,
    );
  });
});

describe("CodeBlock collapsed code area", () => {
  it("clips instead of scrolling, so Show more is the way to the rest", async () => {
    render(<CodeBlock code={LONG} html={toHtml(LONG)} rows={4} />);
    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();

    const scroll = query('[data-slot="code-block-scroll"]');
    expect(getComputedStyle(scroll).overflowY).toBe("clip");
    expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
    scroll.scrollTop = 100;
    expect(scroll.scrollTop).toBe(0);
    await userEvent.wheel(scroll, { delta: { y: 200 } });
    expect(scroll.scrollTop).toBe(0);
  });

  it("leaves no tab stop before the toggle when no line scrolls sideways", async () => {
    render(
      <CodeBlock code={LONG} html={toHtml(LONG)} rows={4} copyable={false} />,
    );
    const toggle = page.getByRole("button", { name: "Show more" });
    await expect.element(toggle).toBeInTheDocument();

    // The first Tab into the page lands on the toggle, the block's one control.
    (document.activeElement as HTMLElement | null)?.blur();
    await userEvent.tab();
    expect(toggle.element()).toHaveFocus();
  });

  it("still scrolls a long unwrapped line sideways", async () => {
    const code = `${LONG_FIRST_LINE.repeat(3)}\n${LONG}`;
    render(
      <div style={{ width: 360 }}>
        <CodeBlock code={code} html={toHtml(code)} rows={4} />
      </div>,
    );
    await expect
      .element(page.getByRole("button", { name: "Show more" }))
      .toBeInTheDocument();

    const content = query('[data-slot="code-block-content"]');
    expect(content.scrollWidth).toBeGreaterThan(content.clientWidth);
    // The content is the one scroller, so it is a tab stop and the arrow keys
    // move it sideways.
    await tabTo(content);
    await userEvent.keyboard("{ArrowRight}");
    await expect.poll(() => content.scrollLeft).toBeGreaterThan(0);
  });

  it("clips nothing and shows no toggle when the code fits in its rows", async () => {
    render(
      <CodeBlock code="const a = 1;" html={toHtml("const a = 1;")} rows={4} />,
    );
    const scroll = query('[data-slot="code-block-scroll"]');
    expect(scroll).toHaveAttribute("data-collapsed");
    expect(scroll.scrollHeight).toBeLessThanOrEqual(scroll.clientHeight);
    expect(
      page.getByRole("button", { name: "Show more" }).query(),
    ).not.toBeInTheDocument();
  });
});

/* Emulating the media query and holding a press need Chromium's DevTools
   protocol, so other browsers skip this. */
describe.skipIf(server.browser !== "chromium")(
  "CodeBlock under reduced motion",
  () => {
    const setReducedMotion = (value: "reduce" | "no-preference") =>
      cdp().send("Emulation.setEmulatedMedia", {
        features: [{ name: "prefers-reduced-motion", value }],
      });

    const mouse = async (
      el: HTMLElement,
      type: "mousePressed" | "mouseReleased",
    ) => {
      const rect = el.getBoundingClientRect();
      await cdp().send("Input.dispatchMouseEvent", {
        type,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        button: "left",
        clickCount: 1,
      });
    };

    it("does not scale a button on press, as it does otherwise", async () => {
      render(<CodeBlock code="x" html={toHtml("x")} wrappable />);
      const button = page
        .getByRole("button", { name: "Toggle line wrap" })
        .element() as HTMLElement;

      try {
        await setReducedMotion("no-preference");
        await mouse(button, "mousePressed");
        await expect
          .poll(() => getComputedStyle(button).scale)
          .not.toBe("none");
        await mouse(button, "mouseReleased");

        await setReducedMotion("reduce");
        expect(matchMedia("(prefers-reduced-motion: reduce)").matches).toBe(
          true,
        );
        await mouse(button, "mousePressed");
        expect(button.matches(":active")).toBe(true);
        expect(getComputedStyle(button).scale).toBe("none");
        await mouse(button, "mouseReleased");
      } finally {
        await setReducedMotion("no-preference");
      }
    });
  },
);

/* Real Shiki output, loaded on first use, against the plain fallback it
   replaces. Indentation, a blank line and a long-ish line cover the markup the
   two paths could disagree on. */
const SOURCE = [
  'import { useState } from "react";',
  "",
  "export function Counter({ start = 0 }: { start?: number }) {",
  "  const [count, setCount] = useState(start);",
  "  return <button onClick={() => setCount(count + 1)}>{count}</button>;",
  "}",
].join("\n");

describe("CodeBlock when highlighting lands", () => {
  for (const showLineNumbers of [false, true]) {
    it(`keeps its height and every line in place${showLineNumbers ? " with line numbers" : ""}`, async () => {
      const container = mountSized(
        <CodeBlock
          code={SOURCE}
          language="tsx"
          showLineNumbers={showLineNumbers}
        />,
      );
      // The first paint is the fallback: Shiki has not answered yet.
      expect(isHighlighted(container)).toBe(false);
      const before = readBoxes(getBlock(container));
      expect(before.lines).toHaveLength(SOURCE.split("\n").length);

      await waitForHighlight(container);
      const after = readBoxes(getBlock(container));
      const delta = boxesDelta(before, after);
      const detail = JSON.stringify({ before, after });
      // Vertically nothing moves at all: the block's height, every row's top
      // and height.
      expect(delta.y, detail).toBe(0);
      // Across, Shiki's token spans each snap to the layout grid (1/64px), so
      // a line's end can drift by a fraction of a pixel. Under half a pixel
      // is no visible shift; a lost gutter or indent would be several.
      expect(delta.x, detail).toBeLessThan(0.5);
    });
  }
});

describe("CodeBlock with server html", () => {
  it("paints highlighted code first and changes nothing on hydration", async () => {
    const html = await highlight(SOURCE, "tsx");
    const ui = <CodeBlock code={SOURCE} language="tsx" html={html} />;

    const container = document.createElement("div");
    // Wide enough for every line: code that scrolls becomes a tab stop once
    // the client measures it, which the server cannot know.
    container.style.width = "640px";
    document.body.append(container);
    container.innerHTML = renderToString(ui);

    try {
      // Before any script runs, the server markup is the highlighted code, in
      // more than one colour.
      expect(isHighlighted(container)).toBe(true);
      const colours = new Set(
        [...container.querySelectorAll(".line span")].map(
          (span) => getComputedStyle(span).color,
        ),
      );
      expect(colours.size).toBeGreaterThan(1);
      const before = readBoxes(getBlock(container));
      const markup = container.innerHTML;
      // Precondition: the code fits, so the client adds no tab stop.
      const content = container.querySelector<HTMLElement>(
        '[data-slot="code-block-content"]',
      )!;
      expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth);

      const mutations: MutationRecord[] = [];
      const observer = new MutationObserver((records) =>
        mutations.push(...records),
      );
      observer.observe(container, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
      const errors: unknown[] = [];
      let root: ReturnType<typeof hydrateRoot> | undefined;
      await act(async () => {
        root = hydrateRoot(container, ui, {
          onRecoverableError: (error) => errors.push(error),
        });
      });
      mutations.push(...observer.takeRecords());
      observer.disconnect();

      expect(errors).toEqual([]);
      expect(mutations).toEqual([]);
      expect(container.innerHTML).toBe(markup);
      expect(readBoxes(getBlock(container))).toEqual(before);
      act(() => root?.unmount());
    } finally {
      container.remove();
    }
  });
});

/* Real Shiki output, which puts `tabindex="0"` on its <pre> whether or not the
   code scrolls. The content is the box that scrolls, so it is the tab stop, and
   only while it has somewhere to scroll. */
describe("CodeBlock keyboard scrolling", () => {
  const SHORT = "const a = 1;";
  const WIDE = `const wide = "${"x".repeat(200)}";`;
  const content = (root: ParentNode = document) =>
    root.querySelector<HTMLElement>('[data-slot="code-block-content"]')!;

  it("adds no tab stop beyond its buttons when the code fits", async () => {
    const html = await highlight(SHORT, "typescript");
    render(
      <>
        <CodeBlock code={SHORT} html={html} />
        <button type="button">After</button>
      </>,
    );
    const copy = page.getByRole("button", { name: /copy/i });
    await expect.element(copy).toBeInTheDocument();

    expect(content()).not.toHaveAttribute("tabindex");
    expect(content().querySelector("[tabindex]")).toBeNull();
    expect(page.getByRole("group").query()).not.toBeInTheDocument();

    (document.activeElement as HTMLElement | null)?.blur();
    await userEvent.tab();
    expect(copy.element()).toHaveFocus();
    await userEvent.tab();
    expect(page.getByRole("button", { name: "After" }).element()).toHaveFocus();
  });

  it("is a named group and a tab stop while a line overflows, and the arrow keys scroll it", async () => {
    const html = await highlight(WIDE, "typescript");
    mountSized(<CodeBlock code={WIDE} html={html} filename="wide.ts" />, {
      width: 360,
    });
    const group = page.getByRole("group", { name: "wide.ts" });
    await expect.element(group).toBeInTheDocument();
    const el = group.element() as HTMLElement;
    expect(el).toBe(content());
    expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);
    // Shiki's own tab stop is gone, so the group is the only one in the code.
    expect(el.querySelector("[tabindex]")).toBeNull();
    // A group, not a region, so it adds no landmark.
    expect(page.getByRole("region").query()).not.toBeInTheDocument();

    await tabTo(el);
    await userEvent.keyboard("{ArrowRight}");
    await expect.poll(() => el.scrollLeft).toBeGreaterThan(0);
  });

  it("is named Code when there is no filename", async () => {
    mountSized(<CodeBlock code={WIDE} html={toHtml(WIDE)} />, { width: 360 });
    await expect
      .element(page.getByRole("group", { name: "Code" }))
      .toBeInTheDocument();
  });

  it("draws its focus ring inside the frame, where the frame cannot clip it", async () => {
    mountSized(<CodeBlock code={WIDE} html={toHtml(WIDE)} />, { width: 360 });
    const el = content();
    await expect.poll(() => el.getAttribute("tabindex")).toBe("0");
    await tabTo(el);

    const style = getComputedStyle(el);
    const width = px(style.outlineWidth);
    expect(style.outlineStyle).toBe("solid");
    expect(width).toBeGreaterThan(0);
    expect(px(style.outlineOffset)).toBe(-width);
    expect(style.outlineColor).toBe(toColor("var(--globals-outline-color)"));

    // A click focuses it too, but shows no ring.
    el.blur();
    await userEvent.click(el);
    expect(el).toHaveFocus();
    expect(el.matches(":focus-visible")).toBe(false);
  });

  it("gains and drops the tab stop as its code grows and shrinks in a box of the same size", async () => {
    const shortHtml = await highlight(SHORT, "typescript");
    const wideHtml = await highlight(WIDE, "typescript");
    const ui = (code: string, html: string) => (
      <div style={{ width: 360 }}>
        <CodeBlock code={code} html={html} />
      </div>
    );
    const { rerender } = render(ui(SHORT, shortHtml));
    const el = content();
    const width = el.clientWidth;
    // Not a timing wait: the hook measures once, synchronously, when its
    // effect runs, and it starts with no tab stop either way.
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(el).not.toHaveAttribute("tabindex");

    rerender(ui(WIDE, wideHtml));
    await expect.poll(() => el.getAttribute("tabindex")).toBe("0");
    expect(el.clientWidth).toBe(width);

    rerender(ui(SHORT, shortHtml));
    await expect.poll(() => el.getAttribute("tabindex")).toBeNull();
    expect(el.clientWidth).toBe(width);
  });

  it("hydrates overflowing server html with only the tab stop's attributes added", async () => {
    const html = await highlight(SOURCE, "tsx");
    const ui = <CodeBlock code={SOURCE} language="tsx" html={html} />;
    const container = document.createElement("div");
    container.style.width = "360px";
    document.body.append(container);
    container.innerHTML = renderToString(ui);

    try {
      const el = content(container);
      // Precondition: the code overflows, which only the client can measure.
      expect(el.scrollWidth).toBeGreaterThan(el.clientWidth);
      expect(el).not.toHaveAttribute("tabindex");
      const before = readBoxes(getBlock(container));
      const markup = el.innerHTML;

      const mutations: MutationRecord[] = [];
      const observer = new MutationObserver((records) =>
        mutations.push(...records),
      );
      observer.observe(container, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
      const errors: unknown[] = [];
      let root: ReturnType<typeof hydrateRoot> | undefined;
      await act(async () => {
        root = hydrateRoot(container, ui, {
          onRecoverableError: (error) => errors.push(error),
        });
      });
      await expect.poll(() => el.getAttribute("tabindex")).toBe("0");
      mutations.push(...observer.takeRecords());
      observer.disconnect();

      expect(errors).toEqual([]);
      // The highlighted markup is never rewritten: no childList or text
      // records, only the three attributes on the content itself.
      expect(
        mutations.map((m) => ({
          type: m.type,
          target: m.target === el,
          name: m.attributeName,
        })),
      ).toEqual(
        expect.arrayContaining([
          { type: "attributes", target: true, name: "tabindex" },
          { type: "attributes", target: true, name: "role" },
          { type: "attributes", target: true, name: "aria-label" },
        ]),
      );
      for (const m of mutations) {
        expect(m.type).toBe("attributes");
        expect(m.target).toBe(el);
        expect(["tabindex", "role", "aria-label"]).toContain(m.attributeName);
      }
      expect(el.innerHTML).toBe(markup);
      expect(readBoxes(getBlock(container))).toEqual(before);
      expect(el).toHaveAttribute("role", "group");
      expect(el).toHaveAccessibleName("Code");
      act(() => root?.unmount());
    } finally {
      container.remove();
    }
  });

  it("gains and drops the tab stop as the block resizes", async () => {
    const container = mountSized(
      <CodeBlock code={WIDE} html={toHtml(WIDE)} />,
      { width: 3000 },
    );
    const el = content(container);
    await expect.poll(() => el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    expect(el).not.toHaveAttribute("tabindex");

    container.style.width = "360px";
    await expect.poll(() => el.getAttribute("tabindex")).toBe("0");
    expect(el).toHaveAttribute("role", "group");

    container.style.width = "3000px";
    await expect.poll(() => el.getAttribute("tabindex")).toBeNull();
    expect(el).not.toHaveAttribute("role");
    expect(el).not.toHaveAttribute("aria-label");
  });

  it("drops the tab stop when the lines wrap", async () => {
    const { rerender } = render(
      <div style={{ width: 360 }}>
        <CodeBlock code={WIDE} html={toHtml(WIDE)} wrap={false} />
      </div>,
    );
    const el = content();
    await expect.poll(() => el.getAttribute("tabindex")).toBe("0");

    rerender(
      <div style={{ width: 360 }}>
        <CodeBlock code={WIDE} html={toHtml(WIDE)} wrap />
      </div>,
    );
    await expect.poll(() => el.getAttribute("tabindex")).toBeNull();
  });

  it("keeps the tab stop under focus, and drops it once focus leaves", async () => {
    const container = mountSized(
      <>
        <CodeBlock code={WIDE} html={toHtml(WIDE)} copyable={false} />
        <button type="button">After</button>
      </>,
      { width: 360 },
    );
    const el = content(container);
    await expect.poll(() => el.getAttribute("tabindex")).toBe("0");
    await tabTo(el);

    // Dropping it now would send focus to the document. A second observer on
    // the content, made after the component's, fires after it in the same
    // delivery; the timeouts after it let React commit what that measured.
    let delivered = () => {};
    const probe = new ResizeObserver(() => delivered());
    const nextDelivery = () =>
      new Promise<void>((resolve) => {
        delivered = resolve;
      });
    // The probe's first delivery is its initial size; widen after it.
    const initial = nextDelivery();
    probe.observe(el);
    await initial;
    const resized = nextDelivery();
    container.style.width = "3000px";
    await resized;
    probe.disconnect();
    await expect.poll(() => el.scrollWidth).toBeLessThanOrEqual(el.clientWidth);
    for (let i = 0; i < 3; i++) {
      await new Promise((resolve) => setTimeout(resolve, 20));
    }
    expect(el).toHaveFocus();
    expect(el).toHaveAttribute("tabindex", "0");

    await userEvent.tab();
    expect(page.getByRole("button", { name: "After" }).element()).toHaveFocus();
    await expect.poll(() => el.getAttribute("tabindex")).toBeNull();
  });

  it("is a tab stop in the fullscreen view while the code is taller than it, and the arrow keys scroll it", async () => {
    await page.viewport(1280, 800);
    render(
      <CodeBlock
        code={LONG}
        html={toHtml(LONG)}
        filename="a.ts"
        fullscreenable
      />,
    );
    await userEvent.click(
      page.getByRole("button", { name: "Enter fullscreen" }).element(),
    );
    const dialog = page.getByRole("dialog", { name: "a.ts" });
    await expect.element(dialog).toBeInTheDocument();
    const el = content(dialog.element());
    expect(el.scrollHeight).toBeGreaterThan(el.clientHeight);
    await expect.poll(() => el.getAttribute("tabindex")).toBe("0");
    expect(el).toHaveAttribute("role", "group");
    expect(el).toHaveAccessibleName("a.ts");

    await tabTo(el);
    await userEvent.keyboard("{ArrowDown}");
    await expect.poll(() => el.scrollTop).toBeGreaterThan(0);
    await userEvent.keyboard("{Escape}");
  });
});
