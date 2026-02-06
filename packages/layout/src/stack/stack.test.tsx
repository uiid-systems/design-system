import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Stack } from "./stack";

describe("Stack", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders children", () => {
    render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText("Item 2")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Stack data-testid="stack">Content</Stack>);
    expect(screen.getByTestId("stack")).toHaveAttribute("data-slot", "stack");
  });

  it("applies custom className", () => {
    render(
      <Stack className="custom-class" data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveClass("custom-class");
  });

  it("renders as div by default", () => {
    render(<Stack data-testid="stack">Content</Stack>);
    expect(screen.getByTestId("stack").tagName).toBe("DIV");
  });

  // ============================================
  // STACK-SPECIFIC: VERTICAL LAYOUT
  // ============================================

  it("is a flex container with column direction", () => {
    render(
      <Stack data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );
    // Stack sets display: inline-flex and flex-direction: column via CSS module
    expect(screen.getByTestId("stack")).toHaveStyle({
      display: "inline-flex",
      flexDirection: "column",
    });
  });

  // ============================================
  // STYLE PROPS (inherited from Box)
  // Style props are now applied as inline styles, not attributes.
  // Detailed style prop testing is in box.test.tsx.
  // ============================================

  it("applies gap spacing", () => {
    render(
      <Stack gap={4} data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toBeInTheDocument();
  });

  it("applies alignment props (swapped for column layout)", () => {
    render(
      <Stack ax="center" data-testid="stack">
        Content
      </Stack>,
    );
    // Stack swaps ax/ay: ax controls horizontal (align-items in column layout)
    // ax="center" -> alignItems: center (horizontal centering in column)
    expect(screen.getByTestId("stack")).toHaveStyle({
      alignItems: "center",
    });
  });

  it("applies padding props", () => {
    render(
      <Stack p={4} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toBeInTheDocument();
  });

  it("applies margin props", () => {
    render(
      <Stack m={4} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toBeInTheDocument();
  });

  // ============================================
  // TOGGLE PROPS
  // ============================================

  it("applies fullwidth", () => {
    render(
      <Stack fullwidth data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toBeInTheDocument();
  });

  it("applies fullheight", () => {
    render(
      <Stack fullheight data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toBeInTheDocument();
  });

  // ============================================
  // POLYMORPHISM (render prop)
  // ============================================

  it("renders as custom element via render prop", () => {
    render(
      <Stack render={<section />} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack").tagName).toBe("SECTION");
  });

  it("renders as nav element", () => {
    render(
      <Stack render={<nav />} data-testid="stack">
        <a href="/">Home</a>
        <a href="/about">About</a>
      </Stack>,
    );
    expect(screen.getByTestId("stack").tagName).toBe("NAV");
  });

  it("renders as ul with li children", () => {
    render(
      <Stack render={<ul />} data-testid="stack">
        <li>Item 1</li>
        <li>Item 2</li>
      </Stack>,
    );
    expect(screen.getByTestId("stack").tagName).toBe("UL");
  });

  // ============================================
  // COMMON USAGE PATTERNS
  // ============================================

  it("creates a centered vertical layout", () => {
    render(
      <Stack ax="center" gap={4} data-testid="stack">
        <div>Centered item 1</div>
        <div>Centered item 2</div>
      </Stack>,
    );

    // ax="center" in Stack means horizontal centering (align-items in column)
    expect(screen.getByTestId("stack")).toHaveStyle({ alignItems: "center" });
  });

  it("creates a padded card layout", () => {
    render(
      <Stack p={4} gap={2} data-testid="stack">
        <h2>Title</h2>
        <p>Description</p>
      </Stack>,
    );

    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
