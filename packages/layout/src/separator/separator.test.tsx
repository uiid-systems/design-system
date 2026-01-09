import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Separator } from "./separator";

describe("Separator", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders a separator element", () => {
    render(<Separator data-testid="separator" />);
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Separator data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-slot",
      "separator",
    );
  });

  it("applies custom className", () => {
    render(<Separator className="custom-class" data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveClass("custom-class");
  });

  // ============================================
  // ORIENTATION
  // ============================================

  it("renders horizontal by default", () => {
    render(<Separator data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("renders horizontal orientation", () => {
    render(<Separator orientation="horizontal" data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-orientation",
      "horizontal",
    );
  });

  it("renders vertical orientation", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("has separator role", () => {
    render(<Separator data-testid="separator" />);
    expect(screen.getByRole("separator")).toBeInTheDocument();
  });

  it("has data-orientation for vertical", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    expect(screen.getByRole("separator")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  // ============================================
  // COMMON USAGE PATTERNS
  // ============================================

  it("separates content in a stack", () => {
    render(
      <div>
        <p>Above</p>
        <Separator data-testid="separator" />
        <p>Below</p>
      </div>,
    );

    expect(screen.getByText("Above")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toBeInTheDocument();
    expect(screen.getByText("Below")).toBeInTheDocument();
  });

  it("separates content in a group", () => {
    render(
      <div style={{ display: "flex" }}>
        <span>Left</span>
        <Separator orientation="vertical" data-testid="separator" />
        <span>Right</span>
      </div>,
    );

    expect(screen.getByText("Left")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
    expect(screen.getByText("Right")).toBeInTheDocument();
  });
});
