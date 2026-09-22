import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { Tabs } from "./tabs";
import type { TabsProps } from "./tabs.types";

import styles from "./tabs.module.css";

const MOCK_ITEMS: TabsProps["items"] = [
  { label: "Tab 1", value: "tab-1", render: <div>Content 1</div> },
  { label: "Tab 2", value: "tab-2", render: <div>Content 2</div> },
  { label: "Tab 3", value: "tab-3", render: <div>Content 3</div> },
];

describe("Tabs", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders all tab buttons", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    expect(screen.getByRole("tab", { name: "Tab 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 2" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Tab 3" })).toBeInTheDocument();
  });

  it("renders with data-slot attributes", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    expect(
      document.querySelector("[data-slot='tabs-list']"),
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='tabs-tab']"),
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='tabs-panel']"),
    ).toBeInTheDocument();
  });

  it("renders the tablist", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("renders the active tab panel", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
  });

  // ============================================
  // DEFAULT VALUE
  // ============================================

  it("selects first tab by default", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("selects specified defaultValue tab", () => {
    render(<Tabs items={MOCK_ITEMS} defaultValue="tab-2" />);
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  it("shows content of the selected tab", () => {
    render(<Tabs items={MOCK_ITEMS} defaultValue="tab-1" />);
    expect(screen.getByText("Content 1")).toBeVisible();
  });

  // ============================================
  // TAB SWITCHING
  // ============================================

  it("switches tabs on click", async () => {
    const user = userEvent.setup();
    render(<Tabs items={MOCK_ITEMS} />);

    await user.click(screen.getByRole("tab", { name: "Tab 2" }));

    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
  });

  it("shows correct content after switching tabs", async () => {
    const user = userEvent.setup();
    render(<Tabs items={MOCK_ITEMS} />);

    await user.click(screen.getByRole("tab", { name: "Tab 2" }));

    expect(screen.getByText("Content 2")).toBeVisible();
  });

  it("calls onValueChange when tab is clicked", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<Tabs items={MOCK_ITEMS} onValueChange={handleChange} />);

    await user.click(screen.getByRole("tab", { name: "Tab 2" }));

    expect(handleChange).toHaveBeenCalled();
    expect(handleChange.mock.calls[0][0]).toBe("tab-2");
  });

  // ============================================
  // CONTROLLED STATE
  // ============================================

  it("supports controlled state", async () => {
    const handleChange = vi.fn();

    const ControlledTabs = () => {
      const [value, setValue] = useState("tab-1");
      return (
        <Tabs
          items={MOCK_ITEMS}
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue as string);
            handleChange(newValue);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledTabs />);

    await user.click(screen.getByRole("tab", { name: "Tab 3" }));

    expect(handleChange).toHaveBeenCalledWith("tab-3");
    expect(screen.getByRole("tab", { name: "Tab 3" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  it("supports keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Tabs items={MOCK_ITEMS} />);

    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    act(() => {
      firstTab.focus();
    });

    await user.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveFocus();
  });

  // ============================================
  // KEEP MOUNTED
  // ============================================

  it("unmounts inactive panels by default", () => {
    render(<Tabs items={MOCK_ITEMS} />);

    // Only the active panel's content should be in the document
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.queryByText("Content 2")).not.toBeInTheDocument();
    expect(screen.queryByText("Content 3")).not.toBeInTheDocument();
  });

  it("keeps panels mounted when keepMounted is true", () => {
    render(<Tabs items={MOCK_ITEMS} keepMounted />);

    // All content should be in the document
    expect(screen.getByText("Content 1")).toBeInTheDocument();
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.getByText("Content 3")).toBeInTheDocument();
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("has correct aria attributes on tabs", () => {
    render(<Tabs items={MOCK_ITEMS} />);

    const tab = screen.getByRole("tab", { name: "Tab 1" });
    expect(tab).toHaveAttribute("aria-selected");
    expect(tab).toHaveAttribute("aria-controls");
  });

  it("has correct aria attributes on panels", () => {
    render(<Tabs items={MOCK_ITEMS} />);

    const panel = screen.getByRole("tabpanel");
    expect(panel).toHaveAttribute("aria-labelledby");
  });

  // ============================================
  // GHOST
  // ============================================

  it("applies the variant data attribute when variant is ghost", () => {
    render(<Tabs items={MOCK_ITEMS} variant="ghost" />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("data-variant", "ghost");
  });

  it("does not apply the variant data attribute by default", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).not.toHaveAttribute("data-variant");
  });

  // ============================================
  // SIZE
  // ============================================

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "paints the list with the %s tier from the shared control scale",
    (size) => {
      render(<Tabs items={MOCK_ITEMS} size={size} />);
      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveAttribute("data-size", size);
      expect(tablist.className).toMatch(new RegExp(`composes-size-${size}`));
    },
  );

  it("defaults to the medium tier, matching the other controls", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist).toHaveAttribute("data-size", "medium");
    expect(tablist.className).toMatch(/composes-size-medium/);
  });

  // ============================================
  // ROOT PROPS
  // ============================================

  it("forwards layout props from RootProps to the root Stack", () => {
    render(<Tabs items={MOCK_ITEMS} RootProps={{ gap: 4, ax: "center" }} />);
    const root = document.querySelector<HTMLElement>("[data-slot='tabs-root']");
    expect(root?.style.gap).toBe("calc(4 * var(--spacing-unit))");
    expect(root).toHaveStyle({ alignItems: "center" });
  });

  it("accepts Base UI's state-function className on RootProps", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        RootProps={{
          className: (state) => `orientation-${state.orientation}`,
        }}
      />,
    );
    expect(document.querySelector("[data-slot='tabs-root']")).toHaveClass(
      "orientation-horizontal",
    );
  });

  // ============================================
  // LAYOUT PROPS
  // ============================================

  /*
   * Base UI merges the render element's own props over the part's, so a
   * default written as a literal on the `Group` or `Stack` would beat these.
   */
  it("forwards layout props from ListProps to the list Group", () => {
    render(<Tabs items={MOCK_ITEMS} ListProps={{ gap: 2, ay: "end" }} />);
    const list = document.querySelector<HTMLElement>("[data-slot='tabs-list']");
    expect(list?.style.gap).toBe("calc(2 * var(--spacing-unit))");
    expect(list).toHaveStyle({ alignItems: "end" });
  });

  it("keeps the list's own gap when ListProps sets none", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    const list = document.querySelector<HTMLElement>("[data-slot='tabs-list']");
    expect(list?.style.gap).toBe("calc(4 * var(--spacing-unit))");
  });

  it("forwards layout props from PanelProps to the panel Stack", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        PanelProps={{ gap: 3, ax: "start", fullwidth: false }}
      />,
    );
    const panel = document.querySelector<HTMLElement>(
      "[data-slot='tabs-panel']",
    );
    expect(panel?.style.gap).toBe("calc(3 * var(--spacing-unit))");
    expect(panel).toHaveStyle({ alignItems: "start" });
    expect(panel?.className).not.toMatch(/toggle-fullwidth/);
  });

  // ============================================
  // TAB PROPS / PANEL PROPS
  // ============================================

  it("applies TabProps to every tab while each keeps its own value", async () => {
    const user = userEvent.setup();
    render(<Tabs items={MOCK_ITEMS} TabProps={{ className: "mine" }} />);

    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveClass("mine", styles["tab"]);
    }

    await user.click(screen.getByRole("tab", { name: "Tab 3" }));
    expect(screen.getByRole("tab", { name: "Tab 3" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText("Content 3")).toBeVisible();
  });

  it("applies PanelProps to every panel while each keeps its own value", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        keepMounted
        PanelProps={{ className: "mine" }}
      />,
    );

    const panels = document.querySelectorAll("[data-slot='tabs-panel']");
    expect(panels).toHaveLength(MOCK_ITEMS.length);
    for (const panel of panels) {
      expect(panel).toHaveClass("mine", styles["tabs-panel"]);
    }
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");
  });

  it("gives each tab and panel its item's value over one in the part props", async () => {
    const user = userEvent.setup();
    render(
      <Tabs
        items={MOCK_ITEMS}
        // @ts-expect-error each item owns its tab's value
        TabProps={{ value: "shared" }}
        // @ts-expect-error each item owns its panel's value
        PanelProps={{ value: "shared" }}
      />,
    );

    await user.click(screen.getByRole("tab", { name: "Tab 2" }));

    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 2");
  });

  it("lets the top-level keepMounted win over one in PanelProps", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        keepMounted
        // @ts-expect-error keepMounted is set once, at the top level
        PanelProps={{ keepMounted: false }}
      />,
    );
    expect(screen.getByText("Content 2")).toBeInTheDocument();
    expect(screen.getByText("Content 3")).toBeInTheDocument();
  });

  // ============================================
  // STATE-FUNCTION CLASSNAME
  // ============================================

  // Base UI calls a function className with the part's state. `cx` used to
  // drop it silently, leaving only the wrapper's own module class.

  it("resolves a state-function className on the list alongside its own class", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        ListProps={{ className: (state) => `fn-${state.orientation}` }}
      />,
    );
    expect(document.querySelector("[data-slot='tabs-list']")).toHaveClass(
      "fn-horizontal",
      styles["tabs-list"],
    );
  });

  it("resolves a state-function className on the tab alongside its own class", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        TabProps={{
          className: (state) => (state.active ? "fn-active" : "fn-idle"),
        }}
      />,
    );
    const [active, idle] = document.querySelectorAll("[data-slot='tabs-tab']");
    expect(active).toHaveClass("fn-active", styles["tab"]);
    expect(idle).toHaveClass("fn-idle", styles["tab"]);
  });

  it("resolves a state-function className on the indicator alongside its own class", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        IndicatorProps={{ className: (state) => `fn-${state.orientation}` }}
      />,
    );
    expect(document.querySelector("[data-slot='tabs-indicator']")).toHaveClass(
      "fn-horizontal",
      styles["tabs-indicator"],
    );
  });

  it("resolves a state-function className on the panel alongside its own class", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        keepMounted
        PanelProps={{
          className: (state) => (state.hidden ? "fn-hidden" : "fn-shown"),
        }}
      />,
    );
    const [shown, hidden] = document.querySelectorAll(
      "[data-slot='tabs-panel']",
    );
    expect(shown).toHaveClass("fn-shown", styles["tabs-panel"]);
    expect(hidden).toHaveClass("fn-hidden", styles["tabs-panel"]);
  });
});
