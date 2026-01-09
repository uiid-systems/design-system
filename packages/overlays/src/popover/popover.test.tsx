import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Popover } from "./popover";

describe("Popover", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the trigger element", () => {
    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    expect(
      screen.getByRole("button", { name: "Open popover" }),
    ).toBeInTheDocument();
  });

  it("does not show popover content initially", () => {
    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
  });

  // ============================================
  // CLICK INTERACTION
  // ============================================

  it("opens popover on trigger click", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });
  });

  it("closes popover when clicking trigger again", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Open popover" });

    await user.click(trigger);
    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });

    await user.click(trigger);
    await waitFor(() => {
      expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
    });
  });

  it("closes popover when clicking outside", async () => {
    const user = userEvent.setup();

    render(
      <>
        <Popover trigger={<button>Open popover</button>}>
          Popover content
        </Popover>
        <button>Outside button</button>
      </>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: "Outside button" }));
    await waitFor(() => {
      expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // KEYBOARD INTERACTION
  // ============================================

  it("opens popover with Enter key", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    screen.getByRole("button", { name: "Open popover" }).focus();
    await user.keyboard("{Enter}");

    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });
  });

  it("opens popover with Space key", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    screen.getByRole("button", { name: "Open popover" }).focus();
    await user.keyboard(" ");

    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });
  });

  it("closes popover with Escape key", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // CONTROLLED STATE
  // ============================================

  it("supports controlled open state", async () => {
    const handleOpenChange = vi.fn();

    const ControlledPopover = () => {
      const [open, setOpen] = useState(false);
      return (
        <Popover
          trigger={<button>Open popover</button>}
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            handleOpenChange(value);
          }}
        >
          Popover content
        </Popover>
      );
    };

    const user = userEvent.setup();
    render(<ControlledPopover />);

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });
  });

  it("can be opened programmatically via controlled state", () => {
    render(
      <Popover trigger={<button>Open popover</button>} open={true}>
        Popover content
      </Popover>,
    );

    expect(screen.getByText("Popover content")).toBeInTheDocument();
  });

  // ============================================
  // CONTENT
  // ============================================

  it("renders complex content in popover", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Open popover</button>}>
        <div data-testid="complex-content">
          <h3>Popover Title</h3>
          <p>Some description text</p>
          <button>Action button</button>
        </div>
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    await waitFor(() => {
      expect(screen.getByTestId("complex-content")).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Action button" }),
      ).toBeInTheDocument();
    });
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("trigger has aria-expanded attribute", async () => {
    const user = userEvent.setup();

    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Open popover" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await user.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveAttribute("aria-expanded", "true");
    });
  });

  it("trigger has aria-haspopup attribute", () => {
    render(
      <Popover trigger={<button>Open popover</button>}>
        Popover content
      </Popover>,
    );

    expect(
      screen.getByRole("button", { name: "Open popover" }),
    ).toHaveAttribute("aria-haspopup", "dialog");
  });

  // ============================================
  // SUBCOMPONENT PROPS
  // ============================================

  it("passes PositionerProps for positioning", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button>Open popover</button>}
        PositionerProps={{ side: "bottom", sideOffset: 10 }}
      >
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    await waitFor(() => {
      expect(screen.getByText("Popover content")).toBeInTheDocument();
    });
  });

  it("passes PopupProps to popup element", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button>Open popover</button>}
        PopupProps={{ className: "custom-popup" }}
      >
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    await waitFor(() => {
      const popup = screen.getByText("Popover content").closest("[data-slot]");
      expect(popup).toHaveClass("custom-popup");
    });
  });

  it("passes TriggerProps to trigger wrapper", () => {
    render(
      <Popover
        trigger={<button>Open popover</button>}
        TriggerProps={{ "data-testid": "trigger-wrapper" }}
      >
        Popover content
      </Popover>,
    );

    expect(screen.getByTestId("trigger-wrapper")).toBeInTheDocument();
  });
});
