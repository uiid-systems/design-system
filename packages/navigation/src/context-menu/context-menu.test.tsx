import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "@uiid/cards";
import { describe, expect, it, vi } from "vitest";

import {
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  SubmenuRoot,
  SubmenuTrigger,
} from "../menu/subcomponents";
import type {
  ContextMenuPositionerProps,
  ContextMenuRootProps,
  ContextMenuTriggerProps,
} from "./context-menu.types";
import {
  ContextMenuPositioner,
  ContextMenuRoot,
  ContextMenuTrigger,
} from "./subcomponents";

import styles from "./context-menu.module.css";
import cssText from "./context-menu.module.css?raw";

type Slots = {
  RootProps?: Omit<ContextMenuRootProps, "children">;
  TriggerProps?: Omit<ContextMenuTriggerProps, "children">;
  PositionerProps?: Omit<ContextMenuPositionerProps, "children">;
  onEdit?: () => void;
};

/* A context menu composed from its own three parts and Menu's popup, items
   and submenu, the way the README shows it. */
const Composed = ({
  RootProps,
  TriggerProps,
  PositionerProps,
  onEdit,
}: Slots) => (
  <ContextMenuRoot {...RootProps}>
    <ContextMenuTrigger {...TriggerProps}>
      <Card title="Project" tabIndex={0} data-testid="area" />
    </ContextMenuTrigger>
    <MenuPortal>
      <ContextMenuPositioner {...PositionerProps}>
        <MenuPopup aria-label="Project actions">
          <MenuItem label="Edit" onClick={onEdit} />
          <MenuItem label="Duplicate" />
          <SubmenuRoot>
            <SubmenuTrigger label="Move to" />
            <MenuPortal>
              <MenuPositioner>
                <MenuPopup>
                  <MenuItem label="Inbox" />
                  <MenuItem label="Archive" />
                </MenuPopup>
              </MenuPositioner>
            </MenuPortal>
          </SubmenuRoot>
        </MenuPopup>
      </ContextMenuPositioner>
    </MenuPortal>
  </ContextMenuRoot>
);

const trigger = () =>
  document.querySelector<HTMLElement>("[data-slot='context-menu-trigger']")!;

describe("context-menu.module.css", () => {
  /* The default trigger `<div>` must draw no box of its own; the browser
     test measures the result. */
  it("draws the default trigger as display: contents", () => {
    expect(cssText).toMatch(/\.trigger\s*\{[^}]*display:\s*contents/);
  });
});

describe("ContextMenu parts", () => {
  it("renders no menu until the area is right-clicked", () => {
    render(<Composed />);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens a menu on contextmenu over the area and closes it on Escape", async () => {
    const user = userEvent.setup();
    render(<Composed />);

    fireEvent.contextMenu(screen.getByTestId("area"));
    expect(await screen.findByRole("menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  /* The keyboard path: Shift+F10 or the Menu key fires `contextmenu` on the
     focused element, which is inside the area. */
  it("opens from a focused child and returns focus to it on Escape", async () => {
    const user = userEvent.setup();
    render(<Composed />);

    const area = screen.getByTestId("area");
    area.focus();
    fireEvent.contextMenu(area);
    const menu = await screen.findByRole("menu", { name: "Project actions" });
    // Focus leaves the card for the menu, so the return below is real.
    await waitFor(() =>
      expect(menu.contains(document.activeElement)).toBe(true),
    );

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    expect(area).toHaveFocus();
  });

  it("runs a Menu item's onClick and closes", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(<Composed onEdit={onEdit} />);

    fireEvent.contextMenu(screen.getByTestId("area"));
    await user.click(await screen.findByRole("menuitem", { name: "Edit" }));

    expect(onEdit).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("opens Menu's submenu inside a context menu", async () => {
    const user = userEvent.setup();
    render(<Composed />);

    fireEvent.contextMenu(screen.getByTestId("area"));
    const moveTo = await screen.findByRole("menuitem", { name: "Move to" });
    moveTo.focus();
    await user.keyboard("{ArrowRight}");

    expect(
      await screen.findByRole("menuitem", { name: "Archive" }),
    ).toBeInTheDocument();
  });

  it("calls the root's onOpenChange", async () => {
    const onOpenChange = vi.fn();
    render(<Composed RootProps={{ onOpenChange }} />);

    fireEvent.contextMenu(screen.getByTestId("area"));
    await screen.findByRole("menu");

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("does not open while disabled and leaves the browser's own menu", () => {
    render(<Composed RootProps={{ disabled: true }} />);

    // `true` means the default was not prevented: the native menu still shows.
    expect(fireEvent.contextMenu(screen.getByTestId("area"))).toBe(true);

    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });
});

describe("ContextMenuTrigger", () => {
  it("wraps the area in a div that draws no box", () => {
    render(<Composed />);

    expect(trigger().tagName).toBe("DIV");
    expect(trigger()).toHaveClass(styles["trigger"]!);
    expect(trigger()).toContainElement(screen.getByTestId("area"));
  });

  it("merges a caller's className with its own and marks the open state", async () => {
    render(<Composed TriggerProps={{ className: "caller" }} />);

    fireEvent.contextMenu(screen.getByTestId("area"));
    await screen.findByRole("menu");

    expect(trigger()).toHaveClass("caller", styles["trigger"]!);
    expect(trigger()).toHaveAttribute("data-popup-open");
  });

  it("is the rendered element itself with render, without the contents class", async () => {
    render(
      <ContextMenuRoot>
        <ContextMenuTrigger
          render={<Card title="Project" data-testid="area" />}
          className="caller"
        />
        <MenuPortal>
          <ContextMenuPositioner>
            <MenuPopup>
              <MenuItem label="Edit" />
            </MenuPopup>
          </ContextMenuPositioner>
        </MenuPortal>
      </ContextMenuRoot>,
    );

    const area = screen.getByTestId("area");
    expect(area).toHaveAttribute("data-slot", "context-menu-trigger");
    expect(area).toHaveClass("caller");
    expect(area).not.toHaveClass(styles["trigger"]!);

    fireEvent.contextMenu(area);
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("takes className only as a string", () => {
    const props: ContextMenuTriggerProps = {
      // @ts-expect-error -- className merges through cx, so a function of state is rejected
      className: () => "caller",
    };
    expect(props).toBeDefined();
  });
});

describe("ContextMenuPositioner", () => {
  it("merges a caller's className with its own and marks its state", async () => {
    render(<Composed PositionerProps={{ className: "caller" }} />);

    fireEvent.contextMenu(screen.getByTestId("area"));
    await screen.findByRole("menu");

    const positioner = document.querySelector(
      "[data-slot='context-menu-positioner']",
    );
    expect(positioner).toHaveClass("caller", styles["positioner"]);
    expect(positioner).toHaveAttribute("data-open");
  });

  it("takes className only as a string", () => {
    const props: ContextMenuPositionerProps = {
      // @ts-expect-error -- className merges through cx, so a function of state is rejected
      className: () => "caller",
    };
    expect(props).toBeDefined();
  });
});
