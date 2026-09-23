import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { LoadingSpinnerIcon } from "./loading-spinner";

const spinner = (container: HTMLElement) =>
  container.querySelector('[data-animate="spin"]');

describe("LoadingSpinnerIcon", () => {
  it("animates with CSS rather than SMIL", () => {
    const { container } = render(<LoadingSpinnerIcon />);

    expect(container.querySelector("animateTransform")).toBeNull();
    expect(spinner(container)).not.toBeNull();
  });

  it("keeps the animation hook when a caller passes className", () => {
    // The regression the attribute hook exists to prevent: `className` is
    // spread straight through, so a class-based hook would be overwritten
    // here and the spinner would silently stop.
    const { container } = render(<LoadingSpinnerIcon className="theirs" />);

    expect(spinner(container)).toHaveClass("theirs");
  });

  it("still applies the caller's own props", () => {
    const { container } = render(
      <LoadingSpinnerIcon size={20} aria-label="Loading" />,
    );
    const svg = spinner(container);

    expect(svg).toHaveAttribute("width", "20");
    expect(svg).toHaveAttribute("height", "20");
    expect(svg).toHaveAttribute("aria-label", "Loading");
  });
});
