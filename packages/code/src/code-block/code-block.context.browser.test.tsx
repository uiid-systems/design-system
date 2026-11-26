import { Card } from "@uiid/cards";
import { Collapsible } from "@uiid/interactive";
import { Dialog } from "@uiid/overlays";
import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { highlight } from "../highlighter/highlighter";
import { CodeBlock } from "./code-block";
import {
  getBlock,
  mountSized,
  waitForHighlight,
} from "./code-block.browser.test.helpers";

// The theme, shade and spacing tokens come from the global sheet.
import "@uiid/tokens/globals.css";

/* The block in the page around it: a theme change, a container with its own
   theme, and the UIID containers it is placed in. Its own file because the
   highlighter mock below covers every test in a file. `spy: true` keeps the
   real highlighter and only counts its calls. */
vi.mock("../highlighter/highlighter", { spy: true });

const SOURCE = [
  'import { useState } from "react";',
  "",
  "export function Counter({ start = 0 }: { start?: number }) {",
  "  const [count, setCount] = useState(start);",
  "  return <button onClick={() => setCount(count + 1)}>{count}</button>;",
  "}",
].join("\n");

const LONG = Array.from({ length: 40 }, (_, i) => `const n${i} = ${i};`).join(
  "\n",
);

const LONG_LINE = `const message = "${"a line far wider than any container it sits in ".repeat(4)}";`;

/** A CSS colour resolved by a probe placed in `parent`, so it takes that theme. */
const toColor = (color: string, parent: Element = document.body) => {
  const probe = document.createElement("div");
  probe.style.color = color;
  parent.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
};

/** Shiki's token spans, those that carry a colour of their own per theme. */
const tokens = (root: ParentNode) =>
  [...root.querySelectorAll<HTMLElement>(".line span")].filter((span) =>
    span.style.getPropertyValue("--shiki-dark"),
  );

/** Every token's computed colour, in order. */
const tokenColors = (root: ParentNode) =>
  tokens(root).map((span) => getComputedStyle(span).color);

/** What each token's colour should be under `scheme`, read from Shiki's own variables. */
const expectedTokenColors = (root: ParentNode, scheme: "light" | "dark") =>
  tokens(root).map((span) =>
    toColor(span.style.getPropertyValue(`--shiki-${scheme}`)),
  );

/** The block's own colours: its frame, its border and the code's surface. */
const blockColors = (block: HTMLElement) => ({
  frame: getComputedStyle(block).backgroundColor,
  border: getComputedStyle(block).borderTopColor,
  pre: getComputedStyle(block.querySelector("pre")!).backgroundColor,
});

/** Two animation frames, so a style change and any work it schedules have run. */
const frames = () =>
  new Promise<void>((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
  );

describe("CodeBlock under a theme change", () => {
  it("recolours its tokens and frame when data-theme changes, with no re-highlight", async () => {
    const container = mountSized(
      <div data-testid="theme" data-theme="light">
        <CodeBlock code={SOURCE} language="tsx" filename="counter.tsx" />
      </div>,
    );
    const themed = container.querySelector<HTMLElement>("[data-theme]")!;
    await waitForHighlight(container);
    const block = getBlock(container);

    const calls = vi.mocked(highlight).mock.calls.length;
    const markup = block.innerHTML;
    const light = { tokens: tokenColors(block), ...blockColors(block) };
    expect(tokens(block).length).toBeGreaterThan(0);
    expect(light.tokens).toEqual(expectedTokenColors(block, "light"));
    expect(light.frame).toBe(toColor("var(--code-surface-light)"));

    themed.dataset.theme = "dark";
    await frames();

    const dark = { tokens: tokenColors(block), ...blockColors(block) };
    expect(dark.tokens).toEqual(expectedTokenColors(block, "dark"));
    expect(dark.tokens).not.toEqual(light.tokens);
    expect(dark.frame).toBe(toColor("var(--code-surface-dark)"));
    expect(dark.frame).not.toBe(light.frame);
    expect(dark.pre).toBe(dark.frame);
    expect(dark.border).toBe(toColor("var(--globals-border-color)", themed));
    // The bar follows the theme's surface, not the light one it started on.
    expect(
      getComputedStyle(
        block.querySelector<HTMLElement>('[data-slot="code-block-header"]')!,
      ).backgroundColor,
    ).toBe(toColor("var(--shade-surface)", themed));

    // CSS did all of it: no new highlight and not one node changed.
    expect(vi.mocked(highlight).mock.calls.length).toBe(calls);
    expect(block.innerHTML).toBe(markup);
  });

  it("takes the colours of a container with the opposite theme", async () => {
    const container = mountSized(
      <div data-theme="light">
        <div data-testid="light">
          <CodeBlock code={SOURCE} language="tsx" showLineNumbers />
        </div>
        <div data-testid="dark" data-theme="dark">
          <CodeBlock code={SOURCE} language="tsx" showLineNumbers />
        </div>
      </div>,
    );
    await waitForHighlight(container.querySelector('[data-testid="light"]')!);
    await waitForHighlight(container.querySelector('[data-testid="dark"]')!);

    const lightSide = container.querySelector<HTMLElement>(
      '[data-testid="light"]',
    )!;
    const darkSide = container.querySelector<HTMLElement>(
      '[data-testid="dark"]',
    )!;
    const lightBlock = getBlock(lightSide);
    const darkBlock = getBlock(darkSide);

    expect(tokenColors(lightBlock)).toEqual(
      expectedTokenColors(lightBlock, "light"),
    );
    expect(tokenColors(darkBlock)).toEqual(
      expectedTokenColors(darkBlock, "dark"),
    );
    expect(tokenColors(darkBlock)).not.toEqual(tokenColors(lightBlock));

    expect(blockColors(lightBlock).frame).toBe(
      toColor("var(--code-surface-light)"),
    );
    expect(blockColors(darkBlock).frame).toBe(
      toColor("var(--code-surface-dark)"),
    );
    // The line numbers and the buttons take the container's shades too.
    const number = (block: HTMLElement) =>
      getComputedStyle(block.querySelector(".line")!, "::before").color;
    expect(number(darkBlock)).toBe(toColor("var(--shade-muted)", darkSide));
    expect(number(darkBlock)).not.toBe(number(lightBlock));
    const copy = (block: HTMLElement) =>
      getComputedStyle(block.querySelector("button")!).color;
    expect(copy(darkBlock)).not.toBe(copy(lightBlock));
  });
});

describe("CodeBlock inside UIID containers", () => {
  /** The block's frame fits its container, and only its own code scrolls sideways. */
  const expectContained = (block: HTMLElement, container: HTMLElement) => {
    const outer = container.getBoundingClientRect();
    const rect = block.getBoundingClientRect();
    expect(rect.width).toBeGreaterThan(0);
    expect(rect.left).toBeGreaterThanOrEqual(outer.left - 0.5);
    expect(rect.right).toBeLessThanOrEqual(outer.right + 0.5);
    expect(container.scrollWidth).toBeLessThanOrEqual(container.clientWidth);
    const content = block.querySelector<HTMLElement>(
      '[data-slot="code-block-content"]',
    )!;
    expect(content.scrollWidth).toBeGreaterThan(content.clientWidth);
  };

  const code = `${LONG_LINE}\n${LONG}`;

  it("renders inside a Card, fitting its body", async () => {
    const container = mountSized(
      <Card title="Example" data-testid="card">
        <CodeBlock code={code} language="tsx" rows={4} />
      </Card>,
      { width: 360 },
    );
    await waitForHighlight(container);
    const card = container.querySelector<HTMLElement>('[data-testid="card"]')!;
    expectContained(getBlock(card), card);
    await expect
      .element(page.getByRole("button", { name: "Show more" }))
      .toBeVisible();
  });

  it("keeps its code's width in a Card when the code is short", async () => {
    const short = "const a = 1;";
    const container = mountSized(
      <Card data-testid="card">
        <CodeBlock code={short} language="tsx" copyable={false} />
      </Card>,
    );
    await waitForHighlight(container);
    const card = container.querySelector<HTMLElement>('[data-testid="card"]')!;
    const block = getBlock(card);
    const content = block.querySelector<HTMLElement>(
      '[data-slot="code-block-content"]',
    )!;
    // The Card still fits its content: narrower than the room it has, yet
    // wide enough that the line shows whole.
    expect(card.getBoundingClientRect().width).toBeLessThan(
      container.getBoundingClientRect().width,
    );
    expect(content.scrollWidth).toBeLessThanOrEqual(content.clientWidth);
    const text = document.createRange();
    text.selectNodeContents(block.querySelector(".line")!);
    expect(text.getBoundingClientRect().right).toBeLessThanOrEqual(
      content.getBoundingClientRect().right,
    );
  });

  it("renders inside a Dialog, fitting its popup", async () => {
    render360Dialog();
    const dialog = page.getByRole("dialog", { name: "Example" });
    await expect.element(dialog).toBeVisible();
    const popup = dialog.element() as HTMLElement;
    await waitForHighlight(popup);
    const block = getBlock(popup);
    // The open transition scales the popup, so compare unscaled boxes.
    expect(block.offsetWidth).toBeGreaterThan(0);
    expect(block.offsetWidth).toBeLessThanOrEqual(popup.clientWidth);
    expect(popup.scrollWidth).toBeLessThanOrEqual(popup.clientWidth);
    const content = block.querySelector<HTMLElement>(
      '[data-slot="code-block-content"]',
    )!;
    expect(content.scrollWidth).toBeGreaterThan(content.clientWidth);
    await expect
      .element(page.getByRole("button", { name: "Show more" }))
      .toBeVisible();
  });

  it("renders inside a Collapsible once opened", async () => {
    const container = mountSized(
      <Collapsible trigger="Show code" instant>
        <CodeBlock code={code} language="tsx" rows={4} />
      </Collapsible>,
      { width: 360 },
    );
    await userEvent.click(page.getByRole("button", { name: "Show code" }));
    await waitForHighlight(container);
    expectContained(getBlock(container), container);
    await expect
      .element(page.getByRole("button", { name: "Show more" }))
      .toBeVisible();
  });

  for (const instant of [true, false]) {
    it(`shows the expand toggle once revealed after it was first measured hidden${instant ? "" : " (animated)"}`, async () => {
      const container = mountSized(
        <Collapsible trigger="Show code" keepMounted instant={instant}>
          <CodeBlock code={LONG} language="tsx" rows={4} />
          <CodeBlock code="const a = 1;" language="tsx" rows={4} />
        </Collapsible>,
      );
      // Highlighted and measured while the panel is closed and hidden.
      await waitForHighlight(container);
      const [long, short] = container.querySelectorAll<HTMLElement>(
        '[data-slot="code-block"]',
      );
      expect(long.checkVisibility()).toBe(false);
      await frames();

      await userEvent.click(page.getByRole("button", { name: "Show code" }));
      await expect.poll(() => long.checkVisibility()).toBe(true);

      // The long block offers its rest; the short one, which fits, does not.
      const toggle = page.getByRole("button", { name: "Show more" });
      await expect.element(toggle).toBeVisible();
      expect(long.contains(toggle.element())).toBe(true);
      expect(
        short.querySelector('[data-slot="code-block-expand-toggle"]'),
      ).toBeNull();
      const scroll = long.querySelector<HTMLElement>(
        '[data-slot="code-block-scroll"]',
      )!;
      expect(scroll).toHaveAttribute("data-collapsed");
      expect(scroll.scrollHeight).toBeGreaterThan(scroll.clientHeight);
    });
  }
});

/** A Dialog, open from the start, at a width the long line overflows. */
const render360Dialog = () =>
  mountSized(
    <Dialog title="Example" size="small" RootProps={{ defaultOpen: true }}>
      <CodeBlock code={`${LONG_LINE}\n${LONG}`} language="tsx" rows={4} />
    </Dialog>,
  );
