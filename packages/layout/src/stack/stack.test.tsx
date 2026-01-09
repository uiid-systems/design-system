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
  // GAP PROP
  // ============================================

  it("applies gap spacing", () => {
    render(
      <Stack gap={4} data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );

    const stack = screen.getByTestId("stack");
    expect(stack).toHaveAttribute("gap", "4");
  });

  it("applies gap of 0", () => {
    render(
      <Stack gap={0} data-testid="stack">
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );

    const stack = screen.getByTestId("stack");
    expect(stack).toHaveAttribute("gap", "0");
  });

  // ============================================
  // ALIGNMENT PROPS
  // ============================================

  it("applies ax (horizontal alignment in stack context)", () => {
    render(
      <Stack ax="center" data-testid="stack">
        Content
      </Stack>,
    );

    // Stack swaps ax/ay, so ax becomes ay on the underlying Box
    const stack = screen.getByTestId("stack");
    expect(stack).toHaveAttribute("ay", "center");
  });

  it("applies ay (vertical alignment in stack context)", () => {
    render(
      <Stack ay="center" data-testid="stack">
        Content
      </Stack>,
    );

    // Stack swaps ax/ay, so ay becomes ax on the underlying Box
    const stack = screen.getByTestId("stack");
    expect(stack).toHaveAttribute("ax", "center");
  });

  it("supports all alignment values for ax", () => {
    const { rerender } = render(
      <Stack ax="start" data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("ay", "start");

    rerender(
      <Stack ax="end" data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("ay", "end");

    rerender(
      <Stack ax="stretch" data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("ay", "stretch");
  });

  // ============================================
  // PADDING PROPS
  // ============================================

  it("applies padding (p)", () => {
    render(
      <Stack p={4} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("p", "4");
  });

  it("applies horizontal padding (px)", () => {
    render(
      <Stack px={2} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("px", "2");
  });

  it("applies vertical padding (py)", () => {
    render(
      <Stack py={3} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("py", "3");
  });

  it("applies individual padding (pt, pr, pb, pl)", () => {
    render(
      <Stack pt={1} pr={2} pb={3} pl={4} data-testid="stack">
        Content
      </Stack>,
    );

    const stack = screen.getByTestId("stack");
    expect(stack).toHaveAttribute("pt", "1");
    expect(stack).toHaveAttribute("pr", "2");
    expect(stack).toHaveAttribute("pb", "3");
    expect(stack).toHaveAttribute("pl", "4");
  });

  // ============================================
  // MARGIN PROPS
  // ============================================

  it("applies margin (m)", () => {
    render(
      <Stack m={4} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("m", "4");
  });

  it("applies horizontal margin (mx)", () => {
    render(
      <Stack mx={2} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("mx", "2");
  });

  it("applies vertical margin (my)", () => {
    render(
      <Stack my={3} data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("my", "3");
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
    expect(screen.getByTestId("stack")).toHaveAttribute("fullwidth", "true");
  });

  it("applies fullheight", () => {
    render(
      <Stack fullheight data-testid="stack">
        Content
      </Stack>,
    );
    expect(screen.getByTestId("stack")).toHaveAttribute("fullheight", "true");
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

    const stack = screen.getByTestId("stack");
    expect(stack).toHaveAttribute("ay", "center");
    expect(stack).toHaveAttribute("gap", "4");
  });

  it("creates a padded card layout", () => {
    render(
      <Stack p={4} gap={2} data-testid="stack">
        <h2>Title</h2>
        <p>Description</p>
      </Stack>,
    );

    const stack = screen.getByTestId("stack");
    expect(stack).toHaveAttribute("p", "4");
    expect(stack).toHaveAttribute("gap", "2");
  });
});
