import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ToggleButton } from "./toggle-button";

describe("ToggleButton", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders a button element", () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("renders with data-slot attribute from underlying Button", () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("data-slot", "button");
  });

  it("renders children content", () => {
    render(<ToggleButton>Toggle me</ToggleButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Toggle me");
  });

  it("applies custom className", () => {
    render(<ToggleButton className="custom-class">Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toHaveClass("custom-class");
  });

  // ============================================
  // TOGGLE STATE
  // ============================================

  it("starts in unpressed state by default", () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("can be toggled by clicking", async () => {
    const user = userEvent.setup();
    render(<ToggleButton>Toggle</ToggleButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("supports controlled pressed state", async () => {
    const handleChange = vi.fn();

    const ControlledToggle = () => {
      const [pressed, setPressed] = useState(false);
      return (
        <ToggleButton
          pressed={pressed}
          onPressedChange={(value) => {
            setPressed(value);
            handleChange(value);
          }}
        >
          Toggle
        </ToggleButton>
      );
    };

    const user = userEvent.setup();
    render(<ControlledToggle />);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(handleChange).toHaveBeenCalledWith(false);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("supports defaultPressed for uncontrolled usage", () => {
    render(<ToggleButton defaultPressed>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  // ============================================
  // DYNAMIC TEXT
  // ============================================

  it("shows unpressed text when not pressed", () => {
    render(
      <ToggleButton text={{ pressed: "On", unpressed: "Off" }}>
        Default
      </ToggleButton>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Off");
  });

  it("shows pressed text when pressed", async () => {
    const user = userEvent.setup();
    render(
      <ToggleButton text={{ pressed: "On", unpressed: "Off" }}>
        Default
      </ToggleButton>,
    );

    const button = screen.getByRole("button");
    await user.click(button);

    expect(button).toHaveTextContent("On");
  });

  it("falls back to children when text prop not provided", () => {
    render(<ToggleButton>Fallback</ToggleButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Fallback");
  });

  // ============================================
  // DYNAMIC ICONS
  // ============================================

  it("shows unpressed icon when not pressed", () => {
    render(
      <ToggleButton
        icon={{
          pressed: <span data-testid="icon-on">🔔</span>,
          unpressed: <span data-testid="icon-off">🔕</span>,
        }}
      >
        Notifications
      </ToggleButton>,
    );

    expect(screen.getByTestId("icon-off")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-on")).not.toBeInTheDocument();
  });

  it("shows pressed icon when pressed", async () => {
    const user = userEvent.setup();
    render(
      <ToggleButton
        icon={{
          pressed: <span data-testid="icon-on">🔔</span>,
          unpressed: <span data-testid="icon-off">🔕</span>,
        }}
      >
        Notifications
      </ToggleButton>,
    );

    await user.click(screen.getByRole("button"));

    expect(screen.getByTestId("icon-on")).toBeInTheDocument();
    expect(screen.queryByTestId("icon-off")).not.toBeInTheDocument();
  });

  // ============================================
  // KEYBOARD INTERACTION
  // ============================================

  it("can be toggled with Enter key", async () => {
    const user = userEvent.setup();
    render(<ToggleButton>Toggle</ToggleButton>);

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard("{Enter}");

    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("can be toggled with Space key", async () => {
    const user = userEvent.setup();
    render(<ToggleButton>Toggle</ToggleButton>);

    const button = screen.getByRole("button");
    button.focus();
    await user.keyboard(" ");

    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  it("can be disabled", () => {
    render(<ToggleButton disabled>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<ToggleButton disabled>Toggle</ToggleButton>);

    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  // ============================================
  // BUTTON VARIANTS (inherited from Button)
  // ============================================

  it("supports size variants", () => {
    const { rerender } = render(<ToggleButton size="small">Toggle</ToggleButton>);
    expect(screen.getByRole("button").className).toContain("size-small");

    rerender(<ToggleButton size="large">Toggle</ToggleButton>);
    expect(screen.getByRole("button").className).toContain("size-large");
  });

  it("supports ghost variant", () => {
    render(<ToggleButton variant="ghost">Toggle</ToggleButton>);
    expect(screen.getByRole("button").className).toContain("variant-ghost");
  });

  it("supports pill shape", () => {
    render(<ToggleButton shape="pill">Toggle</ToggleButton>);
    expect(screen.getByRole("button").className).toContain("shape-pill");
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("has aria-pressed attribute", () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed");
  });

  it("supports aria-label", () => {
    render(<ToggleButton aria-label="Toggle notifications">🔔</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAccessibleName(
      "Toggle notifications",
    );
  });
});
