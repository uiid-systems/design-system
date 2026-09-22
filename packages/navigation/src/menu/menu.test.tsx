import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Menu } from "./menu";
import { MOCK_ITEMS } from "./menu.mocks";

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

    expect(submenuTrigger()?.style.gap).toBe("calc(4 * var(--spacing-unit))");
    expect(submenuTrigger()).toHaveStyle({ justifyContent: "space-between" });
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

    expect(submenuTrigger()?.style.gap).toBe("calc(2 * var(--spacing-unit))");
    expect(submenuTrigger()).toHaveStyle({ justifyContent: "start" });
  });
});

/*
 * Base UI calls a function className with the part's state. `cx` used to drop
 * it silently, leaving only the wrapper's own module class.
 */
describe("Menu state-function className", () => {
  const byOpen = (state: { open: boolean }) =>
    state.open ? "fn-open" : "fn-closed";

  it("resolves a state-function className on the item alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        ItemProps={{
          className: (state) => (state.highlighted ? "fn-lit" : "fn-unlit"),
        }}
      />,
    );

    await user.click(screen.getByText("Open"));
    const [first, second] = document.querySelectorAll(
      "[data-slot='menu-item']",
    );
    await user.keyboard("{ArrowDown}");

    expect(first).toHaveClass("fn-lit", styles["item"]);
    expect(second).toHaveClass("fn-unlit", styles["item"]);
  });

  it("resolves a state-function className on the popup alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        PopupProps={{ className: byOpen }}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(document.querySelector("[data-slot='menu-popup']")).toHaveClass(
      "fn-open",
      styles["popup"],
    );
  });

  it("resolves a state-function className on the positioner alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        PositionerProps={{ className: byOpen }}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(document.querySelector("[data-slot='menu-positioner']")).toHaveClass(
      "fn-open",
      styles["positioner"],
    );
  });

  it("resolves a state-function className on the backdrop alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        BackdropProps={{ className: byOpen }}
      />,
    );

    await user.click(screen.getByText("Open"));

    expect(backdrops()[0]).toHaveClass("fn-open", styles["backdrop"]);
  });

  it("resolves a state-function className on the submenu trigger alongside its own class", async () => {
    const user = userEvent.setup();
    render(
      <Menu
        trigger="Open"
        items={MOCK_ITEMS}
        SubmenuTriggerProps={{ className: byOpen }}
      />,
    );

    await user.click(screen.getByText("Open"));
    const trigger = document.querySelector("[data-slot='submenu-trigger']");
    expect(trigger).toHaveClass("fn-closed", styles["submenu-trigger"]);

    await user.click(screen.getByText("Lorem ipsum"));
    await screen.findByText("Item 3.1");

    expect(trigger).toHaveClass("fn-open", styles["submenu-trigger"]);
  });
});
