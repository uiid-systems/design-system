import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Menu } from "./menu";
import { MOCK_ITEMS } from "./menu.mocks";

import styles from "./menu.module.css";

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
