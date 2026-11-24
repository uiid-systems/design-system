import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { TooltipProvider } from "./subcomponents";
import { Tooltip } from "./tooltip";
import type { TooltipProps } from "./tooltip.types";

import styles from "./tooltip.module.css";

describe("Tooltip", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the trigger element", () => {
    render(
      <Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>,
    );

    expect(
      screen.getByRole("button", { name: "Hover me" }),
    ).toBeInTheDocument();
  });

  it("does not show tooltip content initially", () => {
    render(
      <Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>,
    );

    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("renders the popup in a portal, outside the trigger's container", () => {
    const { container } = render(
      <Tooltip trigger={<button>Hover me</button>} open>
        Tooltip content
      </Tooltip>,
    );

    const popup = document.querySelector('[data-slot="tooltip-popup"]');
    expect(popup).toBeInTheDocument();
    expect(container).not.toContainElement(popup as HTMLElement);
  });

  it("sets the content in a size -1 Text span", () => {
    render(
      <Tooltip trigger={<button>Hover me</button>} open>
        Tooltip content
      </Tooltip>,
    );

    const content = screen.getByText("Tooltip content");
    expect(content.tagName).toBe("SPAN");
    expect(content).toHaveAttribute("data-ui-size", "-1");
    expect(content.closest('[data-slot="tooltip-popup"]')).not.toBeNull();
  });

  // ============================================
  // HOVER INTERACTION
  // ============================================

  it("waits the 300ms default delay before showing on hover", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>,
    );

    await user.hover(screen.getByRole("button"));
    await new Promise((resolve) => setTimeout(resolve, 150));
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
    expect(await screen.findByText("Tooltip content")).toBeVisible();
  });

  it("shows tooltip on hover", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });
  });

  it("hides tooltip when hover ends", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>,
    );

    const trigger = screen.getByRole("button");
    await user.hover(trigger);

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });

    await user.unhover(trigger);

    await waitFor(() => {
      expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // FOCUS INTERACTION
  // ============================================

  it("shows tooltip on focus", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button>Focus me</button>}>Tooltip content</Tooltip>,
    );

    await user.tab();

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });
  });

  it("hides tooltip on blur", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Tooltip trigger={<button>Focus me</button>}>Tooltip content</Tooltip>
        <button>Other button</button>
      </>,
    );

    await user.tab(); // Focus trigger

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });

    await user.tab(); // Focus other button

    await waitFor(() => {
      expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD INTERACTION
  // ============================================

  it("hides tooltip on Escape key", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CONTENT
  // ============================================

  it("renders complex content in tooltip", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button>Hover me</button>}>
        <div data-testid="complex-content">
          <strong>Title</strong>
          <p>Description</p>
        </div>
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByTestId("complex-content")).toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("tooltip popup has data-slot attribute", async () => {
    const user = userEvent.setup();

    render(<Tooltip trigger={<button>Hover me</button>}>Helpful info</Tooltip>);

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="tooltip-popup"]'),
      ).toBeInTheDocument();
    });
  });

  it("inverts the popup surface through the composes-tooltip composition, not inline styles", async () => {
    const user = userEvent.setup();

    render(<Tooltip trigger={<button>Hover me</button>}>Helpful info</Tooltip>);

    await user.hover(screen.getByRole("button"));

    const popup = await waitFor(() => {
      const el = document.querySelector<HTMLElement>(
        '[data-slot="tooltip-popup"]',
      );
      expect(el).toBeInTheDocument();
      return el!;
    });

    expect(popup.className).toMatch(/composes-tooltip(\s|$)/);
    expect(popup.style.backgroundColor).toBe("");
    expect(popup.style.color).toBe("");
  });

  it("tooltip content is visible when shown", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeVisible();
    });
  });

  // ============================================
  // SUBCOMPONENT PROPS
  // ============================================

  it("passes PositionerProps for positioning", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        PositionerProps={{ side: "bottom", sideOffset: 10 }}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    });
  });

  it("passes PopupProps to popup element", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        PopupProps={{ className: "custom-popup" }}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toHaveClass(
        "custom-popup",
      );
    });
  });

  it("passes TriggerProps to trigger wrapper", () => {
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        TriggerProps={{ className: "trigger-wrapper" }}
      >
        Tooltip content
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Hover me" })).toHaveClass(
      "trigger-wrapper",
    );
  });

  // ============================================
  // CLASSNAME AND STATE
  // ============================================
  // A part's `className` is a string, merged with its own module class. Its
  // state is styled through the `data-*` attributes Base UI sets.

  it("gives a string trigger the shared focus-ring class", () => {
    render(<Tooltip trigger="Hover me">Tooltip content</Tooltip>);

    expect(styles["tooltip-trigger"]).toContain("composes-trigger");
    expect(screen.getByRole("button", { name: "Hover me" })).toHaveClass(
      styles["tooltip-trigger"],
    );
  });

  it("merges a consumer className on the trigger with its own class", () => {
    render(
      <Tooltip
        trigger="Hover me"
        TriggerProps={{ className: "custom-trigger" }}
      >
        Tooltip content
      </Tooltip>,
    );

    expect(styles["tooltip-trigger"]).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hover me" })).toHaveClass(
      styles["tooltip-trigger"],
      "custom-trigger",
    );
  });

  it("merges a caller's className on the trigger with its own class and marks its state", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        TriggerProps={{
          className: "caller",
        }}
      >
        Tooltip content
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Hover me" });
    expect(styles["tooltip-trigger"]).toBeTruthy();
    expect(trigger).toHaveClass(styles["tooltip-trigger"], "caller");
    expect(trigger).not.toHaveAttribute("data-popup-open");

    await user.hover(trigger);

    await waitFor(() => {
      expect(trigger).toHaveClass(styles["tooltip-trigger"], "caller");
      expect(trigger).toHaveAttribute("data-popup-open");
    });
  });

  it("merges a caller's className on the positioner with its own class and marks its state", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        PositionerProps={{
          className: "caller",
        }}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      const positioner = document.querySelector(
        '[data-slot="tooltip-positioner"]',
      );
      expect(positioner).toHaveClass(styles["tooltip-positioner"], "caller");
      expect(positioner).toHaveAttribute("data-open");
    });
  });

  it("merges a caller's className on the popup with its own class and marks its state", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        PopupProps={{
          className: "caller",
        }}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      const popup = document.querySelector('[data-slot="tooltip-popup"]');
      expect(popup).toHaveClass(styles["tooltip-popup"], "caller");
      expect(popup).toHaveAttribute("data-open");
    });
  });

  // ============================================
  // TRIGGERS
  // ============================================

  it("wraps a string trigger in a focusable span that opens on focus", async () => {
    const user = userEvent.setup();
    render(<Tooltip trigger="Details">Tooltip content</Tooltip>);

    const trigger = screen.getByRole("button", { name: "Details" });
    expect(trigger.tagName).toBe("SPAN");

    await user.tab();
    expect(trigger).toHaveFocus();
    expect(await screen.findByText("Tooltip content")).toBeInTheDocument();
  });

  it("makes a function trigger focusable and passes it the trigger state", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip trigger={({ open }) => (open ? "Open" : "Closed")}>
        Tooltip content
      </Tooltip>,
    );

    const trigger = screen.getByRole("button", { name: "Closed" });
    expect(trigger).toHaveAttribute("tabindex", "0");

    await user.hover(trigger);
    expect(
      await screen.findByRole("button", { name: "Open" }),
    ).toBeInTheDocument();
  });

  it("keeps a string trigger when TriggerProps sets render to undefined", () => {
    render(
      <Tooltip trigger="Details" TriggerProps={{ render: undefined }}>
        Tooltip content
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Details" }).tagName).toBe(
      "SPAN",
    );
  });

  it("renders no trigger for an empty trigger", () => {
    render(<Tooltip trigger={false}>Tooltip content</Tooltip>);

    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="tooltip-trigger"]'),
    ).not.toBeInTheDocument();
  });

  // React drops a boolean on an unknown DOM attribute, so only its warning shows the leak.
  it("doesn't forward nativeButton to an element trigger", () => {
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Tooltip trigger={<span>Hover me</span>}>Tooltip content</Tooltip>);

    expect(screen.getByText("Hover me")).toHaveAttribute(
      "data-slot",
      "tooltip-trigger",
    );
    expect(consoleError.mock.calls.flat().join(" ")).not.toMatch(
      /nativeButton/i,
    );
    consoleError.mockRestore();
  });

  // ============================================
  // ROOT AND CONTROLLED STATE
  // ============================================

  it("doesn't open when RootProps disables it", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        RootProps={{ disabled: true }}
        delay={0}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("follows a controlled open and reports hover through onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Tooltip
        trigger={<button>Hover me</button>}
        open={false}
        onOpenChange={onOpenChange}
        delay={0}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));
    // Well under the 300ms default, so `delay` reached the trigger.
    await waitFor(
      () => {
        expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
      },
      { timeout: 100 },
    );
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();

    rerender(
      <Tooltip
        trigger={<button>Hover me</button>}
        open
        onOpenChange={onOpenChange}
      >
        Tooltip content
      </Tooltip>,
    );
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });

  it("calls RootProps.onOpenChange alongside onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const rootOnOpenChange = vi.fn();
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        onOpenChange={onOpenChange}
        RootProps={{ onOpenChange: rootOnOpenChange }}
        delay={0}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(rootOnOpenChange).toHaveBeenCalledWith(true, expect.anything());
    });
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("lets RootProps.onOpenChange cancel an open", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const rootOnOpenChange = vi.fn((_, details) => details.cancel());
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        onOpenChange={onOpenChange}
        RootProps={{ onOpenChange: rootOnOpenChange }}
        delay={0}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(rootOnOpenChange).toHaveBeenCalled();
    });
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  // ============================================
  // POSITIONING
  // ============================================

  it("forwards PositionerProps side and align to Base UI", () => {
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        open
        PositionerProps={{ side: "bottom", align: "start" }}
      >
        Tooltip content
      </Tooltip>,
    );

    const positioner = document.querySelector(
      '[data-slot="tooltip-positioner"]',
    );
    expect(positioner).toHaveAttribute("data-side", "bottom");
    expect(positioner).toHaveAttribute("data-align", "start");
  });

  it("keeps its default offsets when PositionerProps sets only a side", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        PositionerProps={{ side: "bottom" }}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));
    await screen.findByText("Tooltip content");

    const positioner = document.querySelector<HTMLElement>(
      '[data-slot="tooltip-positioner"]',
    );
    expect(positioner).toHaveAttribute("data-side", "bottom");
    // Base UI offsets the floating element by sideOffset from the trigger.
    expect(positioner?.style.transform || positioner?.style.top).toMatch(/8px/);
  });

  // ============================================
  // GROUPING
  // ============================================

  it("opens a neighbour instantly inside a shared TooltipProvider", async () => {
    const user = userEvent.setup();
    render(
      <TooltipProvider delay={500}>
        <Tooltip trigger={<button>First</button>}>First tip</Tooltip>
        <Tooltip trigger={<button>Second</button>}>Second tip</Tooltip>
      </TooltipProvider>,
    );

    await user.hover(screen.getByRole("button", { name: "First" }));
    expect(
      await screen.findByText("First tip", {}, { timeout: 2000 }),
    ).toBeInTheDocument();

    await user.unhover(screen.getByRole("button", { name: "First" }));
    await user.hover(screen.getByRole("button", { name: "Second" }));

    // Well under the provider's 500ms delay: the group skips it.
    expect(
      await screen.findByText("Second tip", {}, { timeout: 150 }),
    ).toBeInTheDocument();
  });
});

describe("Tooltip top-level root props", () => {
  it("opens on mount with defaultOpen", () => {
    render(
      <Tooltip trigger={<button>Hover me</button>} defaultOpen>
        Tooltip content
      </Tooltip>,
    );

    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });
});

describe("Tooltip RootProps precedence", () => {
  it("lets a top-level prop win over the same key in RootProps", () => {
    render(
      <Tooltip
        trigger={<button>Open</button>}
        defaultOpen={false}
        RootProps={{ defaultOpen: true }}
      >
        Tooltip content
      </Tooltip>,
    );
    expect(screen.queryByText("Tooltip content")).not.toBeInTheDocument();
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    render(
      <Tooltip
        trigger={<button>Open</button>}
        RootProps={{ defaultOpen: true }}
      >
        Tooltip content
      </Tooltip>,
    );
    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
  });
});

describe("Tooltip slot precedence", () => {
  // Untyped on purpose: the types reject these keys, so this pins what a
  // caller without the types gets.
  const untyped = <T,>(slot: Record<string, unknown>) => slot as T;

  it("lets a top-level delay win over TriggerProps.delay", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        delay={0}
        TriggerProps={untyped<TooltipProps["TriggerProps"]>({ delay: 5000 })}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));
    // Far under the slot's 5000ms, so the top-level `delay` reached the trigger.
    expect(
      await screen.findByText("Tooltip content", undefined, { timeout: 100 }),
    ).toBeInTheDocument();
  });

  it("still applies TriggerProps.delay when the top level leaves it unset", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        TriggerProps={untyped<TooltipProps["TriggerProps"]>({ delay: 0 })}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));
    // Well under the 300ms default, so the slot's `delay` reached the trigger.
    expect(
      await screen.findByText("Tooltip content", undefined, { timeout: 100 }),
    ).toBeInTheDocument();
  });

  it("renders trigger, not TriggerProps.children, as the trigger's content", () => {
    render(
      <Tooltip
        trigger="Details"
        TriggerProps={untyped<TooltipProps["TriggerProps"]>({
          children: "Slot content",
        })}
      >
        Tooltip content
      </Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Details" })).toBeInTheDocument();
    expect(screen.queryByText("Slot content")).not.toBeInTheDocument();
  });

  it("renders children, not PopupProps.children, in the popup", () => {
    render(
      <Tooltip
        trigger="Details"
        open
        PopupProps={untyped<TooltipProps["PopupProps"]>({
          children: "Slot content",
        })}
      >
        Tooltip content
      </Tooltip>,
    );

    expect(screen.getByText("Tooltip content")).toBeInTheDocument();
    expect(screen.queryByText("Slot content")).not.toBeInTheDocument();
  });
});

/* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
describe("Tooltip slot props", () => {
  it("rejects the keys Tooltip owns in TriggerProps", () => {
    void (
      <>
        <Tooltip
          trigger="Details"
          // @ts-expect-error -- the trigger's content is `trigger`
          TriggerProps={{ children: "Other" }}
        />
        <Tooltip
          trigger="Details"
          // @ts-expect-error -- `delay` is set on Tooltip itself
          TriggerProps={{ delay: 0 }}
        />
      </>
    );
  });

  it("rejects the key Tooltip owns in PopupProps", () => {
    void (
      <Tooltip
        trigger="Details"
        // @ts-expect-error -- the popup's content is Tooltip's `children`
        PopupProps={{ children: "Other" }}
      />
    );
  });
});
