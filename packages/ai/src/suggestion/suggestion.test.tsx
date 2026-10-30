import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Suggestion } from "./suggestion";

describe("Suggestion", () => {
  it("is a subtle pill button with the slot and its text", () => {
    render(<Suggestion>Explain this</Suggestion>);

    const button = screen.getByRole("button", { name: "Explain this" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toHaveAttribute("data-slot", "suggestion");
    expect(button.className).toContain("variant-subtle");
    expect(button.className).toContain("shape-pill");
    expect(button.className).toContain("size-small");
  });

  it("calls onClick with the click event", () => {
    const onClick = vi.fn();
    render(<Suggestion onClick={onClick}>Go</Suggestion>);

    fireEvent.click(screen.getByRole("button", { name: "Go" }));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toMatchObject({ type: "click" });
  });

  it("lets a caller's variant, size, disabled and className win", () => {
    render(
      <Suggestion variant="ghost" size="medium" disabled className="custom">
        Go
      </Suggestion>,
    );

    const button = screen.getByRole("button", { name: "Go" });
    expect(button.className).toContain("variant-ghost");
    expect(button.className).toContain("size-medium");
    expect(button.className).not.toContain("variant-subtle");
    expect(button).toBeDisabled();
    expect(button).toHaveClass("custom");
  });
});
