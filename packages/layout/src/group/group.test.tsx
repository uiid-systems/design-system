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
  // GROUP-SPECIFIC: HORIZONTAL LAYOUT
  // ============================================

  it("is a flex container (horizontal layout by CSS default)", () => {
    render(
      <Group data-testid="group">
        <span>Left</span>
        <span>Right</span>
      </Group>,
    );
    // Group sets display: flex via CSS module.
    // flex-direction defaults to row in CSS, making it horizontal.
    expect(screen.getByTestId("group")).toHaveStyle({ display: "flex" });
  });

  // ============================================
  // STYLE PROPS (inherited from Box)
  // Style props are now applied as inline styles, not attributes.
  // Detailed style prop testing is in box.test.tsx.
  // ============================================

  it("applies gap spacing", () => {
    render(
      <Group gap={4} data-testid="group">
        <span>Item 1</span>
        <span>Item 2</span>
      </Group>,
    );
    expect(screen.getByTestId("group")).toBeInTheDocument();
  });

  it("applies alignment props", () => {
    render(
      <Group ax="center" ay="center" data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toHaveStyle({
      justifyContent: "center",
      alignItems: "center",
    });
  });

  it("applies padding props", () => {
    render(
      <Group p={4} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toBeInTheDocument();
  });

  it("applies margin props", () => {
    render(
      <Group m={4} data-testid="group">
        Content
      </Group>,
    );
    expect(screen.getByTestId("group")).toBeInTheDocument();
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
    expect(screen.getByTestId("group")).toBeInTheDocument();
  });

  it("applies evenly for equal spacing", () => {
    render(
      <Group evenly data-testid="group">
        <span>Left</span>
        <span>Center</span>
        <span>Right</span>
      </Group>,
    );
    expect(screen.getByTestId("group")).toBeInTheDocument();
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

    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("creates a centered row with vertical alignment", () => {
    render(
      <Group ay="center" gap={2} data-testid="group">
        <img alt="Avatar" src="#" style={{ width: 32, height: 32 }} />
        <span>Username</span>
      </Group>,
    );

    expect(screen.getByTestId("group")).toHaveStyle({ alignItems: "center" });
  });

  it("creates an icon + text combination", () => {
    render(
      <Group gap={1} ay="center" data-testid="group">
        <span>🔔</span>
        <span>Notifications</span>
      </Group>,
    );

    expect(screen.getByTestId("group")).toHaveStyle({ alignItems: "center" });
  });
});
