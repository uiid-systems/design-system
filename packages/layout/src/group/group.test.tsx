import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Group } from "./group";

describe("Group", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders children", () => {
    render(
      <Group>
        <button>Button 1</button>
        <button>Button 2</button>
      </Group>,
    );

    expect(screen.getByText("Button 1")).toBeInTheDocument();
    expect(screen.getByText("Button 2")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Group data-testid="group">Content</Group>);
    expect(screen.getByTestId("group")).toHaveAttribute("data-slot", "group");
  });

  it("applies custom className", () => {
    render(
      <Group className="custom-class" data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveClass("custom-class");
  });

  it("renders as div by default", () => {
    render(<Group data-testid="group">Content</Group>);
    expect(screen.getByTestId("group").tagName).toBe("DIV");
  });

  // ============================================
  // GAP PROP
  // ============================================

  it("applies gap spacing", () => {
    render(
      <Group gap={4} data-testid="group">
        <span>Item 1</span>
        <span>Item 2</span>
      </Group>,
    );

    expect(screen.getByTestId("group")).toHaveAttribute("gap", "4");
  });

  it("applies gap of 0 for touching elements", () => {
    render(
      <Group gap={0} data-testid="group">
        <button>Left</button>
        <button>Right</button>
      </Group>,
    );

    expect(screen.getByTestId("group")).toHaveAttribute("gap", "0");
  });

  // ============================================
  // ALIGNMENT PROPS
  // ============================================

  it("applies ax (horizontal alignment)", () => {
    render(
      <Group ax="center" data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("ax", "center");
  });

  it("applies ay (vertical alignment)", () => {
    render(
      <Group ay="center" data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("ay", "center");
  });

  it("supports all alignment values", () => {
    const { rerender } = render(
      <Group ax="start" data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("ax", "start");

    rerender(
      <Group ax="end" data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("ax", "end");

    rerender(
      <Group ax="stretch" data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("ax", "stretch");
  });

  // ============================================
  // PADDING PROPS
  // ============================================

  it("applies padding (p)", () => {
    render(
      <Group p={4} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("p", "4");
  });

  it("applies horizontal padding (px)", () => {
    render(
      <Group px={2} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("px", "2");
  });

  it("applies vertical padding (py)", () => {
    render(
      <Group py={3} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("py", "3");
  });

  it("applies individual padding (pt, pr, pb, pl)", () => {
    render(
      <Group pt={1} pr={2} pb={3} pl={4} data-testid="group">
        Content
      </Group>,
    );

    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("pt", "1");
    expect(group).toHaveAttribute("pr", "2");
    expect(group).toHaveAttribute("pb", "3");
    expect(group).toHaveAttribute("pl", "4");
  });

  // ============================================
  // MARGIN PROPS
  // ============================================

  it("applies margin (m)", () => {
    render(
      <Group m={4} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("m", "4");
  });

  it("applies horizontal margin (mx)", () => {
    render(
      <Group mx={2} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("mx", "2");
  });

  it("applies vertical margin (my)", () => {
    render(
      <Group my={3} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("my", "3");
  });

  // ============================================
  // TOGGLE PROPS
  // ============================================

  it("applies fullwidth", () => {
    render(
      <Group fullwidth data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("fullwidth", "true");
  });

  it("applies evenly for equal spacing", () => {
    render(
      <Group evenly data-testid="group">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveAttribute("evenly", "true");
  });

  // ============================================
  // POLYMORPHISM (render prop)
  // ============================================

  it("renders as custom element via render prop", () => {
    render(
      <Group render={<section />} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group").tagName).toBe("SECTION");
  });

  it("renders as nav element for navigation", () => {
    render(
      <Group render={<nav />} gap={4} data-testid="group">
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/contact">Contact</a>
      </Group>,
    );
    expect(screen.getByTestId("group").tagName).toBe("NAV");
  });

  it("renders as header element", () => {
    render(
      <Group render={<header />} ay="center" data-testid="group">
        <span>Logo</span>
        <nav>Navigation</nav>
      </Group>,
    );
    expect(screen.getByTestId("group").tagName).toBe("HEADER");
  });

  // ============================================
  // COMMON USAGE PATTERNS
  // ============================================

  it("creates a button group", () => {
    render(
      <Group gap={2} data-testid="group">
        <button>Cancel</button>
        <button>Save</button>
      </Group>,
    );

    expect(screen.getByTestId("group")).toHaveAttribute("gap", "2");
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("creates a centered row with vertical alignment", () => {
    render(
      <Group ay="center" gap={2} data-testid="group">
        <img alt="Avatar" src="" style={{ width: 32, height: 32 }} />
        <span>Username</span>
      </Group>,
    );

    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("ay", "center");
    expect(group).toHaveAttribute("gap", "2");
  });

  it("creates a space-between header layout", () => {
    render(
      <Group ax="stretch" ay="center" data-testid="group">
        <span>Left content</span>
        <span>Right content</span>
      </Group>,
    );

    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("ay", "center");
  });

  it("creates an icon + text combination", () => {
    render(
      <Group gap={1} ay="center" data-testid="group">
        <span>🔔</span>
        <span>Notifications</span>
      </Group>,
    );

    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("gap", "1");
    expect(group).toHaveAttribute("ay", "center");
  });
});
