import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConditionalRender } from "./conditional-render";

describe("ConditionalRender", () => {
  // ============================================
  // BASIC BEHAVIOR
  // ============================================

  it("renders children directly when condition is false", () => {
    render(
      <ConditionalRender
        condition={false}
        render={<div data-testid="wrapper" />}
      >
        <span>Content</span>
      </ConditionalRender>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.queryByTestId("wrapper")).not.toBeInTheDocument();
  });

  it("wraps children in render element when condition is true", () => {
    render(
      <ConditionalRender
        condition={true}
        render={<div data-testid="wrapper" />}
      >
        <span>Content</span>
      </ConditionalRender>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
    expect(screen.getByTestId("wrapper")).toBeInTheDocument();
    expect(screen.getByTestId("wrapper")).toContainElement(
      screen.getByText("Content"),
    );
  });

  // ============================================
  // RENDER PROP
  // ============================================

  it("renders children when render prop is undefined", () => {
    render(
      <ConditionalRender condition={true} render={undefined}>
        <span>Content</span>
      </ConditionalRender>,
    );

    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("preserves wrapper element props", () => {
    render(
      <ConditionalRender
        condition={true}
        render={<div data-testid="wrapper" className="custom-wrapper" />}
      >
        <span>Content</span>
      </ConditionalRender>,
    );

    expect(screen.getByTestId("wrapper")).toHaveClass("custom-wrapper");
  });

  // ============================================
  // COMMON USAGE PATTERNS
  // ============================================

  it("conditionally wraps in a link", () => {
    const hasLink = true;

    render(
      <ConditionalRender
        condition={hasLink}
        render={<a href="/page" data-testid="link" />}
      >
        <span>Click me</span>
      </ConditionalRender>,
    );

    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/page");
  });

  it("conditionally wraps in a tooltip trigger", () => {
    const showTooltip = true;

    render(
      <ConditionalRender
        condition={showTooltip}
        render={<div data-testid="tooltip-trigger" aria-describedby="tooltip" />}
      >
        <button>Hover me</button>
      </ConditionalRender>,
    );

    expect(screen.getByTestId("tooltip-trigger")).toContainElement(
      screen.getByRole("button"),
    );
  });

  it("does not wrap when feature flag is off", () => {
    const featureEnabled = false;

    render(
      <ConditionalRender
        condition={featureEnabled}
        render={<div data-testid="feature-wrapper" />}
      >
        <span>Base content</span>
      </ConditionalRender>,
    );

    expect(screen.getByText("Base content")).toBeInTheDocument();
    expect(screen.queryByTestId("feature-wrapper")).not.toBeInTheDocument();
  });

  // ============================================
  // NESTED CONTENT
  // ============================================

  it("wraps complex nested content", () => {
    render(
      <ConditionalRender
        condition={true}
        render={<section data-testid="wrapper" />}
      >
        <h2>Title</h2>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </ConditionalRender>,
    );

    const wrapper = screen.getByTestId("wrapper");
    expect(wrapper).toContainElement(screen.getByRole("heading"));
    expect(wrapper.querySelectorAll("p")).toHaveLength(2);
  });
});
