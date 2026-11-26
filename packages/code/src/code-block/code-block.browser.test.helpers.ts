import { render } from "@testing-library/react";
import type * as React from "react";
import { expect } from "vitest";

/* Helpers for CodeBlock's real-browser tests. The name keeps the file out of the
   package build (`*.test.*`) without making it a test file itself. It imports
   nothing from `vitest/browser`, so the happy-dom typecheck can read it too. */

/**
 * Render `ui` into a container of a fixed width, so every measurement is taken
 * against the same layout. Testing Library unmounts and removes the container
 * after each test.
 */
export const mountSized = (ui: React.ReactElement, { width = 480 } = {}) => {
  const container = document.createElement("div");
  container.style.width = `${width}px`;
  document.body.append(container);
  render(ui, { container });
  return container;
};

/** The first CodeBlock frame inside `root`. */
export const getBlock = (root: ParentNode = document) =>
  root.querySelector<HTMLElement>('[data-slot="code-block"]')!;

/** Whether the code inside `root` is Shiki's output rather than the fallback. */
export const isHighlighted = (root: ParentNode = document) =>
  root.querySelector('[data-slot="code-block-content"] pre.shiki') !== null;

/**
 * Wait until the highlighter's output replaces the plain fallback. The first
 * call loads Shiki and a grammar, so the bound is generous; it waits for the
 * markup, not for a fixed time.
 */
export const waitForHighlight = async (root: ParentNode = document) => {
  await expect.poll(() => isHighlighted(root), { timeout: 10_000 }).toBe(true);
};

type Box = { top: number; left: number; width: number; height: number };

const round = (n: number) => Math.round(n * 100) / 100;

const relativeBox = (rect: DOMRect, origin: DOMRect): Box => ({
  top: round(rect.top - origin.top),
  left: round(rect.left - origin.left),
  width: round(rect.width),
  height: round(rect.height),
});

/** The box of one character of a text node. */
const charRect = (node: Text, offset: number) => {
  const range = document.createRange();
  range.setStart(node, offset);
  range.setEnd(node, offset + 1);
  return range.getBoundingClientRect();
};

/**
 * The boxes of a line's first and last non-space characters, so the markup
 * around the text, such as Shiki's token spans, does not count. Null for a
 * blank line.
 */
const textEdges = (line: HTMLElement) => {
  const walker = document.createTreeWalker(line, NodeFilter.SHOW_TEXT);
  let first: DOMRect | undefined;
  let last: DOMRect | undefined;
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node as Text;
    for (let i = 0; i < text.data.length; i++) {
      if (/\s/.test(text.data.charAt(i))) continue;
      const rect = charRect(text, i);
      first ??= rect;
      last = rect;
    }
  }
  return first && last ? { first, last } : null;
};

/**
 * The block's size and, for each `.line`, its box and where its text starts
 * and ends, all relative to the block's top-left corner and rounded to 0.01px.
 * Two reads that are equal mean nothing moved. A blank line has a `text` of
 * null.
 */
export const readBoxes = (block: HTMLElement) => {
  const origin = block.getBoundingClientRect();
  const lines = [...block.querySelectorAll<HTMLElement>(".line")].map(
    (line) => {
      const edges = textEdges(line);
      return {
        box: relativeBox(line.getBoundingClientRect(), origin),
        text: edges && {
          start: relativeBox(edges.first, origin),
          end: relativeBox(edges.last, origin),
        },
      };
    },
  );
  return {
    block: { width: round(origin.width), height: round(origin.height) },
    lines,
  };
};

export type Boxes = ReturnType<typeof readBoxes>;

const flatten = (value: unknown, path: string, out: Map<string, unknown>) => {
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      flatten(child, `${path}.${key}`, out);
    }
  } else {
    out.set(path, value);
  }
  return out;
};

/**
 * How far two reads of `readBoxes` differ: the largest change on each axis.
 * `left` and `width` are horizontal, `top` and `height` vertical. A read with
 * a different shape, such as another line count or a line that lost its text,
 * reports `Infinity` on both axes.
 */
export const boxesDelta = (a: Boxes, b: Boxes) => {
  const left = flatten(a, "", new Map());
  const right = flatten(b, "", new Map());
  const keys = new Set([...left.keys(), ...right.keys()]);
  const delta = { x: 0, y: 0 };
  for (const key of keys) {
    const x = left.get(key);
    const y = right.get(key);
    if (typeof x !== "number" || typeof y !== "number") {
      if (x !== y) return { x: Infinity, y: Infinity };
      continue;
    }
    const axis = /\.(left|width)$/.test(key) ? "x" : "y";
    delta[axis] = Math.max(delta[axis], Math.abs(x - y));
  }
  return delta;
};
