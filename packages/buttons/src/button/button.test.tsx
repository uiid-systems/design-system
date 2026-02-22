import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "./button";

describe("Button", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders a button element", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
  });

  it("renders children content", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Click me");
  });

  it("applies custom className", () => {
    render(<Button className="custom-class">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  it("forwards additional props to root element", () => {
    render(<Button data-testid="test-button">Click me</Button>);
    expect(screen.getByTestId("test-button")).toBeInTheDocument();
  });

  // ============================================
  // VARIANTS
  // ============================================

  it("renders with size variants", () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    expect(screen.getByRole("button").className).toContain("size-small");

    rerender(<Button size="medium">Medium</Button>);
    expect(screen.getByRole("button").className).toContain("size-medium");

    rerender(<Button size="large">Large</Button>);
    expect(screen.getByRole("button").className).toContain("size-large");
  });

  it("renders with variant prop", () => {
    const { rerender } = render(<Button variant="subtle">Subtle</Button>);
    expect(screen.getByRole("button").className).toContain("variant-subtle");

    rerender(<Button variant="ghost">Ghost</Button>);
    expect(screen.getByRole("button").className).toContain("variant-ghost");

    rerender(<Button variant="inverted">Inverted</Button>);
    expect(screen.getByRole("button").className).toContain("variant-inverted");
  });

  it("renders with tone variants", () => {
    const { rerender } = render(<Button tone="positive">Positive</Button>);
    expect(screen.getByRole("button").className).toContain("tone-positive");

    rerender(<Button tone="critical">Negative</Button>);
    expect(screen.getByRole("button").className).toContain("tone-critical");

    rerender(<Button tone="warning">Warning</Button>);
    expect(screen.getByRole("button").className).toContain("tone-warning");

    rerender(<Button tone="info">Info</Button>);
    expect(screen.getByRole("button").className).toContain("tone-info");
  });

  it("renders with shape prop", () => {
    const { rerender } = render(<Button shape="pill">Pill</Button>);
    expect(screen.getByRole("button").className).toContain("shape-pill");

    rerender(<Button shape="square">■</Button>);
    expect(screen.getByRole("button").className).toContain("shape-square");

    rerender(<Button shape="circle">●</Button>);
    expect(screen.getByRole("button").className).toContain("shape-circle");
  });

  // ============================================
  // INTERACTIONS
  // ============================================

  it("handles click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("supports keyboard interaction with Enter", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalled();
  });

  it("supports keyboard interaction with Space", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);
    screen.getByRole("button").focus();
    await user.keyboard(" ");

    expect(handleClick).toHaveBeenCalled();
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  it("can be disabled", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not trigger click when disabled", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    await user.click(screen.getByRole("button"));

    expect(handleClick).not.toHaveBeenCalled();
  });

  // ============================================
  // LOADING STATE
  // ============================================

  it("shows loading state", () => {
    render(<Button loading>Loading</Button>);
    const contentContainer = document.querySelector(
      '[data-slot="button-content-container"]',
    );
    expect(contentContainer).toHaveAttribute("data-loading", "true");
    expect(contentContainer).toHaveAttribute("aria-hidden", "true");
  });

  it("shows spinner when loading", () => {
    render(<Button loading>Loading</Button>);
    const spinner = document.querySelector('[data-slot="button-spinner"]');
    expect(spinner).toHaveAttribute("data-loading", "true");
  });

  it("hides content when loading", () => {
    render(<Button loading>Loading</Button>);
    const contentContainer = document.querySelector(
      '[data-slot="button-content-container"]',
    );
    expect(contentContainer).toHaveAttribute("aria-hidden", "true");
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("has accessible name from children", () => {
    render(<Button>Submit form</Button>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Submit form");
  });

  it("supports aria-label for icon-only buttons", () => {
    render(<Button aria-label="Close dialog">✕</Button>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Close dialog");
  });

  it("supports aria-describedby", () => {
    render(
      <>
        <Button aria-describedby="help-text">Submit</Button>
        <span id="help-text">This will submit the form</span>
      </>,
    );
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-describedby",
      "help-text",
    );
  });

  // ============================================
  // TYPE ATTRIBUTE
  // ============================================

  it("defaults to type button", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("can be set to type submit", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("can be set to type reset", () => {
    render(<Button type="reset">Reset</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
  });

  // ============================================
  // BASE UI API
  // ============================================

  it("renders as anchor element when nativeButton is false with render prop", () => {
    render(
      <Button nativeButton={false} render={<a href="https://example.com" />}>
        Visit site
      </Button>,
    );

    // Base UI adds role="button" to maintain button semantics
    const button = screen.getByRole("button");
    expect(button.tagName).toBe("A");
    expect(button).toHaveAttribute("href", "https://example.com");
    expect(button).toHaveTextContent("Visit site");
  });

  it("preserves button styling when rendered as anchor", () => {
    render(
      <Button
        nativeButton={false}
        render={<a href="https://example.com" />}
        size="large"
        variant="subtle"
      >
        Visit site
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button.tagName).toBe("A");
    expect(button.className).toContain("size-large");
    expect(button.className).toContain("variant-subtle");
  });

  it("preserves anchor attributes when using render prop", () => {
    render(
      <Button
        nativeButton={false}
        render={<a href="https://example.com" target="_blank" rel="noopener" />}
      >
        External link
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("href", "https://example.com");
    expect(button).toHaveAttribute("target", "_blank");
    expect(button).toHaveAttribute("rel", "noopener");
  });

  it("renders as custom element with render prop", () => {
    render(
      <Button nativeButton={false} render={<span />}>
        Span button
      </Button>,
    );

    // Base UI still applies role="button" to custom elements
    const button = screen.getByRole("button");
    expect(button.tagName).toBe("SPAN");
    expect(button).toHaveTextContent("Span button");
  });

  it("applies data-slot to custom rendered element", () => {
    render(
      <Button nativeButton={false} render={<a href="#" />}>
        Link
      </Button>,
    );

    const button = screen.getByRole("button");
    expect(button.tagName).toBe("A");
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("supports keyboard interaction on anchor rendered as button", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(
      <Button
        nativeButton={false}
        render={<a href="#" />}
        onClick={handleClick}
      >
        Link button
      </Button>,
    );

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(handleClick).toHaveBeenCalled();
  });
});
