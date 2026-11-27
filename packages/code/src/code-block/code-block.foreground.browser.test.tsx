import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CodeEditor } from "../code-editor/code-editor";
import { getHighlighter } from "../highlighter/highlighter";
import { CodeBlock } from "./code-block";
import {
  isHighlighted,
  waitForHighlight,
} from "./code-block.browser.test.helpers";

import "@uiid/tokens/globals.css";

/* The plain code shown before a highlight lands takes the code theme's own
   default foreground, so only the tokens change tint when Shiki's output
   arrives. Highlights pass straight through unless a test holds them. */
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

afterEach(() => gate.release?.());

/** A CSS colour resolved inside `parent`, so a theme on it applies. */
const toColor = (color: string, parent: Element) => {
  const probe = document.createElement("div");
  probe.style.color = color;
  parent.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
};

/** Each scheme's default foreground, as the loaded Shiki themes define it. */
const themeForegrounds = async () => {
  const [highlighter, light, dark] = await Promise.all([
    getHighlighter(),
    import("@shikijs/themes/vitesse-light"),
    import("@shikijs/themes/vitesse-black"),
  ]);
  return {
    light: highlighter.getTheme(light.default.name!).fg,
    dark: highlighter.getTheme(dark.default.name!).fg,
  };
};

const CODE = [
  'import { useState } from "react";',
  "",
  "export function Counter() {",
  "  const [count, setCount] = useState(0);",
  "  return <button onClick={() => setCount(count + 1)}>Clicked {count} times</button>;",
  "}",
].join("\n");

const colorOf = (el: Element) => getComputedStyle(el).color;

describe.each(["light", "dark"] as const)(
  "plain code foreground (%s)",
  (scheme) => {
    it("is the theme's default foreground", async () => {
      const fg = (await themeForegrounds())[scheme];
      // The premise: the dark theme's foreground is translucent, so a fallback
      // that drops the alpha would not match.
      if (scheme === "dark") expect(fg).toMatch(/^#[0-9a-f]{8}$/i);
      const release = holdHighlights();
      const { container } = render(
        <div data-theme={scheme}>
          <CodeBlock code={CODE} language="tsx" />
        </div>,
      );
      const themed = container.firstElementChild!;
      expect(isHighlighted(container)).toBe(false);
      const line = container.querySelector(
        '[data-slot="code-block-content"] .line',
      )!;
      expect(colorOf(line)).toBe(toColor(fg, themed));
      release();
    });

    it("does not change for text Shiki gives the default foreground", async () => {
      const fg = (await themeForegrounds())[scheme];
      const release = holdHighlights();
      const { container } = render(
        <div data-theme={scheme}>
          <CodeBlock code={CODE} language="tsx" showLineNumbers />
        </div>,
      );
      const themed = container.firstElementChild!;
      const plain = colorOf(
        container.querySelector('[data-slot="code-block-content"] .line')!,
      );
      const number = getComputedStyle(
        container.querySelector('[data-slot="code-block-content"] .line')!,
        "::before",
      ).color;

      release();
      await waitForHighlight(container);

      const content = container.querySelector(
        '[data-slot="code-block-content"]',
      )!;
      // Every token Shiki paints in the default foreground keeps the colour
      // the plain fallback had.
      const defaults = [
        ...content.querySelectorAll<HTMLElement>(".line span"),
      ].filter(
        (span) =>
          span.style.getPropertyValue(`--shiki-${scheme}`).toLowerCase() ===
          fg.toLowerCase(),
      );
      expect(defaults.length).toBeGreaterThan(0);
      for (const span of defaults) expect(colorOf(span)).toBe(plain);
      // So does the text the lines inherit from Shiki's <pre>.
      expect(colorOf(content.querySelector(".line")!)).toBe(plain);
      // Line numbers stay muted, before and after.
      const muted = toColor("var(--shade-muted)", themed);
      expect(number).toBe(muted);
      expect(
        getComputedStyle(content.querySelector(".line")!, "::before").color,
      ).toBe(muted);
    });

    it("is the theme's default foreground in CodeEditor's highlight layer", async () => {
      const fg = (await themeForegrounds())[scheme];
      const release = holdHighlights();
      const { container } = render(
        <div data-theme={scheme}>
          <CodeEditor defaultValue={CODE} language="tsx" />
        </div>,
      );
      const themed = container.firstElementChild!;
      const pre = container.querySelector(
        '[data-slot="code-editor-highlight"] pre',
      )!;
      expect(pre.classList.contains("shiki")).toBe(false);
      expect(colorOf(pre.querySelector(".line")!)).toBe(toColor(fg, themed));
      release();
    });
  },
);
