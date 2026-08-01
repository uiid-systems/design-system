import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Separator } from "./separator";

describe("Separator", () => {
  it("renders a horizontal separator with role + data-slot by default", () => {
    render(<Separator data-testid="separator" />);
    const sep = screen.getByTestId("separator");
    expect(sep).toHaveAttribute("role", "separator");
    expect(sep).toHaveAttribute("data-slot", "separator");
    expect(sep).toHaveAttribute("data-orientation", "horizontal");
  });

  it("reflects the orientation prop on data-orientation", () => {
    render(<Separator orientation="vertical" data-testid="separator" />);
    expect(screen.getByTestId("separator")).toHaveAttribute(
      "data-orientation",
      "vertical",
    );
  });

  it("renders children between separator lines and preserves a11y attrs", () => {
    render(
      <Separator data-testid="separator">
        <span>or continue</span>
      </Separator>,
    );
    const sep = screen.getByTestId("separator");
    expect(sep).toHaveAttribute("role", "separator");
    expect(sep).toHaveAttribute("data-slot", "separator");
    expect(sep).toContainElement(screen.getByText("or continue"));
  });
});
