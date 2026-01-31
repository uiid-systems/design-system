import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Tabs } from "./tabs";
import type { TabsProps } from "./tabs.types";

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
    expect(document.querySelector("[data-slot='tabs-list']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='tabs-tab']")).toBeInTheDocument();
    expect(document.querySelector("[data-slot='tabs-panel']")).toBeInTheDocument();
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
      "true"
    );
  });

  it("selects specified defaultValue tab", () => {
    render(<Tabs items={MOCK_ITEMS} defaultValue="tab-2" />);
    expect(screen.getByRole("tab", { name: "Tab 2" })).toHaveAttribute(
      "aria-selected",
      "true"
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
      "true"
    );
    expect(screen.getByRole("tab", { name: "Tab 1" })).toHaveAttribute(
      "aria-selected",
      "false"
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
      "true"
    );
  });

  // ============================================
  // KEYBOARD NAVIGATION
  // ============================================

  it("supports keyboard navigation with arrow keys", async () => {
    const user = userEvent.setup();
    render(<Tabs items={MOCK_ITEMS} />);

    const firstTab = screen.getByRole("tab", { name: "Tab 1" });
    act(() => { firstTab.focus(); });

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
  // ALIGNMENT
  // ============================================

  it("applies start alignment by default", () => {
    render(<Tabs items={MOCK_ITEMS} />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toMatch(/align-start/);
  });

  it("applies center alignment when specified", () => {
    render(<Tabs items={MOCK_ITEMS} align="center" />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toMatch(/align-center/);
  });

  it("applies end alignment when specified", () => {
    render(<Tabs items={MOCK_ITEMS} align="end" />);
    const tablist = screen.getByRole("tablist");
    expect(tablist.className).toMatch(/align-end/);
  });
});
