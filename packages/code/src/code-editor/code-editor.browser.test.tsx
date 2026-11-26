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
  it("paints the code area in the frame's colour, which read-only changes and disabled dims", async () => {
    const { container } = render(
      <div data-theme={theme}>
        <CodeEditor defaultValue={CODE} />
        <CodeEditor defaultValue={CODE} readOnly />
        <CodeEditor defaultValue={CODE} disabled />
      </div>,
    );
    const themed = container.firstElementChild!;
    const roots = [
      ...container.querySelectorAll<HTMLElement>('[data-slot="code-editor"]'),
    ];
    await highlighted(roots);
    const [base, readOnly, disabled] = roots.map((root) => ({
      root,
      frame: getComputedStyle(root).backgroundColor,
      opacity: getComputedStyle(root).opacity,
    }));

    // The highlight's <pre> and its token spans paint nothing, so what shows
    // behind the code is the frame, in every state.
    for (const { root } of roots.map((r) => ({ root: r }))) {
      const painted = [
        root.querySelector("pre")!,
        ...root.querySelectorAll(".shiki span"),
      ];
      for (const el of painted) {
        const background = getComputedStyle(el).backgroundColor;
        expect(TRANSPARENT.has(background), `${el.tagName} ${background}`).toBe(
          true,
        );
      }
      // The floating copy button's plate is the same surface as the frame.
      expect(
        getComputedStyle(root.querySelector('[data-slot="code-block-header"]')!)
          .backgroundColor,
      ).toBe(getComputedStyle(root).backgroundColor);
    }

    expect(base!.frame).toBe(
      toColor(
        `light-dark(var(--code-surface-light), var(--code-surface-dark))`,
        themed,
      ),
    );
    expect(readOnly!.frame).toBe(toColor("var(--shade-surface)", themed));
    expect(readOnly!.frame).not.toBe(base!.frame);
    expect(readOnly!.opacity).toBe("1");

    // Disabled keeps the default surface and dims the whole frame instead.
    expect(disabled!.frame).toBe(base!.frame);
    expect(Number(disabled!.opacity)).toBeLessThan(1);
  });
});

describe("CodeEditor frame", () => {
  it.each([false, true])(
    "lines up with a CodeBlock stacked above it (line numbers: %s)",
    async (showLineNumbers) => {
      const { container } = render(
        <div style={{ width: 600 }}>
          <CodeBlock
            code={CODE}
            filename="a.ts"
            showLineNumbers={showLineNumbers}
          />
          <CodeEditor
            defaultValue={CODE}
            filename="a.ts"
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
    expect(Number.parseFloat(textarea!)).toBeGreaterThan(
      Number.parseFloat(padding),
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
