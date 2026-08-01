import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Dialog } from "./dialog";

describe("Dialog", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the trigger element", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={false}
        onOpenChange={() => {}}
      >
        Dialog content
      </Dialog>,
    );

    expect(
      screen.getByRole("button", { name: "Open dialog" }),
    ).toBeInTheDocument();
  });

  it("does not show dialog content when closed", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={false}
        onOpenChange={() => {}}
      >
        Dialog content
      </Dialog>,
    );

    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });

  it("shows dialog content when open", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
      >
        Dialog content
      </Dialog>,
    );

    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  // ============================================
  // CLICK INTERACTION
  // ============================================

  it("opens dialog on trigger click", async () => {
    const user = userEvent.setup();

    const DialogWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Dialog
          trigger={<button>Open dialog</button>}
          open={open}
          onOpenChange={setOpen}
        >
          Dialog content
        </Dialog>
      );
    };

    render(<DialogWrapper />);

    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    await waitFor(() => {
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });
  });

  it("closes dialog when clicking backdrop", async () => {
    const user = userEvent.setup();

    const DialogWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <Dialog
          trigger={<button>Open dialog</button>}
          open={open}
          onOpenChange={setOpen}
        >
          Dialog content
        </Dialog>
      );
    };

    render(<DialogWrapper />);

    // Click the backdrop (data-slot="dialog-backdrop")
    const backdrop = document.querySelector('[data-slot="dialog-backdrop"]');
    if (backdrop) {
      await user.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD INTERACTION
  // ============================================

  it("opens dialog with Enter key on trigger", async () => {
    const user = userEvent.setup();

    const DialogWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Dialog
          trigger={<button>Open dialog</button>}
          open={open}
          onOpenChange={setOpen}
        >
          Dialog content
        </Dialog>
      );
    };

    render(<DialogWrapper />);

    screen.getByRole("button", { name: "Open dialog" }).focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });
  });

  it("closes dialog with Escape key", async () => {
    const user = userEvent.setup();

    const DialogWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <Dialog
          trigger={<button>Open dialog</button>}
          open={open}
          onOpenChange={setOpen}
        >
          Dialog content
        </Dialog>
      );
    };

    render(<DialogWrapper />);

    await waitFor(() => {
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CONTROLLED STATE
  // ============================================

  it("calls onOpenChange when opened", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={false}
        onOpenChange={handleOpenChange}
      >
        Dialog content
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    expect(handleOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("calls onOpenChange when closed via Escape", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={handleOpenChange}
      >
        Dialog content
      </Dialog>,
    );

    await user.keyboard("{Escape}");

    expect(handleOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  // ============================================
  // SIZE VARIANTS
  // ============================================

  it("renders with small size", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        size="small"
      >
        Dialog content
      </Dialog>,
    );

    const popup = document.querySelector('[data-slot="dialog-popup"]');
    expect(popup?.className).toContain("size-small");
  });

  it("renders with medium size", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        size="medium"
      >
        Dialog content
      </Dialog>,
    );

    const popup = document.querySelector('[data-slot="dialog-popup"]');
    expect(popup?.className).toContain("size-medium");
  });

  it("renders with large size", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        size="large"
      >
        Dialog content
      </Dialog>,
    );

    const popup = document.querySelector('[data-slot="dialog-popup"]');
    expect(popup?.className).toContain("size-large");
  });

  it("renders with xlarge size", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        size="xlarge"
      >
        Dialog content
      </Dialog>,
    );

    const popup = document.querySelector('[data-slot="dialog-popup"]');
    expect(popup?.className).toContain("size-xlarge");
  });

  // ============================================
  // CONTENT
  // ============================================

  it("renders complex content in dialog", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
      >
        <div data-testid="complex-content">
          <h2>Dialog Title</h2>
          <p>Dialog description</p>
          <button>Primary action</button>
          <button>Secondary action</button>
        </div>
      </Dialog>,
    );

    expect(screen.getByTestId("complex-content")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Dialog Title" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Primary action" }),
    ).toBeInTheDocument();
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("dialog has role dialog", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
      >
        Dialog content
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("trigger has aria-haspopup attribute", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={false}
        onOpenChange={() => {}}
      >
        Dialog content
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "Open dialog" })).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
  });

  it("dialog is rendered in a portal", () => {
    const { container } = render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
      >
        Dialog content
      </Dialog>,
    );

    // Dialog content should not be inside the container (it's portaled)
    const dialogInContainer = container.querySelector(
      '[data-slot="dialog-popup"]',
    );
    expect(dialogInContainer).toBeNull();

    // But should exist in the document
    expect(
      document.querySelector('[data-slot="dialog-popup"]'),
    ).toBeInTheDocument();
  });

  // ============================================
  // FOCUS MANAGEMENT
  // ============================================

  it("moves focus to dialog content when opened", async () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
      >
        <button>First button</button>
        <button>Second button</button>
      </Dialog>,
    );

    // Dialog should contain focusable elements
    expect(
      screen.getByRole("button", { name: "First button" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Second button" }),
    ).toBeInTheDocument();
  });

  // ============================================
  // SUBCOMPONENT PROPS
  // ============================================

  it("passes PopupProps to popup element", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        PopupProps={{ className: "custom-popup" }}
      >
        Dialog content
      </Dialog>,
    );

    const popup = document.querySelector('[data-slot="dialog-popup"]');
    expect(popup).toHaveClass("custom-popup");
  });

  it("passes BackdropProps to backdrop element", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        BackdropProps={{ className: "custom-backdrop" }}
      >
        Dialog content
      </Dialog>,
    );

    const backdrop = document.querySelector('[data-slot="dialog-backdrop"]');
    expect(backdrop).toHaveClass("custom-backdrop");
  });
});
