import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CodeBlock } from "./code-block";
import { Controlled } from "./code-block.examples";

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
 * `contentHeight` tall, and `data-collapsed` (whose CSS caps the height at the
 * rows) clips its visible height.
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
      return this.hasAttribute("data-collapsed")
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
    expect(scrollArea()?.style.getPropertyValue("--code-rows")).toBe("4");
    expect(scrollArea()?.style.maxHeight).toBe("");
    expect(scrollArea()).toHaveAttribute("data-collapsed");
  });

  it("shows a collapsed Show more toggle when the code overflows", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} rows={4} />);

    const button = await screen.findByRole("button", { name: "Show more" });
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("data-slot", "code-block-expand-toggle");
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()).toHaveAttribute("data-collapsed");
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
    expect(scrollArea()).not.toHaveAttribute("data-collapsed");

    await user.click(less);

    const more = screen.getByRole("button", { name: "Show more" });
    expect(more).toHaveAttribute("aria-expanded", "false");
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()).toHaveAttribute("data-collapsed");
  });

  it("names the toggle with expandLabel and collapseLabel", async () => {
    const user = userEvent.setup();
    contentHeight = 300;
    render(
      <CodeBlock
        code={CODE}
        rows={4}
        expandLabel="Mehr anzeigen"
        collapseLabel="Weniger anzeigen"
      />,
    );

    await user.click(
      await screen.findByRole("button", { name: "Mehr anzeigen" }),
    );
    expect(
      screen.getByRole("button", { name: "Weniger anzeigen" }),
    ).toHaveAttribute("aria-expanded", "true");
  });

  it("starts expanded with defaultExpanded", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} rows={4} defaultExpanded />);

    expect(
      await screen.findByRole("button", { name: "Show less" }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(block()).toHaveAttribute("data-expanded");
    expect(scrollArea()).not.toHaveAttribute("data-collapsed");
  });

  it("shows no toggle for short code that starts expanded", async () => {
    contentHeight = 50;
    render(<CodeBlock code={CODE} rows={4} defaultExpanded />);
    await waitForHighlight();

    expect(toggle()).not.toBeInTheDocument();
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

  it("treats rows={0} as no cap", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} rows={0} />);
    await waitForHighlight();

    expect(toggle()).not.toBeInTheDocument();
    expect(scrollArea()).not.toHaveAttribute("data-rows");
    expect(scrollArea()).not.toHaveAttribute("data-collapsed");
  });

  it("collapses only the inline copy, not the fullscreen one", async () => {
    const user = userEvent.setup();
    contentHeight = 300;
    render(<CodeBlock code={CODE} rows={4} fullscreenable />);
    await screen.findByRole("button", { name: "Show more" });

    await user.click(screen.getByRole("button", { name: /fullscreen/i }));

    const areas = await waitFor(() => {
      const found = document.querySelectorAll(
        '[data-slot="code-block-scroll"]',
      );
      expect(found).toHaveLength(2);
      return found;
    });
    expect(areas[0]).toHaveAttribute("data-collapsed");
    expect(areas[1]).not.toHaveAttribute("data-collapsed");
  });

  it("holds a controlled expanded when onExpandedChange does nothing", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    contentHeight = 300;
    render(
      <CodeBlock
        code={CODE}
        rows={4}
        expanded={false}
        onExpandedChange={onExpandedChange}
      />,
    );

    await user.click(await screen.findByRole("button", { name: "Show more" }));

    expect(onExpandedChange).toHaveBeenCalledTimes(1);
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Show more" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()).toHaveAttribute("data-collapsed");
  });

  it("follows a controlled expanded switched from outside", async () => {
    const onExpandedChange = vi.fn();
    contentHeight = 300;
    const { rerender } = render(
      <CodeBlock
        code={CODE}
        rows={4}
        expanded={false}
        onExpandedChange={onExpandedChange}
      />,
    );
    await screen.findByRole("button", { name: "Show more" });

    rerender(
      <CodeBlock
        code={CODE}
        rows={4}
        expanded
        onExpandedChange={onExpandedChange}
      />,
    );

    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(block()).toHaveAttribute("data-expanded");
    expect(scrollArea()).not.toHaveAttribute("data-collapsed");
    expect(onExpandedChange).not.toHaveBeenCalled();
  });

  it("expands and collapses a controlled block whose parent follows onExpandedChange", async () => {
    const user = userEvent.setup();
    contentHeight = 300;
    const Parent = () => {
      const [expanded, setExpanded] = React.useState(false);
      return (
        <CodeBlock
          code={CODE}
          rows={4}
          expanded={expanded}
          onExpandedChange={setExpanded}
        />
      );
    };
    render(<Parent />);

    await user.click(await screen.findByRole("button", { name: "Show more" }));
    expect(block()).toHaveAttribute("data-expanded");
    expect(scrollArea()).not.toHaveAttribute("data-collapsed");

    await user.click(screen.getByRole("button", { name: "Show less" }));
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()).toHaveAttribute("data-collapsed");
  });

  it("expands the Controlled example from its outside button", async () => {
    const user = userEvent.setup();
    contentHeight = 300;
    render(<Controlled />);
    const outside = screen.getByRole("button", { name: "Expand" });
    expect(outside).toHaveAttribute("aria-expanded", "false");

    await user.click(outside);

    expect(block()).toHaveAttribute("data-expanded");
    expect(screen.getByRole("button", { name: "Collapse" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
    expect(
      await screen.findByRole("button", { name: "Show less" }),
    ).toBeInTheDocument();
  });

  it("lets a controlled expanded win over defaultExpanded", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} rows={4} expanded={false} defaultExpanded />);

    expect(
      await screen.findByRole("button", { name: "Show more" }),
    ).toBeInTheDocument();
    expect(scrollArea()).toHaveAttribute("data-collapsed");
  });

  it("fires onExpandedChange once per press with the next value, uncontrolled", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    contentHeight = 300;
    render(
      <CodeBlock
        code={CODE}
        rows={4}
        defaultExpanded
        onExpandedChange={onExpandedChange}
      />,
    );

    await user.click(await screen.findByRole("button", { name: "Show less" }));
    expect(onExpandedChange).toHaveBeenCalledTimes(1);
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);

    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(onExpandedChange).toHaveBeenCalledTimes(2);
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);
  });

  it("shows every row and no toggle for a controlled expanded whose code fits", async () => {
    contentHeight = 50;
    render(<CodeBlock code={CODE} rows={4} expanded />);
    await waitForHighlight();

    expect(toggle()).not.toBeInTheDocument();
    expect(block()).toHaveAttribute("data-expanded");
    expect(scrollArea()).not.toHaveAttribute("data-collapsed");
  });

  it("ignores a controlled expanded without rows", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} expanded />);
    await waitForHighlight();

    expect(toggle()).not.toBeInTheDocument();
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()).not.toHaveAttribute("data-collapsed");
  });

  it("passes ExpandToggleProps to the toggle", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    contentHeight = 300;
    render(
      <CodeBlock
        code={CODE}
        rows={4}
        ExpandToggleProps={{ id: "more", className: "mine", onClick }}
      />,
    );

    const button = await screen.findByRole("button", { name: "Show more" });
    expect(button).toHaveAttribute("id", "more");
    expect(button).toHaveClass("mine");
    expect(button.className).not.toBe("mine");

    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: "Show less" })).toBeVisible();
  });

  it("keeps the toggle's state and labels over an untyped ExpandToggleProps", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    const slotOnExpandedChange = vi.fn();
    contentHeight = 300;
    render(
      <CodeBlock
        code={CODE}
        rows={4}
        onExpandedChange={onExpandedChange}
        ExpandToggleProps={
          {
            expanded: true,
            onExpandedChange: slotOnExpandedChange,
            expandLabel: "Slot more",
            collapseLabel: "Slot less",
            "aria-expanded": true,
          } as object
        }
      />,
    );

    const button = await screen.findByRole("button", { name: "Show more" });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(slotOnExpandedChange).not.toHaveBeenCalled();
    expect(onExpandedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("neither collapses nor toggles without rows", async () => {
    contentHeight = 300;
    render(<CodeBlock code={CODE} />);
    await waitForHighlight();

    expect(toggle()).not.toBeInTheDocument();
    expect(block()).not.toHaveAttribute("data-expanded");
    expect(scrollArea()).not.toHaveAttribute("data-collapsed");
    expect(scrollArea()?.getAttribute("style")).toBeNull();
  });
});
