import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRef, useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Popover } from "./popover";

import styles from "./popover.module.css";

/* Stand-ins for `Button` and `Text`: a component that renders a real <button>
   and one that renders a <span>. */
const ButtonLike = (props: React.ComponentProps<"button">) => (
  <button type="button" {...props} />
);
const TextLike = (props: React.ComponentProps<"span">) => <span {...props} />;

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
  // TRIGGER
  // ============================================

  it("gives a non-button intrinsic trigger button semantics", async () => {
    const user = userEvent.setup();
    render(<Popover trigger={<span>Open</span>}>Popover content</Popover>);

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Popover content")).toBeInTheDocument();
  });

  it("keeps a component trigger native by default", async () => {
    const user = userEvent.setup();
    render(
      <Popover trigger={<ButtonLike>Open</ButtonLike>}>
        Popover content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).not.toHaveAttribute("role");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Popover content")).toBeInTheDocument();
  });

  it("lets a non-button component opt out with nativeButton={false}", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<TextLike>Open</TextLike>}
        TriggerProps={{ nativeButton: false }}
      >
        Popover content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard(" ");
    expect(await screen.findByText("Popover content")).toBeInTheDocument();
  });

  it("renders the trigger inside a caller's own render element", () => {
    render(
      <Popover trigger="Open" TriggerProps={{ render: <ButtonLike /> }}>
        Popover content
      </Popover>,
    );

    expect(screen.getByRole("button", { name: "Open" }).tagName).toBe("BUTTON");
  });

  it("passes the trigger state to a function trigger", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={({ open }) => <TextLike>{open ? "Hide" : "Show"}</TextLike>}
      >
        Popover content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Show" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByText("Popover content")).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Hide");
  });

  // ============================================
  // NO TRIGGER
  // ============================================
  // A controlled popover anchored through `PositionerProps.anchor` has no
  // trigger of its own, and nothing may stand in for one: not even an empty
  // focusable span.

  it("renders no trigger element when none is given", () => {
    const { container } = render(
      <Popover open={false} onOpenChange={() => {}}>
        Popover content
      </Popover>,
    );

    // The trigger renders inline, never in the portal, so the container is the
    // whole place to look; the popup is unmounted while closed anyway.
    expect(container.querySelector('[data-slot="popover-trigger"]')).toBeNull();
    expect(container.querySelector("[tabindex], [role]")).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders no trigger element for a conditional that came out false", () => {
    const { container } = render(
      <Popover trigger={false} open={false} onOpenChange={() => {}}>
        Popover content
      </Popover>,
    );

    expect(container.querySelector('[data-slot="popover-trigger"]')).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders no trigger element for an empty string", () => {
    const { container } = render(
      <Popover trigger="" open={false} onOpenChange={() => {}}>
        Popover content
      </Popover>,
    );

    expect(container.querySelector('[data-slot="popover-trigger"]')).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("opens when controlled without a trigger", () => {
    render(
      <Popover open={true} onOpenChange={() => {}}>
        Popover content
      </Popover>,
    );

    expect(screen.getByRole("dialog")).toHaveTextContent("Popover content");
    expect(document.querySelector('[data-slot="popover-trigger"]')).toBeNull();
  });

  it("opens against a PositionerProps.anchor without a trigger", () => {
    const AnchoredPopover = () => {
      const anchor = useRef<HTMLDivElement>(null);
      return (
        <>
          <div ref={anchor}>Anchor</div>
          <Popover
            open={true}
            onOpenChange={() => {}}
            PositionerProps={{ anchor }}
          >
            Popover content
          </Popover>
        </>
      );
    };
    render(<AnchoredPopover />);

    // happy-dom has no layout, so placement is not asserted: only that the
    // popup opens with nothing standing in for a trigger.
    expect(screen.getByRole("dialog")).toHaveTextContent("Popover content");
    expect(document.querySelector('[data-slot="popover-trigger"]')).toBeNull();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders a trigger from TriggerProps.render without a trigger prop", () => {
    render(
      <Popover TriggerProps={{ render: <button>Open popover</button> }}>
        Popover content
      </Popover>,
    );

    expect(
      screen.getByRole("button", { name: "Open popover" }),
    ).toHaveAttribute("data-slot", "popover-trigger");
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

  it("calls RootProps.onOpenChange alongside onOpenChange", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const rootOnOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button>Open popover</button>}
        onOpenChange={onOpenChange}
        RootProps={{ onOpenChange: rootOnOpenChange }}
      >
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
    expect(rootOnOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("lets RootProps.onOpenChange cancel an open", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Popover
        trigger={<button>Open popover</button>}
        onOpenChange={onOpenChange}
        RootProps={{ onOpenChange: (_, details) => details.cancel() }}
      >
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));

    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.queryByText("Popover content")).not.toBeInTheDocument();
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

  it("keeps its default offsets when PositionerProps sets only a side", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open popover</button>}
        PositionerProps={{ side: "bottom" }}
      >
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await screen.findByText("Popover content");

    const positioner = document.querySelector<HTMLElement>(
      '[data-slot="popover-positioner"]',
    );
    expect(positioner).toHaveAttribute("data-side", "bottom");
    // Base UI offsets the floating element by sideOffset from the trigger, and
    // happy-dom's zero-sized viewport leaves minus twice the collisionPadding.
    expect(positioner?.style.transform).toBe("translate(0px, 4px)");
    expect(positioner?.style.getPropertyValue("--available-height")).toBe(
      "-32px",
    );
  });

  it("lets an explicit sideOffset and collisionPadding win over the defaults", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open popover</button>}
        PositionerProps={{
          side: "bottom",
          sideOffset: 12,
          collisionPadding: 40,
        }}
      >
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await screen.findByText("Popover content");

    const positioner = document.querySelector<HTMLElement>(
      '[data-slot="popover-positioner"]',
    );
    expect(positioner?.style.transform).toBe("translate(0px, 12px)");
    expect(positioner?.style.getPropertyValue("--available-height")).toBe(
      "-80px",
    );
  });

  it("keeps an explicit sideOffset of 0 rather than falling back to the default", async () => {
    const user = userEvent.setup();
    render(
      <Popover
        trigger={<button>Open popover</button>}
        PositionerProps={{ side: "bottom", sideOffset: 0 }}
      >
        Popover content
      </Popover>,
    );

    await user.click(screen.getByRole("button", { name: "Open popover" }));
    await screen.findByText("Popover content");

    const positioner = document.querySelector<HTMLElement>(
      '[data-slot="popover-positioner"]',
    );
    expect(positioner?.style.transform).toBe("translate(0px, 0px)");
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
      expect(document.querySelector('[data-slot="popover-popup"]')).toHaveClass(
        "custom-popup",
      );
    });
  });

  it("passes TriggerProps to trigger wrapper", () => {
    render(
      <Popover
        trigger={<button>Open popover</button>}
        TriggerProps={{ className: "trigger-wrapper" }}
      >
        Popover content
      </Popover>,
    );

    expect(screen.getByRole("button", { name: "Open popover" })).toHaveClass(
      "trigger-wrapper",
    );
  });

  // ============================================
  // STATE-FUNCTION CLASSNAME
  // ============================================
  // Base UI accepts `className` as a function of the part's state. Each part
  // must hand the caller's function that state and keep its own module class.

  it("gives a string trigger the shared focus-ring class", () => {
    render(<Popover trigger="Open popover">Popover content</Popover>);

    expect(styles["popover-trigger"]).toContain("composes-trigger");
    expect(screen.getByRole("button", { name: "Open popover" })).toHaveClass(
      styles["popover-trigger"],
    );
  });

  it("merges a consumer className on the trigger with its own class", () => {
    render(
      <Popover
        trigger="Open popover"
        TriggerProps={{ className: "custom-trigger" }}
      >
        Popover content
      </Popover>,
    );

    expect(styles["popover-trigger"]).toBeTruthy();
    expect(screen.getByRole("button", { name: "Open popover" })).toHaveClass(
      styles["popover-trigger"],
      "custom-trigger",
    );
  });

  it("resolves a state-function className on the trigger alongside its own class", async () => {
    const user = userEvent.setup();

    render(
      <Popover
        trigger={<button>Open popover</button>}
        TriggerProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      >
        Popover content
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: "Open popover" });
    expect(styles["popover-trigger"]).toBeTruthy();
    expect(trigger).toHaveClass(styles["popover-trigger"], "fn-closed");

    await user.click(trigger);

    await waitFor(() => {
      expect(trigger).toHaveClass(styles["popover-trigger"], "fn-open");
    });
  });

  it("resolves a state-function className on the positioner alongside its own class", () => {
    render(
      <Popover
        trigger={<button>Open popover</button>}
        open={true}
        PositionerProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      >
        Popover content
      </Popover>,
    );

    const positioner = document.querySelector(
      '[data-slot="popover-positioner"]',
    );
    expect(positioner).toHaveClass(styles["popover-positioner"], "fn-open");
  });

  it("resolves a state-function className on the popup alongside its own class", () => {
    render(
      <Popover
        trigger={<button>Open popover</button>}
        open={true}
        PopupProps={{
          className: (state) => (state.open ? "fn-open" : "fn-closed"),
        }}
      >
        Popover content
      </Popover>,
    );

    const popup = document.querySelector('[data-slot="popover-popup"]');
    expect(popup).toHaveClass(styles["popover-popup"], "fn-open");
  });
});
