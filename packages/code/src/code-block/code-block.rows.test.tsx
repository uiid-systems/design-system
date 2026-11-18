import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { CodeBlock } from "./code-block";

const CODE = "const a = 1;\nconst b = 2;";
const COLLAPSED_HEIGHT = 100;

/** Height of the scroll area's content, set per test. */
let contentHeight = 0;

const isScrollArea = (el: HTMLElement) =>
  el.dataset.slot === "code-block-scroll";

const LAYOUT_PROPS = ["scrollHeight", "clientHeight"] as const;
type LayoutProp = (typeof LAYOUT_PROPS)[number];

/** happy-dom's own descriptors, restored after each test. */
let originalDescriptors: Partial<
  Record<LayoutProp, PropertyDescriptor | undefined>
> = {};

/**
 * happy-dom does no layout, so model the scroll area: its content is
 * `contentHeight` tall, and a collapsed max-height clips its visible height.
 */
const stubLayout = () => {
  const proto = HTMLElement.prototype;
  originalDescriptors = Object.fromEntries(
    LAYOUT_PROPS.map((prop) => [
      prop,
      Object.getOwnPropertyDescriptor(proto, prop),
    ]),
  );
  Object.defineProperty(proto, "scrollHeight", {
    configurable: true,
    get(this: HTMLElement) {
      return isScrollArea(this) ? contentHeight : 0;
    },
  });
  Object.defineProperty(proto, "clientHeight", {
    configurable: true,
    get(this: HTMLElement) {
      if (!isScrollArea(this)) return 0;
      return this.style.maxHeight
        ? Math.min(contentHeight, COLLAPSED_HEIGHT)
        : contentHeight;
    },
  });
};

const restoreLayout = () => {
  const proto = HTMLElement.prototype;
  for (const prop of LAYOUT_PROPS) {
    const descriptor = originalDescriptors[prop];
    if (descriptor) {
      Object.defineProperty(proto, prop, descriptor);
    } else {
      Reflect.deleteProperty(proto, prop);
    }
  }
};

const scrollArea = () =>
  document.querySelector<HTMLElement>('[data-slot="code-block-scroll"]');
const block = () => document.querySelector('[data-slot="code-block"]');
const toggle = () =>
  screen.queryByRole("button", { name: /show (more|less)/i });

/** Wait for the real highlighter's markup, which the overflow check needs. */
const waitForHighlight = () =>
  waitFor(() =>
    expect(document.querySelector("pre.shiki")).toBeInTheDocument(),
  );

describe("CodeBlock rows", () => {
  beforeEach(() => {
    contentHeight = 0;
    stubLayout();
  });

  afterEach(() => {
    restoreLayout();
  });

  it("shows no toggle when the code fits in its rows", async () => {
    contentHeight = 50;
    render(<CodeBlock code={CODE} rows={4} />);
    await waitForHighlight();

    expect(toggle()).not.toBeInTheDocument();
    expect(scrollArea()?.style.maxHeight).toContain("calc(4 *");
  });

  it("shows a collapsed Show more toggle when the code overflows", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} rows={4} />);

    const button = await screen.findByRole("button", { name: "Show more" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("data-slot", "code-block-expand-toggle");
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()?.style.maxHeight).not.toBe("");
  });

  it("ignores an overflow within the 1px rounding tolerance", async () => {
    contentHeight = COLLAPSED_HEIGHT + 1;
    render(<CodeBlock code={CODE} rows={4} />);
    await waitForHighlight();

    expect(toggle()).not.toBeInTheDocument();
  });

  it("expands and collapses with Show more and Show less", async () => {
    const user = userEvent.setup();
    contentHeight = 300;
    render(<CodeBlock code={CODE} rows={4} />);

    await user.click(await screen.findByRole("button", { name: "Show more" }));

    const less = screen.getByRole("button", { name: "Show less" });
    expect(less).toHaveAttribute("aria-expanded", "true");
    expect(block()).toHaveAttribute("data-expanded");
    expect(scrollArea()?.style.maxHeight).toBe("");

    await user.click(less);

    const more = screen.getByRole("button", { name: "Show more" });
    expect(more).toHaveAttribute("aria-expanded", "false");
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()?.style.maxHeight).not.toBe("");
  });

  it("starts expanded with defaultExpanded", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} rows={4} defaultExpanded />);
    await waitForHighlight();

    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(block()).toHaveAttribute("data-expanded");
    expect(scrollArea()?.style.maxHeight).toBe("");
  });

  it("shows no toggle for short code that starts expanded", async () => {
    contentHeight = 50;
    render(<CodeBlock code={CODE} rows={4} defaultExpanded />);
    await waitForHighlight();

    expect(
      screen.queryByRole("button", { name: "Show less", expanded: true }),
    ).not.toBeInTheDocument();
  });

  it("re-measures when the code grows past its rows", async () => {
    contentHeight = 50;
    const { rerender } = render(<CodeBlock code={CODE} rows={4} />);
    await waitForHighlight();
    expect(toggle()).not.toBeInTheDocument();

    contentHeight = 300;
    rerender(<CodeBlock code={`${CODE}\nconst c = 3;`} rows={4} />);

    expect(
      await screen.findByRole("button", { name: "Show more" }),
    ).toBeInTheDocument();
  });

  it("measures prerendered html", async () => {
    contentHeight = 300;
    render(
      <CodeBlock
        code={CODE}
        rows={4}
        html={`<pre class="shiki"><code>${CODE}</code></pre>`}
      />,
    );

    expect(
      await screen.findByRole("button", { name: "Show more" }),
    ).toBeInTheDocument();
  });

  it("neither collapses nor toggles without rows", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} />);
    await waitForHighlight();

    expect(toggle()).not.toBeInTheDocument();
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()?.style.maxHeight).toBe("");
  });
});
