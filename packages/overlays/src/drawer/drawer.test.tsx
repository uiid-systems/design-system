import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, it, expect, vi } from "vitest";

import { Drawer } from "./drawer";
import { Footer, SwipeArea } from "./drawer.examples";
import { DrawerClose, DrawerRoot, DrawerSwipeArea } from "./subcomponents";

import styles from "./drawer.module.css";
import css from "./drawer.module.css?raw";

/* Stand-ins for `Button` and `Text`: a component that renders a real <button>
   and one that renders a <span>. */
const ButtonLike = (props: React.ComponentProps<"button">) => (
  <button type="button" {...props} />
);
const TextLike = (props: React.ComponentProps<"span">) => <span {...props} />;

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
  // NO TRIGGER
  // ============================================
  // A controlled drawer opened from elsewhere has no trigger of its own, and
  // nothing may stand in for one: not even an empty focusable span.

  it("renders no trigger element when none is given", () => {
    const { container } = render(
      <Drawer open={false} onOpenChange={() => {}}>
        Drawer content
      </Drawer>,
    );

    // The trigger renders inline, never in the portal, so the container is the
    // whole place to look; the popup is unmounted while closed anyway.
    expect(container.querySelector('[data-slot="drawer-trigger"]')).toBeNull();
    expect(container.querySelector("[tabindex], [role]")).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders no trigger element for a conditional that came out false", () => {
    const { container } = render(
      <Drawer trigger={false} open={false} onOpenChange={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(container.querySelector('[data-slot="drawer-trigger"]')).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens when controlled without a trigger", () => {
    render(
      <Drawer open={true} onOpenChange={() => {}}>
        Drawer content
      </Drawer>,
    );

    expect(screen.getByRole("dialog")).toHaveTextContent("Drawer content");
  });

  it("renders a trigger from TriggerProps.render without a trigger prop", () => {
    render(
      <Drawer TriggerProps={{ render: <button>Open drawer</button> }}>
        Drawer content
      </Drawer>,
    );

    expect(screen.getByRole("button", { name: "Open drawer" })).toHaveAttribute(
      "data-slot",
      "drawer-trigger",
    );
  });

  // ============================================
  // CLICK INTERACTION
  // ============================================

  it("opens drawer on trigger click", async () => {
    const user = userEvent.setup();

    const DrawerWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Drawer
          trigger={<button>Open drawer</button>}
          open={open}
          onOpenChange={setOpen}
        >
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
        <Drawer
          trigger={<button>Open drawer</button>}
          open={open}
          onOpenChange={setOpen}
        >
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
  // TRIGGER
  // ============================================

  it("gives a non-button intrinsic trigger button semantics", async () => {
    const user = userEvent.setup();
    render(<Drawer trigger={<span>Open</span>}>Drawer content</Drawer>);

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Drawer content")).toBeInTheDocument();
  });

  it("keeps a component trigger native by default", async () => {
    const user = userEvent.setup();
    render(
      <Drawer trigger={<ButtonLike>Open</ButtonLike>}>Drawer content</Drawer>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).not.toHaveAttribute("role");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Drawer content")).toBeInTheDocument();
  });

  it("lets a non-button component opt out with nativeButton={false}", async () => {
    const user = userEvent.setup();
    render(
      <Drawer
        trigger={<TextLike>Open</TextLike>}
        TriggerProps={{ nativeButton: false }}
      >
        Drawer content
      </Drawer>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard(" ");
    expect(await screen.findByText("Drawer content")).toBeInTheDocument();
  });

  it("passes the trigger state to a function trigger", async () => {
    const user = userEvent.setup();
    render(
      <Drawer
        trigger={({ open }) => <TextLike>{open ? "Hide" : "Show"}</TextLike>}
      >
        Drawer content
      </Drawer>,
    );

    const trigger = screen.getByRole("button", { name: "Show" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Drawer content")).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Hide");
  });

  // ============================================
  // KEYBOARD INTERACTION
  // ============================================

  it("opens drawer with Enter key on trigger", async () => {
    const user = userEvent.setup();

    const DrawerWrapper = () => {
      const [open, setOpen] = useState(false);
      return (
        <Drawer
          trigger={<button>Open drawer</button>}
          open={open}
          onOpenChange={setOpen}
        >
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
        <Drawer
          trigger={<button>Open drawer</button>}
          open={open}
          onOpenChange={setOpen}
        >
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
  // CLOSE BUTTON
  // ============================================

  it("renders an icon-only ghost close button named Close in the header", () => {
    render(
      <Drawer open={true} onOpenChange={() => {}} title="Title">
        Drawer content
      </Drawer>,
    );

    const close = screen.getByRole("button", { name: "Close" });
    expect(close).toHaveAttribute("data-slot", "drawer-close-button");
    expect(close).toHaveAttribute("type", "button");
    expect(close.closest('[data-slot="card-action"]')).toBeInTheDocument();
    expect(close.className).toMatch(/variant-ghost/);
    expect(close.className).toMatch(/shape-square/);
    expect(close.querySelector("svg")).toBeInTheDocument();
  });

  it("closes an uncontrolled drawer from the close button", async () => {
    const user = userEvent.setup();
    render(
      <Drawer trigger={<button>Open drawer</button>} title="Title">
        Drawer content
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await user.click(await screen.findByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
    });
  });

  it("calls onOpenChange with false from the close button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Drawer open={true} onOpenChange={onOpenChange} title="Title">
        Drawer content
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it("places the close button after the caller's action", () => {
    render(
      <Drawer
        open={true}
        onOpenChange={() => {}}
        title="Title"
        action={<button>Action</button>}
      >
        Drawer content
      </Drawer>,
    );

    const slot = document.querySelector('[data-slot="card-action"]');
    const buttons = within(slot as HTMLElement).getAllByRole("button");
    expect(
      buttons.map(
        (button) => button.textContent || button.getAttribute("aria-label"),
      ),
    ).toEqual(["Action", "Close"]);
  });

  it("leaves the close button out with hideCloseButton", () => {
    render(
      <Drawer
        open={true}
        onOpenChange={() => {}}
        title="Title"
        action={<button>Action</button>}
        hideCloseButton
      >
        Drawer content
      </Drawer>,
    );

    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  // ============================================
  // CLOSE PART
  // ============================================

  it("renders DrawerClose as a subtle Button", () => {
    render(
      <Drawer
        open={true}
        onOpenChange={() => {}}
        title="Title"
        footer={<DrawerClose>Cancel</DrawerClose>}
      >
        Drawer content
      </Drawer>,
    );

    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toHaveAttribute("data-slot", "drawer-close");
    expect(cancel).toHaveAttribute("type", "button");
    expect(cancel.closest('[data-slot="card-footer"]')).toBeInTheDocument();
    expect(cancel.className).toMatch(/variant-subtle/);
  });

  it("lets DrawerClose take another Button variant", () => {
    render(
      <Drawer
        open={true}
        onOpenChange={() => {}}
        title="Title"
        footer={<DrawerClose variant="ghost">Done</DrawerClose>}
      >
        Drawer content
      </Drawer>,
    );

    const done = screen.getByRole("button", { name: "Done" });
    expect(done.className).toMatch(/variant-ghost/);
    expect(done.className).not.toMatch(/variant-subtle/);
  });

  it("closes an uncontrolled drawer from DrawerClose, after its own onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        title="Title"
        onOpenChange={onOpenChange}
        footer={<DrawerClose onClick={onClick}>Cancel</DrawerClose>}
      >
        Drawer content
      </Drawer>,
    );

    await user.click(screen.getByRole("button", { name: "Open drawer" }));
    await user.click(await screen.findByRole("button", { name: "Cancel" }));

    expect(onClick).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    await waitFor(() => {
      expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // PENDING
  // ============================================
  // A swipe dismiss goes through the same cancelable onOpenChange as Escape;
  // jsdom can't drive the gesture, so it's covered by the Escape case.

  describe("pending", () => {
    const PendingDrawer = ({
      onOpenChange,
    }: {
      onOpenChange: (open: boolean) => void;
    }) => (
      <Drawer
        open={true}
        onOpenChange={onOpenChange}
        pending
        title="Saving"
        footer={<DrawerClose>Cancel</DrawerClose>}
      >
        Drawer content
      </Drawer>
    );

    it("disables the close button and DrawerClose", () => {
      render(<PendingDrawer onOpenChange={() => {}} />);

      expect(
        screen.getByRole("button", { name: "Close" }),
      ).toBeDisabledForUser();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeDisabledForUser();
    });

    it("keeps DrawerClose's own disabled when the drawer isn't pending", () => {
      render(
        <Drawer
          open={true}
          onOpenChange={() => {}}
          footer={
            <>
              <DrawerClose disabled>Cancel</DrawerClose>
              <DrawerClose>Done</DrawerClose>
            </>
          }
        >
          Drawer content
        </Drawer>,
      );

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeDisabledForUser();
      expect(
        screen.getByRole("button", { name: "Done" }),
      ).not.toBeDisabledForUser();
      expect(
        screen.getByRole("button", { name: "Close" }),
      ).not.toBeDisabledForUser();
    });

    it("doesn't call a disabled DrawerClose's onClick or onOpenChange", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const onOpenChange = vi.fn();
      render(
        <Drawer
          open={true}
          onOpenChange={onOpenChange}
          footer={
            <DrawerClose disabled onClick={onClick}>
              Cancel
            </DrawerClose>
          }
        >
          Drawer content
        </Drawer>,
      );

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(onClick).not.toHaveBeenCalled();
      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });

    it.each([
      [
        "Escape",
        async (user: ReturnType<typeof userEvent.setup>) =>
          user.keyboard("{Escape}"),
      ],
      [
        "a backdrop click",
        async (user: ReturnType<typeof userEvent.setup>) => {
          const backdrop = document.querySelector(
            '[data-slot="drawer-backdrop"]',
          );
          if (backdrop) await user.click(backdrop);
        },
      ],
      [
        "the close button",
        async (user: ReturnType<typeof userEvent.setup>) =>
          user.click(screen.getByRole("button", { name: "Close" })),
      ],
      [
        "DrawerClose",
        async (user: ReturnType<typeof userEvent.setup>) =>
          user.click(screen.getByRole("button", { name: "Cancel" })),
      ],
    ])("is not closed by %s", async (_, close) => {
      const user = userEvent.setup({
        pointerEventsCheck: PointerEventsCheckLevel.Never,
      });
      const onOpenChange = vi.fn();
      render(<PendingDrawer onOpenChange={onOpenChange} />);

      await close(user);

      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });

    it("blocks an uncontrolled drawer too", async () => {
      const user = userEvent.setup();
      render(
        <Drawer trigger={<button>Open drawer</button>} pending>
          Drawer content
        </Drawer>,
      );

      await user.click(screen.getByRole("button", { name: "Open drawer" }));
      expect(await screen.findByText("Drawer content")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });

    it("still closes when open turns false", async () => {
      const { rerender } = render(
        <Drawer open={true} onOpenChange={() => {}} pending>
          Drawer content
        </Drawer>,
      );

      rerender(
        <Drawer open={false} onOpenChange={() => {}} pending>
          Drawer content
        </Drawer>,
      );

      await waitFor(() => {
        expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
      });
    });

    it("closes again once pending clears", async () => {
      const user = userEvent.setup();
      const DrawerWrapper = () => {
        const [open, setOpen] = useState(true);
        const [pending, setPending] = useState(true);
        return (
          <Drawer
            open={open}
            onOpenChange={setOpen}
            pending={pending}
            action={<button onClick={() => setPending(false)}>Finish</button>}
            footer={<DrawerClose>Cancel</DrawerClose>}
          >
            Drawer content
          </Drawer>
        );
      };
      render(<DrawerWrapper />);

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeDisabledForUser();
      await user.click(screen.getByRole("button", { name: "Finish" }));
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).not.toBeDisabledForUser();

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
      });
    });

    it("calls RootProps.onOpenChange alongside onOpenChange", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const rootOnOpenChange = vi.fn();
      render(
        <Drawer
          open={true}
          onOpenChange={onOpenChange}
          RootProps={{ onOpenChange: rootOnOpenChange }}
        >
          Drawer content
        </Drawer>,
      );

      await user.keyboard("{Escape}");

      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
      expect(rootOnOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it("lets RootProps.onOpenChange cancel a controlled close", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Drawer
          open={true}
          onOpenChange={onOpenChange}
          RootProps={{ onOpenChange: (_, details) => details.cancel() }}
        >
          Drawer content
        </Drawer>,
      );

      await user.keyboard("{Escape}");

      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.getByText("Drawer content")).toBeInTheDocument();
    });
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
    expect(
      screen.getByRole("heading", { name: "Drawer Title" }),
    ).toBeInTheDocument();
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

    expect(screen.getByRole("button", { name: "Open drawer" })).toHaveAttribute(
      "aria-haspopup",
      "dialog",
    );
  });

  it("drawer is rendered in a portal", () => {
    const { container } = render(
      <Drawer trigger={<button>Open drawer</button>} open={true}>
        Drawer content
      </Drawer>,
    );

    // Drawer content should not be inside the container (it's portaled)
    const drawerInContainer = container.querySelector(
      '[class*="drawer-popup"]',
    );
    expect(drawerInContainer).toBeNull();

    // But should exist in the document
    expect(
      document.querySelector('[class*="drawer-popup"]'),
    ).toBeInTheDocument();
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

  // ============================================
  // CLASSNAME AND STATE
  // ============================================
  // A part's `className` is a string, merged with its own module class. Its
  // state is styled through the `data-*` attributes Base UI sets.

  it("merges a caller's className on the trigger with its own class and marks its state", async () => {
    const user = userEvent.setup();

    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        TriggerProps={{
          className: "caller",
        }}
      >
        Drawer content
      </Drawer>,
    );

    const trigger = document.querySelector('[data-slot="drawer-trigger"]');
    expect(styles["drawer-trigger"]).toContain("composes-trigger");
    expect(trigger).toHaveClass(styles["drawer-trigger"], "caller");
    expect(trigger).not.toHaveAttribute("data-popup-open");

    await user.click(screen.getByRole("button", { name: "Open drawer" }));

    await waitFor(() => {
      expect(trigger).toHaveClass(styles["drawer-trigger"], "caller");
      expect(trigger).toHaveAttribute("data-popup-open");
    });
  });

  it("merges a caller's className on the backdrop with its own class and marks its state", () => {
    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        open={true}
        BackdropProps={{
          className: "caller",
        }}
      >
        Drawer content
      </Drawer>,
    );

    const backdrop = document.querySelector('[data-slot="drawer-backdrop"]');
    expect(backdrop).toHaveClass(styles["drawer-backdrop"], "caller");
    expect(backdrop).toHaveAttribute("data-open");
  });

  it("merges a caller's className on the viewport with its own class and marks its state", () => {
    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        open={true}
        ViewportProps={{
          className: "caller",
        }}
      >
        Drawer content
      </Drawer>,
    );

    const viewport = document.querySelector('[data-slot="drawer-viewport"]');
    expect(viewport).toHaveClass(styles["drawer-viewport"], "caller");
    expect(viewport).toHaveAttribute("data-open");
  });

  it("merges a caller's className on the popup with its own class and marks its state", () => {
    render(
      <Drawer
        trigger={<button>Open drawer</button>}
        open={true}
        PopupProps={{
          className: "caller",
        }}
      >
        Drawer content
      </Drawer>,
    );

    const popup = document.querySelector('[data-slot="drawer-popup"]');
    expect(popup).toHaveClass(styles["drawer-popup"], "caller");
    expect(popup).toHaveAttribute("data-open");
  });

  it.each(["Cancel", "Save"])(
    "closes from the Footer example's %s button",
    async (name) => {
      const user = userEvent.setup();
      render(<Footer />);

      await user.click(
        screen.getByRole("button", { name: "Edit preferences" }),
      );
      await user.click(await screen.findByRole("button", { name }));
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
      );
    },
  );

  // ============================================
  // SCROLLING BODY
  // ============================================
  // A panel caps its height at the viewport, so a long body scrolls inside it
  // while the header and footer stay in view, as Dialog's does. The test DOM
  // has no layout; Storybook covers the scrolling itself. These stub the
  // body's scroll and client heights to stand in for an overflowing body.

  describe("scrolling body", () => {
    const stubHeights = (scrollHeight: number, clientHeight: number) => {
      vi.spyOn(HTMLElement.prototype, "scrollHeight", "get").mockReturnValue(
        scrollHeight,
      );
      vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(
        clientHeight,
      );
    };
    const body = () =>
      screen
        .getByRole("dialog")
        .querySelector<HTMLElement>(
          ':scope > [data-slot="card-inner-container"]',
        );

    afterEach(() => {
      vi.restoreAllMocks();
      vi.unstubAllGlobals();
    });

    it("makes the body the scroll container, free to reach the panel's edges", () => {
      render(
        <Drawer open={true} title="Title" footer="Footer">
          Drawer content
        </Drawer>,
      );

      expect(screen.getByRole("dialog")).toHaveClass(
        "composes-popup-scroll-body",
      );
      expect(body()).toHaveTextContent("Drawer content");
      expect(body()).not.toHaveAttribute("data-ui-w");
    });

    it.each(["down", "right"] as const)(
      "makes a long %s drawer's body a tab stop, reached by Tab",
      async (swipeDirection) => {
        stubHeights(1000, 400);
        const user = userEvent.setup();
        render(
          <Drawer open={true} swipeDirection={swipeDirection} title="Terms">
            Long content
          </Drawer>,
        );
        await waitFor(() => expect(body()).toHaveAttribute("tabindex", "0"));
        expect(screen.getByRole("region", { name: "Terms" })).toBe(body());

        screen.getByRole("button", { name: "Close" }).focus();
        await user.tab();
        expect(body()).toHaveFocus();
      },
    );

    it("gives an untitled long body no role, since it has no name", async () => {
      stubHeights(1000, 400);
      render(<Drawer open={true}>Long content</Drawer>);

      await waitFor(() => expect(body()).toHaveAttribute("tabindex", "0"));
      expect(body()).not.toHaveAttribute("role");
    });

    it("leaves a short body out of the tab order", async () => {
      stubHeights(400, 400);
      render(
        <Drawer open={true} title="Terms">
          Short content
        </Drawer>,
      );

      await waitFor(() => expect(body()).toBeInTheDocument());
      expect(body()).not.toHaveAttribute("tabindex");
    });

    // Dropping the tab stop under focus would send focus to the document, so
    // a focused body keeps it until focus leaves. ResizeObserver is captured
    // so the test can report the resize happy-dom never would.
    it("keeps a focused body's tab stop when it stops overflowing, until blur", async () => {
      const resizes: (() => void)[] = [];
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(callback: () => void) {
            resizes.push(callback);
          }
          observe() {}
          disconnect() {}
        },
      );
      stubHeights(1000, 400);
      render(
        <Drawer open={true} title="Terms">
          Long content
        </Drawer>,
      );
      await waitFor(() => expect(body()).toHaveAttribute("tabindex", "0"));
      body()!.focus();

      stubHeights(400, 400);
      act(() => resizes.forEach((resize) => resize()));
      expect(body()).toHaveAttribute("tabindex", "0");

      act(() => screen.getByRole("button", { name: "Close" }).focus());
      await waitFor(() => expect(body()).not.toHaveAttribute("tabindex"));
    });
  });

  // Base UI hides the page with aria-hidden rather than emitting aria-modal,
  // the same way it does for Dialog and CodeBlock's fullscreen view.
  it("hides the page behind it by default", () => {
    render(
      <>
        <button>Outside</button>
        <Drawer title="Settings" open>
          Drawer content
        </Drawer>
      </>,
    );

    const outside = screen.getByRole("button", {
      name: "Outside",
      hidden: true,
    });
    expect(outside.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(
      screen.queryByRole("button", { name: "Outside" }),
    ).not.toBeInTheDocument();
  });

  it('hides the page behind it with modal="trap-focus"', () => {
    render(
      <>
        <button>Outside</button>
        <Drawer title="Settings" open modal="trap-focus">
          Drawer content
        </Drawer>
      </>,
    );

    const outside = screen.getByRole("button", {
      name: "Outside",
      hidden: true,
    });
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
    expect(outside.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("leaves the page reachable with modal={false}", () => {
    render(
      <>
        <button>Outside</button>
        <Drawer title="Settings" open modal={false}>
          Drawer content
        </Drawer>
      </>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();
  });
});

// happy-dom evaluates no media queries, so the stylesheet text is the only
// place a unit test can hold the reduced-motion guard.
describe("drawer.module.css", () => {
  const [base, motion = ""] = css.split(
    "@media (prefers-reduced-motion: no-preference)",
  );

  it("slides the popup in and out only when motion is allowed", () => {
    expect(base).not.toMatch(/translate[XY]\(calc\(-?100%/);
    expect(base).not.toMatch(/transition:\s*transform/);
    expect(motion).toMatch(/\.drawer-popup \{\s*transition:\s*transform /);
    expect(motion.match(/translate[XY]\(calc\(-?100%/g)).toHaveLength(4);
  });

  it("keeps the opacity fade and the gesture transform under reduced motion", () => {
    expect(base).toMatch(
      /\.drawer-popup \{[^}]*transition: opacity var\(--globals-transition-duration-slow\)/,
    );
    expect(base).toMatch(/translateX\(var\(--drawer-swipe-movement-x, 0px\)\)/);
  });
});

describe("DrawerSwipeArea", () => {
  it("renders Base UI's swipe area inside a DrawerRoot", () => {
    render(
      <DrawerRoot swipeDirection="right">
        <DrawerSwipeArea className="edge" />
      </DrawerRoot>,
    );

    const area = document.querySelector('[data-slot="drawer-swipe-area"]');
    expect(area).toBeInTheDocument();
    expect(area).toHaveClass("edge");
    expect(area).toHaveAttribute("data-swipe-direction", "left");
  });

  it("renders in the composed example beside its trigger", () => {
    render(<SwipeArea />);

    expect(
      document.querySelector('[data-slot="drawer-swipe-area"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Open drawer" }),
    ).toBeInTheDocument();
  });
});

describe("Drawer RootProps precedence", () => {
  it("lets a top-level prop win over the same key in RootProps", () => {
    render(
      <Drawer
        title="Settings"
        defaultOpen={false}
        RootProps={{ defaultOpen: true }}
      >
        Drawer content
      </Drawer>,
    );
    expect(screen.queryByText("Drawer content")).not.toBeInTheDocument();
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    render(
      <Drawer title="Settings" RootProps={{ defaultOpen: true }}>
        Drawer content
      </Drawer>,
    );
    expect(screen.getByText("Drawer content")).toBeInTheDocument();
  });

  it("lets a top-level modal win over RootProps.modal", () => {
    render(
      <>
        <button>Outside</button>
        <Drawer title="Settings" open modal={false} RootProps={{ modal: true }}>
          Drawer content
        </Drawer>
      </>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();
  });

  it("still applies RootProps.modal when the top level leaves it unset", () => {
    render(
      <>
        <button>Outside</button>
        <Drawer title="Settings" open RootProps={{ modal: false }}>
          Drawer content
        </Drawer>
      </>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();
  });
});
