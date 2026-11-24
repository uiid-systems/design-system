import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Collapsible } from "./collapsible";
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsiblePanel,
} from "./subcomponents";

import styles from "./collapsible.module.css";
import css from "./collapsible.module.css?raw";

const getRoot = () =>
  document.querySelector<HTMLElement>("[data-slot='collapsible-root']");
const getPanel = () =>
  document.querySelector<HTMLElement>("[data-slot='collapsible-panel']");

/* Stand-ins for `Button` and `Text`: a component that renders a real <button>
   and one that renders a <span>. */
const ButtonLike = (props: React.ComponentProps<"button">) => (
  <button type="button" {...props} />
);
const TextLike = (props: React.ComponentProps<"span">) => <span {...props} />;

describe("Collapsible", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders with data-slot attributes", () => {
    render(
      <Collapsible trigger="Toggle" defaultOpen>
        Content
      </Collapsible>,
    );
    expect(getRoot()).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='collapsible-trigger']"),
    ).toBeInTheDocument();
    expect(getPanel()).toHaveTextContent("Content");
  });

  it("renders a string trigger as a focusable button role", () => {
    render(<Collapsible trigger="Toggle">Content</Collapsible>);
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger.tagName).toBe("SPAN");
    expect(trigger).toHaveAttribute("tabindex", "0");
  });

  it("renders an element trigger as that element", () => {
    render(
      <Collapsible trigger={<button type="button">Toggle</button>}>
        Content
      </Collapsible>,
    );
    expect(screen.getByRole("button", { name: "Toggle" }).tagName).toBe(
      "BUTTON",
    );
  });

  // ============================================
  // TRIGGER
  // ============================================

  it("gives a non-button intrinsic trigger button semantics", async () => {
    const user = userEvent.setup();
    render(<Collapsible trigger={<span>Toggle</span>}>Content</Collapsible>);

    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("keeps a component trigger native by default", () => {
    render(
      <Collapsible trigger={<ButtonLike>Toggle</ButtonLike>}>
        Content
      </Collapsible>,
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).not.toHaveAttribute("role");
  });

  it("lets a non-button component opt out with nativeButton={false}", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible
        trigger={<TextLike>Toggle</TextLike>}
        TriggerProps={{ nativeButton: false }}
      >
        Content
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Toggle" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("does not nest a childless element trigger inside itself", () => {
    render(
      <Collapsible trigger={<button type="button" aria-label="Expand" />}>
        Content
      </Collapsible>,
    );
    expect(screen.getAllByRole("button")).toHaveLength(1);
  });

  it("passes the trigger state to a function trigger", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible
        trigger={({ open }) => <TextLike>{open ? "Hide" : "Show"}</TextLike>}
      >
        Content
      </Collapsible>,
    );

    const trigger = screen.getByRole("button", { name: "Show" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);
    expect(trigger).toHaveAccessibleName("Hide");
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("wraps a function trigger in its own keyboard-operable button", async () => {
    const user = userEvent.setup();
    render(
      <CollapsibleRoot>
        <CollapsibleTrigger>
          {({ open }) => <TextLike>{open ? "Hide" : "Show"}</TextLike>}
        </CollapsibleTrigger>
        <CollapsiblePanel>Content</CollapsiblePanel>
      </CollapsibleRoot>,
    );

    const trigger = screen.getByRole("button", { name: "Show" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(trigger).toHaveAccessibleName("Hide");
  });

  // ============================================
  // OPEN STATE
  // ============================================

  it("is closed by default and opens on trigger click", async () => {
    const user = userEvent.setup();
    render(<Collapsible trigger="Toggle">Content</Collapsible>);

    expect(screen.queryByText("Content")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("opens initially with defaultOpen", () => {
    render(
      <Collapsible trigger="Toggle" defaultOpen>
        Content
      </Collapsible>,
    );
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("supports controlled state", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const Controlled = () => {
      const [open, setOpen] = useState(false);
      return (
        <Collapsible
          trigger="Toggle"
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          Content
        </Collapsible>
      );
    };

    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Toggle" }));

    expect(onOpenChange).toHaveBeenCalled();
    expect(onOpenChange.mock.calls[0][0]).toBe(true);
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("takes open state directly, as CollapsibleCard does", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();

    const Controlled = () => {
      const [open, setOpen] = useState(false);
      return (
        <Collapsible
          trigger="Toggle"
          open={open}
          onOpenChange={(next) => {
            onOpenChange(next);
            setOpen(next);
          }}
        >
          Content
        </Collapsible>
      );
    };

    render(<Controlled />);
    await user.click(screen.getByRole("button", { name: "Toggle" }));

    expect(onOpenChange.mock.calls[0][0]).toBe(true);
    expect(screen.getByText("Content")).toBeVisible();
  });

  it("takes defaultOpen and keepMounted directly", () => {
    const { unmount } = render(
      <Collapsible trigger="Toggle" defaultOpen>
        Content
      </Collapsible>,
    );
    expect(screen.getByText("Content")).toBeVisible();
    unmount();

    render(
      <Collapsible trigger="Toggle" keepMounted>
        Kept
      </Collapsible>,
    );
    expect(screen.getByText("Kept")).toBeInTheDocument();
    expect(screen.getByText("Kept")).not.toBeVisible();
  });

  it("takes disabled directly", async () => {
    const user = userEvent.setup();
    render(
      <Collapsible trigger="Toggle" disabled>
        Content
      </Collapsible>,
    );
    await user.click(screen.getByRole("button", { name: "Toggle" }));
    expect(screen.queryByText("Content")).not.toBeInTheDocument();
  });

  // ============================================
  // LAYOUT PROPS
  // ============================================

  it("forwards layout props from RootProps to the root Stack", () => {
    render(
      <Collapsible
        trigger="Toggle"
        RootProps={{ gap: 4, ax: "center", fullwidth: true }}
      >
        Content
      </Collapsible>,
    );
    const root = getRoot();
    expect(root).toHaveAttribute("data-ui-gap", "4");
    expect(root).toHaveAttribute("data-ui-ay", "center");
    expect(root).toHaveAttribute("data-ui-fullwidth");
  });

  it("aligns panel content to the end by default", () => {
    render(
      <Collapsible trigger="Toggle" defaultOpen>
        Content
      </Collapsible>,
    );
    expect(getPanel()).toHaveAttribute("data-ui-ax", "end");
  });

  it("lets PanelProps override the default alignment", () => {
    render(
      <Collapsible
        trigger="Toggle"
        defaultOpen
        PanelProps={{ ay: "start", gap: 2 }}
      >
        Content
      </Collapsible>,
    );
    const panel = getPanel();
    expect(panel).toHaveAttribute("data-ui-ax", "start");
    expect(panel).toHaveAttribute("data-ui-gap", "2");
  });

  it("accepts layout props on the composed subcomponents", () => {
    render(
      <CollapsibleRoot defaultOpen p={2}>
        <CollapsibleTrigger>Toggle</CollapsibleTrigger>
        <CollapsiblePanel ay="center">Content</CollapsiblePanel>
      </CollapsibleRoot>,
    );
    expect(getRoot()).toHaveAttribute("data-ui-p", "2");
    expect(getPanel()).toHaveAttribute("data-ui-ax", "center");
  });

  it("lets the panel shrink below its content while it animates", () => {
    render(
      <Collapsible trigger="Toggle" defaultOpen>
        Content
      </Collapsible>,
    );
    expect(getPanel()).toHaveAttribute("data-ui-minh", "0");
  });

  it("lets PanelProps override the panel's minh", () => {
    render(
      <Collapsible trigger="Toggle" defaultOpen PanelProps={{ minh: 40 }}>
        Content
      </Collapsible>,
    );
    expect(getPanel()).toHaveAttribute("data-ui-minh", "40");
  });

  // ============================================
  // CLASSNAME
  // ============================================

  it("merges a panel className with the panel's own styles", () => {
    render(
      <Collapsible
        trigger="Toggle"
        defaultOpen
        PanelProps={{ className: "custom" }}
      >
        Content
      </Collapsible>,
    );
    const panel = getPanel();
    expect(panel).toHaveClass("custom");
    expect(panel?.className).toContain("collapsible-panel");
  });

  it("merges a caller's className on the panel with its own class and marks its state", () => {
    render(
      <Collapsible
        trigger="Toggle"
        defaultOpen
        PanelProps={{
          className: "caller",
        }}
      >
        Content
      </Collapsible>,
    );
    expect(getPanel()).toHaveClass(styles["collapsible-panel"], "caller");
    expect(getPanel()).toHaveAttribute("data-open");
  });

  // ============================================
  // INSTANT
  // ============================================

  it("animates by default, leaving data-instant off the panel", () => {
    render(
      <Collapsible trigger="Toggle" defaultOpen>
        Content
      </Collapsible>,
    );
    expect(getPanel()).not.toHaveAttribute("data-instant");
  });

  it("marks the panel instant when instant is set", () => {
    render(
      <Collapsible trigger="Toggle" instant defaultOpen>
        Content
      </Collapsible>,
    );
    expect(getPanel()).toHaveAttribute("data-instant", "");
  });

  // ============================================
  // ORIENTATION
  // ============================================

  it("is vertical by default", () => {
    render(
      <Collapsible trigger="Toggle" defaultOpen>
        Content
      </Collapsible>,
    );
    const panel = getPanel();
    // Only a horizontal panel names its orientation, so a vertical one can't
    // be mistaken for the vertical ancestor of something inside it.
    expect(panel).not.toHaveAttribute("data-orientation");
    // A Stack's `ay` is its main axis, which Box writes as `ax`.
    expect(panel).toHaveAttribute("data-ui-ax", "end");
    expect(panel).toHaveAttribute("data-ui-minh", "0");
    expect(panel).not.toHaveAttribute("data-ui-ay");
    expect(panel).not.toHaveAttribute("data-ui-minw");
  });

  it("pins and shrinks a horizontal panel along its width instead", () => {
    render(
      <CollapsibleRoot defaultOpen>
        <CollapsiblePanel orientation="horizontal">Content</CollapsiblePanel>
      </CollapsibleRoot>,
    );
    const panel = getPanel();
    expect(panel).toHaveAttribute("data-orientation", "horizontal");
    // A Stack's `ax` is its cross axis, which Box writes as `ay`.
    expect(panel).toHaveAttribute("data-ui-ay", "end");
    expect(panel).toHaveAttribute("data-ui-minw", "0");
    expect(panel).not.toHaveAttribute("data-ui-ax");
    expect(panel).not.toHaveAttribute("data-ui-minh");
  });

  it("lets a horizontal panel override its default alignment and minimum", () => {
    render(
      <CollapsibleRoot defaultOpen>
        <CollapsiblePanel orientation="horizontal" ax="start" minw={40}>
          Content
        </CollapsiblePanel>
      </CollapsibleRoot>,
    );
    expect(getPanel()).toHaveAttribute("data-ui-ay", "start");
    expect(getPanel()).toHaveAttribute("data-ui-minw", "40");
  });

  it("takes orientation through PanelProps", () => {
    render(
      <Collapsible
        trigger="Toggle"
        defaultOpen
        PanelProps={{ orientation: "horizontal" }}
      >
        Content
      </Collapsible>,
    );
    const panel = getPanel();
    expect(panel).toHaveAttribute("data-orientation", "horizontal");
    expect(panel).toHaveAttribute("data-ui-ay", "end");
    expect(panel).toHaveAttribute("data-ui-minw", "0");
    expect(panel).not.toHaveAttribute("data-ui-ax");
    expect(panel).not.toHaveAttribute("data-ui-minh");
  });

  it("animates and clips a horizontal panel's width", () => {
    // The horizontal rule alone, up to the comment that opens the next one.
    const start = css.indexOf(
      '.collapsible-panel[data-orientation="horizontal"]',
    );
    const horizontal = css.slice(start, css.indexOf("/*", start));
    expect(horizontal).toMatch(/width: var\(--collapsible-panel-width\);/);
    // Frees the height the base rule pins to the panel's measured height.
    expect(horizontal).toMatch(
      /width: var\(--collapsible-panel-width\);\s*height: auto;/,
    );
    expect(horizontal).toMatch(/overflow-x: clip;/);
    expect(horizontal).toMatch(/overflow-y: visible;/);
    expect(horizontal).toMatch(
      /&\[data-starting-style\],\s*&\[data-ending-style\] \{\s*width: 0;\s*height: auto;/,
    );
    expect(css).toMatch(
      /&\[data-orientation="horizontal"\] \{\s*transition-property: width;/,
    );
  });

  // ============================================
  // CSS
  // ============================================

  it("marks a closed kept-mounted panel hidden, which the rule below selects", () => {
    render(
      <CollapsibleRoot>
        <CollapsiblePanel keepMounted>Content</CollapsiblePanel>
      </CollapsibleRoot>,
    );
    expect(getPanel()).toHaveAttribute("hidden");
    expect(getPanel()).not.toHaveAttribute("hidden", "until-found");
    expect(getPanel()).toHaveStyle({ display: "none" });
  });

  it("leaves an open kept-mounted panel on screen", () => {
    render(
      <CollapsibleRoot defaultOpen>
        <CollapsiblePanel keepMounted>Content</CollapsiblePanel>
      </CollapsibleRoot>,
    );
    expect(getPanel()).not.toHaveAttribute("hidden");
    expect(getPanel()).not.toHaveStyle({ display: "none" });
  });

  it("hides a kept-mounted panel once it has closed", () => {
    expect(css).toMatch(
      /\.collapsible-panel\[hidden\]:not\(\[hidden="until-found"\]\) \{\s*display: none;/,
    );
  });

  it("clips the panel vertically only, so focus rings and shadows survive", () => {
    expect(css).toMatch(/overflow-x: visible;/);
    expect(css).toMatch(/overflow-y: clip;/);
    expect(css).not.toMatch(/overflow: hidden/);
  });

  it("animates the panel only when motion is allowed", () => {
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: no-preference\) \{\s*\.collapsible-panel \{\s*transition: height /,
    );
  });
});

/* Type-level only: `pnpm typecheck` fails if the directive goes unused. */
describe("className", () => {
  it("takes a string, not a function of the part's state", () => {
    // @ts-expect-error -- style a state through its `data-*` attribute instead
    void (<CollapsiblePanel className={() => "from-fn"} />);
  });
});

/* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
describe("slot props", () => {
  it("rejects a key Collapsible owns in RootProps", () => {
    void (
      <Collapsible
        trigger="Toggle"
        // @ts-expect-error -- `defaultOpen` is set on Collapsible itself
        RootProps={{ defaultOpen: true }}
      />
    );
  });

  it("rejects a key Collapsible owns in TriggerProps", () => {
    void (
      <Collapsible
        trigger="Toggle"
        // @ts-expect-error -- the trigger's content is `trigger`
        TriggerProps={{ children: "Other" }}
      />
    );
  });

  it("rejects a key Collapsible owns in PanelProps", () => {
    void (
      <Collapsible
        trigger="Toggle"
        // @ts-expect-error -- `keepMounted` is set on Collapsible itself
        PanelProps={{ keepMounted: true }}
      />
    );
  });
});
