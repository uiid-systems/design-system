import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { ToggleButton } from "./toggle-button";

describe("ToggleButton", () => {
  it("renders an unpressed button by default", () => {
    render(<ToggleButton>Toggle</ToggleButton>);
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Toggle");
    expect(button).toHaveAttribute("aria-pressed", "false");
    expect(button).toHaveAttribute("data-slot", "button");
  });

  it("toggles aria-pressed on click and on Enter/Space", async () => {
    const user = userEvent.setup();
    render(<ToggleButton>Toggle</ToggleButton>);
    const button = screen.getByRole("button");

    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");

    button.focus();
    await user.keyboard("{Enter}");
    expect(button).toHaveAttribute("aria-pressed", "false");

    await user.keyboard(" ");
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  it("respects defaultPressed for uncontrolled usage", () => {
    render(<ToggleButton defaultPressed>Toggle</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("supports controlled pressed state via onPressedChange", async () => {
    const onPressedChange = vi.fn();
    const Controlled = () => {
      const [pressed, setPressed] = useState(false);
      return (
        <ToggleButton
          pressed={pressed}
          onPressedChange={(v) => {
            setPressed(v);
            onPressedChange(v);
          }}
        >
          Toggle
        </ToggleButton>
      );
    };
    const user = userEvent.setup();
    render(<Controlled />);
    const button = screen.getByRole("button");

    await user.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(true);
    expect(button).toHaveAttribute("aria-pressed", "true");

    await user.click(button);
    expect(onPressedChange).toHaveBeenCalledWith(false);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("swaps text by pressed state and falls back to children when text is absent", async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ToggleButton text={{ pressed: "On", unpressed: "Off" }}>
        Default
      </ToggleButton>,
    );
    const button = screen.getByRole("button");
    expect(button).toHaveTextContent("Off");

    await user.click(button);
    expect(button).toHaveTextContent("On");

    rerender(<ToggleButton>Fallback</ToggleButton>);
    expect(screen.getByRole("button")).toHaveTextContent("Fallback");
  });

  it("swaps icon by pressed state", async () => {
    const user = userEvent.setup();
    render(
      <ToggleButton
        icon={{
          pressed: <span data-testid="on">on</span>,
          unpressed: <span data-testid="off">off</span>,
        }}
      >
        Notifications
      </ToggleButton>,
    );

    expect(screen.getByTestId("off")).toBeInTheDocument();
    expect(screen.queryByTestId("on")).not.toBeInTheDocument();

    await user.click(screen.getByRole("button"));
    expect(screen.getByTestId("on")).toBeInTheDocument();
    expect(screen.queryByTestId("off")).not.toBeInTheDocument();
  });

  it("does not toggle when disabled", async () => {
    const user = userEvent.setup();
    render(<ToggleButton disabled>Toggle</ToggleButton>);
    const button = screen.getByRole("button");

    await user.click(button);
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("supports aria-label for icon-only triggers", () => {
    render(<ToggleButton aria-label="Toggle notifications">🔔</ToggleButton>);
    expect(screen.getByRole("button")).toHaveAccessibleName(
      "Toggle notifications",
    );
  });
});
