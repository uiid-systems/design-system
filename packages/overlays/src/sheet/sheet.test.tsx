import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Sheet } from "./sheet";

describe("Sheet", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the trigger element", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>}>Sheet content</Sheet>,
    );

    expect(
      screen.getByRole("button", { name: "Open sheet" }),
    ).toBeInTheDocument();
  });

  it("does not show sheet content when closed", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>}>Sheet content</Sheet>,
    );

    expect(screen.queryByText("Sheet content")).not.toBeInTheDocument();
  });

  it("shows sheet content when open", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} open={true}>
        Sheet content
      </Sheet>,
    );

    expect(screen.getByText("Sheet content")).toBeInTheDocument();
  });

  // ============================================
  // CLICK INTERACTION
  // ============================================

  it("opens sheet on trigger click", async () => {
    const user = userEvent.setup();

    const SheetWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Sheet trigger={<button>Open sheet</button>} open={open} onOpenChange={setOpen}>
          Sheet content
        </Sheet>
      );
    };

    render(<SheetWrapper />);

    await user.click(screen.getByRole("button", { name: "Open sheet" }));

    await waitFor(() => {
      expect(screen.getByText("Sheet content")).toBeInTheDocument();
    });
  });

  it("closes sheet when clicking backdrop", async () => {
    const user = userEvent.setup();

    const SheetWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <Sheet trigger={<button>Open sheet</button>} open={open} onOpenChange={setOpen}>
          Sheet content
        </Sheet>
      );
    };

    render(<SheetWrapper />);

    const backdrop = document.querySelector('[data-slot="sheet-backdrop"]');
    if (backdrop) {
      await user.click(backdrop);
    }

    await waitFor(() => {
      expect(screen.queryByText("Sheet content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD INTERACTION
  // ============================================

  it("opens sheet with Enter key on trigger", async () => {
    const user = userEvent.setup();

    const SheetWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Sheet trigger={<button>Open sheet</button>} open={open} onOpenChange={setOpen}>
          Sheet content
        </Sheet>
      );
    };

    render(<SheetWrapper />);

    screen.getByRole("button", { name: "Open sheet" }).focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Sheet content")).toBeInTheDocument();
    });
  });

  it("closes sheet with Escape key", async () => {
    const user = userEvent.setup();

    const SheetWrapper = () => {
      const [open, setOpen] = useState(true);
      return (
        <Sheet trigger={<button>Open sheet</button>} open={open} onOpenChange={setOpen}>
          Sheet content
        </Sheet>
      );
    };

    render(<SheetWrapper />);

    await waitFor(() => {
      expect(screen.getByText("Sheet content")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByText("Sheet content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CONTROLLED STATE
  // ============================================

  it("calls onOpenChange when opened", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Sheet
        trigger={<button>Open sheet</button>}
        open={false}
        onOpenChange={handleOpenChange}
      >
        Sheet content
      </Sheet>,
    );

    await user.click(screen.getByRole("button", { name: "Open sheet" }));

    expect(handleOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("calls onOpenChange when closed via Escape", async () => {
    const handleOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <Sheet
        trigger={<button>Open sheet</button>}
        open={true}
        onOpenChange={handleOpenChange}
      >
        Sheet content
      </Sheet>,
    );

    await user.keyboard("{Escape}");

    expect(handleOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  // ============================================
  // SIDE VARIANTS
  // ============================================

  it("renders on right side by default", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} open={true}>
        Sheet content
      </Sheet>,
    );

    const popup = document.querySelector('[class*="sheet-popup"]');
    expect(popup?.className).toContain("side-right");
  });

  it("renders on left side", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} open={true} side="left">
        Sheet content
      </Sheet>,
    );

    const popup = document.querySelector('[class*="sheet-popup"]');
    expect(popup?.className).toContain("side-left");
  });

  it("renders on top side", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} open={true} side="top">
        Sheet content
      </Sheet>,
    );

    const popup = document.querySelector('[class*="sheet-popup"]');
    expect(popup?.className).toContain("side-top");
  });

  it("renders on bottom side", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} open={true} side="bottom">
        Sheet content
      </Sheet>,
    );

    const popup = document.querySelector('[class*="sheet-popup"]');
    expect(popup?.className).toContain("side-bottom");
  });

  // ============================================
  // CONTENT
  // ============================================

  it("renders complex content in sheet", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} open={true}>
        <div data-testid="complex-content">
          <h2>Sheet Title</h2>
          <p>Sheet description</p>
          <input type="text" placeholder="Enter something" />
          <button>Save</button>
        </div>
      </Sheet>,
    );

    expect(screen.getByTestId("complex-content")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Sheet Title" })).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("sheet has role dialog", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} open={true}>
        Sheet content
      </Sheet>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("trigger has aria-haspopup attribute", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>}>Sheet content</Sheet>,
    );

    expect(
      screen.getByRole("button", { name: "Open sheet" }),
    ).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("sheet is rendered in a portal", () => {
    const { container } = render(
      <Sheet trigger={<button>Open sheet</button>} open={true}>
        Sheet content
      </Sheet>,
    );

    // Sheet content should not be inside the container (it's portaled)
    const sheetInContainer = container.querySelector('[class*="sheet-popup"]');
    expect(sheetInContainer).toBeNull();

    // But should exist in the document
    expect(document.querySelector('[class*="sheet-popup"]')).toBeInTheDocument();
  });

  // ============================================
  // FOCUS MANAGEMENT
  // ============================================

  it("contains focusable elements when open", () => {
    render(
      <Sheet trigger={<button>Open sheet</button>} open={true}>
        <button>First button</button>
        <button>Second button</button>
      </Sheet>,
    );

    // Sheet should contain focusable elements
    expect(screen.getByRole("button", { name: "First button" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Second button" })).toBeInTheDocument();
  });

  // ============================================
  // SUBCOMPONENT PROPS
  // ============================================

  it("passes PopupProps to popup element", () => {
    render(
      <Sheet
        trigger={<button>Open sheet</button>}
        open={true}
        PopupProps={{ className: "custom-popup" }}
      >
        Sheet content
      </Sheet>,
    );

    const popup = document.querySelector('[class*="sheet-popup"]');
    expect(popup).toHaveClass("custom-popup");
  });

  it("passes BackdropProps to backdrop element", () => {
    render(
      <Sheet
        trigger={<button>Open sheet</button>}
        open={true}
        BackdropProps={{ className: "custom-backdrop" }}
      >
        Sheet content
      </Sheet>,
    );

    const backdrop = document.querySelector('[data-slot="sheet-backdrop"]');
    expect(backdrop).toHaveClass("custom-backdrop");
  });

  it("passes TriggerProps to trigger wrapper", () => {
    render(
      <Sheet
        trigger={<button>Open sheet</button>}
        TriggerProps={{ className: "trigger-wrapper" }}
      >
        Sheet content
      </Sheet>,
    );

    expect(screen.getByRole("button", { name: "Open sheet" })).toHaveClass(
      "trigger-wrapper",
    );
  });
});
