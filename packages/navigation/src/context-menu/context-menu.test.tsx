import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "@uiid/cards";
import { StarIcon } from "@uiid/icons/star";
import { describe, expect, it, vi } from "vitest";

import { Menu } from "../menu/menu";
import type { MenuItemType } from "../menu/menu.types";
import {
  MenuItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  SubmenuRoot,
  SubmenuTrigger,
} from "../menu/subcomponents";
import { ContextMenu } from "./context-menu";
import type {
  ContextMenuPositionerProps,
  ContextMenuProps,
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

/* An action with an icon and a description, a submenu three levels deep with
   a separator inside it, a separator and a link. */
const itemsWith = (onRename?: () => void): MenuItemType[] => [
  {
    label: "Rename",
    value: "rename",
    icon: StarIcon,
    description: "Give it a new name",
    onClick: onRename,
  },
  {
    label: "Move to",
    value: "move",
    items: [
      { label: "Inbox", value: "inbox" },
      { type: "separator" },
      {
        label: "Archive",
        value: "archive",
        items: [{ label: "2025", value: "2025" }],
      },
    ],
  },
  { type: "separator" },
  { label: "Open docs", value: "docs", href: "/docs" },
];
const ITEMS = itemsWith();

/* Each row of a popup as one line: its element, slot, role, text and link. */
const rows = (popup: HTMLElement) =>
  [
    ...popup.querySelectorAll<HTMLElement>(
      '[role="menuitem"], [role="separator"]',
    ),
  ].map((row) =>
    [
      row.tagName,
      row.dataset["slot"],
      row.getAttribute("role"),
      row.textContent,
      row.getAttribute("href"),
    ].join(" | "),
  );

const backdrops = () =>
  document.querySelectorAll('[data-slot="menu-backdrop"]');

const openContextMenu = async () => {
  fireEvent.contextMenu(screen.getByTestId("area"));
  return screen.findByRole("menu");
};

const Area = () => <Card title="Project" tabIndex={0} data-testid="area" />;

describe("ContextMenu", () => {
  it("renders no menu until the area is right-clicked", () => {
    render(
      <ContextMenu items={ITEMS}>
        <Area />
      </ContextMenu>,
    );
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("opens on contextmenu with the same rows Menu draws, at every level", async () => {
    const user = userEvent.setup();

    /* Menu's rows first: the root popup, then each submenu opened in turn. */
    const menu = render(<Menu trigger="Open" items={ITEMS} />);
    await user.click(screen.getByText("Open"));
    const expected: string[][] = [rows(await screen.findByRole("menu"))];
    screen.getByRole("menuitem", { name: "Move to" }).focus();
    await user.keyboard("{ArrowRight}");
    await screen.findByRole("menuitem", { name: "Archive" });
    expected.push(rows(screen.getAllByRole("menu")[1]!));
    screen.getByRole("menuitem", { name: "Archive" }).focus();
    await user.keyboard("{ArrowRight}");
    await screen.findByRole("menuitem", { name: "2025" });
    expected.push(rows(screen.getAllByRole("menu")[2]!));
    menu.unmount();

    render(
      <ContextMenu items={ITEMS}>
        <Area />
      </ContextMenu>,
    );
    const actual: string[][] = [rows(await openContextMenu())];
    screen.getByRole("menuitem", { name: "Move to" }).focus();
    await user.keyboard("{ArrowRight}");
    await screen.findByRole("menuitem", { name: "Archive" });
    actual.push(rows(screen.getAllByRole("menu")[1]!));
    screen.getByRole("menuitem", { name: "Archive" }).focus();
    await user.keyboard("{ArrowRight}");
    await screen.findByRole("menuitem", { name: "2025" });
    actual.push(rows(screen.getAllByRole("menu")[2]!));

    // The fixture really holds a separator, a link and a description.
    expect(expected[0]).toEqual([
      expect.stringContaining(
        "menu-item | menuitem | RenameGive it a new name",
      ),
      expect.stringContaining("submenu-trigger | menuitem | Move to"),
      expect.stringContaining("menu-separator | separator"),
      "A | menu-link-item | menuitem | Open docs | /docs",
    ]);
    expect(actual).toEqual(expected);
  });

  it("runs an item's onClick and closes", async () => {
    const user = userEvent.setup();
    const onRename = vi.fn();
    render(
      <ContextMenu items={itemsWith(onRename)}>
        <Area />
      </ContextMenu>,
    );

    await openContextMenu();
    await user.click(screen.getByRole("menuitem", { name: /Rename/ }));

    expect(onRename).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
  });

  it("closes on Escape and returns focus to the area", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu items={ITEMS}>
        <Area />
      </ContextMenu>,
    );

    const area = screen.getByTestId("area");
    area.focus();
    const menu = await openContextMenu();
    await waitFor(() =>
      expect(menu.contains(document.activeElement)).toBe(true),
    );

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByRole("menu")).not.toBeInTheDocument(),
    );
    expect(area).toHaveFocus();
  });

  it("wraps the area in the trigger that draws no box", () => {
    render(
      <ContextMenu items={ITEMS}>
        <Area />
      </ContextMenu>,
    );

    expect(trigger().tagName).toBe("DIV");
    expect(trigger()).toHaveClass(styles["trigger"]!);
    expect(trigger()).toContainElement(screen.getByTestId("area"));
  });
});

describe("ContextMenu backdrop", () => {
  it("draws no backdrop while closed", () => {
    render(
      <ContextMenu items={ITEMS}>
        <Area />
      </ContextMenu>,
    );
    expect(backdrops()).toHaveLength(0);
  });

  it("dims the page by default when opened", async () => {
    render(
      <ContextMenu items={ITEMS}>
        <Area />
      </ContextMenu>,
    );
    await openContextMenu();
    expect(backdrops()).toHaveLength(1);
  });

  it("omits the backdrop with backdrop={false}", async () => {
    render(
      <ContextMenu items={ITEMS} backdrop={false}>
        <Area />
      </ContextMenu>,
    );
    // The menu still opens; only the dimming is gone.
    await openContextMenu();
    expect(backdrops()).toHaveLength(0);
  });

  it("does not stack a second backdrop when a submenu opens", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu items={ITEMS}>
        <Area />
      </ContextMenu>,
    );
    await openContextMenu();
    screen.getByRole("menuitem", { name: "Move to" }).focus();
    await user.keyboard("{ArrowRight}");
    await screen.findByRole("menuitem", { name: "Archive" });

    expect(backdrops()).toHaveLength(1);
  });

  it("forwards BackdropProps to the backdrop", async () => {
    render(
      <ContextMenu items={ITEMS} BackdropProps={{ className: "dim" }}>
        <Area />
      </ContextMenu>,
    );
    await openContextMenu();
    expect(backdrops()[0]).toHaveClass("dim");
  });

  /* Base UI's context menu root takes no `modal`: a context menu is always
     modal, so `backdrop` is the only switch. */
  it("rejects RootProps.modal", () => {
    void (
      <ContextMenu
        items={ITEMS}
        // @ts-expect-error -- Base UI's ContextMenu.Root takes no `modal`
        RootProps={{ modal: false }}
      >
        <Area />
      </ContextMenu>
    );
  });
});

describe("ContextMenu slots", () => {
  it("passes RootProps to the root", async () => {
    const onOpenChange = vi.fn();
    render(
      <ContextMenu items={ITEMS} RootProps={{ onOpenChange }}>
        <Area />
      </ContextMenu>,
    );
    await openContextMenu();
    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });

  it("does not open while RootProps.disabled is set", () => {
    render(
      <ContextMenu items={ITEMS} RootProps={{ disabled: true }}>
        <Area />
      </ContextMenu>,
    );
    // `true`: the default was not prevented, so the browser's menu shows.
    expect(fireEvent.contextMenu(screen.getByTestId("area"))).toBe(true);
    expect(screen.queryByRole("menu")).not.toBeInTheDocument();
  });

  it("passes TriggerProps to the trigger", () => {
    render(
      <ContextMenu items={ITEMS} TriggerProps={{ className: "caller" }}>
        <Area />
      </ContextMenu>,
    );
    expect(trigger()).toHaveClass("caller", styles["trigger"]!);
  });

  it("makes TriggerProps.render the trigger itself, holding children", async () => {
    render(
      <ContextMenu
        items={ITEMS}
        TriggerProps={{ render: <section data-testid="area" tabIndex={0} /> }}
      >
        <span>Project</span>
      </ContextMenu>,
    );

    const area = screen.getByTestId("area");
    expect(area).toHaveAttribute("data-slot", "context-menu-trigger");
    expect(area).not.toHaveClass(styles["trigger"]!);
    expect(area).toHaveTextContent("Project");
    expect(await openContextMenu()).toBeInTheDocument();
  });

  it("passes PositionerProps and PopupProps to the root positioner and popup", async () => {
    render(
      <ContextMenu
        items={ITEMS}
        PositionerProps={{ className: "placed" }}
        PopupProps={{ "aria-label": "Project actions", className: "surface" }}
      >
        <Area />
      </ContextMenu>,
    );

    const menu = await openContextMenu();
    expect(menu).toHaveClass("surface");
    expect(menu).toHaveAccessibleName("Project actions");
    expect(
      document.querySelector("[data-slot='context-menu-positioner']"),
    ).toHaveClass("placed");
  });

  it("renders the menu and its submenus inside the PortalProps container", async () => {
    const user = userEvent.setup();
    const container = document.createElement("div");
    document.body.append(container);
    render(
      <ContextMenu items={ITEMS} PortalProps={{ container }}>
        <Area />
      </ContextMenu>,
    );

    const menu = await openContextMenu();
    expect(container).toContainElement(menu);
    screen.getByRole("menuitem", { name: "Move to" }).focus();
    await user.keyboard("{ArrowRight}");
    expect(container).toContainElement(
      await screen.findByRole("menuitem", { name: "Archive" }),
    );
    container.remove();
  });

  it("reaches every row with the item, link, separator and submenu slots", async () => {
    const user = userEvent.setup();
    const onItem = vi.fn();
    render(
      <ContextMenu
        items={ITEMS}
        ItemProps={{ className: "row", onClick: onItem }}
        LinkItemProps={{ className: "link" }}
        SeparatorProps={{ className: "line" }}
        SubmenuTriggerProps={{ className: "opens" }}
      >
        <Area />
      </ContextMenu>,
    );

    await openContextMenu();
    expect(screen.getByRole("menuitem", { name: /Rename/ })).toHaveClass("row");
    expect(screen.getByRole("menuitem", { name: "Open docs" })).toHaveClass(
      "link",
    );
    expect(screen.getByRole("separator")).toHaveClass("line");

    const moveTo = screen.getByRole("menuitem", { name: "Move to" });
    expect(moveTo).toHaveClass("opens");
    moveTo.focus();
    await user.keyboard("{ArrowRight}");
    await user.click(await screen.findByRole("menuitem", { name: "Inbox" }));

    expect(onItem).toHaveBeenCalledOnce();
  });

  it("reaches a submenu's positioner and popup with the submenu slots", async () => {
    const user = userEvent.setup();
    render(
      <ContextMenu
        items={ITEMS}
        SubmenuPositionerProps={{ className: "sub-placed" }}
        SubmenuPopupProps={{ className: "sub-surface" }}
      >
        <Area />
      </ContextMenu>,
    );

    const root = await openContextMenu();
    screen.getByRole("menuitem", { name: "Move to" }).focus();
    await user.keyboard("{ArrowRight}");
    await screen.findByRole("menuitem", { name: "Archive" });

    const submenu = screen.getAllByRole("menu")[1]!;
    expect(submenu).toHaveClass("sub-surface");
    expect(root).not.toHaveClass("sub-surface");
    expect(submenu.closest("[data-slot='menu-positioner']")).toHaveClass(
      "sub-placed",
    );
  });

  it("reaches every submenu root with SubmenuRootProps", async () => {
    const onOpenChange = vi.fn();
    const user = userEvent.setup();
    render(
      <ContextMenu items={ITEMS} SubmenuRootProps={{ onOpenChange }}>
        <Area />
      </ContextMenu>,
    );

    await openContextMenu();
    screen.getByRole("menuitem", { name: "Move to" }).focus();
    await user.keyboard("{ArrowRight}");
    await screen.findByRole("menuitem", { name: "Archive" });

    expect(onOpenChange).toHaveBeenCalledWith(true, expect.anything());
  });
});

describe("ContextMenu slot props", () => {
  /* Each slot rejects the keys ContextMenu fills itself. */
  const slot = (props: Partial<ContextMenuProps>) => (
    <ContextMenu items={ITEMS} {...props}>
      <Area />
    </ContextMenu>
  );

  it("rejects the trigger's children, which are ContextMenu's children", () => {
    // @ts-expect-error -- `children` are the trigger's content
    void slot({ TriggerProps: { children: "Other" } });
  });

  it("rejects children in the portal, positioner and popup slots", () => {
    // @ts-expect-error -- the portal holds ContextMenu's positioner
    void slot({ PortalProps: { children: "Other" } });
    // @ts-expect-error -- the positioner holds the root popup
    void slot({ PositionerProps: { children: "Other" } });
    // @ts-expect-error -- `items` fill the popup
    void slot({ PopupProps: { children: "Other" } });
  });

  it("rejects the keys each entry owns in ItemProps", () => {
    // @ts-expect-error -- each entry's `label` and `icon` are its content
    void slot({ ItemProps: { children: "Other" } });
    // @ts-expect-error -- each entry's `label` is its content
    void slot({ ItemProps: { label: "Other" } });
    // @ts-expect-error -- each entry's `icon` is its content
    void slot({ ItemProps: { icon: StarIcon } });
    // @ts-expect-error -- a row's second line belongs to its entry
    void slot({ ItemProps: { description: "Other" } });
  });

  it("rejects the keys each link entry owns in LinkItemProps", () => {
    // @ts-expect-error -- each link entry's `href` is its own
    void slot({ LinkItemProps: { href: "/other" } });
    // @ts-expect-error -- each entry's `label` is its content
    void slot({ LinkItemProps: { label: "Other" } });
    // @ts-expect-error -- each entry's `icon` is its content
    void slot({ LinkItemProps: { icon: StarIcon } });
    // @ts-expect-error -- a row's second line belongs to its entry
    void slot({ LinkItemProps: { description: "Other" } });
    // @ts-expect-error -- each entry's `label` and `icon` are its content
    void slot({ LinkItemProps: { children: "Other" } });
  });

  it("rejects a separator's children in SeparatorProps", () => {
    // @ts-expect-error -- a separator entry draws no content
    void slot({ SeparatorProps: { children: "Other" } });
  });

  it("rejects the keys each submenu entry owns in the submenu slots", () => {
    // @ts-expect-error -- each entry's `items` fill its submenu
    void slot({ SubmenuRootProps: { children: "Other" } });
    // @ts-expect-error -- each entry's `label` and `icon` are its content
    void slot({ SubmenuTriggerProps: { children: "Other" } });
    // @ts-expect-error -- each entry's `label` is its content
    void slot({ SubmenuTriggerProps: { label: "Other" } });
    // @ts-expect-error -- each entry's `icon` is its content
    void slot({ SubmenuTriggerProps: { icon: StarIcon } });
    // @ts-expect-error -- a row's second line belongs to its entry
    void slot({ SubmenuTriggerProps: { description: "Other" } });
    // @ts-expect-error -- the positioner holds the submenu's popup
    void slot({ SubmenuPositionerProps: { children: "Other" } });
    // @ts-expect-error -- each entry's `items` fill its submenu's popup
    void slot({ SubmenuPopupProps: { children: "Other" } });
  });
});
