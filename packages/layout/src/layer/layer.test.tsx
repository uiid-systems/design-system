import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layer } from "./layer";

describe("Layer", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders children", () => {
    render(
      <Layer>
        <div>Layer 1</div>
        <div>Layer 2</div>
      </Layer>,
    );

    expect(screen.getByText("Layer 1")).toBeInTheDocument();
    expect(screen.getByText("Layer 2")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Layer data-testid="layer">Content</Layer>);
    expect(screen.getByTestId("layer")).toHaveAttribute("data-slot", "layer");
  });

  it("applies custom className", () => {
    render(
      <Layer className="custom-class" data-testid="layer">
        Content
      </Layer>,
    );
    expect(screen.getByTestId("layer")).toHaveClass("custom-class");
  });

  // ============================================
  // ALIGNMENT PROPS (inherited from Box)
  // ============================================

  it("applies ax alignment", () => {
    render(
      <Layer ax="center" data-testid="layer">
        Content
      </Layer>,
    );
    expect(screen.getByTestId("layer")).toHaveAttribute("ax", "center");
  });

  it("applies ay alignment", () => {
    render(
      <Layer ay="center" data-testid="layer">
        Content
      </Layer>,
    );
    expect(screen.getByTestId("layer")).toHaveAttribute("ay", "center");
  });

  // ============================================
  // OFFSET PROP
  // ============================================

  it("applies x offset transforms to children", () => {
    render(
      <Layer offset={{ x: 10 }} data-testid="layer">
        <div data-testid="child-1">1</div>
        <div data-testid="child-2">2</div>
        <div data-testid="child-3">3</div>
      </Layer>,
    );

    expect(screen.getByTestId("child-1")).toHaveStyle({
      transform: "translate(0px, 0px)",
    });
    expect(screen.getByTestId("child-2")).toHaveStyle({
      transform: "translate(10px, 0px)",
    });
    expect(screen.getByTestId("child-3")).toHaveStyle({
      transform: "translate(20px, 0px)",
    });
  });

  it("applies y offset transforms to children", () => {
    render(
      <Layer offset={{ y: 5 }} data-testid="layer">
        <div data-testid="child-1">1</div>
        <div data-testid="child-2">2</div>
      </Layer>,
    );

    expect(screen.getByTestId("child-1")).toHaveStyle({
      transform: "translate(0px, 0px)",
    });
    expect(screen.getByTestId("child-2")).toHaveStyle({
      transform: "translate(0px, 5px)",
    });
  });

  it("applies both x and y offsets", () => {
    render(
      <Layer offset={{ x: 8, y: 4 }} data-testid="layer">
        <div data-testid="child-1">1</div>
        <div data-testid="child-2">2</div>
      </Layer>,
    );

    expect(screen.getByTestId("child-1")).toHaveStyle({
      transform: "translate(0px, 0px)",
    });
    expect(screen.getByTestId("child-2")).toHaveStyle({
      transform: "translate(8px, 4px)",
    });
  });

  it("renders without offset when not provided", () => {
    render(
      <Layer data-testid="layer">
        <div data-testid="child">No offset</div>
      </Layer>,
    );

    // Child should not have inline transform
    expect(screen.getByTestId("child")).not.toHaveStyle({ transform: expect.any(String) });
  });

  // ============================================
  // COMMON USAGE PATTERNS
  // ============================================

  it("creates an avatar stack with offset", () => {
    render(
      <Layer offset={{ x: -8 }} data-testid="layer">
        <div data-testid="avatar-1">A</div>
        <div data-testid="avatar-2">B</div>
        <div data-testid="avatar-3">C</div>
      </Layer>,
    );

    // Negative offset for overlapping avatars
    expect(screen.getByTestId("avatar-2")).toHaveStyle({
      transform: "translate(-8px, 0px)",
    });
  });

  it("creates centered overlapping content", () => {
    render(
      <Layer ax="center" ay="center" data-testid="layer">
        <div>Background</div>
        <div>Foreground</div>
      </Layer>,
    );

    const layer = screen.getByTestId("layer");
    expect(layer).toHaveAttribute("ax", "center");
    expect(layer).toHaveAttribute("ay", "center");
  });
});
