import { render } from "@testing-library/react";
import { Prose } from "@uiid/typography";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";

import { highlight } from "../highlighter/highlighter";
import { CodeInline } from "./code-inline";

// Shade tokens and the [data-theme] color schemes come from the global sheet,
// the code font from the code tokens the package's stylesheet carries.
import "@uiid/tokens/globals.css";
import "@uiid/tokens/component/code.tokens.css";

/* Runs in a real browser, for what happy-dom cannot show: line breaking, the
   page's scroll width, measured boxes, and the colors light-dark() resolves
   against the nearest [data-theme].

   Highlighted states are rendered from markup produced up front by the real
   highlighter, so no check waits on Shiki loading inside a poll. The one test
   that watches the component highlight on its own gives its wait a long
   explicit timeout. */

const SHORT = "pnpm add @uiid/code";
// 120 characters with spaces, the shape of a long command.
const LONG_WITH_SPACES = Array.from({ length: 12 }, (_, i) => `--flag-${i}`)
  .join(" ")
  .padEnd(120, "x");
// 120 characters with no break opportunity, the shape of a long URL or path.
const LONG_UNBROKEN = "a".repeat(60) + "b".repeat(60);
const SNIPPET = 'const id: string = "a";';

// The poll gives up well before the test does, so a slow Shiki load fails
// with the poll's message rather than a bare test timeout.
const HIGHLIGHT_POLL_TIMEOUT = 15_000;
const HIGHLIGHT_TIMEOUT = 20_000;

beforeEach(async () => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = false;
  await page.viewport(320, 640);
  expect(document.documentElement.clientWidth).toBe(320);
});

// Vitest's default viewport, so later files measure what they expect.
afterEach(async () => {
  await page.viewport(414, 896);
});

const code = (container: HTMLElement, index = 0) =>
  container.querySelectorAll<HTMLElement>('[data-slot="code-inline"]')[index]!;

const hasNoPageScroll = () =>
  document.documentElement.scrollWidth <= document.documentElement.clientWidth;

/* Chromium snaps each text fragment to 1/64px, so splitting text into token
   spans can move an edge by a few of those units. Anything under 0.1px is that
   rounding, not a shift anyone can see. */
const expectSameBox = (
  actual: ReturnType<typeof box>,
  expected: ReturnType<typeof box>,
) => {
  for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
    expect(Math.abs(actual[key] - expected[key]), key).toBeLessThan(0.1);
  }
};

/** The box of `el` relative to its paragraph, which carries its baseline. */
const box = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const parent = el.parentElement!.getBoundingClientRect();
  return {
    width: rect.width,
    height: rect.height,
    top: rect.top - parent.top,
    lineHeight: parent.height,
  };
};

describe("CodeInline at 320px", () => {
  it("breaks a 120-character snippet with spaces instead of widening the page", () => {
    expect(LONG_WITH_SPACES).toHaveLength(120);
    const { container } = render(
      <p>
        Run <CodeInline>{LONG_WITH_SPACES}</CodeInline> to finish.
      </p>,
    );
    expect(code(container).getClientRects().length).toBeGreaterThan(1);
    expect(hasNoPageScroll()).toBe(true);
  });

  it("breaks a 120-character snippet with no spaces instead of widening the page", () => {
    expect(LONG_UNBROKEN).toHaveLength(120);
    const { container } = render(
      <p>
        Open <CodeInline>{LONG_UNBROKEN}</CodeInline> to finish.
      </p>,
    );
    expect(code(container).getClientRects().length).toBeGreaterThan(1);
    expect(hasNoPageScroll()).toBe(true);
  });

  it(
    "breaks a long highlighted snippet too",
    async () => {
      const html = await highlight(LONG_UNBROKEN, "ts");
      const { container } = render(
        <p>
          <CodeInline language="ts" html={html}>
            {LONG_UNBROKEN}
          </CodeInline>
        </p>,
      );
      expect(code(container).querySelector(".line")).not.toBeNull();
      expect(code(container).getClientRects().length).toBeGreaterThan(1);
      expect(hasNoPageScroll()).toBe(true);
    },
    HIGHLIGHT_TIMEOUT,
  );

  it("keeps a short snippet on one line", () => {
    const { container } = render(
      <p>
        <CodeInline>{SHORT}</CodeInline>
      </p>,
    );
    expect(code(container).getClientRects()).toHaveLength(1);
  });

  it("does not widen the page from a table cell", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <th>Path</th>
            <td>
              <CodeInline>{LONG_UNBROKEN}</CodeInline>
            </td>
          </tr>
        </tbody>
      </table>,
    );
    expect(code(container).getClientRects().length).toBeGreaterThan(1);
    expect(hasNoPageScroll()).toBe(true);
  });
});

describe("CodeInline box", () => {
  it(
    "measures the same plain and highlighted",
    async () => {
      const html = await highlight(SNIPPET, "ts");
      const { container } = render(
        <>
          <p>
            <CodeInline>{SNIPPET}</CodeInline> end
          </p>
          <p>
            <CodeInline language="ts" html={html}>
              {SNIPPET}
            </CodeInline>{" "}
            end
          </p>
        </>,
      );
      const highlighted = code(container, 1);
      expect(
        highlighted.querySelectorAll("span[style]").length,
      ).toBeGreaterThan(1);
      expectSameBox(box(highlighted), box(code(container, 0)));
    },
    HIGHLIGHT_TIMEOUT,
  );

  it(
    "measures the same pending and highlighted",
    async () => {
      const { container } = render(
        <p>
          <CodeInline language="ts">{SNIPPET}</CodeInline> end
        </p>,
      );
      const el = code(container);
      // Nothing has highlighted yet: the plain text is the pending state.
      expect(el.querySelector(".line")).toBeNull();
      const pending = box(el);

      await expect
        .poll(() => el.querySelector(".line"), {
          timeout: HIGHLIGHT_POLL_TIMEOUT,
        })
        .not.toBeNull();
      expectSameBox(box(el), pending);
    },
    HIGHLIGHT_TIMEOUT,
  );
});

describe("CodeInline theme", () => {
  /** What the browser paints for a CSS color value. */
  const resolve = (value: string) => {
    const probe = document.createElement("span");
    probe.style.color = value;
    document.body.append(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  };

  it(
    "takes each container's theme, and recolors without re-rendering",
    async () => {
      const html = await highlight(SNIPPET, "ts");
      const { container } = render(
        <div data-theme="light">
          <p>
            <CodeInline language="ts" html={html}>
              {SNIPPET}
            </CodeInline>
          </p>
          <div data-theme="dark">
            <p>
              <CodeInline language="ts" html={html}>
                {SNIPPET}
              </CodeInline>
            </p>
          </div>
        </div>,
      );
      const token = (index: number) =>
        code(container, index).querySelector<HTMLElement>(
          "span[style*='--shiki-light']",
        )!;
      const light = resolve(token(0).style.getPropertyValue("--shiki-light"));
      const dark = resolve(token(0).style.getPropertyValue("--shiki-dark"));
      expect(light).not.toBe(dark);

      expect(getComputedStyle(token(0)).color).toBe(light);
      expect(getComputedStyle(token(1)).color).toBe(dark);

      // Flipping the outer theme repaints the same nodes.
      const node = token(0);
      container
        .querySelector("[data-theme]")!
        .setAttribute("data-theme", "dark");
      expect(token(0)).toBe(node);
      expect(getComputedStyle(token(0)).color).toBe(dark);
    },
    HIGHLIGHT_TIMEOUT,
  );
});

describe("CodeInline nested in text", () => {
  const surface = (el: HTMLElement) => {
    const style = getComputedStyle(el);
    return {
      painted: style.backgroundColor !== "rgba(0, 0, 0, 0)",
      rounded: Number.parseFloat(style.borderTopLeftRadius) > 0,
    };
  };

  it("inside a link stays inline, takes the link color and keeps its surface", () => {
    const { container } = render(
      <p>
        See{" "}
        <a href="#install">
          the <CodeInline>install</CodeInline> step
        </a>
      </p>,
    );
    const el = code(container);
    const link = container.querySelector("a")!;
    // Only inline boxes carry the link's underline through them.
    expect(getComputedStyle(el).display).toBe("inline");
    expect(getComputedStyle(el).color).toBe(getComputedStyle(link).color);
    expect(surface(el)).toEqual({ painted: true, rounded: true });
  });

  it("inside a heading scales with the heading's size", () => {
    const { container } = render(
      <>
        <p>
          <CodeInline>size</CodeInline>
        </p>
        <h1>
          <CodeInline>size</CodeInline>
        </h1>
      </>,
    );
    const size = (el: HTMLElement) =>
      Number.parseFloat(getComputedStyle(el).fontSize);
    const ratio = (el: HTMLElement) => size(el) / size(el.parentElement!);
    const inParagraph = code(container, 0);
    const inHeading = code(container, 1);

    expect(size(inHeading)).toBeGreaterThan(size(inParagraph));
    expect(ratio(inHeading)).toBeCloseTo(ratio(inParagraph), 5);
    expect(surface(inHeading)).toEqual({ painted: true, rounded: true });
  });

  it("inside a table cell keeps its surface", () => {
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <td>
              <CodeInline>cell</CodeInline>
            </td>
          </tr>
        </tbody>
      </table>,
    );
    expect(surface(code(container))).toEqual({ painted: true, rounded: true });
  });

  /* Tests load CSS modules without the cascade layers the build adds, so here
     Prose's own `code` rule wins by specificity and paints the surface. In a
     build CodeInline's layer comes later and its surface wins. So this checks
     only what holds either way: sizing, inline display and no page scroll. */
  it("inside Prose scales in a heading, stays inline in a link and fits a table cell", () => {
    const { container } = render(
      <Prose>
        <h2>
          Heading with <CodeInline>code</CodeInline>
        </h2>
        <p>
          <a href="#x">
            Link with <CodeInline>code</CodeInline>
          </a>
        </p>
        <table>
          <tbody>
            <tr>
              <td>
                <CodeInline>{LONG_UNBROKEN}</CodeInline>
              </td>
            </tr>
          </tbody>
        </table>
      </Prose>,
    );
    const [heading, link, cell] = [0, 1, 2].map((i) => code(container, i));
    expect(cell!.getClientRects().length).toBeGreaterThan(1);
    expect(
      Number.parseFloat(getComputedStyle(heading!).fontSize),
    ).toBeGreaterThan(Number.parseFloat(getComputedStyle(link!).fontSize));
    expect(getComputedStyle(link!).display).toBe("inline");
    expect(hasNoPageScroll()).toBe(true);
  });
});
