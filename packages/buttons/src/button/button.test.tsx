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

    const link = screen.getByRole("link");
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

    screen.getByRole("link").focus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalled();
  });

  /*
   * A button whose `render` navigates has to stay a link. Base UI's
   * `useButton` adds `role="button"` to anything it renders in non-native
   * mode, which announced these as buttons and hid them from a screen
   * reader's list of links.
   */
  describe("link semantics", () => {
    it("keeps link semantics instead of role=button", () => {
      render(<Button render={<a href="/page" />}>Next</Button>);

      const link = screen.getByRole("link", { name: "Next" });
      expect(link).not.toHaveAttribute("role");
      expect(link).not.toHaveAttribute("tabindex");
      expect(screen.queryByRole("button")).toBeNull();
    });

    it("detects a router link that forwards href to an anchor", () => {
      const RouterLink = ({
        href,
        ...props
      }: React.ComponentProps<"a"> & { href: string }) => (
        <a href={href} {...props} />
      );

      render(
        <Button render={<RouterLink href="/page" />} variant="subtle">
          Next
        </Button>,
      );

      const link = screen.getByRole("link", { name: "Next" });
      expect(link).not.toHaveAttribute("role");
      expect(link).toHaveAttribute("href", "/page");
      expect(link.className).toContain("variant-subtle");
    });

    it("still renders a button for a render prop with no href", () => {
      render(<Button render={<span />}>Act</Button>);

      const button = screen.getByRole("button", { name: "Act" });
      expect(button.tagName).toBe("SPAN");
    });

    it("does not leave Base UI props on the anchor", () => {
      render(
        <Button
          nativeButton={false}
          focusableWhenDisabled
          render={<a href="/page" />}
        >
          Next
        </Button>,
      );

      const link = screen.getByRole("link");
      expect(link).not.toHaveAttribute("nativeButton");
      expect(link).not.toHaveAttribute("focusableWhenDisabled");
    });

    it("does not activate a disabled link", async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Button disabled onClick={onClick} render={<a href="/page" />}>
          Next
        </Button>,
      );

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("aria-disabled", "true");
      expect(link).toHaveAttribute("tabindex", "-1");
      expect(link).not.toHaveAttribute("disabled");

      await user.click(link);
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  /*
   * The tooltip is composed from Base UI directly rather than the Tooltip in
   * @uiid/overlays — depending on overlays here would close a cycle back
   * through cards. These cover the behaviour that swap has to preserve.
   */
  describe("tooltip", () => {
    it("renders the button normally when no tooltip is passed", () => {
      render(<Button>Plain</Button>);

      expect(screen.getByRole("button")).toHaveTextContent("Plain");
    });

    it("still renders its children when wrapped in a tooltip", () => {
      render(<Button tooltip="Helpful hint">Save</Button>);

      expect(screen.getByText("Save")).toBeVisible();
    });

    it("reveals the tooltip content on hover", async () => {
      const user = userEvent.setup();
      render(<Button tooltip="Helpful hint">Save</Button>);

      expect(screen.queryByText("Helpful hint")).not.toBeInTheDocument();

      await user.hover(screen.getByText("Save"));

      expect(await screen.findByText("Helpful hint")).toBeVisible();
    });
  });
});
