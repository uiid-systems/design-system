import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "./drawer";

describe("Drawer", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the trigger element", () => {
    render(
      <Drawer trigger={<button>Open drawer</button>}>Drawer content</Drawer>,
    );

    expect(
      screen.getByRole("button", { name: "Open drawer" }),
    ).toBeInTheDocument();
  });

  it("does not show drawer content when closed", () => {
    render(
      <Drawer trigger={<button>Open drawer</button>}>Drawer content</Drawer>,
    );

    expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
  });

  it("shows drawer content when open", () => {
    render(
      <Drawer trigger={<button>Open drawer</button>} open={true}>
        Drawer content
      </Drawer>,
    );

    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  // ============================================
  // CLICK INTERACTION
  // ============================================

  it("opens drawer on trigger click", async () => {
    const user = userEvent.setup();

    const DrawerWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Drawer trigger={<button>Open drawer</button>} open={open} onOpenChange={setOpen}>
          Drawer content
        </Drawer>
      );
    };

    render(<DrawerWrapper />);

    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    await waitFor(() => {
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });
  });

  it("closes drawer when clicking backdrop", async () => {
    const user = userEvent.setup();

    const DrawerWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <Drawer trigger={<button>Open drawer</button>} open={open} onOpenChange={setOpen}>
          Drawer content
        </Drawer>
      );
    };

    render(<DrawerWrapper />);

    const backdrop = document.querySelector('[data-slot="drawer-backdrop"]');
    if (backdrop) {
      await user.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD INTERACTION
  // ============================================

  it("opens drawer with Enter key on trigger", async () => {
    const user = userEvent.setup();

    const DrawerWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Drawer trigger={<button>Open drawer</button>} open={open} onOpenChange={setOpen}>
          Drawer content
        </Drawer>
      );
    };

    render(<DrawerWrapper />);

    screen.getByRole("button", { name: "Open drawer" }).focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });
  });

  it("closes drawer with Escape key", async () => {
    const user = userEvent.setup();

    const DrawerWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <Drawer trigger={<button>Open drawer</button>} open={open} onOpenChange={setOpen}>
          Drawer content
        </Drawer>
      );
    };

    render(<DrawerWrapper />);

    await waitFor(() => {
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CONTROLLED STATE
  // ============================================

  it("calls onOpenChange when opened", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        open={false}
        onOpenChange={handleOpenChange}
      >
        Drawer content
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    expect(handleOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("calls onOpenChange when closed via Escape", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        open={true}
        onOpenChange={handleOpenChange}
      >
        Drawer content
      </Drawer>,
    );

    await user.keyboard("{Escape}");

    expect(handleOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  // ============================================
  // SWIPE DIRECTION
  // ============================================
  // Edge placement is driven by Base UI's `data-swipe-direction` on the popup
  // rather than a variant class — see drawer.module.css.

  it("defaults to the down swipe direction", () => {
    render(
      <Drawer trigger={<button>Open drawer</button>} open={true}>
        Drawer content
      </Drawer>,
    );

    const popup = document.querySelector('[data-slot="drawer-popup"]');
    expect(popup).toHaveAttribute("data-swipe-direction", "down");
  });

  it.each(["up", "down", "left", "right"] as const)(
    "reflects the %s swipe direction on the popup",
    (swipeDirection) => {
      render(
        <Drawer
          trigger={<button>Open drawer</button>}
          open={true}
          swipeDirection={swipeDirection}
        >
          Drawer content
        </Drawer>,
      );

      const popup = document.querySelector('[data-slot="drawer-popup"]');
      expect(popup).toHaveAttribute("data-swipe-direction", swipeDirection);
    },
  );

  // ============================================
  // CONTENT
  // ============================================

  it("renders complex content in drawer", () => {
    render(
      <Drawer trigger={<button>Open drawer</button>} open={true}>
        <div data-testid="complex-content">
          <h2>Drawer Title</h2>
          <p>Drawer description</p>
          <input type="text" placeholder="Enter something" />
          <button>Save</button>
        </div>
      </Drawer>,
    );

    expect(screen.getByTestId("complex-content")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Drawer Title" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("drawer has role dialog", () => {
    render(
      <Drawer trigger={<button>Open drawer</button>} open={true}>
        Drawer content
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("trigger has aria-haspopup attribute", () => {
    render(
      <Drawer trigger={<button>Open drawer</button>}>Drawer content</Drawer>,
    );

    expect(
      screen.getByRole("button", { name: "Open drawer" }),
    ).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("drawer is rendered in a portal", () => {
    const { container } = render(
      <Drawer trigger={<button>Open drawer</button>} open={true}>
        Drawer content
      </Drawer>,
    );

    // Drawer content should not be inside the container (it's portaled)
    const drawerInContainer = container.querySelector('[class*="drawer-popup"]');
    expect(drawerInContainer).toBeNull();

    // But should exist in the document
    expect(document.querySelector('[class*="drawer-popup"]')).toBeInTheDocument();
  });

  // ============================================
  // FOCUS MANAGEMENT
  // ============================================

  it("contains focusable elements when open", () => {
    render(
      <Drawer trigger={<button>Open drawer</button>} open={true}>
        <button>First button</button>
        <button>Second button</button>
      </Drawer>,
    );

    // Drawer should contain focusable elements
    expect(screen.getByRole("button", { name: "First button" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Second button" })).toBeInTheDocument();
  });

  // ============================================
  // SUBCOMPONENT PROPS
  // ============================================

  it("passes PopupProps to popup element", () => {
    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        open={true}
        PopupProps={{ className: "custom-popup" }}
      >
        Drawer content
      </Drawer>,
    );

    const popup = document.querySelector('[class*="drawer-popup"]');
    expect(popup).toHaveClass("custom-popup");
  });

  it("passes BackdropProps to backdrop element", () => {
    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        open={true}
        BackdropProps={{ className: "custom-backdrop" }}
      >
        Drawer content
      </Drawer>,
    );

    const backdrop = document.querySelector('[data-slot="drawer-backdrop"]');
    expect(backdrop).toHaveClass("custom-backdrop");
  });

  it("passes TriggerProps to trigger wrapper", () => {
    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        TriggerProps={{ className: "trigger-wrapper" }}
      >
        Drawer content
      </Drawer>,
    );

    expect(screen.getByRole("button", { name: "Open drawer" })).toHaveClass(
      "trigger-wrapper",
    );
  });
});
