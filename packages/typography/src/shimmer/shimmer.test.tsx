import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Shimmer } from "./shimmer";

const getRoot = (container: HTMLElement) =>
  container.querySelector('[data-slot="shimmer"]') as HTMLElement;

describe("Shimmer", () => {
  it("renders the full text content", () => {
    const { container } = render(<Shimmer>Thinking…</Shimmer>);
    expect(container).toHaveTextContent("Thinking…");
  });

  it("renders with data-slot attribute", () => {
    const { container } = render(<Shimmer>hello</Shimmer>);
    expect(getRoot(container)).toBeInTheDocument();
  });

  it("exposes the default duration and spread as custom properties", () => {
    const { container } = render(<Shimmer>hello</Shimmer>);
    const root = getRoot(container);
    expect(root.style.getPropertyValue("--shimmer-duration")).toBe("2000ms");
    expect(root.style.getPropertyValue("--shimmer-spread")).toBe("10px");
  });

  it("reflects duration and spread props", () => {
    const { container } = render(
      <Shimmer duration={1000} spread={4}>
        hello
      </Shimmer>,
    );
    const root = getRoot(container);
    expect(root.style.getPropertyValue("--shimmer-duration")).toBe("1000ms");
    expect(root.style.getPropertyValue("--shimmer-spread")).toBe("20px");
  });

  it("scales the spread with the length of the text", () => {
    const short = render(<Shimmer>hi</Shimmer>);
    const long = render(<Shimmer>hello world</Shimmer>);
    expect(
      getRoot(short.container).style.getPropertyValue("--shimmer-spread"),
    ).toBe("4px");
    expect(
      getRoot(long.container).style.getPropertyValue("--shimmer-spread"),
    ).toBe("22px");
  });

  it("sets a zero spread for an empty string", () => {
    const { container } = render(<Shimmer>{""}</Shimmer>);
    expect(getRoot(container).style.getPropertyValue("--shimmer-spread")).toBe(
      "0px",
    );
  });

  it("merges a caller's style with the custom properties", () => {
    const { container } = render(
      <Shimmer style={{ opacity: 0.5 }}>hello</Shimmer>,
    );
    const root = getRoot(container);
    expect(root.style.opacity).toBe("0.5");
    expect(root.style.getPropertyValue("--shimmer-duration")).toBe("2000ms");
    expect(root.style.getPropertyValue("--shimmer-spread")).toBe("10px");
  });

  it("passes Text props through as data-ui attributes", () => {
    const { container } = render(
      <Shimmer size={3} weight="bold" color="blue">
        hello
      </Shimmer>,
    );
    const root = getRoot(container);
    expect(root).toHaveAttribute("data-ui-size", "3");
    expect(root).toHaveAttribute("data-ui-weight", "bold");
    expect(root).toHaveAttribute("data-ui-color", "blue");
  });

  it("sets no inline color of its own", () => {
    const { container } = render(<Shimmer color="blue">hello</Shimmer>);
    expect(getRoot(container).style.color).toBe("");
  });

  it("swaps the element with render", () => {
    const { container } = render(<Shimmer render={<p />}>hello</Shimmer>);
    expect(getRoot(container).tagName).toBe("P");
  });

  it("merges className", () => {
    const { container } = render(<Shimmer className="custom">hello</Shimmer>);
    expect(getRoot(container)).toHaveClass("custom");
  });
});
