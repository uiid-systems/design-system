import { flushSync } from "react-dom";
import { createRoot, type Root } from "react-dom/client";
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from "vitest";

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
   Each chunk is one synchronous render followed by one animation frame, and
   each frame is checked right after its render, which is what it paints.
   Nothing waits for a fixed time: the stream advances a frame at a time, and
   the end waits on the markup a frame at a time.

   Rendering goes through `flushSync` rather than `act()`, as a real stream's
   updates would, so passes landing between frames are not reported as updates
   outside `act()`. */

/**
 * Holds each highlight pass, while `active`, until the stream has moved
 * `lag` chunks past the chunk it started on. A warm highlighter otherwise
 * finishes each pass before the next chunk, and the stream never outruns it.
 * Inactive, `highlight` is the real one.
 */
const gate = vi.hoisted(() => ({
  active: false,
  lag: 3,
  chunk: 0,
  held: [] as { until: number; release: () => void }[],
  advance() {
    this.chunk++;
    const ready = this.held.filter((pass) => pass.until <= this.chunk);
    this.held = this.held.filter((pass) => pass.until > this.chunk);
    for (const pass of ready) pass.release();
  },
  open() {
    this.active = false;
    for (const pass of this.held.splice(0)) pass.release();
  },
}));

vi.mock("../highlighter/highlighter", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("../highlighter/highlighter")>();
  return {
    ...actual,
    highlight: async (...args: Parameters<typeof actual.highlight>) => {
      const until = gate.chunk + gate.lag;
      const html = await actual.highlight(...args);
      if (gate.active && gate.chunk < until) {
        await new Promise<void>((release) =>
          gate.held.push({ until, release }),
        );
      }
      return html;
    },
  };
});

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

const firstLines = (count: number) =>
  FILE.split("\n").slice(0, count).join("\n");

/** `text` cut into `count` non-empty chunks of near-equal length. */
const chunk = (text: string, count: number) =>
  Array.from({ length: count }, (_, i) =>
    text.slice(
      Math.round((i * text.length) / count),
      Math.round(((i + 1) * text.length) / count),
    ),
  );

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

const mounted: { root: Root; container: HTMLElement }[] = [];

/**
 * Mount an empty block in a 480px container. `setCode` renders it with new
 * code synchronously; the DOM it leaves is what the next frame paints.
 */
const mountBlock = (props: BlockProps) => {
  const container = document.createElement("div");
  container.style.width = "480px";
  document.body.append(container);
  const root = createRoot(container);
  mounted.push({ root, container });
  const setCode = (code: string) =>
    flushSync(() => root.render(<CodeBlock code={code} {...props} />));
  setCode("");
  return { root: container, setCode };
};

type Frame = { code: string; root: HTMLElement; i: number };

/**
 * Stream `text` into a new block in `count` chunks, one frame apart. `onFrame`
 * runs after each chunk's render.
 */
const stream = async (
  text: string,
  count: number,
  props: BlockProps,
  onFrame: (frame: Frame) => void,
) => {
  const { root, setCode } = mountBlock(props);
  let code = "";
  for (const [i, piece] of chunk(text, count).entries()) {
    code += piece;
    setCode(code);
    gate.advance();
    onFrame({ code, root, i });
    await nextFrame();
  }
  return root;
};

/**
 * After the stream, check each frame with `onFrame` until the markup is a
 * one-shot highlight of `text`, for at most `maxFrames` frames.
 */
const settle = async (
  root: HTMLElement,
  text: string,
  onFrame: () => void,
  maxFrames = 600,
) => {
  const oneShot = serialized(await highlight(text, "tsx"));
  for (let i = 0; i < maxFrames && content(root).innerHTML !== oneShot; i++) {
    onFrame();
    await nextFrame();
  }
  // The frame where the final pass replaced the uncolored rest.
  onFrame();
  expect(content(root).innerHTML).toBe(oneShot);
};

let actEnvironment: unknown;
beforeAll(() => {
  actEnvironment = Reflect.get(globalThis, "IS_REACT_ACT_ENVIRONMENT");
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", false);
});
afterAll(() => {
  Reflect.set(globalThis, "IS_REACT_ACT_ENVIRONMENT", actEnvironment);
});

afterEach(() => {
  gate.open();
  gate.chunk = 0;
  for (const { root, container } of mounted.splice(0)) {
    root.unmount();
    container.remove();
  }
  vi.restoreAllMocks();
});

describe("CodeBlock while its code streams in", () => {
  it(
    "stays highlighted, shows every character and only grows by lines",
    { timeout: 30_000 },
    async () => {
      await warmUp();
      gate.active = true;
      let highlighted = false;
      let plainAfterHighlight = 0;
      let passesDuringStream = 0;
      let lastPre: Element | null = null;
      let last = { lines: 0, height: 0 };
      const failures: string[] = [];

      const check = (code: string, at: string) => {
        const root = mounted[0].container;
        const now = isHighlighted(root);
        if (highlighted && !now) plainAfterHighlight++;
        highlighted ||= now;

        const shown = shownText(root);
        if (shown !== code) {
          failures.push(`${at}: ${shown?.length} of ${code.length} characters`);
        }

        // The block's height moves only with its line count, and both only
        // grow.
        const lines = lineCount(root);
        const { height } = getBlock(root).getBoundingClientRect();
        if (lines !== code.split("\n").length) {
          failures.push(`${at}: ${lines} lines`);
        }
        if (lines === last.lines && height !== last.height) {
          failures.push(`${at}: height ${last.height} -> ${height}`);
        }
        if (height < last.height) failures.push(`${at}: height shrank`);
        last = { lines, height };
      };

      const root = await stream(
        FILE,
        400,
        { language: "tsx", showLineNumbers: true },
        ({ code, root, i }) => {
          check(code, `chunk ${i}`);
          // Every pass is held until the stream is three chunks past it, so a
          // new <pre> here is a pass for a value the stream has left behind.
          const pre = content(root).querySelector("pre.shiki");
          if (pre && pre !== lastPre) passesDuringStream++;
          lastPre = pre;
        },
      );

      gate.open();
      let frame = 0;
      await settle(root, FILE, () => check(FILE, `settle ${frame++}`));

      expect(failures).toEqual([]);
      expect(highlighted).toBe(true);
      expect(plainAfterHighlight).toBe(0);
      // Stale passes were shown as they landed, rather than dropped until the
      // stream stopped. One pass lands every `gate.lag` chunks, about 133 here;
      // the bound leaves room for passes that share a frame.
      expect(passesDuringStream).toBeGreaterThan(50);
    },
  );

  it("keeps every line in place when a pass lands", async () => {
    await warmUp();
    const { root, setCode } = mountBlock({ language: "tsx" });
    setCode(firstLines(12));
    await waitForHighlight(root);

    // Grow past the highlighted text, so a pass is pending for the new end.
    const more = firstLines(30);
    setCode(more);
    const pending = content(root).querySelector("pre");
    const tops = () =>
      [...content(root).querySelectorAll(".line")].map(
        (line) => line.getBoundingClientRect().top,
      );
    const before = tops();
    const height = getBlock(root).getBoundingClientRect().height;

    await expect
      .poll(() => content(root).querySelector("pre") !== pending)
      .toBe(true);
    expect(tops()).toEqual(before);
    expect(getBlock(root).getBoundingClientRect().height).toBe(height);
    expect(shownText(root)).toBe(more);
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

    await stream(
      firstLines(40),
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
          flushSync(() => toggle.click());
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
  });

  it("copies the text at the moment the button is pressed", async () => {
    await warmUp();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue(undefined);
    let pressedWith = "";

    await stream(
      firstLines(20),
      40,
      { language: "tsx" },
      ({ code, root, i }) => {
        if (i !== 25) return;
        pressedWith = code;
        root
          .querySelector<HTMLButtonElement>(
            '[data-slot="code-block-copy-button"]',
          )!
          .click();
      },
    );

    expect(writeText).toHaveBeenCalledTimes(1);
    expect(writeText).toHaveBeenCalledWith(pressedWith);
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
      const text = `${firstLines(10)}\n${tail}`;
      const root = await stream(text, 30, { language: "tsx" }, () => {});

      await settle(root, text, () => {});
      expect(shownText(root)).toBe(text);
      expect(errors).not.toHaveBeenCalled();
    });
  }
});
