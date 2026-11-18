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

  it("takes a string size, as lucide's icons do", () => {
    const { container } = render(<LoadingSpinnerIcon size="1em" />);
    const svg = spinner(container);

    expect(svg).toHaveAttribute("width", "1em");
    expect(svg).toHaveAttribute("height", "1em");
  });

  // `Icon` slots may pass any of `IconProps`; this one means nothing to a
  // filled spinner and is not an SVG attribute.
  it("does not pass absoluteStrokeWidth through to the svg", () => {
    const { container } = render(<LoadingSpinnerIcon absoluteStrokeWidth />);
    const svg = spinner(container);

    expect(svg).not.toHaveAttribute("absoluteStrokeWidth");
    expect(svg).not.toHaveAttribute("absolutestrokewidth");
  });

  // The same rule lucide's icons follow, so a spinner in an `icon` slot is
  // decorative by default like any other icon.
  it("is hidden from assistive technology when it has no accessible name", () => {
    const { container } = render(<LoadingSpinnerIcon className="theirs" />);

    expect(spinner(container)).toHaveAttribute("aria-hidden", "true");
  });

  it.each([
    ["aria-label", { "aria-label": "Loading" }],
    ["aria-labelledby", { "aria-labelledby": "status" }],
    ["title", { title: "Loading" }],
    ["role", { role: "status" }],
  ])("is exposed when the caller passes %s", (_name, props) => {
    const { container } = render(<LoadingSpinnerIcon {...props} />);

    expect(spinner(container)).not.toHaveAttribute("aria-hidden");
  });

  it("lets the caller set aria-hidden itself", () => {
    const { container } = render(<LoadingSpinnerIcon aria-hidden={false} />);

    expect(spinner(container)).toHaveAttribute("aria-hidden", "false");
  });
});
