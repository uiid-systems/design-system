import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Suggestion } from "./suggestion";
import * as Examples from "./suggestion.examples";

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

describe("examples", () => {
  it("renders a row of pills that report the one picked", () => {
    render(<Examples.Basic />);

    fireEvent.click(screen.getByRole("button", { name: "Draft a reply" }));

    expect(screen.getByText("Sent: Draft a reply")).toBeInTheDocument();
  });

  it("renders pills under an empty state", () => {
    render(<Examples.WithEmptyState />);

    expect(
      screen.getByRole("heading", { level: 3, name: "No messages yet" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Summarize this page" }),
    ).toBeInTheDocument();
  });
});
