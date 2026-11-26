import { render } from "@testing-library/react";
import { act } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { page } from "vitest/browser";

import { highlight } from "../highlighter/highlighter";
import { CodeBlock } from "./code-block";
import {
  getBlock,
  isHighlighted,
  waitForHighlight,
} from "./code-block.browser.test.helpers";
import type { CodeBlockProps } from "./code-block.types";

import "@uiid/tokens/globals.css";

/* A CodeBlock whose `code` grows a chunk at a time, as in a chat response.
   Each chunk is one render followed by one animation frame, so the real
   highlighter's passes land between chunks wherever they finish. Nothing waits
   for a fixed time: the stream advances a frame at a time, and the end waits on
   the markup. */

/** A 200-line `tsx` file: components with strings, comments and JSX. */
const FILE = Array.from({ length: 20 }, (_, i) =>
  [
    `// Component ${i}: renders a labelled counter`,
    `export function Counter${i}({ label = "count ${i}" }: { label?: string }) {`,
    `  const [count, setCount] = useState(${i});`,
    "  /* A block comment that spans",
    "     two lines */",
    `  const text = \`\${label}: \${count}\`;`,
    "  return (",
    `    <button className="counter" onClick={() => setCount(count + 1)}>{text}</button>`,
    "  );",
    "}",
  ].join("\n"),
).join("\n");

/** `text` cut into `count` chunks of near-equal length. */
const chunk = (text: string, count: number) => {
  const size = Math.ceil(text.length / count);
  return Array.from({ length: count }, (_, i) =>
    text.slice(i * size, (i + 1) * size),
  );
};

const nextFrame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

const content = (root: ParentNode) =>
  root.querySelector<HTMLElement>('[data-slot="code-block-content"]')!;

/** The text the block shows, as a reader or a selection sees it. */
const shownText = (root: ParentNode) =>
  content(root).querySelector("code")!.textContent;

const lineCount = (root: ParentNode) =>
  content(root).querySelectorAll(".line").length;

/** Markup as the browser serializes it, which escapes `<` as `&lt;`. */
const serialized = (html: string) => {
  const template = document.createElement("template");
  template.innerHTML = html;
  return template.innerHTML;
};

/** Load Shiki and the grammar first, so passes land during the stream. */
const warmUp = () => highlight("const a = 1;", "tsx");

type BlockProps = Omit<CodeBlockProps, "code">;

/**
 * Mount an empty block in a 480px container. `setCode` renders it with new
 * code; the DOM it leaves is what the next frame paints.
 */
const mountBlock = (props: BlockProps) => {
  const root = document.createElement("div");
  root.style.width = "480px";
  document.body.append(root);
  const { rerender } = render(<CodeBlock code="" {...props} />, {
    container: root,
  });
  const setCode = (code: string) =>
    act(() => rerender(<CodeBlock code={code} {...props} />));
  return { root, setCode };
};

/**
 * Stream `text` into a new block in `count` chunks, one frame apart. `onFrame`
 * runs after each chunk's render.
 */
const stream = async (
  text: string,
  count: number,
  props: BlockProps,
  onFrame: (frame: { code: string; root: HTMLElement; i: number }) => void,
) => {
  const { root, setCode } = mountBlock(props);
  let code = "";
  for (const [i, piece] of chunk(text, count).entries()) {
    code += piece;
    setCode(code);
    onFrame({ code, root, i });
    await nextFrame();
  }
  return root;
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("CodeBlock while its code streams in", () => {
  it("stays highlighted, shows every character and only grows by lines", async () => {
    await warmUp();
    let highlighted = false;
    let plainAfterHighlight = 0;
    let passesShown = 0;
    let lastPre: Element | null = null;
    let last = { lines: 0, height: 0 };
    const failures: string[] = [];

    const root = await stream(
      FILE,
      400,
      { language: "tsx", showLineNumbers: true },
      ({ code, root, i }) => {
        const now = isHighlighted(root);
        if (highlighted && !now) plainAfterHighlight++;
        highlighted ||= now;

        const pre = content(root).querySelector("pre");
        if (now && pre !== lastPre) passesShown++;
        lastPre = pre;

        if (shownText(root) !== code) {
          failures.push(
            `text at ${i} is ${shownText(root)?.length} of ${code.length} characters`,
          );
        }

        // The block's height moves only with its line count, and both only
        // grow.
        const lines = lineCount(root);
        const { height } = getBlock(root).getBoundingClientRect();
        if (lines !== code.split("\n").length) {
          failures.push(`${lines} lines at ${i}`);
        }
        if (lines === last.lines && height !== last.height) {
          failures.push(`height ${last.height} -> ${height} at ${i}`);
        }
        if (height < last.height) failures.push(`height shrank at ${i}`);
        last = { lines, height };
      },
    );

    expect(failures).toEqual([]);
    expect(highlighted).toBe(true);
    expect(plainAfterHighlight).toBe(0);
    // Several passes landed mid-stream, so the remainder path was exercised.
    expect(passesShown).toBeGreaterThan(1);

    // Once the stream stops, the markup is a one-shot highlight of the file.
    const oneShot = serialized(await highlight(FILE, "tsx"));
    await expect
      .poll(() => content(root).innerHTML, { timeout: 10_000 })
      .toBe(oneShot);
    root.remove();
  });

  it("keeps every line in place when a pass lands", async () => {
    await warmUp();
    const { root: container, setCode } = mountBlock({ language: "tsx" });
    setCode(FILE.split("\n").slice(0, 12).join("\n"));
    await waitForHighlight(container);

    // Grow past the highlighted text, so a pass is pending for the new end.
    const more = FILE.split("\n").slice(0, 30).join("\n");
    setCode(more);
    const pending = content(container).querySelector("pre");
    const tops = () =>
      [...content(container).querySelectorAll(".line")].map(
        (line) => line.getBoundingClientRect().top,
      );
    const before = tops();
    const height = getBlock(container).getBoundingClientRect().height;

    await expect
      .poll(() => content(container).querySelector("pre") !== pending)
      .toBe(true);
    expect(tops()).toEqual(before);
    expect(getBlock(container).getBoundingClientRect().height).toBe(height);
    expect(shownText(container)).toBe(more);
  });

  it("shows the toggle once the code passes its rows, and stays expanded", async () => {
    await warmUp();
    const rows = 8;
    let toggleSeen = false;
    let toggleLost = 0;
    let exceededAt = -1;
    let toggleAt = -1;
    let expandedAt = -1;
    let collapsedAfterExpand = 0;

    const root = await stream(
      FILE.split("\n").slice(0, 40).join("\n"),
      80,
      { language: "tsx", rows },
      ({ code, root, i }) => {
        const toggle = root.querySelector<HTMLButtonElement>(
          '[data-slot="code-block-expand-toggle"]',
        );
        if (toggleSeen && !toggle) toggleLost++;
        toggleSeen ||= !!toggle;
        if (exceededAt < 0 && code.split("\n").length > rows) exceededAt = i;
        if (toggleAt < 0 && toggle) toggleAt = i;

        // Expand part-way through, then it must stay expanded.
        if (toggle && expandedAt < 0 && i > 40) {
          act(() => toggle.click());
          expandedAt = i;
        }
        if (expandedAt >= 0 && !getBlock(root).hasAttribute("data-expanded")) {
          collapsedAfterExpand++;
        }
      },
    );

    expect(toggleSeen).toBe(true);
    expect(toggleLost).toBe(0);
    // It appears with the first line past the rows, or the frame after: the
    // resize it answers to is observed after layout.
    expect(toggleAt - exceededAt).toBeGreaterThanOrEqual(0);
    expect(toggleAt - exceededAt).toBeLessThanOrEqual(1);
    expect(expandedAt).toBeGreaterThan(0);
    expect(collapsedAfterExpand).toBe(0);
    root.remove();
  });

  it("copies the text at the moment the button is pressed", async () => {
    await warmUp();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    let pressedWith = "";

    const root = await stream(
      FILE.split("\n").slice(0, 20).join("\n"),
      40,
      { language: "tsx" },
      ({ code, root, i }) => {
        if (i !== 25) return;
        pressedWith = code;
        act(() =>
          root
            .querySelector<HTMLButtonElement>(
              '[data-slot="code-block-copy-button"]',
            )!
            .click(),
        );
      },
    );

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(pressedWith);
    root.remove();
  });

  for (const [what, tail] of [
    ["string", 'const s = "an unterminated'],
    ["comment", "/* an unterminated"],
    ["tag", '<div className="x'],
    ["template", "const t = `${count"],
  ]) {
    it(`renders an unterminated ${what} at the end`, async () => {
      await warmUp();
      const errors = vi.spyOn(console, "error");
      const text = `${FILE.split("\n").slice(0, 10).join("\n")}\n${tail}`;
      const root = await stream(text, 30, { language: "tsx" }, () => {});

      const oneShot = serialized(await highlight(text, "tsx"));
      await expect
        .poll(() => content(root).innerHTML, { timeout: 10_000 })
        .toBe(oneShot);
      expect(shownText(root)).toBe(text);
      await expect
        .element(page.getByText("[Error:", { exact: false }))
        .not.toBeInTheDocument();
      // Passes land outside act(), which React reports; nothing else may log.
      const logged = errors.mock.calls.filter(
        ([message]) => !String(message).includes("not wrapped in act"),
      );
      expect(logged).toEqual([]);
      root.remove();
    });
  }
});
