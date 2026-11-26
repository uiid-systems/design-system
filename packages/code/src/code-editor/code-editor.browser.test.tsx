import { render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { CodeBlock } from "../code-block/code-block";
import { CodeEditor } from "./code-editor";

import "@uiid/tokens/globals.css";

const header = () => document.querySelector('[data-slot="code-block-header"]');

const TRANSPARENT = new Set(["rgba(0, 0, 0, 0)", "transparent"]);

/** A CSS colour resolved inside `parent`, so a theme on it applies. */
const toColor = (color: string, parent: Element) => {
  const probe = document.createElement("div");
  probe.style.color = color;
  parent.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
};

/** Waits for Shiki's real output in each editor's highlight layer. */
const highlighted = (roots: Element[]) =>
  waitFor(
    () => {
      for (const root of roots) {
        expect(root.querySelector(".shiki span")).not.toBeNull();
      }
    },
    { timeout: 5000 },
  );

const CODE = 'const greeting = "hello";\nconsole.log(greeting);';

describe.each(["light", "dark"] as const)("CodeEditor states (%s)", (theme) => {
  it("keeps the code on the editor theme's surface in every state; read-only dashes the border, disabled dims", async () => {
    const { container } = render(
      <div data-theme={theme}>
        <CodeEditor defaultValue={CODE} />
        <CodeEditor defaultValue={CODE} readOnly />
        <CodeEditor defaultValue={CODE} disabled />
      </div>,
    );
    const roots = [
      ...container.querySelectorAll<HTMLElement>('[data-slot="code-editor"]'),
    ];
    await highlighted(roots);
    // The token colours are tuned for this surface, so nothing behind them may change.
    const codeSurface = toColor(
      "light-dark(var(--code-surface-light), var(--code-surface-dark))",
      container.firstElementChild!,
    );
    expect(TRANSPARENT.has(codeSurface)).toBe(false);

    for (const root of roots) {
      const pre = root.querySelector<HTMLElement>("pre")!;
      // The premise: Shiki writes its theme backgrounds onto the <pre>, so a
      // surface change anywhere behind the code would show.
      expect(pre.style.getPropertyValue("--shiki-light-bg")).not.toBe("");
      expect(pre.style.getPropertyValue("--shiki-dark-bg")).not.toBe("");

      const painted = [
        root,
        pre,
        // The floating copy button's plate, so no square of another colour sits on the code
        root.querySelector('[data-slot="code-block-header"]')!,
        ...root.querySelectorAll(".shiki span"),
      ];
      for (const el of painted) {
        const background = getComputedStyle(el).backgroundColor;
        expect(
          background === codeSurface || TRANSPARENT.has(background),
          `${(el as HTMLElement).dataset.slot ?? el.tagName} ${background}`,
        ).toBe(true);
      }
      expect(getComputedStyle(root).backgroundColor).toBe(codeSurface);
    }

    const [base, readOnly, disabled] = roots.map((root) => {
      const style = getComputedStyle(root);
      return { border: style.borderTopStyle, opacity: style.opacity };
    });
    expect(base).toEqual({ border: "solid", opacity: "1" });
    expect(readOnly).toEqual({ border: "dashed", opacity: "1" });
    expect(disabled!.border).toBe("solid");
    expect(Number(disabled!.opacity)).toBeLessThan(1);
  });
});

describe("CodeEditor frame", () => {
  it.each([
    { filename: "a.ts", showLineNumbers: false },
    { filename: "a.ts", showLineNumbers: true },
    { filename: undefined, showLineNumbers: false },
  ])(
    "lines up with a CodeBlock stacked above it ($filename, line numbers: $showLineNumbers)",
    async ({ filename, showLineNumbers }) => {
      const { container } = render(
        <div style={{ width: 600 }}>
          <CodeBlock
            code={CODE}
            filename={filename}
            showLineNumbers={showLineNumbers}
          />
          <CodeEditor
            defaultValue={CODE}
            filename={filename}
            showLineNumbers={showLineNumbers}
          />
        </div>,
      );
      const block = container.querySelector<HTMLElement>(
        '[data-slot="code-block"]',
      )!;
      const editor = container.querySelector<HTMLElement>(
        '[data-slot="code-editor"]',
      )!;
      await highlighted([block, editor]);

      const measure = (root: HTMLElement) => {
        const style = getComputedStyle(root);
        const box = root.getBoundingClientRect();
        const line = document.createRange();
        line.selectNodeContents(root.querySelector(".line")!);
        const code = getComputedStyle(root.querySelector("pre")!);
        return {
          radius: style.borderRadius,
          border: style.borderTopWidth,
          background: style.backgroundColor,
          header: root
            .querySelector('[data-slot="code-block-header"]')!
            .getBoundingClientRect().height,
          lineLeft: line.getBoundingClientRect().left - box.left,
          fontSize: code.fontSize,
          lineHeight: code.lineHeight,
          height: box.height,
        };
      };
      expect(measure(editor)).toEqual(measure(block));
    },
  );

  it("keeps the floating copy button's width clear in both layers, and nothing under a bar", async () => {
    const { container } = render(
      <div style={{ width: 600 }}>
        <CodeEditor defaultValue={CODE} />
        <CodeEditor defaultValue={CODE} filename="a.ts" />
      </div>,
    );
    const [floating, barred] = [
      ...container.querySelectorAll<HTMLElement>('[data-slot="code-editor"]'),
    ];
    await highlighted([floating!, barred!]);
    const ends = (root: HTMLElement) =>
      [root.querySelector("textarea")!, root.querySelector("pre")!].map(
        (el) => getComputedStyle(el).paddingInlineEnd,
      );
    const padding = getComputedStyle(
      barred!.querySelector("textarea")!,
    ).paddingInlineStart;

    const [textarea, pre] = ends(floating!);
    expect(textarea).toBe(pre);
    // At least the run from the button's start edge to the frame's end edge
    const button = floating!.querySelector("button")!.getBoundingClientRect();
    const frame = floating!.getBoundingClientRect();
    expect(Number.parseFloat(textarea!)).toBeGreaterThanOrEqual(
      frame.right - button.left,
    );
    expect(ends(barred!)).toEqual([padding, padding]);
  });

  it("draws the focus ring on the frame for the textarea, not for the copy button", async () => {
    render(<CodeEditor defaultValue={CODE} />);
    const root = document.querySelector<HTMLElement>(
      '[data-slot="code-editor"]',
    )!;
    const outline = () => getComputedStyle(root).outlineStyle;
    expect(outline()).toBe("none");

    // The floating copy button comes first in the tab order, then the textarea.
    await userEvent.tab();
    expect(document.activeElement).toBe(
      page.getByRole("button", { name: "Copy code" }).element(),
    );
    expect(outline()).toBe("none");

    await userEvent.tab();
    expect(document.activeElement).toBe(page.getByRole("textbox").element());
    expect(outline()).not.toBe("none");
  });
});

/* Runs in a real browser, which lays out the header and textarea. */
describe("CodeEditor header", () => {
  it("keeps the textarea in place as the floating copy button comes and goes", async () => {
    render(<CodeEditor />);
    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toBeInTheDocument();
    const el = textarea.element() as HTMLElement;
    expect(header()).toBeNull();

    const top = el.getBoundingClientRect().top;
    await userEvent.type(el, "x");
    await expect
      .element(page.getByRole("button", { name: "Copy code" }))
      .toBeInTheDocument();
    expect(header()).toHaveAttribute("data-floating");
    expect(el.getBoundingClientRect().top).toBe(top);

    await userEvent.clear(el);
    await expect
      .poll(() => page.getByRole("button", { name: "Copy code" }).query())
      .toBeNull();
    expect(el.getBoundingClientRect().top).toBe(top);
  });

  it("keeps the textarea in place under a filename bar as the copy button comes and goes", async () => {
    render(<CodeEditor filename="a.ts" />);
    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toBeInTheDocument();
    const el = textarea.element() as HTMLElement;
    const bar = header();
    expect(bar).toBeInTheDocument();

    const top = el.getBoundingClientRect().top;
    await userEvent.type(el, "x");
    await expect
      .element(page.getByRole("button", { name: "Copy code" }))
      .toBeInTheDocument();
    expect(header()).toBe(bar);
    expect(el.getBoundingClientRect().top).toBe(top);

    await userEvent.clear(el);
    await expect
      .poll(() => page.getByRole("button", { name: "Copy code" }).query())
      .toBeNull();
    expect(el.getBoundingClientRect().top).toBe(top);
  });
});
