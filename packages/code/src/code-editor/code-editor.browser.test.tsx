import { render, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";

import { CodeBlock } from "../code-block/code-block";
import { CodeEditor } from "./code-editor";

import "@uiid/tokens/globals.css";

/* Highlights pass straight through unless a test holds them, so a test can
   type while no highlight can land. */
const gate = vi.hoisted(() => ({
  held: null as Promise<void> | null,
  release: null as (() => void) | null,
}));
vi.mock("../highlighter/highlighter", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../highlighter/highlighter")>();
  return {
    ...actual,
    highlight: async (...args: Parameters<typeof actual.highlight>) => {
      while (gate.held) await gate.held;
      return actual.highlight(...args);
    },
  };
});

/** Holds every highlight until the returned function is called. */
const holdHighlights = () => {
  gate.held = new Promise<void>((resolve) => {
    gate.release = () => {
      gate.held = null;
      gate.release = null;
      resolve();
    };
  });
  return gate.release!;
};

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

/* ---------------------------------------------------------------------------
   Layer alignment

   A textarea exposes no caret rectangle, so these tests ask the textarea's own
   layout where each character is: `document.caretPositionFromPoint` hit-tests
   the real textarea and returns the value offset nearest a point. The x at
   which that offset steps from `i` to `i + 1` is the textarea's centre of
   character `i`, and the y at which it steps to the next row is its row edge.
   Both are found by bisection to 1/32px and compared with the rectangle of the
   same character in the highlight layer (a Range over its text nodes). The
   caret is drawn at the boundary between two characters, so when the
   characters either side of it match within 1px, so does the caret.

   This pins Chromium's `caretPositionFromPoint`, which CI runs. On a one-row
   value the row's bottom edge is found because a point below the last line
   puts the caret at the end of the text, as Mac and Unix editing does; a
   Windows-style engine may not, so read failures there with that in mind.
   --------------------------------------------------------------------------- */

type CaretDocument = Document & {
  caretPositionFromPoint: (
    x: number,
    y: number,
  ) => { offsetNode: Node; offset: number } | null;
};

type ActGlobal = { IS_REACT_ACT_ENVIRONMENT?: boolean };

/* Testing Library marks the page as an act() environment, which suits
   happy-dom. Here the events come from outside React, so act() never wraps
   them and React would warn on every keystroke. Both the flag and the
   viewport go back to what they were after each test. */
const leaveActEnvironment = () => {
  let actEnvironment: boolean | undefined;
  let viewport: [number, number];
  beforeEach(async () => {
    actEnvironment = (globalThis as ActGlobal).IS_REACT_ACT_ENVIRONMENT;
    (globalThis as ActGlobal).IS_REACT_ACT_ENVIRONMENT = false;
    viewport = [window.innerWidth, window.innerHeight];
    // Hit-testing only reaches what is inside the viewport
    await page.viewport(1024, 900);
  });
  afterEach(async () => {
    // A failed test never leaves later highlights held
    gate.release?.();
    (globalThis as ActGlobal).IS_REACT_ACT_ENVIRONMENT = actEnvironment;
    await page.viewport(...viewport);
  });
};

const editorRoot = (container: Element, index = 0) =>
  container.querySelectorAll<HTMLElement>('[data-slot="code-editor"]')[index]!;
const textareaOf = (root: Element) => root.querySelector("textarea")!;
const highlightOf = (root: Element) =>
  root.querySelector<HTMLElement>('[data-slot="code-editor-highlight"]')!;
/** The text the highlight layer paints. */
const paintedText = (root: Element) =>
  highlightOf(root).querySelector("code")?.textContent ?? "";

/** Waits until Shiki's markup for exactly `value` is in the highlight layer. */
const highlightedAs = (root: Element, value: string) =>
  waitFor(
    () => {
      expect(highlightOf(root).querySelector(".shiki span")).not.toBeNull();
      // Every line is Shiki's markup, none plain text waiting for it
      expect(highlightOf(root)).not.toHaveAttribute("data-pending");
      expect(paintedText(root)).toBe(value);
    },
    { timeout: 5000 },
  );

/** The rectangle of the character at value offset `index` in the highlight layer. */
const glyphRect = (root: Element, index: number) => {
  const code = highlightOf(root).querySelector("code")!;
  const walker = document.createTreeWalker(code, NodeFilter.SHOW_TEXT);
  let start = 0;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const length = node.textContent!.length;
    if (index < start + length) {
      const range = document.createRange();
      range.setStart(node, index - start);
      range.setEnd(node, index - start + 1);
      return range.getBoundingClientRect();
    }
    start += length;
  }
  throw new Error(`no character ${index} in the highlight layer`);
};

const offsetAt = (textarea: HTMLTextAreaElement, x: number, y: number) => {
  const position = (document as CaretDocument).caretPositionFromPoint(x, y);
  expect(position?.offsetNode, `hit at ${x},${y}`).toBe(textarea);
  return position!.offset;
};

/** The smallest t in [lo, hi] for which `test(t)` holds, assuming it is monotonic. */
const bisect = (lo: number, hi: number, test: (t: number) => boolean) => {
  while (hi - lo > 1 / 32) {
    const mid = (lo + hi) / 2;
    if (test(mid)) hi = mid;
    else lo = mid;
  }
  return hi;
};

/**
 * How far the textarea's character `index` sits from the highlight layer's on
 * each axis, in px. Pick a character that is not the last on its visual row.
 */
const drift = (root: Element, index: number) => {
  const textarea = textareaOf(root);
  const glyph = glyphRect(root, index);
  const lineHeight = Number.parseFloat(getComputedStyle(textarea).lineHeight);
  const cx = glyph.left + glyph.width / 2;
  const cy = glyph.top + glyph.height / 2;
  // The highlight's line box: the half-leading sits evenly above and below the glyph
  const rowTop = cy - lineHeight / 2;

  expect(
    [index, index + 1],
    `the textarea has character ${index} under its glyph`,
  ).toContain(offsetAt(textarea, cx, cy));

  const x = bisect(
    glyph.left - glyph.width,
    glyph.right + glyph.width,
    (t) => offsetAt(textarea, t, cy) > index,
  );
  // Measure the row's top edge where there is a row above, else its bottom edge
  const hasRowAbove =
    cy - lineHeight > textarea.getBoundingClientRect().top &&
    offsetAt(textarea, cx, cy - lineHeight) < index;
  const dy = hasRowAbove
    ? bisect(cy - lineHeight, cy, (t) => offsetAt(textarea, cx, t) >= index) -
      rowTop
    : bisect(
        cy,
        cy + lineHeight,
        (t) => offsetAt(textarea, cx, t) > index + 1,
      ) -
      (rowTop + lineHeight);
  return { dx: Math.abs(x - cx), dy: Math.abs(dy) };
};

const expectAligned = (root: Element, indices: number[]) => {
  for (const index of indices) {
    const { dx, dy } = drift(root, index);
    expect(dx, `character ${index} x drift`).toBeLessThanOrEqual(1);
    expect(dy, `character ${index} y drift`).toBeLessThanOrEqual(1);
  }
};

/** The offsets of the characters either side of the caret, on its row. */
const aroundCaret = (textarea: HTMLTextAreaElement) => {
  const caret = textarea.selectionStart;
  return [caret - 2, caret - 1].filter(
    (i) => i >= 0 && !textarea.value.slice(i, caret).includes("\n"),
  );
};

/** The textarea never scrolls on its own: it is exactly as tall as the highlight. */
const expectNoInnerScroll = (root: Element) => {
  const textarea = textareaOf(root);
  expect(textarea.scrollHeight, "textarea overflow").toBe(
    textarea.clientHeight,
  );
  expect(textarea.scrollWidth).toBe(textarea.clientWidth);
  expect(textarea.scrollTop).toBe(0);
  expect(textarea.scrollLeft).toBe(0);
  expect(highlightOf(root).getBoundingClientRect().height).toBe(
    textarea.getBoundingClientRect().height,
  );
};

/** The glyph before the caret is wholly inside the layer's scrollport. */
const expectCaretInView = (root: Element) => {
  const textarea = textareaOf(root);
  const glyph = glyphRect(root, textarea.selectionStart - 1);
  const port = textarea.parentElement!.getBoundingClientRect();
  expect(glyph.top, "caret below the scrollport top").toBeGreaterThanOrEqual(
    port.top,
  );
  expect(glyph.bottom, "caret above the scrollport bottom").toBeLessThanOrEqual(
    port.bottom,
  );
};

/** The key that moves the caret to the end of the text, on the machine's platform. */
const TO_END = navigator.platform.startsWith("Mac")
  ? "{Meta>}{ArrowDown}{/Meta}"
  : "{Control>}{End}{/Control}";

/* Puts `text` on the clipboard with a real copy keystroke, so the paste that
   follows is the browser's own, as the forms mask tests do. It relies on the
   headless browser keeping its own clipboard, apart from the computer's; the
   clipboard is deliberately not saved and restored, which would mean reading
   it. */
const copyToClipboard = async (text: string) => {
  const source = document.createElement("textarea");
  document.body.append(source);
  source.value = text;
  source.focus();
  source.select();
  await userEvent.copy();
  source.remove();
};

/** The offset each line of `value` starts at. */
const lineStarts = (value: string) => {
  const starts = [0];
  for (let i = 0; i < value.length; i++) {
    if (value[i] === "\n") starts.push(i + 1);
  }
  return starts;
};

const SHORT = "const a = 1;\nlet total = a + 41;\nconsole.log(total);";
const LONG_LINE = `const message = ${Array.from(
  { length: 24 },
  (_, i) => `word${i}`,
).join(" + ")}; const url = "https://example.com/${"a".repeat(90)}";\nnext();`;
/** Characters inside words spread through LONG_LINE, so none ends a row. */
const LONG_LINE_SAMPLES = ["const", "word5", "word12", "word19"].map(
  (word) => LONG_LINE.indexOf(word) + 2,
);
const MANY_LINES = Array.from(
  { length: 30 },
  (_, i) => `const line${i} = ${i};`,
).join("\n");

describe("CodeEditor layer alignment", () => {
  leaveActEnvironment();

  it.each([
    { width: 600, showLineNumbers: false },
    { width: 600, showLineNumbers: true },
    { width: 320, showLineNumbers: false },
    { width: 320, showLineNumbers: true },
  ])(
    "keeps every character on its glyph ($width px, line numbers: $showLineNumbers)",
    async ({ width, showLineNumbers }) => {
      const { container } = render(
        <div style={{ width }}>
          <CodeEditor defaultValue={SHORT} showLineNumbers={showLineNumbers} />
        </div>,
      );
      const root = editorRoot(container);
      await highlightedAs(root, SHORT);
      expectAligned(root, [1, 8, 15, 22, 36, 44]);
    },
  );

  it.each([
    { width: 600, showLineNumbers: false },
    { width: 600, showLineNumbers: true },
    { width: 320, showLineNumbers: true },
  ])(
    "wraps a long line at the same point in both layers ($width px, line numbers: $showLineNumbers)",
    async ({ width, showLineNumbers }) => {
      const { container } = render(
        <div style={{ width }}>
          <CodeEditor
            defaultValue={LONG_LINE}
            showLineNumbers={showLineNumbers}
          />
        </div>,
      );
      const root = editorRoot(container);
      await highlightedAs(root, LONG_LINE);
      const line = document.createRange();
      line.selectNodeContents(highlightOf(root).querySelector(".line")!);
      expect(line.getBoundingClientRect().height).toBeGreaterThan(
        2 * Number.parseFloat(getComputedStyle(textareaOf(root)).lineHeight),
      );
      // Characters spread through the wrapped line, including inside the long URL
      const url = LONG_LINE.indexOf("aaaa");
      expectAligned(root, [...LONG_LINE_SAMPLES, url + 10, url + 60]);
      expectNoInnerScroll(root);
    },
  );

  it.each([false, true])(
    "keeps the caret on its glyph at every scroll offset (line numbers: %s)",
    async (showLineNumbers) => {
      const { container } = render(
        <div style={{ width: 600 }}>
          <CodeEditor
            defaultValue={MANY_LINES}
            rows={4}
            showLineNumbers={showLineNumbers}
          />
        </div>,
      );
      const root = editorRoot(container);
      await highlightedAs(root, MANY_LINES);
      const textarea = textareaOf(root);
      const scroller = textarea.parentElement!;
      const max = scroller.scrollHeight - scroller.clientHeight;
      expect(max).toBeGreaterThan(0);
      const starts = lineStarts(MANY_LINES);

      for (const top of [0, 37, Math.round(max / 2), max]) {
        scroller.scrollTop = top;
        await expect.poll(() => scroller.scrollTop).toBe(top);
        // The first line wholly inside the scrollport
        const box = scroller.getBoundingClientRect();
        const start = starts.find(
          (s) => glyphRect(root, s + 3).top > box.top + 4,
        )!;
        expectAligned(root, [start + 3, start + 8]);
        expectNoInnerScroll(root);
      }

      // The caret the keyboard moves, after the browser scrolls it into view
      scroller.scrollTop = 0;
      await userEvent.click(textarea);
      await userEvent.keyboard(TO_END);
      await expect.poll(() => textarea.selectionStart).toBe(MANY_LINES.length);
      await expect.poll(() => scroller.scrollTop).toBeGreaterThan(0);
      expectCaretInView(root);
      expectAligned(root, aroundCaret(textarea));
    },
  );
});

describe("CodeEditor typing", () => {
  leaveActEnvironment();

  it("paints a typed character in the frame it is typed, before its highlight lands", async () => {
    const { container } = render(<CodeEditor defaultValue={SHORT} />);
    const root = editorRoot(container);
    await highlightedAs(root, SHORT);
    const textarea = textareaOf(root);
    await userEvent.click(textarea);
    await userEvent.keyboard(TO_END);

    // Hold every highlight, so none can land while the check runs
    const release = holdHighlights();

    /* Reads what the next frame paints: an `input` listener schedules a frame
       callback, which runs after React has committed the keystroke and before
       the browser paints that frame. */
    const frames: { value: string; painted: string; color: string }[] = [];
    const onInput = () =>
      requestAnimationFrame(() => {
        const code = highlightOf(root).querySelector("code")!;
        frames.push({
          value: textarea.value,
          painted: code.textContent ?? "",
          color: getComputedStyle(code).color,
        });
      });
    textarea.addEventListener("input", onInput);
    try {
      // One key at a time, each waiting for its frame
      await userEvent.keyboard(" ");
      await expect.poll(() => frames.length).toBe(1);
      await userEvent.keyboard("x");
      await expect.poll(() => frames.length).toBe(2);
    } finally {
      textarea.removeEventListener("input", onInput);
    }

    const typed = `${SHORT} x`;
    expect(frames.map((frame) => frame.value)).toEqual([`${SHORT} `, typed]);
    for (const frame of frames) {
      expect(frame.painted).toBe(frame.value);
      expect(TRANSPARENT.has(frame.color)).toBe(false);
    }
    // The textarea's own text stays transparent, so the text is painted once
    expect(TRANSPARENT.has(getComputedStyle(textarea).color)).toBe(true);
    expectAligned(root, aroundCaret(textarea));

    release();
    await highlightedAs(root, typed);
    expectAligned(root, aroundCaret(textarea));
  });

  it("keeps the other lines' highlight while an edited line waits for its own", async () => {
    const { container } = render(<CodeEditor defaultValue={SHORT} />);
    const root = editorRoot(container);
    await highlightedAs(root, SHORT);
    const textarea = textareaOf(root);
    const lines = () => [...highlightOf(root).querySelectorAll(".line")];
    /** The distinct token colours a line paints. */
    const colours = (line: Element) =>
      new Set(
        [...line.querySelectorAll("span")].map(
          (span) => getComputedStyle(span).color,
        ),
      );
    const before = lines().map((line) => line.innerHTML);
    expect(colours(lines()[0]!).size).toBeGreaterThan(1);
    expect(colours(lines()[2]!).size).toBeGreaterThan(1);

    // The caret after "41" on the second line
    await userEvent.click(textarea);
    const caret = SHORT.indexOf("41") + 2;
    textarea.setSelectionRange(caret, caret);
    await expect.poll(() => textarea.selectionStart).toBe(caret);

    const release = holdHighlights();
    const frames: { value: string; painted: string; lines: Element[] }[] = [];
    const onInput = () =>
      requestAnimationFrame(() =>
        frames.push({
          value: textarea.value,
          painted: paintedText(root),
          lines: lines(),
        }),
      );
    textarea.addEventListener("input", onInput);
    try {
      await userEvent.keyboard("2");
      await expect.poll(() => frames.length).toBe(1);
    } finally {
      textarea.removeEventListener("input", onInput);
    }

    const typed = SHORT.replace("41", "412");
    const [frame] = frames;
    expect(frame!.value).toBe(typed);
    expect(frame!.painted).toBe(typed);
    const [first, edited, last] = frame!.lines;
    // The unchanged lines keep Shiki's markup and its token colours
    expect(first!.innerHTML).toBe(before[0]);
    expect(last!.innerHTML).toBe(before[2]);
    expect(colours(first!).size).toBeGreaterThan(1);
    expect(colours(last!).size).toBeGreaterThan(1);
    // The edited line shows its new text, plain, until its highlight lands
    expect(edited!.textContent).toBe("let total = a + 412;");
    expect(edited!.querySelector("span")).toBeNull();
    expect(highlightOf(root)).toHaveAttribute("data-pending");
    expectAligned(root, aroundCaret(textarea));

    release();
    await highlightedAs(root, typed);
    expect(highlightOf(root)).not.toHaveAttribute("data-pending");
    expect(colours(lines()[1]!).size).toBeGreaterThan(1);
    expectAligned(root, aroundCaret(textarea));
  });
});

describe("CodeEditor scroll", () => {
  leaveActEnvironment();

  // The editor wraps, so it never scrolls sideways; the horizontal half of
  // "both axes" is that neither layer can.
  it("follows the textarea's scroll on both axes after a paste, and never scrolls sideways", async () => {
    const { container } = render(
      <div style={{ width: 600 }}>
        <CodeEditor defaultValue="start();" rows={4} />
      </div>,
    );
    const root = editorRoot(container);
    await highlightedAs(root, "start();");
    const textarea = textareaOf(root);
    const scroller = textarea.parentElement!;

    const pasted = `\n${MANY_LINES}\n${LONG_LINE}`;
    await copyToClipboard(pasted);
    await userEvent.click(textarea);
    await userEvent.keyboard(TO_END);
    await userEvent.paste();
    const value = `start();${pasted}`;
    await expect.element(page.getByRole("textbox")).toHaveValue(value);
    await highlightedAs(root, value);

    // The paste moved the scroll position to the caret at the end
    await expect.poll(() => scroller.scrollTop).toBeGreaterThan(0);
    expectCaretInView(root);
    expect(scroller.scrollLeft).toBe(0);
    expect(scroller.scrollWidth).toBe(scroller.clientWidth);
    expectNoInnerScroll(root);
    expectAligned(root, aroundCaret(textarea));
  });

  it("follows a programmatic value change", async () => {
    const replaced = `${MANY_LINES}\nend();`;
    const Controlled = () => {
      const [value, setValue] = useState("start();");
      return (
        <div style={{ width: 600 }}>
          <button type="button" onClick={() => setValue(replaced)}>
            replace
          </button>
          <CodeEditor value={value} onValueChange={setValue} rows={4} />
        </div>
      );
    };
    const { container } = render(<Controlled />);
    const root = editorRoot(container);
    await highlightedAs(root, "start();");
    const scroller = textareaOf(root).parentElement!;

    const release = holdHighlights();
    await userEvent.click(page.getByRole("button", { name: "replace" }));
    await expect.element(page.getByRole("textbox")).toHaveValue(replaced);
    // Before its highlight lands
    expect(paintedText(root)).toBe(replaced);
    expectAligned(root, [2, 9]);
    expectNoInnerScroll(root);

    release();
    await highlightedAs(root, replaced);
    scroller.scrollTop = scroller.scrollHeight;
    await expect.poll(() => scroller.scrollTop).toBeGreaterThan(0);
    expectNoInnerScroll(root);
    expectAligned(root, [replaced.length - 4]);
  });
});

describe("CodeEditor edge input", () => {
  leaveActEnvironment();

  it("paints only the placeholder when empty, then aligns the first characters typed", async () => {
    const { container } = render(
      <div style={{ width: 600 }}>
        <CodeEditor defaultValue="" placeholder="Write some code" />
      </div>,
    );
    const root = editorRoot(container);
    const textarea = textareaOf(root);
    await waitFor(
      () => expect(highlightOf(root).querySelector(".shiki")).not.toBeNull(),
      { timeout: 5000 },
    );
    expect(paintedText(root)).toBe("");
    expect(textarea.matches(":placeholder-shown")).toBe(true);
    expectNoInnerScroll(root);

    await userEvent.click(textarea);
    await userEvent.keyboard("abc");
    await highlightedAs(root, "abc");
    expectAligned(root, [0, 1]);
    expectNoInnerScroll(root);
  });

  it("keeps a trailing newline's empty last line in both layers", async () => {
    const value = "const a = 1;\nconst b = 2;\n";
    const { container } = render(
      <div style={{ width: 600 }}>
        <CodeEditor defaultValue={value} showLineNumbers />
      </div>,
    );
    const root = editorRoot(container);
    await highlightedAs(root, value);
    expectNoInnerScroll(root);

    const textarea = textareaOf(root);
    await userEvent.click(textarea);
    await userEvent.keyboard(`${TO_END}{Enter}`);
    await highlightedAs(root, `${value}\n`);
    expectNoInnerScroll(root);
    await userEvent.keyboard("xyz");
    await highlightedAs(root, `${value}\nxyz`);
    expectAligned(root, [value.length + 1, value.length + 2]);
  });

  it("lines tabs up in both layers", async () => {
    const value =
      "\tconst a = 1;\n\t\tif (a) {\n\t\t\treturn a;\n\t\t}\nend();";
    const { container } = render(
      <div style={{ width: 600 }}>
        <CodeEditor defaultValue={value} showLineNumbers language="tsx" />
      </div>,
    );
    const root = editorRoot(container);
    await highlightedAs(root, value);
    expectAligned(root, [
      value.indexOf("const") + 1,
      value.indexOf("if") + 1,
      value.indexOf("return") + 1,
    ]);
  });

  it("highlights a controlled value with Windows line endings, as the textarea shows it", async () => {
    const value = "const a = 1;\r\nconst b = 2;\rend();";
    const { container } = render(
      <div style={{ width: 600 }}>
        <CodeEditor value={value} showLineNumbers />
      </div>,
    );
    const root = editorRoot(container);
    // The textarea holds LF line endings, so the highlight holds the same
    const shown = textareaOf(root).value;
    expect(shown).toBe("const a = 1;\nconst b = 2;\nend();");
    await highlightedAs(root, shown);
    expect(highlightOf(root)).not.toHaveAttribute("data-pending");
    expectAligned(root, [2, shown.indexOf("b ="), shown.indexOf("end") + 1]);
    expectNoInnerScroll(root);
  });

  it("keeps the layers aligned when a controlled value changes from outside", async () => {
    const Controlled = () => {
      const [value, setValue] = useState(SHORT);
      return (
        <div style={{ width: 320 }}>
          <button type="button" onClick={() => setValue(LONG_LINE)}>
            replace
          </button>
          <CodeEditor value={value} onValueChange={setValue} showLineNumbers />
        </div>
      );
    };
    const { container } = render(<Controlled />);
    const root = editorRoot(container);
    await highlightedAs(root, SHORT);

    const release = holdHighlights();
    await userEvent.click(page.getByRole("button", { name: "replace" }));
    await expect.element(page.getByRole("textbox")).toHaveValue(LONG_LINE);
    expect(paintedText(root)).toBe(LONG_LINE);
    expectAligned(root, LONG_LINE_SAMPLES);
    expectNoInnerScroll(root);

    release();
    await highlightedAs(root, LONG_LINE);
    expectAligned(root, LONG_LINE_SAMPLES);
    expectNoInnerScroll(root);
  });

  it("paints notation comments as typed, not the highlighter's stripped copy", async () => {
    const value =
      "const a = 1; // [!code ++]\nconst b = 2; // [!code highlight]\nend();";
    const { container } = render(
      <div style={{ width: 600 }}>
        <CodeEditor defaultValue={value} />
      </div>,
    );
    const root = editorRoot(container);
    await highlightedAs(root, value);
    expectAligned(root, [value.indexOf("++"), value.indexOf("end") + 1]);
  });
});

describe("CodeEditor rows and forms", () => {
  leaveActEnvironment();

  it("caps the height at rows and scrolls inside; with no rows it grows with its content", async () => {
    const { container } = render(
      <div style={{ width: 600 }}>
        <CodeEditor defaultValue={MANY_LINES} rows={5} />
        <CodeEditor defaultValue={SHORT} />
        <CodeEditor defaultValue={MANY_LINES} />
      </div>,
    );
    const roots = [0, 1, 2].map((i) => editorRoot(container, i));
    const [capped, short, tall] = roots as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    await highlightedAs(capped, MANY_LINES);
    await highlightedAs(short, SHORT);
    await highlightedAs(tall, MANY_LINES);

    const style = getComputedStyle(textareaOf(short));
    const lineHeight = Number.parseFloat(style.lineHeight);
    const padding = Number.parseFloat(style.paddingTop);
    const layer = (root: Element) => textareaOf(root).parentElement!;

    expect(layer(capped).clientHeight).toBeCloseTo(
      5 * lineHeight + 2 * padding,
      0,
    );
    expect(layer(capped).scrollHeight).toBeGreaterThan(
      layer(capped).clientHeight,
    );
    expect(layer(short).clientHeight).toBeCloseTo(
      3 * lineHeight + 2 * padding,
      0,
    );
    expect(layer(tall).clientHeight).toBeCloseTo(
      30 * lineHeight + 2 * padding,
      0,
    );
    for (const root of roots) expectNoInnerScroll(root);
  });

  it("submits the typed value under TextareaProps.name", async () => {
    let submitted: FormData | undefined;
    render(
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submitted = new FormData(event.currentTarget);
        }}
      >
        <CodeEditor defaultValue="a" TextareaProps={{ name: "source" }} />
        <button type="submit">Save</button>
      </form>,
    );
    const textbox = page.getByRole("textbox");
    await userEvent.click(textbox);
    await userEvent.keyboard(`${TO_END}bc`);
    await expect.element(textbox).toHaveValue("abc");
    await userEvent.click(page.getByRole("button", { name: "Save" }));
    await expect.poll(() => submitted?.get("source")).toBe("abc");
  });
});
