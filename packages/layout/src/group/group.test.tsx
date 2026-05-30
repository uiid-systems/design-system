import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Group } from "./group";

describe("Group", () => {
  it("renders a flex container with data-slot=group", () => {
    render(<Group data-testid="group">x</Group>);
    const group = screen.getByTestId("group");
    expect(group).toHaveAttribute("data-slot", "group");
    expect(group).toHaveStyle({ display: "flex" });
  });

  it("forwards Box props with ax/ay un-swapped (row layout)", () => {
    render(
      <Group ax="center" p={4} data-testid="group">
        x
      </Group>,
    );
    const group = screen.getByTestId("group");
    // Group does not swap ax/ay: `ax` maps to justify-content (main axis).
    expect(group).toHaveStyle({ justifyContent: "center" });
    // Spacing props forward through to the underlying Box.
    expect(group).toHaveStyle({ padding: "calc(4 * var(--spacing-unit))" });
  });
});
