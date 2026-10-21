import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { TooltipProvider } from "./subcomponents";
import { Tooltip } from "./tooltip";

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
  // STATE-FUNCTION CLASSNAME
  // ============================================
  // Base UI accepts `className` as a function of the part's state. Each part
  // must hand the caller's function that state and keep its own module class.

  it("resolves a state-function className on the positioner alongside its own class", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        PositionerProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="tooltip-positioner"]'),
      ).toHaveClass(styles["tooltip-positioner"], "fn-open");
    });
  });

  it("resolves a state-function className on the popup alongside its own class", async () => {
    const user = userEvent.setup();

    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        PopupProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      >
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole("button"));

    await waitFor(() => {
      expect(document.querySelector('[data-slot="tooltip-popup"]')).toHaveClass(
        styles["tooltip-popup"],
        "fn-open",
      );
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
  // POSITIONING
  // ============================================

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
