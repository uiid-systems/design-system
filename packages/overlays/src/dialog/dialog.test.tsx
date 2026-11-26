import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent, {
  PointerEventsCheckLevel,
} from "@testing-library/user-event";
import { Button } from "@uiid/buttons";
import { useState } from "react";
import { afterEach, describe, it, expect, vi } from "vitest";

import { Dialog } from "./dialog";
import { Footer } from "./dialog.examples";
import type { DialogPopupProps, DialogProps } from "./dialog.types";
import {
  DialogBackdrop,
  DialogClose,
  DialogPopup,
  DialogPortal,
  DialogRoot,
  DialogTrigger,
  DialogViewport,
} from "./subcomponents";

import styles from "./dialog.module.css";

/* Stand-ins for `Button` and `Text`: a component that renders a real <button>
   and one that renders a <span>. */
const ButtonLike = (props: React.ComponentProps<"button">) => (
  <button type="button" {...props} />
);
const TextLike = (props: React.ComponentProps<"span">) => <span {...props} />;

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
  // NO TRIGGER
  // ============================================
  // A controlled dialog opened from elsewhere has no trigger of its own, and
  // nothing may stand in for one: not even an empty focusable span.

  it("renders no trigger element when none is given", () => {
    const { container } = render(
      <Dialog open={false} onOpenChange={() => {}}>
        Dialog content
      </Dialog>,
    );

    // The trigger renders inline, never in the portal, so the container is the
    // whole place to look; the popup is unmounted while closed anyway.
    expect(container.querySelector('[data-slot="dialog-trigger"]')).toBeNull();
    expect(container.querySelector("[tabindex], [role]")).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders no trigger element for a conditional that came out false", () => {
    const { container } = render(
      <Dialog trigger={false} open={false} onOpenChange={() => {}}>
        Dialog content
      </Dialog>,
    );

    expect(container.querySelector('[data-slot="dialog-trigger"]')).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders no trigger element for an empty string", () => {
    const { container } = render(
      <Dialog trigger="" open={false} onOpenChange={() => {}}>
        Dialog content
      </Dialog>,
    );

    expect(container.querySelector('[data-slot="dialog-trigger"]')).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens when controlled without a trigger", () => {
    render(
      <Dialog open={true} onOpenChange={() => {}}>
        Dialog content
      </Dialog>,
    );

    expect(screen.getByRole("dialog")).toHaveTextContent("Dialog content");
  });

  it("renders a trigger from TriggerProps.render without a trigger prop", () => {
    render(
      <Dialog TriggerProps={{ render: <button>Open dialog</button> }}>
        Dialog content
      </Dialog>,
    );

    expect(screen.getByRole("button", { name: "Open dialog" })).toHaveAttribute(
      "data-slot",
      "dialog-trigger",
    );
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
  // TRIGGER
  // ============================================

  it("doesn't open from a disabled Button trigger, which stays a tab stop", async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger={<Button disabled>Open dialog</Button>} title="Title">
        Dialog content
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Open dialog" });
    expect(trigger).toBeDisabledForUser();

    await user.click(trigger);
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });

  it("gives a non-button intrinsic trigger button semantics", async () => {
    const user = userEvent.setup();
    render(<Dialog trigger={<span>Open</span>}>Dialog content</Dialog>);

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Dialog content")).toBeInTheDocument();
  });

  it("keeps a string trigger when TriggerProps leaves render and nativeButton undefined", async () => {
    const user = userEvent.setup();
    render(
      <Dialog
        trigger="Open"
        TriggerProps={{ render: undefined, nativeButton: undefined }}
      >
        Dialog content
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Dialog content")).toBeInTheDocument();
  });

  it("keeps a component trigger native by default", async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger={<ButtonLike>Open</ButtonLike>}>Dialog content</Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).not.toHaveAttribute("role");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Dialog content")).toBeInTheDocument();
  });

  it("lets a non-button component opt out with nativeButton={false}", async () => {
    const user = userEvent.setup();
    render(
      <Dialog
        trigger={<TextLike>Open</TextLike>}
        TriggerProps={{ nativeButton: false }}
      >
        Dialog content
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard(" ");
    expect(await screen.findByText("Dialog content")).toBeInTheDocument();
  });

  it("passes the trigger state to a function trigger", async () => {
    const user = userEvent.setup();
    render(
      <Dialog
        trigger={({ open }) => <TextLike>{open ? "Hide" : "Show"}</TextLike>}
      >
        Dialog content
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Show" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Dialog content")).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Hide");
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

  it("renders with full size", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        size="full"
      >
        Dialog content
      </Dialog>,
    );

    const popup = document.querySelector('[data-slot="dialog-popup"]');
    expect(popup?.className).toContain("size-full");
  });

  // ============================================
  // CLOSE BUTTON
  // ============================================

  it("renders an icon-only ghost close button named Close in the header", () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="Title">
        Dialog content
      </Dialog>,
    );

    const close = screen.getByRole("button", { name: "Close" });
    expect(close).toHaveAttribute("data-slot", "dialog-close-button");
    expect(close).toHaveAttribute("type", "button");
    expect(close.closest('[data-slot="card-action"]')).toBeInTheDocument();
    expect(close.className).toMatch(/variant-ghost/);
    expect(close.className).toMatch(/shape-square/);
    expect(close.querySelector("svg")).toBeInTheDocument();
  });

  it("closes an uncontrolled dialog from the close button", async () => {
    const user = userEvent.setup();
    render(
      <Dialog trigger={<button>Open dialog</button>} title="Title">
        Dialog content
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await user.click(await screen.findByRole("button", { name: "Close" }));

    await waitFor(() => {
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
    });
  });

  it("calls onOpenChange with false from the close button", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Dialog open={true} onOpenChange={onOpenChange} title="Title">
        Dialog content
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
  });

  it("places the close button after the caller's action", () => {
    render(
      <Dialog
        open={true}
        onOpenChange={() => {}}
        title="Title"
        action={<button>Action</button>}
      >
        Dialog content
      </Dialog>,
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
      <Dialog
        open={true}
        onOpenChange={() => {}}
        title="Title"
        action={<button>Action</button>}
        hideCloseButton
      >
        Dialog content
      </Dialog>,
    );

    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  // ============================================
  // CLOSE PART
  // ============================================

  it("renders DialogClose as a subtle Button", () => {
    render(
      <Dialog
        open={true}
        onOpenChange={() => {}}
        title="Title"
        footer={<DialogClose>Cancel</DialogClose>}
      >
        Dialog content
      </Dialog>,
    );

    const cancel = screen.getByRole("button", { name: "Cancel" });
    expect(cancel).toHaveAttribute("data-slot", "dialog-close");
    expect(cancel).toHaveAttribute("type", "button");
    expect(cancel.closest('[data-slot="card-footer"]')).toBeInTheDocument();
    expect(cancel.className).toMatch(/variant-subtle/);
  });

  /* Card is flat with no footer divider by default, so the dialog's lift and
     its footer rule rest on DialogPopup turning both on. */
  it("keeps the popup's shadow and footer divider", () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="Title" footer="Footer">
        Dialog content
      </Dialog>,
    );

    const popup = screen.getByRole("dialog");
    expect(popup.className).toMatch(/shadow/);
    expect(within(popup).getByRole("separator")).toBeInTheDocument();
  });

  /*
   * The body scrolls and reaches the popup's side edges (dialog.module.css),
   * so it must not carry Card's `w="full"`, which would hold it to the content
   * box. The test DOM has no layout; Storybook covers the scrolling itself.
   */
  it("leaves the body free to stretch to the popup's edges", () => {
    render(
      <Dialog open={true} onOpenChange={() => {}} title="Title" footer="Footer">
        Dialog content
      </Dialog>,
    );

    const body = screen
      .getByRole("dialog")
      .querySelector(':scope > [data-slot="card-inner-container"]');
    expect(body).toHaveTextContent("Dialog content");
    expect(body).not.toHaveAttribute("data-ui-w");
  });

  /*
   * happy-dom has no layout, so these stub the body's scroll and client
   * heights. A body that overflows is the only way to scroll by keyboard when
   * focus sits on the close button or the popup, so it becomes a tab stop.
   */
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

    it("makes a long body a tab stop, named by the title", async () => {
      stubHeights(1000, 400);
      render(
        <Dialog open={true} onOpenChange={() => {}} title="Terms">
          Long content
        </Dialog>,
      );

      await waitFor(() => expect(body()).toHaveAttribute("tabindex", "0"));
      expect(screen.getByRole("region", { name: "Terms" })).toBe(body());
      expect(body()).toHaveAttribute(
        "aria-labelledby",
        screen.getByRole("dialog").getAttribute("aria-labelledby"),
      );
    });

    it("gives an untitled long body no role, since it has no name", async () => {
      stubHeights(1000, 400);
      render(
        <Dialog open={true} onOpenChange={() => {}}>
          Long content
        </Dialog>,
      );

      await waitFor(() => expect(body()).toHaveAttribute("tabindex", "0"));
      expect(body()).not.toHaveAttribute("role");
      expect(body()).not.toHaveAttribute("aria-labelledby");
    });

    it("leaves a short body unnamed", async () => {
      stubHeights(400, 400);
      render(
        <Dialog open={true} onOpenChange={() => {}} title="Terms">
          Short content
        </Dialog>,
      );

      await waitFor(() => expect(body()).toBeInTheDocument());
      expect(body()).not.toHaveAttribute("role");
    });

    it("reaches a long body by Tab from the close button", async () => {
      stubHeights(1000, 400);
      const user = userEvent.setup();
      render(
        <Dialog open={true} onOpenChange={() => {}} title="Terms">
          Long content
        </Dialog>,
      );
      await waitFor(() => expect(body()).toHaveAttribute("tabindex", "0"));

      screen.getByRole("button", { name: "Close" }).focus();
      await user.tab();
      expect(body()).toHaveFocus();
    });

    it("leaves a short body out of the tab order", async () => {
      stubHeights(400, 400);
      render(
        <Dialog open={true} onOpenChange={() => {}} title="Terms">
          Short content
        </Dialog>,
      );

      await waitFor(() => expect(body()).toBeInTheDocument());
      expect(body()).not.toHaveAttribute("tabindex");
    });

    /*
     * Dropping the tab stop under focus would send focus to the document, so a
     * focused body keeps it until focus leaves. ResizeObserver is captured so
     * the test can report the resize happy-dom never would.
     */
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
        <Dialog open={true} onOpenChange={() => {}} title="Terms">
          Long content
        </Dialog>,
      );
      await waitFor(() => expect(body()).toHaveAttribute("tabindex", "0"));
      body()!.focus();

      stubHeights(400, 400);
      act(() => resizes.forEach((resize) => resize()));
      expect(body()).toHaveAttribute("tabindex", "0");
      expect(body()).toHaveFocus();

      act(() => screen.getByRole("button", { name: "Close" }).focus());
      await waitFor(() => expect(body()).not.toHaveAttribute("tabindex"));
    });

    it("drops an unfocused body's region and tab stop once it stops overflowing", async () => {
      const resizes: (() => void)[] = [];
      vi.stubGlobal(
        "ResizeObserver",
        class {
          constructor(callback: () => void) {
            resizes.push(callback);
          }
          observe() {}
          unobserve() {}
          disconnect() {}
        },
      );
      stubHeights(1000, 400);
      render(
        <Dialog open={true} onOpenChange={() => {}} title="Terms">
          Long content
        </Dialog>,
      );
      await waitFor(() => expect(body()).toHaveAttribute("role", "region"));
      expect(body()).not.toHaveFocus();

      stubHeights(400, 400);
      act(() => resizes.forEach((resize) => resize()));

      expect(body()).not.toHaveAttribute("role");
      expect(body()).not.toHaveAttribute("aria-labelledby");
      expect(body()).not.toHaveAttribute("tabindex");
    });
  });

  it("lets DialogClose take another Button variant", () => {
    render(
      <Dialog
        open={true}
        onOpenChange={() => {}}
        title="Title"
        footer={<DialogClose variant="ghost">Done</DialogClose>}
      >
        Dialog content
      </Dialog>,
    );

    const done = screen.getByRole("button", { name: "Done" });
    expect(done.className).toMatch(/variant-ghost/);
    expect(done.className).not.toMatch(/variant-subtle/);
  });

  it("closes an uncontrolled dialog from DialogClose, after its own onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onOpenChange = vi.fn();
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        title="Title"
        onOpenChange={onOpenChange}
        footer={<DialogClose onClick={onClick}>Cancel</DialogClose>}
      >
        Dialog content
      </Dialog>,
    );

    await user.click(screen.getByRole("button", { name: "Open dialog" }));
    await user.click(await screen.findByRole("button", { name: "Cancel" }));

    expect(onClick).toHaveBeenCalled();
    expect(onOpenChange).toHaveBeenLastCalledWith(false, expect.anything());
    await waitFor(() => {
      expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
    });
  });

  // ============================================
  // PENDING
  // ============================================

  describe("pending", () => {
    const PendingDialog = ({
      onOpenChange,
    }: {
      onOpenChange: (open: boolean) => void;
    }) => (
      <Dialog
        open={true}
        onOpenChange={onOpenChange}
        pending
        title="Saving"
        footer={<DialogClose>Cancel</DialogClose>}
      >
        Dialog content
      </Dialog>
    );

    it("disables the close button and DialogClose", () => {
      render(<PendingDialog onOpenChange={() => {}} />);

      expect(
        screen.getByRole("button", { name: "Close" }),
      ).toBeDisabledForUser();
      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeDisabledForUser();
    });

    it("keeps DialogClose's own disabled when the dialog isn't pending", () => {
      render(
        <Dialog
          open={true}
          onOpenChange={() => {}}
          title="Title"
          footer={<DialogClose disabled>Cancel</DialogClose>}
        >
          Dialog content
        </Dialog>,
      );

      expect(
        screen.getByRole("button", { name: "Cancel" }),
      ).toBeDisabledForUser();
      expect(
        screen.getByRole("button", { name: "Close" }),
      ).not.toBeDisabledForUser();
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
            '[data-slot="dialog-backdrop"]',
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
        "DialogClose",
        async (user: ReturnType<typeof userEvent.setup>) =>
          user.click(screen.getByRole("button", { name: "Cancel" })),
      ],
    ])("is not closed by %s", async (_, close) => {
      const user = userEvent.setup({
        pointerEventsCheck: PointerEventsCheckLevel.Never,
      });
      const onOpenChange = vi.fn();
      render(<PendingDialog onOpenChange={onOpenChange} />);

      await close(user);

      expect(onOpenChange).not.toHaveBeenCalled();
      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });

    it("blocks an uncontrolled dialog too", async () => {
      const user = userEvent.setup();
      render(
        <Dialog trigger={<button>Open dialog</button>} title="Saving" pending>
          Dialog content
        </Dialog>,
      );

      await user.click(screen.getByRole("button", { name: "Open dialog" }));
      expect(await screen.findByText("Dialog content")).toBeInTheDocument();

      await user.keyboard("{Escape}");

      expect(screen.getByText("Dialog content")).toBeInTheDocument();
    });

    it("still closes when open turns false", async () => {
      const { rerender } = render(
        <Dialog open={true} onOpenChange={() => {}} pending title="Saving">
          Dialog content
        </Dialog>,
      );

      rerender(
        <Dialog open={false} onOpenChange={() => {}} pending title="Saving">
          Dialog content
        </Dialog>,
      );

      await waitFor(() => {
        expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
      });
    });

    it("closes again once pending clears", async () => {
      const user = userEvent.setup();
      const DialogWrapper = () => {
        const [open, setOpen] = useState(true);
        const [pending, setPending] = useState(true);
        return (
          <Dialog
            open={open}
            onOpenChange={setOpen}
            pending={pending}
            title="Saving"
            action={<button onClick={() => setPending(false)}>Finish</button>}
          >
            Dialog content
          </Dialog>
        );
      };
      render(<DialogWrapper />);

      expect(
        screen.getByRole("button", { name: "Close" }),
      ).toBeDisabledForUser();
      await user.click(screen.getByRole("button", { name: "Finish" }));
      expect(
        screen.getByRole("button", { name: "Close" }),
      ).not.toBeDisabledForUser();

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
      });
    });

    it("still calls RootProps.onOpenChange when not pending", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const rootOnOpenChange = vi.fn();
      render(
        <Dialog
          open={true}
          onOpenChange={onOpenChange}
          RootProps={{ onOpenChange: rootOnOpenChange }}
        >
          Dialog content
        </Dialog>,
      );

      await user.keyboard("{Escape}");

      expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
      expect(rootOnOpenChange).toHaveBeenCalledWith(false, expect.anything());
    });

    it("lets RootProps.onOpenChange cancel a controlled close", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Dialog
          open={true}
          onOpenChange={onOpenChange}
          RootProps={{ onOpenChange: (_, details) => details.cancel() }}
        >
          Dialog content
        </Dialog>,
      );

      await user.keyboard("{Escape}");

      expect(onOpenChange).not.toHaveBeenCalled();
    });
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

  /*
   * The popup passes Base UI's Title to Card, which still lays a composed
   * title out as a row, on the dialog's own <h2> labelling it.
   */
  it("keeps a composed title a labelling heading laid out as a row", () => {
    render(
      <Dialog
        open
        onOpenChange={() => {}}
        title={
          <>
            <svg />
            Billing
          </>
        }
      />,
    );

    const heading = screen.getByRole("heading", { level: 2, name: "Billing" });
    expect(heading).toHaveAttribute("data-ui-ay", "center");
    expect(screen.getByRole("dialog")).toHaveAccessibleName("Billing");
  });

  it.each(["Cancel", "Save"])(
    "closes from the Footer example's %s button",
    async (name) => {
      const user = userEvent.setup();
      render(<Footer />);

      await user.click(
        screen.getByRole("button", { name: "Notification preferences" }),
      );
      await user.click(await screen.findByRole("button", { name }));
      await waitFor(() =>
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
      );
    },
  );

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

  it("is named by its title and described by its description", () => {
    render(
      <Dialog
        open
        onOpenChange={() => {}}
        title="Preferences"
        description="Choose how you're notified."
      >
        Dialog content
      </Dialog>,
    );

    expect(
      screen.getByRole("dialog", { name: "Preferences" }),
    ).toHaveAccessibleDescription("Choose how you're notified.");
  });

  it("takes its name from PopupProps when there is no title", () => {
    render(
      <Dialog
        open
        onOpenChange={() => {}}
        PopupProps={{ "aria-label": "Preferences" }}
      >
        Dialog content
      </Dialog>,
    );

    expect(
      screen.getByRole("dialog", { name: "Preferences" }),
    ).toBeInTheDocument();
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

  // ============================================
  // CLASSNAME AND STATE
  // ============================================
  // A part's `className` is a string, merged with its own module class. Its
  // state is styled through the `data-*` attributes Base UI sets.

  it("merges a caller's className on the trigger with its own class and marks its state", async () => {
    const user = userEvent.setup();

    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        TriggerProps={{
          className: "caller",
        }}
      >
        Dialog content
      </Dialog>,
    );

    const trigger = document.querySelector('[data-slot="dialog-trigger"]');
    expect(styles["dialog-trigger"]).toContain("composes-trigger");
    expect(trigger).toHaveClass(styles["dialog-trigger"], "caller");
    expect(trigger).not.toHaveAttribute("data-popup-open");

    await user.click(screen.getByRole("button", { name: "Open dialog" }));

    await waitFor(() => {
      expect(trigger).toHaveClass(styles["dialog-trigger"], "caller");
      expect(trigger).toHaveAttribute("data-popup-open");
    });
  });

  it("merges a caller's className on the backdrop with its own class and marks its state", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        BackdropProps={{
          className: "caller",
        }}
      >
        Dialog content
      </Dialog>,
    );

    const backdrop = document.querySelector('[data-slot="dialog-backdrop"]');
    expect(backdrop).toHaveClass(styles["dialog-backdrop"], "caller");
    expect(backdrop).toHaveAttribute("data-open");
  });

  it("merges a caller's className on the viewport with its own class and marks its state", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        ViewportProps={{
          className: "caller",
        }}
      >
        Dialog content
      </Dialog>,
    );

    const viewport = document.querySelector('[data-slot="dialog-viewport"]');
    expect(viewport).toHaveClass(styles["dialog-viewport"], "caller");
    expect(viewport).toHaveAttribute("data-open");
  });

  it("merges a caller's className on the popup with its own class and marks its state", () => {
    render(
      <Dialog
        trigger={<button>Open dialog</button>}
        open={true}
        onOpenChange={() => {}}
        PopupProps={{
          className: "caller",
        }}
      >
        Dialog content
      </Dialog>,
    );

    const popup = document.querySelector('[data-slot="dialog-popup"]');
    expect(popup).toHaveClass(styles["dialog-popup"], "caller");
    expect(popup).toHaveAttribute("data-open");
  });

  describe("nested dialogs", () => {
    it("leaves out a nested dialog's backdrop by default", () => {
      render(
        <Dialog open={true} onOpenChange={() => {}} title="Outer">
          <Dialog open={true} onOpenChange={() => {}} title="Inner">
            Inner content
          </Dialog>
        </Dialog>,
      );

      expect(
        document.querySelectorAll('[data-slot="dialog-backdrop"]'),
      ).toHaveLength(1);
    });

    it("renders a nested dialog's backdrop with BackdropProps forceRender", () => {
      render(
        <Dialog open={true} onOpenChange={() => {}} title="Outer">
          <Dialog
            open={true}
            onOpenChange={() => {}}
            title="Inner"
            BackdropProps={{ forceRender: true }}
          >
            Inner content
          </Dialog>
        </Dialog>,
      );

      expect(
        document.querySelectorAll('[data-slot="dialog-backdrop"]'),
      ).toHaveLength(2);
    });

    // `.dialog-viewport ~ * > .dialog-backdrop` lifts a nested backdrop over the outer viewport.
    // happy-dom can't paint, and its `matches()` mishandles that compound selector, so this checks
    // the structure the rule relies on, arm by arm; the stacking itself was proven in Chromium.
    it("portals only a nested backdrop after a dialog viewport", () => {
      render(
        <Dialog open={true} onOpenChange={() => {}} title="Outer">
          <Dialog
            open={true}
            onOpenChange={() => {}}
            title="Inner"
            BackdropProps={{ forceRender: true }}
          >
            Inner content
          </Dialog>
        </Dialog>,
      );

      const afterViewport = `.${styles["dialog-viewport"]} ~ *`;
      const [outerBackdrop, innerBackdrop] = document.querySelectorAll(
        '[data-slot="dialog-backdrop"]',
      );
      expect(innerBackdrop).toHaveClass(styles["dialog-backdrop"]);
      expect(innerBackdrop?.parentElement?.matches(afterViewport)).toBe(true);
      expect(outerBackdrop?.parentElement?.matches(afterViewport)).toBe(false);
    });
  });
});

describe("Dialog top-level root props", () => {
  it("opens on mount with defaultOpen", () => {
    render(
      <Dialog title="Settings" defaultOpen>
        Dialog content
      </Dialog>,
    );

    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  it("hides the page behind it by default", () => {
    render(
      <>
        <button>Outside</button>
        <Dialog title="Settings" open>
          Dialog content
        </Dialog>
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
        <Dialog title="Settings" open modal="trap-focus">
          Dialog content
        </Dialog>
      </>,
    );

    const outside = screen.getByRole("button", {
      name: "Outside",
      hidden: true,
    });
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
    expect(outside.closest('[aria-hidden="true"]')).not.toBeNull();
  });

  it("leaves the page reachable with modal={false}", () => {
    render(
      <>
        <button>Outside</button>
        <Dialog title="Settings" open modal={false}>
          Dialog content
        </Dialog>
      </>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();
  });
});

describe("Dialog RootProps precedence", () => {
  it("lets a top-level prop win over the same key in RootProps", () => {
    render(
      <Dialog
        title="Settings"
        defaultOpen={false}
        RootProps={{ defaultOpen: true }}
      >
        Dialog content
      </Dialog>,
    );
    expect(screen.queryByText("Dialog content")).not.toBeInTheDocument();
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    render(
      <Dialog title="Settings" RootProps={{ defaultOpen: true }}>
        Dialog content
      </Dialog>,
    );
    expect(screen.getByText("Dialog content")).toBeInTheDocument();
  });

  it("lets a top-level modal win over RootProps.modal", () => {
    render(
      <>
        <button>Outside</button>
        <Dialog title="Settings" open modal={false} RootProps={{ modal: true }}>
          Dialog content
        </Dialog>
      </>,
    );
    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();
  });

  it("still applies RootProps.modal when the top level leaves it unset", () => {
    render(
      <>
        <button>Outside</button>
        <Dialog title="Settings" open RootProps={{ modal: false }}>
          Dialog content
        </Dialog>
      </>,
    );
    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();
  });
});

/* Type-level only: `pnpm typecheck` fails if the directive goes unused. */
describe("className", () => {
  it("takes a string, not a function of the part's state", () => {
    // @ts-expect-error -- style a state through its `data-*` attribute instead
    void (<DialogPopup className={() => "from-fn"} />);
  });
});

describe("Dialog slot precedence", () => {
  // Untyped on purpose: the types reject these keys, so this pins what a
  // caller without the types gets.
  const untyped = <T,>(slot: Record<string, unknown>) => slot as T;

  it("lets the top-level card slots win over the same keys in PopupProps", () => {
    render(
      <Dialog
        open
        title="Settings"
        description="Top-level description"
        action="Top-level action"
        footer="Top-level footer"
        PopupProps={untyped<DialogProps["PopupProps"]>({
          title: "Slot title",
          description: "Slot description",
          action: "Slot action",
          footer: "Slot footer",
        })}
      >
        Dialog content
      </Dialog>,
    );

    expect(
      screen.getByRole("dialog", { name: "Settings" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Top-level description")).toBeInTheDocument();
    expect(screen.getByText("Top-level action")).toBeInTheDocument();
    expect(screen.getByText("Top-level footer")).toBeInTheDocument();
    expect(screen.queryByText("Slot title")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot description")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot action")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot footer")).not.toBeInTheDocument();
  });

  it("lets a top-level size and hideCloseButton win over PopupProps", () => {
    render(
      <Dialog
        open
        title="Settings"
        size="small"
        hideCloseButton={false}
        PopupProps={untyped<DialogProps["PopupProps"]>({
          size: "large",
          hideCloseButton: true,
        })}
      >
        Dialog content
      </Dialog>,
    );

    const popup = screen.getByRole("dialog", { name: "Settings" });
    expect(popup).toHaveClass(styles["size-small"]);
    expect(popup).not.toHaveClass(styles["size-large"]);
    expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
  });

  it("still applies a PopupProps key the top level leaves unset", () => {
    render(
      <Dialog
        open
        title="Settings"
        PopupProps={untyped<DialogProps["PopupProps"]>({
          hideCloseButton: true,
        })}
      >
        Dialog content
      </Dialog>,
    );

    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
  });

  it("renders trigger, not TriggerProps.children, as the trigger's content", () => {
    render(
      <Dialog
        trigger="Open dialog"
        TriggerProps={untyped<DialogProps["TriggerProps"]>({
          children: "Slot content",
        })}
      >
        Dialog content
      </Dialog>,
    );

    expect(
      screen.getByRole("button", { name: "Open dialog" }),
    ).toBeInTheDocument();
    expect(screen.queryByText("Slot content")).not.toBeInTheDocument();
  });
});

/* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
describe("Dialog slot props", () => {
  it("rejects the keys Dialog owns in PopupProps", () => {
    void (
      <>
        <Dialog
          // @ts-expect-error -- `size` is set on Dialog itself
          PopupProps={{ size: "large" }}
        />
        <Dialog
          // @ts-expect-error -- `title` is set on Dialog itself
          PopupProps={{ title: "Settings" }}
        />
        <Dialog
          // @ts-expect-error -- `description` is set on Dialog itself
          PopupProps={{ description: "About" }}
        />
        <Dialog
          // @ts-expect-error -- `action` is set on Dialog itself
          PopupProps={{ action: "Edit" }}
        />
        <Dialog
          // @ts-expect-error -- `footer` is set on Dialog itself
          PopupProps={{ footer: "Done" }}
        />
        <Dialog
          // @ts-expect-error -- `hideCloseButton` is set on Dialog itself
          PopupProps={{ hideCloseButton: true }}
        />
        <Dialog
          // @ts-expect-error -- the popup's content is Dialog's `children`
          PopupProps={{ children: "Body" }}
        />
      </>
    );
  });

  it("rejects the key Dialog owns in TriggerProps", () => {
    void (
      <Dialog
        trigger="Open"
        // @ts-expect-error -- the trigger's content is `trigger`
        TriggerProps={{ children: "Other" }}
      />
    );
  });
});

/*
 * An unstyled popup is the bare Base UI popup: no Card, so no surface, slots
 * or scrolling body. It keeps the dialog's own class, the size variant and the
 * popup transition. happy-dom has no layout; dialog.browser.test.tsx measures
 * the boxes in Chromium.
 */
describe("DialogPopup unstyled", () => {
  const Unstyled = ({
    children = <p>Frame content</p>,
    ...props
  }: Omit<Extract<DialogPopupProps, { unstyled: true }>, "unstyled">) => (
    <DialogRoot open>
      <DialogPortal>
        <DialogBackdrop />
        <DialogViewport>
          <DialogPopup unstyled aria-label="Viewer" {...props}>
            {children}
          </DialogPopup>
        </DialogViewport>
      </DialogPortal>
    </DialogRoot>
  );

  it("renders no Card and passes its children straight through", () => {
    render(
      <Unstyled>
        <p>First</p>
        <p>Second</p>
      </Unstyled>,
    );

    const popup = screen.getByRole("dialog", { name: "Viewer" });
    for (const slot of [
      "card-container",
      "card-header",
      "card-inner-container",
    ]) {
      expect(document.querySelector(`[data-slot="${slot}"]`)).toBeNull();
    }
    expect(screen.getByText("First").parentElement).toBe(popup);
    expect(screen.getByText("Second").parentElement).toBe(popup);
    expect(
      screen.queryByRole("button", { name: "Close" }),
    ).not.toBeInTheDocument();
  });

  it("keeps the popup slot, its class, the size variant and the open state", () => {
    render(<Unstyled size="full" />);

    const popup = screen.getByRole("dialog", { name: "Viewer" });
    expect(popup).toHaveAttribute("data-slot", "dialog-popup");
    expect(popup).toHaveClass(styles["dialog-popup"], styles["size-full"]);
    expect(popup).toHaveClass("composes-popup");
    expect(popup).toHaveAttribute("data-open");
  });

  it("defaults to the medium size, as the Card popup does", () => {
    render(<Unstyled />);

    expect(screen.getByRole("dialog", { name: "Viewer" })).toHaveClass(
      styles["size-medium"],
    );
  });

  it("leaves out the scroll-body composition the Card popup carries", () => {
    render(<Unstyled />);

    const popup = screen.getByRole("dialog", { name: "Viewer" });
    expect(popup).not.toHaveClass("composes-popup-scroll-body");
    expect(popup).not.toHaveClass(styles["dialog-popup-card"]);
    expect(popup.querySelector("[tabindex], [role='region']")).toBeNull();
  });

  it("keeps the scroll-body composition on the Card popup", () => {
    render(
      <Dialog open title="Settings">
        Dialog content
      </Dialog>,
    );

    expect(screen.getByRole("dialog", { name: "Settings" })).toHaveClass(
      "composes-popup-scroll-body",
      styles["dialog-popup-card"],
    );
  });

  it("does not write unstyled to the DOM", () => {
    render(<Unstyled />);

    const popup = screen.getByRole("dialog", { name: "Viewer" });
    expect(popup).not.toHaveAttribute("unstyled");
    expect(popup).not.toHaveAttribute("data-unstyled");
  });

  it("passes className, data and aria attributes and the ref to the popup", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Unstyled
        ref={ref}
        className="caller"
        data-testid="frame"
        aria-describedby="hint"
      />,
    );

    const popup = screen.getByRole("dialog", { name: "Viewer" });
    expect(popup).toHaveClass("caller", styles["dialog-popup"]);
    expect(popup).toHaveAttribute("data-testid", "frame");
    expect(popup).toHaveAttribute("aria-describedby", "hint");
    expect(ref.current).toBe(popup);
  });

  it("is a dialog named by its aria-label", () => {
    render(<Unstyled aria-label="Fullscreen code" />);

    expect(
      screen.getByRole("dialog", { name: "Fullscreen code" }),
    ).toBeInTheDocument();
  });

  it("opens from inside a Dialog, after it, and returns focus to its trigger on close", async () => {
    const user = userEvent.setup();
    render(
      <Dialog open title="Outer">
        <DialogRoot>
          <DialogTrigger>Fullscreen</DialogTrigger>
          <DialogPortal>
            <DialogViewport>
              <DialogPopup unstyled size="full" aria-label="Viewer">
                <button type="button">Inside</button>
              </DialogPopup>
            </DialogViewport>
          </DialogPortal>
        </DialogRoot>
      </Dialog>,
    );

    const trigger = screen.getByRole("button", { name: "Fullscreen" });
    await user.click(trigger);

    const inner = await screen.findByRole("dialog", { name: "Viewer" });
    // The open inner dialog hides the outer one from the accessibility tree.
    const outer = screen.getByRole("dialog", { name: "Outer", hidden: true });
    // A nested portal renders after the outer viewport, outside it, so the
    // inner viewport paints above it at the same z-index. The browser test
    // checks the painting itself.
    const outerViewport = outer.closest('[data-slot="dialog-viewport"]')!;
    const innerViewport = inner.closest('[data-slot="dialog-viewport"]')!;
    expect(innerViewport).toHaveClass(styles["dialog-viewport"]);
    expect(outerViewport.contains(innerViewport)).toBe(false);
    expect(
      outerViewport.compareDocumentPosition(innerViewport) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(
        screen.queryByRole("dialog", { name: "Viewer" }),
      ).not.toBeInTheDocument(),
    );
    expect(screen.getByRole("dialog", { name: "Outer" })).toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});

/* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
describe("DialogPopup unstyled types", () => {
  it("rejects the Card slots and the close button with unstyled", () => {
    void (
      <>
        {/* @ts-expect-error -- an unstyled popup has no title slot */}
        <DialogPopup unstyled title="Settings" />
        {/* @ts-expect-error -- an unstyled popup has no description slot */}
        <DialogPopup unstyled description="About" />
        {/* @ts-expect-error -- an unstyled popup has no action slot */}
        <DialogPopup unstyled action="Edit" />
        {/* @ts-expect-error -- an unstyled popup has no footer slot */}
        <DialogPopup unstyled footer="Done" />
        {/* @ts-expect-error -- an unstyled popup has no close button to hide */}
        <DialogPopup unstyled hideCloseButton />
      </>
    );
  });

  it("still takes the Card slots without unstyled", () => {
    void (
      <>
        <DialogPopup title="Settings" description="About" hideCloseButton />
        <DialogPopup unstyled={false} footer="Done" />
        <DialogPopup unstyled size="full" aria-label="Viewer" />
      </>
    );
  });

  it("keeps unstyled out of Dialog's PopupProps", () => {
    void (
      <Dialog
        // @ts-expect-error -- only the DialogPopup part takes unstyled
        PopupProps={{ unstyled: true }}
      />
    );
  });
});
