import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Tooltip } from "./tooltip";

describe("Tooltip", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the trigger element", () => {
    render(
      <Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>,
    );

    expect(screen.getByRole("button", { name: "Hover me" })).toBeInTheDocument();
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

    render(
      <Tooltip trigger={<button>Hover me</button>}>Helpful info</Tooltip>,
    );

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
      expect(
        document.querySelector('[data-slot="tooltip-popup"]'),
      ).toHaveClass("custom-popup");
    });
  });

  it("passes TriggerProps to trigger wrapper", () => {
    render(
      <Tooltip
        trigger={<button>Hover me</button>}
        TriggerProps={{ "data-testid": "trigger-wrapper" }}
      >
        Tooltip content
      </Tooltip>,
    );

    expect(screen.getByTestId("trigger-wrapper")).toBeInTheDocument();
  });
});
