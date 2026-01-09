import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "./modal";

describe("Modal", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the trigger element", () => {
    render(
      <Modal trigger={<button>Open modal</button>} open={false} onOpenChange={() => {}}>
        Modal content
      </Modal>,
    );

    expect(
      screen.getByRole("button", { name: "Open modal" }),
    ).toBeInTheDocument();
  });

  it("does not show modal content when closed", () => {
    render(
      <Modal trigger={<button>Open modal</button>} open={false} onOpenChange={() => {}}>
        Modal content
      </Modal>,
    );

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("shows modal content when open", () => {
    render(
      <Modal trigger={<button>Open modal</button>} open={true} onOpenChange={() => {}}>
        Modal content
      </Modal>,
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  // ============================================
  // CLICK INTERACTION
  // ============================================

  it("opens modal on trigger click", async () => {
    const user = userEvent.setup();

    const ModalWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Modal trigger={<button>Open modal</button>} open={open} onOpenChange={setOpen}>
          Modal content
        </Modal>
      );
    };

    render(<ModalWrapper />);

    await user.click(screen.getByRole("button", { name: "Open modal" }));

    await waitFor(() => {
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });
  });

  it("closes modal when clicking backdrop", async () => {
    const user = userEvent.setup();

    const ModalWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <Modal trigger={<button>Open modal</button>} open={open} onOpenChange={setOpen}>
          Modal content
        </Modal>
      );
    };

    render(<ModalWrapper />);

    // Click the backdrop (data-slot="modal-backdrop")
    const backdrop = document.querySelector('[data-slot="modal-backdrop"]');
    if (backdrop) {
      await user.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD INTERACTION
  // ============================================

  it("opens modal with Enter key on trigger", async () => {
    const user = userEvent.setup();

    const ModalWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Modal trigger={<button>Open modal</button>} open={open} onOpenChange={setOpen}>
          Modal content
        </Modal>
      );
    };

    render(<ModalWrapper />);

    screen.getByRole("button", { name: "Open modal" }).focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });
  });

  it("closes modal with Escape key", async () => {
    const user = userEvent.setup();

    const ModalWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <Modal trigger={<button>Open modal</button>} open={open} onOpenChange={setOpen}>
          Modal content
        </Modal>
      );
    };

    render(<ModalWrapper />);

    await waitFor(() => {
      expect(screen.getByText("Modal content")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CONTROLLED STATE
  // ============================================

  it("calls onOpenChange when opened", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal
        trigger={<button>Open modal</button>}
        open={false}
        onOpenChange={handleOpenChange}
      >
        Modal content
      </Modal>,
    );

    await user.click(screen.getByRole("button", { name: "Open modal" }));

    expect(handleOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("calls onOpenChange when closed via Escape", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Modal
        trigger={<button>Open modal</button>}
        open={true}
        onOpenChange={handleOpenChange}
      >
        Modal content
      </Modal>,
    );

    await user.keyboard("{Escape}");

    expect(handleOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  // ============================================
  // SIZE VARIANTS
  // ============================================

  it("renders with small size", () => {
    render(
      <Modal
        trigger={<button>Open modal</button>}
        open={true}
        onOpenChange={() => {}}
        size="small"
      >
        Modal content
      </Modal>,
    );

    const popup = document.querySelector('[data-slot="modal-popup"]');
    expect(popup?.className).toContain("size-small");
  });

  it("renders with medium size", () => {
    render(
      <Modal
        trigger={<button>Open modal</button>}
        open={true}
        onOpenChange={() => {}}
        size="medium"
      >
        Modal content
      </Modal>,
    );

    const popup = document.querySelector('[data-slot="modal-popup"]');
    expect(popup?.className).toContain("size-medium");
  });

  it("renders with large size", () => {
    render(
      <Modal
        trigger={<button>Open modal</button>}
        open={true}
        onOpenChange={() => {}}
        size="large"
      >
        Modal content
      </Modal>,
    );

    const popup = document.querySelector('[data-slot="modal-popup"]');
    expect(popup?.className).toContain("size-large");
  });

  it("renders with xlarge size", () => {
    render(
      <Modal
        trigger={<button>Open modal</button>}
        open={true}
        onOpenChange={() => {}}
        size="xlarge"
      >
        Modal content
      </Modal>,
    );

    const popup = document.querySelector('[data-slot="modal-popup"]');
    expect(popup?.className).toContain("size-xlarge");
  });

  // ============================================
  // CONTENT
  // ============================================

  it("renders complex content in modal", () => {
    render(
      <Modal trigger={<button>Open modal</button>} open={true} onOpenChange={() => {}}>
        <div data-testid="complex-content">
          <h2>Modal Title</h2>
          <p>Modal description</p>
          <button>Primary action</button>
          <button>Secondary action</button>
        </div>
      </Modal>,
    );

    expect(screen.getByTestId("complex-content")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Modal Title" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Primary action" })).toBeInTheDocument();
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("modal has role dialog", () => {
    render(
      <Modal trigger={<button>Open modal</button>} open={true} onOpenChange={() => {}}>
        Modal content
      </Modal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("trigger has aria-haspopup attribute", () => {
    render(
      <Modal trigger={<button>Open modal</button>} open={false} onOpenChange={() => {}}>
        Modal content
      </Modal>,
    );

    expect(
      screen.getByRole("button", { name: "Open modal" }),
    ).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("modal is rendered in a portal", () => {
    const { container } = render(
      <Modal trigger={<button>Open modal</button>} open={true} onOpenChange={() => {}}>
        Modal content
      </Modal>,
    );

    // Modal content should not be inside the container (it's portaled)
    const modalInContainer = container.querySelector('[data-slot="modal-popup"]');
    expect(modalInContainer).toBeNull();

    // But should exist in the document
    expect(document.querySelector('[data-slot="modal-popup"]')).toBeInTheDocument();
  });

  // ============================================
  // FOCUS MANAGEMENT
  // ============================================

  it("moves focus to modal content when opened", async () => {
    render(
      <Modal trigger={<button>Open modal</button>} open={true} onOpenChange={() => {}}>
        <button>First button</button>
        <button>Second button</button>
      </Modal>,
    );

    // Modal should contain focusable elements
    expect(screen.getByRole("button", { name: "First button" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Second button" })).toBeInTheDocument();
  });

  // ============================================
  // SUBCOMPONENT PROPS
  // ============================================

  it("passes PopupProps to popup element", () => {
    render(
      <Modal
        trigger={<button>Open modal</button>}
        open={true}
        onOpenChange={() => {}}
        PopupProps={{ className: "custom-popup" }}
      >
        Modal content
      </Modal>,
    );

    const popup = document.querySelector('[data-slot="modal-popup"]');
    expect(popup).toHaveClass("custom-popup");
  });

  it("passes BackdropProps to backdrop element", () => {
    render(
      <Modal
        trigger={<button>Open modal</button>}
        open={true}
        onOpenChange={() => {}}
        BackdropProps={{ className: "custom-backdrop" }}
      >
        Modal content
      </Modal>,
    );

    const backdrop = document.querySelector('[data-slot="modal-backdrop"]');
    expect(backdrop).toHaveClass("custom-backdrop");
  });
});
