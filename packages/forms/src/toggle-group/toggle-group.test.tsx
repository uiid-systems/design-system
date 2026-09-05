import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Toggle, ToggleGroup } from "./toggle-group";

const SIZES = ["xsmall", "small", "medium", "large"] as const;

const renderGroup = (props: React.ComponentProps<typeof ToggleGroup> = {}) =>
  render(
    <ToggleGroup {...props}>
      <Toggle value="monthly">Monthly</Toggle>
      <Toggle value="yearly">Yearly</Toggle>
    </ToggleGroup>,
  );

describe("ToggleGroup size", () => {
  it.each(SIZES)("marks the panel with the %s tier", (size) => {
    const { container } = renderGroup({ size });
    expect(
      container.querySelector(`[data-size="${size}"]`),
    ).toBeInTheDocument();
  });

  it.each(SIZES)(
    "hands the %s tier to every toggle, not just the panel",
    (size) => {
      renderGroup({ size });
      for (const toggle of screen.getAllByRole("button")) {
        expect(toggle.className).toMatch(new RegExp(`composes-size-${size}`));
      }
    },
  );

  it("defaults to the medium tier, matching the other form controls", () => {
    const { container } = renderGroup();
    expect(container.querySelector('[data-size="medium"]')).toBeInTheDocument();
    expect(screen.getAllByRole("button")[0].className).toMatch(
      /composes-size-medium/,
    );
  });

  it("keeps a consumer's own className alongside the tier", () => {
    render(
      <ToggleGroup size="large">
        <Toggle value="monthly" className="custom">
          Monthly
        </Toggle>
      </ToggleGroup>,
    );
    const toggle = screen.getByRole("button");
    expect(toggle).toHaveClass("custom");
    expect(toggle.className).toMatch(/composes-size-large/);
  });
});
