import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SwitchRender } from "./switch-render";

describe("SwitchRender", () => {
  // ============================================
  // BASIC BEHAVIOR
  // ============================================

  it("renders with true wrapper when condition is true", () => {
    render(
      <SwitchRender
        condition={true}
        render={{
          true: <div data-testid="true-wrapper" />,
          false: <div data-testid="false-wrapper" />,
        }}
      >
        <span>Content</span>
      </SwitchRender>,
    );

    expect(screen.getByTestId("true-wrapper")).toBeInTheDocument();
    expect(screen.queryByTestId("false-wrapper")).not.toBeInTheDocument();
    expect(screen.getByTestId("true-wrapper")).toContainElement(
      screen.getByText("Content"),
    );
  });

  it("renders with false wrapper when condition is false", () => {
    render(
      <SwitchRender
        condition={false}
        render={{
          true: <div data-testid="true-wrapper" />,
          false: <div data-testid="false-wrapper" />,
        }}
      >
        <span>Content</span>
      </SwitchRender>,
    );

    expect(screen.getByTestId("false-wrapper")).toBeInTheDocument();
    expect(screen.queryByTestId("true-wrapper")).not.toBeInTheDocument();
    expect(screen.getByTestId("false-wrapper")).toContainElement(
      screen.getByText("Content"),
    );
  });

  // ============================================
  // WRAPPER PROPS
  // ============================================

  it("preserves wrapper element props", () => {
    render(
      <SwitchRender
        condition={true}
        render={{
          true: <div data-testid="wrapper" className="active" />,
          false: <div data-testid="wrapper" className="inactive" />,
        }}
      >
        <span>Content</span>
      </SwitchRender>,
    );

    expect(screen.getByTestId("wrapper")).toHaveClass("active");
  });

  // ============================================
  // COMMON USAGE PATTERNS
  // ============================================

  it("switches between link and span based on href", () => {
    const href = "/page";

    render(
      <SwitchRender
        condition={!!href}
        render={{
          true: <a href={href} data-testid="link" />,
          false: <span data-testid="text" />,
        }}
      >
        Click me
      </SwitchRender>,
    );

    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "/page");
  });

  it("renders as text when no href provided", () => {
    const href = undefined;

    render(
      <SwitchRender
        condition={!!href}
        render={{
          true: <a href={href} data-testid="link" />,
          false: <span data-testid="text" />,
        }}
      >
        Not a link
      </SwitchRender>,
    );

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByTestId("text")).toBeInTheDocument();
  });

  it("switches between button and div based on interactivity", () => {
    const isInteractive = true;

    render(
      <SwitchRender
        condition={isInteractive}
        render={{
          true: <button data-testid="interactive" />,
          false: <div data-testid="static" />,
        }}
      >
        Content
      </SwitchRender>,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.queryByTestId("static")).not.toBeInTheDocument();
  });

  it("switches between enabled and disabled styles", () => {
    const isEnabled = false;

    render(
      <SwitchRender
        condition={isEnabled}
        render={{
          true: <div data-testid="wrapper" className="enabled" />,
          false: <div data-testid="wrapper" className="disabled" />,
        }}
      >
        Content
      </SwitchRender>,
    );

    expect(screen.getByTestId("wrapper")).toHaveClass("disabled");
  });
});
