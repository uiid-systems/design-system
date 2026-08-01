import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";

import { Button } from "./button";

describe("Button", () => {
  it("renders children inside a button", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Click me");
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("forwards className and arbitrary props", () => {
    render(
      <Button className="extra" data-testid="btn">
        Hi
      </Button>,
    );
    const button = screen.getByTestId("btn");
    expect(button).toHaveClass("extra");
  });

  it.each(["xsmall", "small", "medium", "large"] as const)(
    "applies size=%s",
    (size) => {
      render(<Button size={size}>x</Button>);
      expect(screen.getByRole("button").className).toContain(`size-${size}`);
    },
  );

  it.each(["subtle", "ghost"] as const)("applies variant=%s", (variant) => {
    render(<Button variant={variant}>x</Button>);
    expect(screen.getByRole("button").className).toContain(
      `variant-${variant}`,
    );
  });

  it.each(["pill", "square", "circle"] as const)(
    "applies shape=%s",
    (shape) => {
      render(<Button shape={shape}>x</Button>);
      expect(screen.getByRole("button").className).toContain(`shape-${shape}`);
    },
  );

  it("fires onClick on click and keyboard", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(<Button onClick={onClick}>Click</Button>);

    const button = screen.getByRole("button");
    await user.click(button);
    button.focus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");

    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("does not fire onClick when disabled", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button disabled onClick={onClick}>
        Disabled
      </Button>,
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toBeDisabled();
    expect(onClick).not.toHaveBeenCalled();
  });

  it("hides content and shows spinner when loading", () => {
    render(<Button loading>Submitting</Button>);
    const content = document.querySelector(
      '[data-slot="button-content-container"]',
    );
    const spinner = document.querySelector('[data-slot="button-spinner"]');

    expect(content).toHaveAttribute("data-loading", "true");
    expect(content).toHaveAttribute("aria-hidden", "true");
    expect(spinner).toHaveAttribute("data-loading", "true");
  });

  it("supports aria-label for icon-only buttons", () => {
    render(<Button aria-label="Close">✕</Button>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Close");
  });

  it("defaults to type=button and accepts submit/reset", () => {
    const { rerender } = render(<Button>x</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");

    rerender(<Button type="submit">x</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");

    rerender(<Button type="reset">x</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "reset");
  });

  it("renders as an anchor via the render prop and preserves href/target/rel", () => {
    render(
      <Button
        nativeButton={false}
        render={<a href="https://example.com" target="_blank" rel="noopener" />}
        size="large"
        variant="subtle"
      >
        Visit
      </Button>,
    );

    const link = screen.getByRole("button");
    expect(link.tagName).toBe("A");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener");
    expect(link).toHaveAttribute("data-slot", "button");
    expect(link.className).toContain("size-large");
    expect(link.className).toContain("variant-subtle");
  });

  it("triggers onClick from Enter on a polymorphic anchor", async () => {
    const onClick = vi.fn();
    const user = userEvent.setup();
    render(
      <Button nativeButton={false} render={<a href="#" />} onClick={onClick}>
        Link
      </Button>,
    );

    screen.getByRole("button").focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalled();
  });
});
