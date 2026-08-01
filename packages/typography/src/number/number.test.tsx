import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Number } from "./number";

describe("Number", () => {
  it("renders with data-slot attribute", () => {
    const { container } = render(<Number value={1234} />);
    expect(container.querySelector('[data-slot="number"]')).toBeInTheDocument();
  });

  it("renders the number-flow element", () => {
    const { container } = render(<Number value={1234} />);
    expect(container.querySelector("number-flow-react")).toBeInTheDocument();
  });

  it("merges className onto the number-flow element", () => {
    const { container } = render(<Number value={1234} className="custom" />);
    expect(container.querySelector("number-flow-react")).toHaveClass("custom");
  });

  it("accepts Text variant props without error", () => {
    const { container } = render(
      <Number value={42} size={4} weight="bold" color="green" />,
    );
    const el = container.querySelector('[data-slot="number"]');
    expect(el).toBeInTheDocument();
    expect(el?.className).not.toBe("");
  });
});
