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
      <Collapsible trigger="Toggle" RootProps={{ defaultOpen: true }}>
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
      <Collapsible trigger="Toggle" RootProps={{ defaultOpen: true }}>
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
          RootProps={{
            open,
            onOpenChange: (next) => {
              onOpenChange(next);
              setOpen(next);
            },
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
      <Collapsible trigger="Toggle" RootProps={{ defaultOpen: true }}>
        Content
      </Collapsible>,
    );
    expect(getPanel()).toHaveAttribute("data-ui-ax", "end");
  });

  it("lets PanelProps override the default alignment", () => {
    render(
      <Collapsible
        trigger="Toggle"
        RootProps={{ defaultOpen: true }}
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

  // ============================================
  // CLASSNAME
  // ============================================

  it("merges a panel className with the panel's own styles", () => {
    render(
      <Collapsible
        trigger="Toggle"
        RootProps={{ defaultOpen: true }}
        PanelProps={{ className: "custom" }}
      >
        Content
      </Collapsible>,
    );
    const panel = getPanel();
    expect(panel).toHaveClass("custom");
    expect(panel?.className).toContain("collapsible-panel");
  });

  it("resolves a state-function className on the panel alongside its own class", () => {
    render(
      <Collapsible
        trigger="Toggle"
        RootProps={{ defaultOpen: true }}
        PanelProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      >
        Content
      </Collapsible>,
    );
    expect(getPanel()).toHaveClass(styles["collapsible-panel"], "fn-open");
  });

  // ============================================
  // INSTANT
  // ============================================

  it("animates by default, leaving data-instant off the panel", () => {
    render(
      <Collapsible trigger="Toggle" RootProps={{ defaultOpen: true }}>
        Content
      </Collapsible>,
    );
    expect(getPanel()).not.toHaveAttribute("data-instant");
  });

  it("marks the panel instant when instant is set", () => {
    render(
      <Collapsible trigger="Toggle" instant RootProps={{ defaultOpen: true }}>
        Content
      </Collapsible>,
    );
    expect(getPanel()).toHaveAttribute("data-instant", "");
  });
});
