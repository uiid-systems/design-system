import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";

import { Menu } from "./menu";
import { MOCK_ITEMS } from "./menu.mocks";

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
