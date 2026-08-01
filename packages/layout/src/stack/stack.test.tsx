import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Stack } from "./stack";

describe("Stack", () => {
  it("renders a flex column with data-slot=stack", () => {
    render(<Stack data-testid="stack">x</Stack>);
    const stack = screen.getByTestId("stack");
    expect(stack).toHaveAttribute("data-slot", "stack");
    expect(stack).toHaveStyle({
      display: "inline-flex",
      flexDirection: "column",
    });
  });

  it("forwards Box props and swaps ax/ay for column layout", () => {
    render(
      <Stack ax="center" p={4} data-testid="stack">
        x
      </Stack>,
    );
    const stack = screen.getByTestId("stack");
    // Stack swaps ax/ay: the user's `ax` maps to align-items (cross axis).
    expect(stack).toHaveStyle({ alignItems: "center" });
    // Spacing props forward through to the underlying Box.
    expect(stack).toHaveStyle({ padding: "calc(4 * var(--spacing-unit))" });
  });
});
