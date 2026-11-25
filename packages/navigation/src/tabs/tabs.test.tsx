import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest";

import {
  TabsIndicator,
  TabsList,
  TabsPanel,
  TabsRoot,
  TabsTab,
} from "./subcomponents";
import { Tabs } from "./tabs";
import type { TabsProps } from "./tabs.types";

import styles from "./tabs.module.css";

const MOCK_ITEMS: TabsProps["items"] = [
  { label: "Tab 1", value: "tab-1", content: <div>Content 1</div> },
  { label: "Tab 2", value: "tab-2", content: <div>Content 2</div> },
  { label: "Tab 3", value: "tab-3", content: <div>Content 3</div> },
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

  it("renders each item's content in its panel", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    expect(screen.getByText("Content 1")).toBeInTheDocument();
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

  it("renders an empty tablist when items is empty", () => {
    expect(() => render(<Tabs items={[]} />)).not.toThrow();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.queryByRole("tab")).not.toBeInTheDocument();
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });

  it("does not throw on empty items while controlled", () => {
    expect(() => render(<Tabs items={[]} value="tab-1" />)).not.toThrow();
    expect(screen.getByRole("tablist")).toBeInTheDocument();
  });

  it("selects no tab and shows no panel when defaultValue is null", () => {
    render(<Tabs items={MOCK_ITEMS} defaultValue={null} />);
    for (const tab of screen.getAllByRole("tab")) {
      expect(tab).toHaveAttribute("aria-selected", "false");
    }
    expect(screen.queryByRole("tabpanel")).not.toBeInTheDocument();
  });

  // ============================================
  // ITEMS ARRIVING AFTER MOUNT
  // ============================================

  describe("items arriving after mount", () => {
    /*
     * Base UI dedupes its dev warnings per module, so each case gets its own
     * test. The "no warning" assertions also rely on no earlier test in this
     * file triggering the same Base UI warning; one that had would leave these
     * passing with nothing logged.
     */

    let consoleError: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      consoleError.mockRestore();
    });

    it("selects the first tab without a dev warning when items load after an empty mount", () => {
      const handleChange = vi.fn();

      const { rerender } = render(
        <Tabs items={[]} onValueChange={handleChange} />,
      );
      rerender(<Tabs items={MOCK_ITEMS} onValueChange={handleChange} />);

      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 1");
      expect(consoleError).not.toHaveBeenCalled();
      // Base UI reports the first automatic selection once the tabs exist.
      expect(handleChange).toHaveBeenCalledTimes(1);
      expect(handleChange.mock.calls[0][0]).toBe("tab-1");
      expect(handleChange.mock.calls[0][1].reason).toBe("initial");
    });

    it("selects an explicit defaultValue without a dev warning when items load after an empty mount", () => {
      const handleChange = vi.fn();

      const { rerender } = render(
        <Tabs items={[]} defaultValue="tab-2" onValueChange={handleChange} />,
      );
      rerender(
        <Tabs
          items={MOCK_ITEMS}
          defaultValue="tab-2"
          onValueChange={handleChange}
        />,
      );

      expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(screen.getByRole("tabpanel")).toHaveTextContent("Content 2");
      expect(consoleError).not.toHaveBeenCalled();
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("does not call onValueChange or warn when items are present on mount", () => {
      const handleChange = vi.fn();

      const { rerender } = render(
        <Tabs items={MOCK_ITEMS} onValueChange={handleChange} />,
      );
      rerender(<Tabs items={MOCK_ITEMS} onValueChange={handleChange} />);

      expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
        "aria-selected",
        "true",
      );
      expect(consoleError).not.toHaveBeenCalled();
      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  it("selects the tab matching an empty-string defaultValue", () => {
    render(
      <Tabs
        items={[
          { label: "First", value: "first", content: <div>First content</div> },
          { label: "Blank", value: "", content: <div>Blank content</div> },
        ]}
        defaultValue=""
      />,
    );
    expect(screen.getByRole("tab", { name: "Blank" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tab", { name: "First" })).toHaveAttribute(
      "aria-selected",
      "false",
    );
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
    expect(root).toHaveAttribute("data-ui-gap", "4");
    expect(root).toHaveAttribute("data-ui-ay", "center");
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
    expect(list).toHaveAttribute("data-ui-gap", "2");
    expect(list).toHaveAttribute("data-ui-ay", "end");
  });

  /* Type-level: `pnpm typecheck` fails if a directive goes unused. */
  it("rejects a key Tabs owns in ListProps", () => {
    void (
      <Tabs
        items={MOCK_ITEMS}
        // @ts-expect-error -- `size` is set on Tabs itself
        ListProps={{ size: "small" }}
      />
    );
    void (
      <Tabs
        items={MOCK_ITEMS}
        // @ts-expect-error -- `variant` is set on Tabs itself
        ListProps={{ variant: "ghost" }}
      />
    );
    void (
      <Tabs
        items={MOCK_ITEMS}
        // @ts-expect-error -- `fullwidth` is set on Tabs itself
        ListProps={{ fullwidth: true }}
      />
    );
  });

  it("rejects the list's children in ListProps, which Tabs renders from items", () => {
    void (
      <Tabs
        items={MOCK_ITEMS}
        // @ts-expect-error -- the tabs come from `items`
        ListProps={{ children: "Other" }}
      />
    );
  });

  it("keeps the list's own gap when ListProps sets none", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    const list = document.querySelector<HTMLElement>("[data-slot='tabs-list']");
    expect(list).toHaveAttribute("data-ui-gap", "4");
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
    expect(panel).toHaveAttribute("data-ui-gap", "3");
    expect(panel).toHaveAttribute("data-ui-ay", "start");
    expect(panel).not.toHaveAttribute("data-ui-fullwidth");
  });

  it("leaves the panel's cross axis to Stack's stretch default", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    const panel = document.querySelector<HTMLElement>(
      "[data-slot='tabs-panel']",
    );
    // Stack maps the panel's `ax` onto data-ui-ay; no value means stretch.
    expect(panel).not.toHaveAttribute("data-ui-ay");
    expect(panel).toHaveAttribute("data-ui-ax", "center");
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
  // CLASSNAME AND STATE
  // ============================================

  // A part's `className` is a string, merged with its own module class. Its
  // state is styled through the `data-*` attributes Base UI sets.

  it("merges a caller's className on the list with its own class and marks its state", () => {
    render(<Tabs items={MOCK_ITEMS} ListProps={{ className: "caller" }} />);
    const list = document.querySelector("[data-slot='tabs-list']");
    expect(list).toHaveClass("caller", styles["tabs-list"]);
    expect(list).toHaveAttribute("data-orientation", "horizontal");
  });

  it("merges a caller's className on the tab with its own class and marks its state", () => {
    render(<Tabs items={MOCK_ITEMS} TabProps={{ className: "caller" }} />);
    const [active, idle] = document.querySelectorAll("[data-slot='tabs-tab']");
    expect(active).toHaveClass("caller", styles["tab"]);
    expect(active).toHaveAttribute("data-active");
    expect(idle).toHaveClass("caller", styles["tab"]);
    expect(idle).not.toHaveAttribute("data-active");
  });

  it("merges a caller's className on the indicator with its own class and marks its state", () => {
    render(
      <Tabs items={MOCK_ITEMS} IndicatorProps={{ className: "caller" }} />,
    );
    const indicator = document.querySelector("[data-slot='tabs-indicator']");
    expect(indicator).toHaveClass("caller", styles["tabs-indicator"]);
    expect(indicator).toHaveAttribute("data-orientation", "horizontal");
  });

  it("merges a caller's className on the panel with its own class and marks its state", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        keepMounted
        PanelProps={{ className: "caller" }}
      />,
    );
    const [shown, hidden] = document.querySelectorAll(
      "[data-slot='tabs-panel']",
    );
    expect(shown).toHaveClass("caller", styles["tabs-panel"]);
    expect(shown).not.toHaveAttribute("data-hidden");
    expect(hidden).toHaveClass("caller", styles["tabs-panel"]);
    expect(hidden).toHaveAttribute("data-hidden");
  });
});

describe("Tabs RootProps precedence", () => {
  const selected = (name: string) =>
    screen.getByRole("tab", { name }).getAttribute("aria-selected");

  it("lets a top-level prop win over the same key in RootProps", () => {
    render(
      <Tabs
        items={MOCK_ITEMS}
        defaultValue="tab-2"
        RootProps={{ defaultValue: "tab-3" }}
      />,
    );
    expect(selected("Tab 2")).toBe("true");
  });

  it("still applies a RootProps key the top level leaves unset", () => {
    render(<Tabs items={MOCK_ITEMS} RootProps={{ defaultValue: "tab-3" }} />);
    expect(selected("Tab 3")).toBe("true");
  });

  it("follows a controlled RootProps.value", () => {
    const { rerender } = render(
      <Tabs items={MOCK_ITEMS} RootProps={{ value: "tab-3" }} />,
    );
    expect(selected("Tab 3")).toBe("true");

    rerender(<Tabs items={MOCK_ITEMS} RootProps={{ value: "tab-2" }} />);
    expect(selected("Tab 2")).toBe("true");
  });

  it("lets a top-level value win over RootProps.value", () => {
    render(
      <Tabs items={MOCK_ITEMS} value="tab-1" RootProps={{ value: "tab-3" }} />,
    );
    expect(selected("Tab 1")).toBe("true");
  });
});

/* Type-level only: `pnpm typecheck` fails if the directive goes unused. */
describe("className", () => {
  it("takes a string, not a function of the part's state", () => {
    // @ts-expect-error -- style a state through its `data-*` attribute instead
    void (<TabsTab value="a" className={() => "from-fn"} />);
  });
});

describe("Tabs parts composed by hand", () => {
  it("render a tablist whose selected tab shows its panel", async () => {
    const user = userEvent.setup();
    render(
      <TabsRoot defaultValue="one">
        <TabsList>
          <TabsTab value="one">One</TabsTab>
          <TabsTab value="two">Two</TabsTab>
          <TabsIndicator />
        </TabsList>
        <TabsPanel value="one">First panel</TabsPanel>
        <TabsPanel value="two">Second panel</TabsPanel>
      </TabsRoot>,
    );

    expect(screen.getByRole("tablist")).toBeInTheDocument();
    expect(screen.getAllByRole("tab")).toHaveLength(2);
    expect(screen.getByRole("tab", { name: "One" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("First panel");

    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Second panel");
  });
});
