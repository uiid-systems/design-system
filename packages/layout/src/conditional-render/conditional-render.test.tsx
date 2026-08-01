import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { ConditionalRender } from "./conditional-render";

describe("ConditionalRender", () => {
  it("wraps children in the render element when condition is true", () => {
    render(
      <ConditionalRender condition render={<div data-testid="wrapper" />}>
        <span>Content</span>
      </ConditionalRender>,
    );
    expect(screen.getByTestId("wrapper")).toContainElement(
      screen.getByText("Content"),
    );
  });

  it("renders children without a wrapper when condition is false", () => {
    render(
      <ConditionalRender
        condition={false}
        render={<div data-testid="wrapper" />}
      >
        <span>Content</span>
      </ConditionalRender>,
    );
    expect(screen.queryByTestId("wrapper")).not.toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("preserves the wrapper element's own props", () => {
    render(
      <ConditionalRender
        condition
        render={<a href="/page" data-testid="link" className="custom" />}
      >
        <span>Click me</span>
      </ConditionalRender>,
    );
    const link = screen.getByTestId("link");
    expect(link).toHaveAttribute("href", "/page");
    expect(link).toHaveClass("custom");
  });

  it("falls back to render's own children when no children are passed", () => {
    render(
      <ConditionalRender
        condition
        render={<div data-testid="wrapper">Fallback</div>}
      />,
    );
    expect(screen.getByTestId("wrapper")).toHaveTextContent("Fallback");
  });
});
