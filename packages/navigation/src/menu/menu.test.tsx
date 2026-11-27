import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Card } from "@uiid/cards";
import { PencilIcon } from "@uiid/icons/pencil";
import { StarIcon } from "@uiid/icons/star";
import { describe, it, expect, onTestFinished, vi } from "vitest";

import { Menu } from "./menu";
import { MOCK_ITEMS } from "./menu.mocks";
import type { MenuItemType, MenuProps } from "./menu.types";
import { renderMenuItems } from "./render-menu-items";
import {
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuLinkItem,
  MenuPopup,
  MenuPortal,
  MenuPositioner,
  MenuRoot,
  MenuSeparator,
  MenuTrigger,
  SubmenuRoot,
  SubmenuTrigger,
} from "./subcomponents";

/* The layout Separator's classes, reached by path like Select in the browser
   test: the test only checks MenuSeparator draws that line. */
import separatorStyles from "../../../layout/src/separator/separator.module.css";
import styles from "./menu.module.css";
import menuCss from "./menu.module.css?raw";

/* Stand-ins for `Button` and `Text`: a component that renders a real <button>
   and one that renders a <span>. */
const ButtonLike = (props: React.ComponentProps<"button">) => (
  <button type="button" {...props} />
);
const TextLike = (props: React.ComponentProps<"span">) => <span {...props} />;

const backdrops = () =>
  document.querySelectorAll('[data-slot="menu-backdrop"]');

/* The highlight is `composes-option`'s, shared with Select. A Menu rule on
   `[data-highlighted]` that paints a fill or a text color, including the list
   colors the icon and description read, would split the two again. */
describe("menu.module.css", () => {
  it("leaves the highlight's fill and text color to composes-option", () => {
    const rules = [
      ...menuCss.matchAll(/\[data-highlighted\][^{]*\{[^}]*\}/g),
    ].map(([rule]) => rule);

    for (const rule of rules) {
      expect(rule).not.toMatch(
        /(^|[\s;{])(background|background-color|color|--list-[\w-]+-color)\s*:/,
      );
    }
  });
});

describe("Menu backdrop", () => {
  it("renders no backdrop while closed", () => {
    render(<Menu trigger="Open" items={MOCK_ITEMS} />);
    expect(backdrops()).toHaveLength(0);
  });

  it("dims the page by default when opened", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={MOCK_ITEMS} />);

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(backdrops()).toHaveLength(1);
  });

  it("omits the backdrop when opted out", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={MOCK_ITEMS} backdrop={false} />);

    await user.click(screen.getByText("Open"));

    // The menu still opens — only the dimming is gone.
    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(backdrops()).toHaveLength(0);
  });

  /*
   * A submenu renders the same portal tree as its parent. Drawing a backdrop
   * there too would stack two dims and darken the page a second time the moment
   * a submenu opened, so only the root menu draws one.
   */
  it("does not stack a second backdrop when a submenu opens", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={MOCK_ITEMS} />);

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Lorem ipsum"));

    expect(await screen.findByText("Item 3.1")).toBeInTheDocument();
    expect(backdrops()).toHaveLength(1);
  });

  it("forwards BackdropProps to the backdrop element", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        BackdropProps={{ "data-testid": "dim" } as never}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByTestId("dim")).toHaveAttribute(
      "data-slot",
      "menu-backdrop",
    );
  });

  /* A non-modal menu blocks nothing, so it draws no backdrop to say it does. */
  it("draws no backdrop when the root is not modal", async () => {
    const user = userEvent.setup();
    render(
      <Menu trigger="Open" items={MOCK_ITEMS} RootProps={{ modal: false }} />,
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(backdrops()).toHaveLength(0);
  });

  it("draws no backdrop when not modal even with backdrop set", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        backdrop
        RootProps={{ modal: false }}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("menu")).toBeInTheDocument();
    expect(backdrops()).toHaveLength(0);
  });

  it("dims the page when the root is explicitly modal", async () => {
    const user = userEvent.setup();
    render(
      <Menu trigger="Open" items={MOCK_ITEMS} RootProps={{ modal: true }} />,
    );

    await user.click(screen.getByText("Open"));

    expect(backdrops()).toHaveLength(1);
  });
});

/*
 * Menu wears the surface every other popup list does: a `Card` holding
 * `ListItem` rows, the same structure as Select's popup.
 */
describe("Menu surface", () => {
  const popup = () =>
    document.querySelector<HTMLElement>("[data-slot='menu-popup']");

  it("renders the popup as a Card with each row on a ListItem", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={MOCK_ITEMS} />);

    await user.click(screen.getByText("Open"));

    expect(popup()).toHaveClass("palette-neutral");
    expect(
      popup()!.querySelector("[data-slot='card-inner-container']"),
    ).toBeInTheDocument();

    const rows = document.querySelectorAll(
      "[data-slot='menu-item'], [data-slot='submenu-trigger']",
    );
    expect(rows).toHaveLength(MOCK_ITEMS.length);
    for (const row of rows) {
      expect(row.querySelector("[data-slot='list-item']")).toBeInTheDocument();
    }
  });

  it("gives the popup Card the same padding and gap defaults as Select's", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={MOCK_ITEMS} />);

    await user.click(screen.getByText("Open"));

    expect(popup()).toHaveAttribute("data-ui-pt", "2");
    expect(popup()).toHaveAttribute("data-ui-gap", "0");
    expect(popup()).toHaveAttribute("data-ui-w", "full");
  });

  it("lifts the popup Card with the shadow Select's popup wears", async () => {
    // The shadow class is the one a `Card` gains from `shadow`.
    const { getByTestId, unmount } = render(
      <>
        <Card data-testid="flat" />
        <Card data-testid="lifted" shadow />
      </>,
    );
    const flat = new Set(getByTestId("flat").classList);
    const [shadowClass] = [...getByTestId("lifted").classList].filter(
      (name) => !flat.has(name),
    );
    unmount();

    const user = userEvent.setup();
    render(<Menu trigger="Open" items={MOCK_ITEMS} />);
    await user.click(screen.getByText("Open"));

    expect(shadowClass).toBeDefined();
    expect(popup()).toHaveClass(shadowClass!);
  });

  /*
   * Base UI merges the render element's own props over the part's, so a
   * default written as a literal on the `Card` would beat these.
   */
  it("passes layout props from PopupProps to the Card", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        PopupProps={{ p: 4, gap: 1, w: null }}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(popup()).toHaveAttribute("data-ui-pt", "4");
    expect(popup()).toHaveAttribute("data-ui-pl", "4");
    expect(popup()).toHaveAttribute("data-ui-gap", "1");
    expect(popup()).not.toHaveAttribute("data-ui-w");
  });

  it("tints the popup Card with a palette hue", async () => {
    const user = userEvent.setup();
    render(
      <Menu trigger="Open" items={MOCK_ITEMS} PopupProps={{ color: "blue" }} />,
    );

    await user.click(screen.getByText("Open"));

    expect(popup()).toHaveClass("palette-blue");
  });
});

describe("Menu parts", () => {
  const renderParts = (children: React.ReactNode) =>
    render(
      <MenuRoot open>
        <MenuTrigger>Open</MenuTrigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup>{children}</MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>,
    );

  it("draws a MenuItem's icon and label with no children", () => {
    renderParts(<MenuItem label="Edit" icon={PencilIcon} />);

    const item = screen.getByRole("menuitem", { name: "Edit" });
    expect(
      item.querySelector("[data-slot='list-item-icon']"),
    ).toBeInTheDocument();
    expect(item.querySelector("[data-slot='list-item']")).toHaveTextContent(
      "Edit",
    );
  });

  it("keeps a titled icon out of a MenuItem's name", () => {
    const TitledIcon = (props: React.SVGProps<SVGSVGElement>) => (
      <svg {...props}>
        <title>Pencil</title>
      </svg>
    );
    renderParts(<MenuItem label="Edit" icon={TitledIcon} />);

    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  });

  it("draws a MenuItem's description under its label", () => {
    renderParts(<MenuItem label="Edit" description="Change the name" />);

    expect(
      screen
        .getByRole("menuitem")
        .querySelector("[data-slot='list-text-description']"),
    ).toHaveTextContent("Change the name");
  });

  it("lets a MenuItem's children replace the row's content", () => {
    renderParts(
      <MenuItem label="Edit" icon={PencilIcon}>
        <span data-testid="custom-row">Custom</span>
      </MenuItem>,
    );

    const item = screen.getByRole("menuitem");
    expect(screen.getByTestId("custom-row")).toBeInTheDocument();
    expect(item.querySelector("[data-slot='list-item-icon']")).toBeNull();
    expect(item).not.toHaveTextContent("Edit");
  });

  it("renders a MenuLinkItem as a link row with its icon, label and description", () => {
    renderParts(
      <MenuLinkItem
        href="/settings"
        label="Settings"
        description="Account and billing"
        icon={PencilIcon}
      />,
    );

    const link = screen.getByRole("menuitem");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/settings");
    expect(link).toHaveAttribute("data-slot", "menu-link-item");
    expect(link).toHaveClass(styles["link-item"]!);
    expect(
      link.querySelector("[data-slot='list-item-icon']"),
    ).toBeInTheDocument();
    expect(
      link.querySelector("[data-slot='list-text-description']"),
    ).toHaveTextContent("Account and billing");
  });

  it("renders a MenuLinkItem through a router's link component", () => {
    const RouterLink = ({
      to,
      ...props
    }: React.ComponentProps<"a"> & { to: string }) => (
      <a data-router-link="" href={to} {...props} />
    );
    renderParts(
      <MenuLinkItem render={<RouterLink to="/home" />} label="Home" />,
    );

    const link = screen.getByRole("menuitem", { name: "Home" });
    expect(link).toHaveAttribute("data-router-link");
    expect(link).toHaveAttribute("href", "/home");
  });

  it("renders a MenuSeparator as a horizontal separator and keeps a caller's class", () => {
    renderParts(
      <>
        <MenuItem label="Edit" />
        <MenuSeparator className="custom" />
        <MenuItem label="Delete" />
      </>,
    );

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("data-slot", "menu-separator");
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    // The caller's class merges with the layout line's own.
    expect(separator).toHaveClass(
      "custom",
      separatorStyles["separator"]!,
      separatorStyles["orientation-horizontal"]!,
    );
  });

  it("gives a vertical MenuSeparator's line and its ARIA the same orientation", () => {
    renderParts(<MenuSeparator orientation="vertical" />);

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("aria-orientation", "vertical");
    expect(separator).toHaveClass(separatorStyles["orientation-vertical"]!);
    expect(separator).not.toHaveClass(
      separatorStyles["orientation-horizontal"]!,
    );
  });

  it("draws a SubmenuTrigger's icon, label and description", () => {
    renderParts(
      <SubmenuRoot>
        <SubmenuTrigger
          label="Share"
          description="Send a copy"
          icon={PencilIcon}
        />
      </SubmenuRoot>,
    );

    const trigger = screen.getByRole("menuitem");
    expect(
      trigger.querySelector("[data-slot='list-item-icon']"),
    ).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Share");
    expect(
      trigger.querySelector("[data-slot='list-text-description']"),
    ).toHaveTextContent("Send a copy");
  });

  it("lets a SubmenuTrigger's children replace the row's content", () => {
    renderParts(
      <SubmenuRoot>
        <SubmenuTrigger label="Share">
          <span data-testid="custom-trigger">Custom</span>
        </SubmenuTrigger>
      </SubmenuRoot>,
    );

    expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
    expect(screen.getByRole("menuitem")).not.toHaveTextContent("Share");
  });

  /* The chevron is the part's own, beside the row's content, so a composed
     trigger needs no hand-placed icon and custom children keep it. */
  const chevron = (trigger: HTMLElement) =>
    trigger.querySelector(":scope > svg");

  it("draws a chevron beside a SubmenuTrigger's content", () => {
    renderParts(
      <SubmenuRoot>
        <SubmenuTrigger label="Share" icon={PencilIcon} />
      </SubmenuRoot>,
    );

    const trigger = screen.getByRole("menuitem");
    expect(chevron(trigger)).toBeInTheDocument();
    expect(trigger.lastElementChild).toBe(chevron(trigger));
  });

  it("keeps the chevron when children replace a SubmenuTrigger's content", () => {
    renderParts(
      <SubmenuRoot>
        <SubmenuTrigger label="Share">
          <span>Custom</span>
        </SubmenuTrigger>
      </SubmenuRoot>,
    );

    expect(chevron(screen.getByRole("menuitem"))).toBeInTheDocument();
  });

  it("draws a chevron for a trigger composed from text alone", () => {
    renderParts(
      <SubmenuRoot>
        <SubmenuTrigger>Move to</SubmenuTrigger>
      </SubmenuRoot>,
    );

    const trigger = screen.getByRole("menuitem", { name: "Move to" });
    expect(chevron(trigger)).toHaveClass(styles["submenu-chevron"]);
    expect(chevron(trigger)).toHaveAttribute("aria-hidden", "true");
  });

  /* With `children` in place of the row, `label` is the only typeahead text. */
  it("keys typeahead on a MenuItem's label when children replace its row", async () => {
    const user = userEvent.setup();
    render(
      <MenuRoot>
        <MenuTrigger>Open</MenuTrigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup>
              <MenuItem label="Archive">
                <span>First</span>
              </MenuItem>
              <MenuItem label="Edit">
                <span>Second</span>
              </MenuItem>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>,
    );

    await user.click(screen.getByText("Open"));
    await user.keyboard("e");

    const [, edit] = screen.getAllByRole("menuitem");
    expect(edit).toHaveAttribute("data-highlighted");
  });

  it("keys typeahead on a SubmenuTrigger's label when children replace its row", async () => {
    const user = userEvent.setup();
    render(
      <MenuRoot>
        <MenuTrigger>Open</MenuTrigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup>
              <MenuItem label="Archive" />
              <SubmenuRoot>
                <SubmenuTrigger label="Share">
                  <span>Custom</span>
                </SubmenuTrigger>
              </SubmenuRoot>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>,
    );

    await user.click(screen.getByText("Open"));
    await user.keyboard("s");

    const [, share] = screen.getAllByRole("menuitem");
    expect(share).toHaveAttribute("data-highlighted");
  });
});

describe("Menu items", () => {
  it("calls the clicked item's own onClick", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const onDelete = vi.fn();
    render(
      <Menu
        trigger="Open"
        items={[
          { label: "Edit", value: "edit", onClick: onEdit },
          { label: "Delete", value: "delete", onClick: onDelete },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));

    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onEdit).not.toHaveBeenCalled();
  });

  it("calls ItemProps.onClick as well as the item's own onClick", async () => {
    const user = userEvent.setup();
    const onItem = vi.fn();
    const onAny = vi.fn();
    render(
      <Menu
        trigger="Open"
        items={[{ label: "Edit", value: "edit", onClick: onItem }]}
        ItemProps={{ onClick: onAny }}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(onAny).toHaveBeenCalledTimes(1);
    expect(onItem).toHaveBeenCalledTimes(1);
  });

  it("makes a disabled item inert", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Menu
        trigger="Open"
        items={[{ label: "Edit", value: "edit", disabled: true, onClick }]}
      />,
    );

    await user.click(screen.getByText("Open"));
    const item = screen.getByRole("menuitem", { name: "Edit" });
    await user.click(item);

    expect(item).toHaveAttribute("aria-disabled", "true");
    expect(onClick).not.toHaveBeenCalled();
  });

  /*
   * Pins Base UI's behaviour, not Menu's CSS: the keyboard can land on a
   * disabled row, which is why `composes-option` keeps the highlight on it.
   * That the row is visibly highlighted is checked in menu.browser.test.tsx.
   */
  it("lets the keyboard highlight a disabled item", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          { label: "Edit", value: "edit", disabled: true },
          { label: "Delete", value: "delete" },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.keyboard("{ArrowDown}");

    const edit = screen.getByRole("menuitem", { name: "Edit" });
    expect(edit).toHaveAttribute("data-highlighted");
    expect(edit).toHaveAttribute("data-disabled");
  });

  it("renders an item's icon before its label", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          { label: "Star", value: "star", icon: StarIcon },
          { label: "Plain", value: "plain" },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));

    const star = screen.getByRole("menuitem", { name: "Star" });
    const icon = star.querySelector("svg");
    expect(icon).toHaveAttribute("aria-hidden", "true");
    // The icon leads, and the label is the text right after it.
    expect(icon!.parentElement!.firstChild).toBe(icon);
    expect(icon!.nextSibling?.textContent).toBe("Star");
    expect(
      screen.getByRole("menuitem", { name: "Plain" }).querySelector("svg"),
    ).toBeNull();
  });

  it("wires submenu items the same way, including ItemProps", async () => {
    const itemProps = { className: "from-item-props" };
    const user = userEvent.setup();
    const onSub = vi.fn();
    render(
      <Menu
        trigger="Open"
        items={[
          {
            label: "More",
            value: "more",
            items: [
              { label: "Archive", value: "archive", onClick: onSub },
              { label: "Locked", value: "locked", disabled: true },
            ],
          },
        ]}
        ItemProps={itemProps}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("More"));
    const archive = await screen.findByRole("menuitem", { name: "Archive" });

    expect(archive).toHaveClass("from-item-props");
    expect(screen.getByRole("menuitem", { name: "Locked" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );

    /* A pointer can't reach the submenu while it is still entering, which
       happy-dom reports as pointer-events: none, so choose it by keyboard. */
    archive.focus();
    await user.keyboard("{Enter}");
    expect(onSub).toHaveBeenCalledTimes(1);
  });

  it("disables a submenu trigger", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          {
            label: "More",
            value: "more",
            disabled: true,
            items: [{ label: "Archive", value: "archive" }],
          },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("menuitem", { name: "More" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  describe("at depth", () => {
    const popups = () => document.querySelectorAll('[data-slot="menu-popup"]');

    /* Opens "More", then its "Share" submenu, by keyboard: happy-dom reports a
       submenu's rows as pointer-events: none while it enters. */
    const openThirdLevel = async (user: ReturnType<typeof userEvent.setup>) => {
      await user.click(screen.getByText("Open"));
      await user.click(screen.getByText("More"));
      const share = await screen.findByRole("menuitem", { name: "Share" });
      share.focus();
      await user.keyboard("{ArrowRight}");
      return screen.findByRole("menuitem", { name: "Email" });
    };

    const threeLevels = (
      onEmail?: () => void,
      share?: Pick<MenuProps["items"][number], "disabled">,
      email?: Pick<MenuProps["items"][number], "disabled">,
    ): MenuProps["items"] => [
      { label: "Edit", value: "edit" },
      {
        label: "More",
        value: "more",
        items: [
          { label: "Archive", value: "archive" },
          {
            label: "Share",
            value: "share",
            items: [
              { label: "Email", value: "email", onClick: onEmail, ...email },
              { label: "Copy link", value: "link" },
            ],
            ...share,
          },
        ],
      },
    ];

    it("opens a submenu inside a submenu, and its leaf's onClick fires", async () => {
      const user = userEvent.setup();
      const onEmail = vi.fn();
      render(<Menu trigger="Open" items={threeLevels(onEmail)} />);

      const email = await openThirdLevel(user);
      expect(popups()).toHaveLength(3);

      email.focus();
      await user.keyboard("{Enter}");
      expect(onEmail).toHaveBeenCalledTimes(1);
    });

    it("calls ItemProps.onClick at the third level, before the item's own", async () => {
      const user = userEvent.setup();
      const calls: string[] = [];
      render(
        <Menu
          trigger="Open"
          items={threeLevels(() => calls.push("item"))}
          ItemProps={{ onClick: () => calls.push("slot") }}
        />,
      );

      const email = await openThirdLevel(user);
      email.focus();
      await user.keyboard("{Enter}");
      expect(calls).toEqual(["slot", "item"]);
    });

    it("reaches every level with the submenu slots", async () => {
      const user = userEvent.setup();
      render(
        <Menu
          trigger="Open"
          items={threeLevels()}
          ItemProps={{ className: "from-item-props" }}
          SubmenuTriggerProps={{ className: "from-trigger-props" }}
        />,
      );

      const email = await openThirdLevel(user);
      expect(email).toHaveClass("from-item-props");
      expect(screen.getByRole("menuitem", { name: "Share" })).toHaveClass(
        "from-trigger-props",
      );
    });

    it("lets a second-level entry's disabled win over SubmenuTriggerProps", async () => {
      const user = userEvent.setup();
      render(
        <Menu
          trigger="Open"
          items={threeLevels(undefined, { disabled: true })}
          SubmenuTriggerProps={{ disabled: false }}
        />,
      );

      await user.click(screen.getByText("Open"));
      await user.click(screen.getByText("More"));
      const share = await screen.findByRole("menuitem", { name: "Share" });
      // A submenu trigger, not a plain row that dropped its `items`.
      expect(share).toHaveAttribute("data-slot", "submenu-trigger");
      expect(share).toHaveAttribute("aria-haspopup", "menu");
      expect(share).toHaveAttribute("aria-disabled", "true");

      share.focus();
      await user.keyboard("{ArrowRight}");
      expect(screen.queryByRole("menuitem", { name: "Email" })).toBeNull();
      expect(popups()).toHaveLength(2);
    });

    it("reaches every submenu root with SubmenuRootProps", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <Menu
          trigger="Open"
          items={threeLevels()}
          SubmenuRootProps={{ onOpenChange }}
        />,
      );

      await openThirdLevel(user);
      const opened = onOpenChange.mock.calls.filter(([open]) => open === true);
      expect(opened).toHaveLength(2);
    });

    it("lets a third-level entry's disabled win over ItemProps", async () => {
      const user = userEvent.setup();
      render(
        <Menu
          trigger="Open"
          items={threeLevels(undefined, undefined, { disabled: true })}
          ItemProps={{ disabled: false }}
        />,
      );

      const email = await openThirdLevel(user);
      expect(email).toHaveAttribute("aria-disabled", "true");
    });

    it("reaches every submenu positioner with SubmenuPositionerProps", async () => {
      const user = userEvent.setup();
      render(
        <Menu
          trigger="Open"
          items={threeLevels()}
          SubmenuPositionerProps={{ sideOffset: 12 }}
        />,
      );

      await openThirdLevel(user);
      const positioners = document.querySelectorAll<HTMLElement>(
        '[data-slot="menu-positioner"]',
      );
      expect(positioners).toHaveLength(3);
      const [root, second, third] = positioners;
      // Base UI offsets the floating element by sideOffset from its anchor.
      // happy-dom's layout is zero-sized and limitShift holds the cross axis
      // at 0, so only that offset is left. Positioning is async, so wait.
      await waitFor(() => {
        expect(root?.style.transform).toBe("translate(0px, 4px)");
        expect(second?.style.transform).toBe("translate(12px, 0px)");
        expect(third?.style.transform).toBe("translate(12px, 0px)");
      });
    });

    it("merges SubmenuPopupProps onto every submenu popup and not the root's", async () => {
      const user = userEvent.setup();
      render(
        <Menu
          trigger="Open"
          items={threeLevels()}
          SubmenuPopupProps={{ className: "from-submenu-popup" }}
        />,
      );

      await openThirdLevel(user);
      const [root, second, third] = popups();
      expect(root).not.toHaveClass("from-submenu-popup");
      expect(second).toHaveClass("from-submenu-popup", styles["popup"]);
      expect(third).toHaveClass("from-submenu-popup", styles["popup"]);
    });

    it("renders the menu and its submenus inside the PortalProps container", async () => {
      const user = userEvent.setup();
      const container = document.createElement("div");
      document.body.appendChild(container);
      onTestFinished(() => container.remove());
      render(
        <Menu
          trigger="Open"
          items={threeLevels()}
          PortalProps={{ container }}
        />,
      );

      await openThirdLevel(user);
      expect(popups()).toHaveLength(3);
      // A submenu portal without the slot would still land inside `container`,
      // nested in its parent's portal; with it, each one is a direct child.
      for (const popup of popups()) {
        const portal = popup.closest('[data-slot="menu-portal"]');
        expect(portal?.parentElement).toBe(container);
      }
    });
  });
});

describe("Menu descriptions and links", () => {
  it("draws an entry's description under its label", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          {
            label: "Copy link",
            value: "copy",
            description: "Anyone with the link can view",
          },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));

    // The description is text inside the row, so it joins the row's name.
    const row = screen.getByRole("menuitem", {
      name: "Copy link Anyone with the link can view",
    });
    expect(
      row.querySelector("[data-slot='list-text-description']"),
    ).toHaveTextContent("Anyone with the link can view");
  });

  it("draws a submenu entry's description on its trigger", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          {
            label: "Share",
            value: "share",
            description: "Send a copy",
            items: [{ label: "Email", value: "email" }],
          },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(
      document.querySelector(
        "[data-slot='submenu-trigger'] [data-slot='list-text-description']",
      ),
    ).toHaveTextContent("Send a copy");
  });

  it("renders an href entry as a link menu item", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          { label: "Edit", value: "edit" },
          { label: "Settings", value: "settings", href: "/settings" },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));

    const link = screen.getByRole("menuitem", { name: "Settings" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/settings");
    expect(screen.getByRole("menuitem", { name: "Edit" }).tagName).not.toBe(
      "A",
    );
  });

  it("renders an href entry inside a submenu as a link menu item", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          {
            label: "More",
            value: "more",
            items: [{ label: "Docs", value: "docs", href: "/docs" }],
          },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("More"));

    const link = await screen.findByRole("menuitem", { name: "Docs" });
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "/docs");
  });

  it("calls LinkItemProps.onClick, then the link entry's own onClick", async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <Menu
        trigger="Open"
        items={[
          {
            label: "Settings",
            value: "settings",
            // A fragment link keeps happy-dom from navigating away.
            href: "#settings",
            onClick: () => calls.push("entry"),
          },
        ]}
        LinkItemProps={{ onClick: () => calls.push("slot") }}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByRole("menuitem", { name: "Settings" }));

    expect(calls).toEqual(["slot", "entry"]);
  });

  it("reaches every link item with LinkItemProps", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          { label: "Docs", value: "docs", href: "/docs" },
          {
            label: "More",
            value: "more",
            items: [{ label: "Blog", value: "blog", href: "/blog" }],
          },
        ]}
        LinkItemProps={{ target: "_blank", className: "from-slot" }}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("More"));

    for (const name of ["Docs", "Blog"]) {
      const link = await screen.findByRole("menuitem", { name });
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveClass("from-slot", styles["link-item"]!);
    }
  });

  /* Like an action row, so a router or hash link does not leave the modal
     menu open over the new view. */
  it("closes the menu when a link entry is clicked", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[{ label: "Settings", value: "settings", href: "#settings" }]}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByRole("menuitem", { name: "Settings" }));

    expect(screen.getByText("Open")).toHaveAttribute("aria-expanded", "false");
  });

  it("keeps the menu open after a link click when LinkItemProps opts out", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[{ label: "Settings", value: "settings", href: "#settings" }]}
        LinkItemProps={{ closeOnClick: false }}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByRole("menuitem", { name: "Settings" }));

    expect(screen.getByText("Open")).toHaveAttribute("aria-expanded", "true");
    expect(
      screen.getByRole("menuitem", { name: "Settings" }),
    ).toBeInTheDocument();
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects an entry with both href and items", () => {
    const items: MenuItemType[] = [
      // @ts-expect-error -- a link cannot also open a submenu
      { label: "Docs", value: "docs", href: "/docs", items: [] },
    ];
    void items;
  });

  it("rejects an entry with both href and disabled", () => {
    const items: MenuItemType[] = [
      // @ts-expect-error -- Base UI's LinkItem takes no `disabled`
      { label: "Docs", value: "docs", href: "/docs", disabled: true },
    ];
    void items;
  });

  it("rejects the keys each link entry owns in LinkItemProps", () => {
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each link entry's `href` is its own
        LinkItemProps={{ href: "/other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `label` is its content
        LinkItemProps={{ label: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `icon` is its content
        LinkItemProps={{ icon: StarIcon }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- a row's second line belongs to its entry
        LinkItemProps={{ description: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `label` and `icon` are its content
        LinkItemProps={{ children: "Other" }}
      />
    );
  });
});

describe("Menu separators", () => {
  const SEPARATED: MenuItemType[] = [
    { label: "Edit", value: "edit" },
    { label: "Duplicate", value: "duplicate" },
    { type: "separator" },
    { label: "Delete", value: "delete" },
  ];

  it("renders a separator entry as a separator between the rows", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={SEPARATED} />);

    await user.click(screen.getByText("Open"));

    const separator = screen.getByRole("separator");
    expect(separator).toHaveAttribute("data-slot", "menu-separator");
    expect(separator).toHaveAttribute("aria-orientation", "horizontal");
    expect(separator).toBeEmptyDOMElement();
    // Between Duplicate and Delete, in the order of `items`.
    expect(separator.previousElementSibling).toHaveTextContent("Duplicate");
    expect(separator.nextElementSibling).toHaveTextContent("Delete");
  });

  it("skips the separator with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={SEPARATED} />);

    await user.click(screen.getByText("Open"));
    await user.keyboard("{ArrowDown}{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Duplicate" })).toHaveAttribute(
      "data-highlighted",
    );

    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("menuitem", { name: "Delete" })).toHaveAttribute(
      "data-highlighted",
    );
    expect(screen.getByRole("separator")).not.toHaveAttribute(
      "data-highlighted",
    );
  });

  it("renders a separator entry inside a submenu", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          {
            label: "Move to",
            value: "move",
            items: [
              { label: "Inbox", value: "inbox" },
              { type: "separator" },
              { label: "Archive", value: "archive" },
            ],
          },
        ]}
      />,
    );

    await user.click(screen.getByText("Open"));
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    await user.click(screen.getByText("Move to"));

    await screen.findByRole("menuitem", { name: "Archive" });
    expect(screen.getByRole("separator")).toHaveAttribute(
      "data-slot",
      "menu-separator",
    );
  });

  /* Asserts the keys themselves, not React's console warnings: a separator
     keyed by its missing `value` would have no key at all, and React dedupes
     those warnings within a run. */
  it("keys every separator, so siblings never share or lack a key", () => {
    const rows = renderMenuItems(
      [
        { label: "Edit", value: "edit" },
        { type: "separator" },
        { label: "Share", value: "share" },
        { type: "separator" },
        { label: "Delete", value: "delete" },
      ],
      {},
    ) as React.ReactElement[];

    const keys = rows.map((row) => row.key);
    expect(keys).toHaveLength(5);
    for (const key of keys) expect(key).toEqual(expect.any(String));
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("reaches every separator, at any depth, with SeparatorProps", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          { label: "Edit", value: "edit" },
          { type: "separator" },
          {
            label: "Move to",
            value: "move",
            items: [
              { label: "Inbox", value: "inbox" },
              { type: "separator" },
              { label: "Archive", value: "archive" },
            ],
          },
        ]}
        SeparatorProps={{ className: "from-slot" }}
      />,
    );

    await user.click(screen.getByText("Open"));
    await user.click(screen.getByText("Move to"));
    await screen.findByRole("menuitem", { name: "Archive" });

    const separators = screen.getAllByRole("separator");
    expect(separators).toHaveLength(2);
    for (const separator of separators) {
      expect(separator).toHaveClass("from-slot", separatorStyles["separator"]!);
      expect(separator).toHaveAttribute("data-slot", "menu-separator");
    }
  });

  it("keeps a separator empty when SeparatorProps passes children", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={SEPARATED}
        SeparatorProps={
          // Untyped callers can still pass them at runtime.
          { children: "OR" } as unknown as MenuProps["SeparatorProps"]
        }
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("separator")).toBeEmptyDOMElement();
  });

  /* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects a value or a label on a separator entry", () => {
    const items: MenuItemType[] = [
      // @ts-expect-error -- a separator is keyed by its index, not a value
      { type: "separator", value: "line" },
      // @ts-expect-error -- a separator draws no content
      { type: "separator", label: "Line" },
      // @ts-expect-error -- `separator` is the only entry kind with a type
      { type: "item", label: "Edit", value: "edit" },
    ];
    void items;
  });

  it("still reads a field off every entry, as string | undefined", () => {
    const labels: (string | undefined)[] = MOCK_ITEMS.map((item) => item.label);
    void labels;
  });

  it("rejects a separator's children in SeparatorProps", () => {
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- a separator entry draws no content
        SeparatorProps={{ children: "OR" }}
      />
    );
  });
});

describe("Menu trigger", () => {
  it("gives a non-button intrinsic trigger button semantics", async () => {
    const user = userEvent.setup();
    render(<Menu trigger={<span>Open</span>} items={MOCK_ITEMS} />);

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("makes a component trigger the button itself, not a wrapper", async () => {
    const user = userEvent.setup();
    render(<Menu trigger={<ButtonLike>Open</ButtonLike>} items={MOCK_ITEMS} />);

    expect(screen.getAllByRole("button")).toHaveLength(1);
    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("BUTTON");
    expect(trigger).toHaveAttribute("aria-haspopup", "menu");
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("lets a non-button component opt out with nativeButton={false}", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger={<TextLike>Open</TextLike>}
        items={MOCK_ITEMS}
        TriggerProps={{ nativeButton: false }}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Open" });
    expect(trigger.tagName).toBe("SPAN");

    trigger.focus();
    await user.keyboard(" ");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
  });

  it("passes the trigger state to a function trigger", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger={({ open }) => <TextLike>{open ? "Hide" : "Show"}</TextLike>}
        items={MOCK_ITEMS}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Show" });
    trigger.focus();
    await user.keyboard("{Enter}");
    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(trigger).toHaveTextContent("Hide");
  });

  it("renders the trigger inside a caller's own render element", () => {
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        TriggerProps={{ render: <ButtonLike /> }}
      />,
    );

    expect(screen.getByRole("button", { name: "Open" }).tagName).toBe("BUTTON");
  });
});

describe("SubmenuTrigger layout props", () => {
  const submenuTrigger = () =>
    document.querySelector<HTMLElement>("[data-slot='submenu-trigger']");

  it("keeps its own spacing and alignment by default", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={MOCK_ITEMS} />);

    await user.click(screen.getByText("Open"));

    expect(submenuTrigger()).toHaveAttribute("data-ui-gap", "4");
    expect(submenuTrigger()).toHaveAttribute("data-ui-ax", "space-between");
  });

  /*
   * Base UI merges the render element's own props over the part's, so a
   * default written as a literal on the `Group` would beat these.
   */
  it("forwards layout props from SubmenuTriggerProps to its Group", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        SubmenuTriggerProps={{ gap: 2, ax: "start" }}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(submenuTrigger()).toHaveAttribute("data-ui-gap", "2");
    expect(submenuTrigger()).toHaveAttribute("data-ui-ax", "start");
  });
});

/*
 * A part's `className` is a string, merged with its own module class. Its
 * state is styled through the `data-*` attributes Base UI sets.
 */
describe("Menu className", () => {
  it("merges a caller's className on the item with its own class and marks its state", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        ItemProps={{ className: "caller" }}
      />,
    );

    await user.click(screen.getByText("Open"));
    const [first, second] = document.querySelectorAll(
      "[data-slot='menu-item']",
    );
    await user.keyboard("{ArrowDown}");

    expect(first).toHaveClass("caller", styles["item"]);
    expect(first).toHaveAttribute("data-highlighted");
    expect(second).toHaveClass("caller", styles["item"]);
    expect(second).not.toHaveAttribute("data-highlighted");
  });

  it("merges a caller's className on the popup with its own class and marks its state", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        PopupProps={{ className: "caller" }}
      />,
    );

    await user.click(screen.getByText("Open"));

    const popup = document.querySelector("[data-slot='menu-popup']");
    expect(popup).toHaveClass("caller", styles["popup"]);
    expect(popup).toHaveAttribute("data-open");
  });

  it("merges a caller's className on the positioner with its own class and marks its state", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        PositionerProps={{ className: "caller" }}
      />,
    );

    await user.click(screen.getByText("Open"));

    const positioner = document.querySelector("[data-slot='menu-positioner']");
    expect(positioner).toHaveClass("caller", styles["positioner"]);
    expect(positioner).toHaveAttribute("data-open");
  });

  it("merges a caller's className on the backdrop with its own class and marks its state", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        BackdropProps={{ className: "caller" }}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(backdrops()[0]).toHaveClass("caller", styles["backdrop"]);
    expect(backdrops()[0]).toHaveAttribute("data-open");
  });

  it("merges a caller's className on the submenu trigger with its own class and marks its state", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        SubmenuTriggerProps={{ className: "caller" }}
      />,
    );

    await user.click(screen.getByText("Open"));
    const trigger = document.querySelector("[data-slot='submenu-trigger']");
    expect(trigger).toHaveClass("caller", styles["submenu-trigger"]);
    expect(trigger).not.toHaveAttribute("data-popup-open");

    await user.click(screen.getByText("Lorem ipsum"));
    await screen.findByText("Item 3.1");

    expect(trigger).toHaveAttribute("data-popup-open");
  });
});

/* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
describe("Menu slot props", () => {
  it("rejects a key Menu owns in PositionerProps", () => {
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- `side` is set on Menu itself
        PositionerProps={{ side: "left" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- `align` is set on Menu itself
        PositionerProps={{ align: "end" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- the positioner holds Menu's popup
        PositionerProps={{ children: "Other" }}
      />
    );
  });

  it("rejects the trigger's children in TriggerProps, which come from `trigger`", () => {
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- `trigger` is the trigger's content
        TriggerProps={{ children: "Other" }}
      />
    );
  });

  it("rejects the popup's children in PopupProps, which come from `items`", () => {
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- `items` fill the popup
        PopupProps={{ children: "Other" }}
      />
    );
  });

  it("rejects an item's children in ItemProps, which come from each entry", () => {
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `label` and `icon` are its content
        ItemProps={{ children: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `label` is its content
        ItemProps={{ label: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `icon` is its content
        ItemProps={{ icon: StarIcon }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- a row's second line belongs to its entry
        ItemProps={{ description: "Other" }}
      />
    );
  });

  it("rejects the submenu's children in its slots, which come from each entry", () => {
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `items` fill its submenu
        SubmenuRootProps={{ children: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `label` and `icon` are its content
        SubmenuTriggerProps={{ children: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `label` is its content
        SubmenuTriggerProps={{ label: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `icon` is its content
        SubmenuTriggerProps={{ icon: StarIcon }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- a row's second line belongs to its entry
        SubmenuTriggerProps={{ description: "Other" }}
      />
    );
  });

  it("rejects children in the portal and submenu popup slots, which hold Menu's own parts", () => {
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- the portal holds Menu's positioners
        PortalProps={{ children: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- the positioner holds the submenu's popup
        SubmenuPositionerProps={{ children: "Other" }}
      />
    );
    void (
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        // @ts-expect-error -- each entry's `items` fill its submenu's popup
        SubmenuPopupProps={{ children: "Other" }}
      />
    );
  });
});

describe("Menu slot precedence", () => {
  // Untyped on purpose: the types reject these keys, so this pins what a
  // caller without the types gets.
  const untyped = <T,>(slot: Record<string, unknown>) => slot as T;

  it("lets the top-level side and align win over the same keys in PositionerProps", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        side="top"
        align="end"
        PositionerProps={untyped<MenuProps["PositionerProps"]>({
          side: "left",
          align: "start",
        })}
      />,
    );

    await user.click(screen.getByText("Open"));

    const positioner = document.querySelector("[data-slot='menu-positioner']");
    expect(positioner).toHaveAttribute("data-side", "top");
    expect(positioner).toHaveAttribute("data-align", "end");
  });

  it("keeps Menu's own content when a slot passes children", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        TriggerProps={untyped<MenuProps["TriggerProps"]>({
          children: "Slot trigger",
        })}
        PopupProps={untyped<MenuProps["PopupProps"]>({
          children: "Slot popup",
        })}
        ItemProps={untyped<MenuProps["ItemProps"]>({ children: "Slot item" })}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("menuitem", { name: "Lorem" })).toBeInTheDocument();
    expect(screen.queryByText("Slot trigger")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot popup")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot item")).not.toBeInTheDocument();
  });

  it("keeps each link entry's own href and content when a slot passes its own", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          {
            label: "Docs",
            value: "docs",
            href: "/docs",
            icon: PencilIcon,
            description: "Read the guides",
          },
        ]}
        LinkItemProps={untyped<MenuProps["LinkItemProps"]>({
          href: "/slot",
          label: "Slot label",
          icon: StarIcon,
          description: "Slot description",
          children: "Slot content",
        })}
      />,
    );

    await user.click(screen.getByText("Open"));

    const link = screen.getByRole("menuitem", { name: /^Docs/ });
    expect(link).toHaveAttribute("href", "/docs");
    expect(
      link.querySelector("[data-slot='list-text-description']"),
    ).toHaveTextContent("Read the guides");
    const icon = link.querySelector("[data-slot='list-item-icon']");
    expect(icon).toHaveClass("lucide-pencil");
    expect(icon).not.toHaveClass("lucide-star");
    expect(screen.queryByText("Slot label")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot description")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot content")).not.toBeInTheDocument();
  });

  it("keeps each entry's label and icon when a slot passes its own", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={[
          { label: "Lorem", value: "item-1", icon: PencilIcon },
          {
            label: "Lorem ipsum",
            value: "item-2",
            icon: PencilIcon,
            items: [{ label: "Item 2.1", value: "item-2.1" }],
          },
        ]}
        ItemProps={untyped<MenuProps["ItemProps"]>({
          label: "Slot label",
          icon: StarIcon,
          description: "Slot description",
        })}
        SubmenuTriggerProps={untyped<MenuProps["SubmenuTriggerProps"]>({
          label: "Slot trigger label",
          icon: StarIcon,
          description: "Slot trigger description",
          children: "Slot trigger content",
        })}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(screen.getByRole("menuitem", { name: "Lorem" })).toBeInTheDocument();
    expect(screen.getByText("Lorem ipsum")).toBeInTheDocument();
    expect(screen.queryByText("Slot label")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot trigger label")).not.toBeInTheDocument();
    expect(screen.queryByText("Slot description")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Slot trigger description"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText("Slot trigger content")).not.toBeInTheDocument();

    // Both rows draw the entry's own icon, never the slot's.
    const icons = document.querySelectorAll("[data-slot='list-item-icon']");
    expect(icons).toHaveLength(2);
    for (const icon of icons) {
      expect(icon).toHaveClass("lucide-pencil");
      expect(icon).not.toHaveClass("lucide-star");
    }
  });
});

describe("Menu groups", () => {
  const renderGroups = () =>
    render(
      <MenuRoot open>
        <MenuTrigger>Open</MenuTrigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup>
              <MenuGroup>
                <MenuGroupLabel>Edit</MenuGroupLabel>
                <MenuItem label="Cut" />
                <MenuItem label="Copy" />
              </MenuGroup>
              <MenuGroup>
                <MenuGroupLabel>View</MenuGroupLabel>
                <MenuItem label="Zoom in" />
              </MenuGroup>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>,
    );

  it("renders each MenuGroup as a group named by its MenuGroupLabel", () => {
    renderGroups();

    const edit = screen.getByRole("group", { name: "Edit" });
    const view = screen.getByRole("group", { name: "View" });

    expect(edit).toHaveAttribute("data-slot", "menu-group");
    expect(edit).toContainElement(
      screen.getByRole("menuitem", { name: "Copy" }),
    );
    expect(view).toContainElement(
      screen.getByRole("menuitem", { name: "Zoom in" }),
    );
  });

  it("marks the label with its own slot, outside the group's items", () => {
    renderGroups();

    const label = screen.getByText("Edit");
    expect(label).toHaveAttribute("data-slot", "menu-group-label");
    expect(label).not.toHaveAttribute("role", "menuitem");
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
  });

  it("forwards Base UI's props to the group and its label", () => {
    render(
      <MenuRoot open>
        <MenuTrigger>Open</MenuTrigger>
        <MenuPortal>
          <MenuPositioner>
            <MenuPopup>
              <MenuGroup data-testid="group" className="custom-group">
                <MenuGroupLabel id="label-id" className="custom-label">
                  Edit
                </MenuGroupLabel>
                <MenuItem label="Cut" />
              </MenuGroup>
            </MenuPopup>
          </MenuPositioner>
        </MenuPortal>
      </MenuRoot>,
    );

    const group = screen.getByTestId("group");
    expect(group).toHaveClass("custom-group");
    expect(group).toHaveAttribute("aria-labelledby", "label-id");
    expect(screen.getByText("Edit")).toHaveClass("custom-label");
  });
});

/*
 * The keyboard behaviour people rely on, from Base UI under Menu's trigger
 * wrapper and item rendering. Asserted through roles, focus and
 * `data-highlighted`, never console output: Base UI dedupes its dev warnings.
 */
describe("Menu keyboard", () => {
  const ROWS: MenuProps["items"] = [
    { label: "Edit", value: "edit" },
    { label: "Duplicate", value: "duplicate", disabled: true },
    {
      label: "Move to",
      value: "move",
      items: [
        { label: "Inbox", value: "inbox" },
        { label: "Archive", value: "archive" },
      ],
    },
    { label: "Delete", value: "delete" },
  ];

  const trigger = () => screen.getByRole("button", { name: "Open" });
  const highlighted = () =>
    screen
      .getAllByRole("menuitem")
      .filter((row) => row.hasAttribute("data-highlighted"))
      .map((row) => row.textContent);

  it.each([
    ["Enter", "{Enter}"],
    ["Space", " "],
    ["ArrowDown", "{ArrowDown}"],
  ])("opens the menu with %s from a focused trigger", async (_, key) => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={ROWS} />);

    trigger().focus();
    expect(screen.queryByRole("menu")).toBeNull();
    await user.keyboard(key);

    expect(await screen.findByRole("menu")).toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });

  /*
   * Base UI lets the arrows land on a disabled row too (see "lets the keyboard
   * highlight a disabled item" above), so no row is skipped, enabled or not.
   */
  it("moves the highlight through every row with the arrow keys", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={ROWS} />);

    await user.click(trigger());
    const seen: string[][] = [];
    for (let step = 0; step < 4; step++) {
      await user.keyboard("{ArrowDown}");
      seen.push(highlighted());
    }
    expect(seen).toEqual([["Edit"], ["Duplicate"], ["Move to"], ["Delete"]]);

    await user.keyboard("{ArrowUp}");
    expect(highlighted()).toEqual(["Move to"]);
  });

  it("opens a submenu with ArrowRight and closes it with ArrowLeft", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={ROWS} />);

    await user.click(trigger());
    const moveTo = screen.getByRole("menuitem", { name: "Move to" });
    moveTo.focus();
    await user.keyboard("{ArrowRight}");

    const inbox = await screen.findByRole("menuitem", { name: "Inbox" });
    expect(screen.getAllByRole("menu")).toHaveLength(2);
    expect(moveTo).toHaveAttribute("aria-expanded", "true");
    expect(inbox).toHaveAttribute("data-highlighted");

    await user.keyboard("{ArrowLeft}");

    await waitFor(() =>
      expect(screen.queryByRole("menuitem", { name: "Inbox" })).toBeNull(),
    );
    expect(screen.getAllByRole("menu")).toHaveLength(1);
    expect(moveTo).toHaveAttribute("aria-expanded", "false");
    expect(moveTo).toHaveFocus();
  });

  /* Typeahead, like the arrows, can land on a disabled row: "d" finds
     "Duplicate" before "Delete". */
  it.each([
    ["e", "Edit"],
    ["m", "Move to"],
    ["d", "Duplicate"],
  ])(
    "moves the highlight to the row a typed %s starts",
    async (letter, label) => {
      const user = userEvent.setup();
      render(<Menu trigger="Open" items={ROWS} />);

      await user.click(trigger());
      await user.keyboard(letter);

      expect(highlighted()).toEqual([label]);
    },
  );

  it("closes with Escape and returns focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={ROWS} />);

    trigger().focus();
    await user.keyboard("{Enter}");
    await screen.findByRole("menu");

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveFocus();
  });

  it("closes when an item is chosen by keyboard", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    render(
      <Menu
        trigger="Open"
        items={ROWS.map((item) =>
          item.value === "edit" ? { ...item, onClick: onEdit } : item,
        )}
      />,
    );

    trigger().focus();
    await user.keyboard("{ArrowDown}");
    await screen.findByRole("menu");
    await waitFor(() => expect(highlighted()).toEqual(["Edit"]));
    await user.keyboard("{Enter}");

    expect(onEdit).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
    expect(trigger()).toHaveFocus();
  });

  it("closes when an item is clicked", async () => {
    const user = userEvent.setup();
    render(<Menu trigger="Open" items={ROWS} />);

    await user.click(trigger());
    await user.click(screen.getByRole("menuitem", { name: "Delete" }));

    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull());
  });
});
