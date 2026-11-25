import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StarIcon } from "@uiid/icons/star";
import { describe, it, expect, vi } from "vitest";

import { Menu } from "./menu";
import { MOCK_ITEMS } from "./menu.mocks";
import type { MenuProps } from "./menu.types";

import styles from "./menu.module.css";

/* Stand-ins for `Button` and `Text`: a component that renders a real <button>
   and one that renders a <span>. */
const ButtonLike = (props: React.ComponentProps<"button">) => (
  <button type="button" {...props} />
);
const TextLike = (props: React.ComponentProps<"span">) => <span {...props} />;

const backdrops = () =>
  document.querySelectorAll('[data-slot="menu-backdrop"]');

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
});
