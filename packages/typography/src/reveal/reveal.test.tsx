import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { Reveal } from "./reveal";

describe("Reveal", () => {
  it("renders the full text content", () => {
    const { container } = render(<Reveal>The quick brown fox</Reveal>);
    expect(container).toHaveTextContent("The quick brown fox");
  });

  it("renders with data-slot attribute", () => {
    const { container } = render(<Reveal>hello</Reveal>);
    expect(container.querySelector('[data-slot="reveal"]')).toBeInTheDocument();
  });

  it("wraps each word in its own span", () => {
    const { container } = render(<Reveal>one two three</Reveal>);
    const root = container.querySelector('[data-slot="reveal"]');
    expect(root?.children).toHaveLength(3);
  });

  it("preserves whitespace so words read back contiguously", () => {
    const { container } = render(<Reveal>one two</Reveal>);
    expect(container.textContent).toBe("one two");
  });

  it("indexes each word for the stagger delay", () => {
    const { container } = render(<Reveal>one two three</Reveal>);
    const words = Array.from(
      container.querySelector('[data-slot="reveal"]')?.children ?? [],
    );
    expect(
      words.map((word) =>
        (word as HTMLElement).style.getPropertyValue("--reveal-index"),
      ),
    ).toEqual(["0", "1", "2"]);
  });

  it("exposes timing props as custom properties on the root", () => {
    const { container } = render(
      <Reveal stagger={50} duration={600} blur={10}>
        hello
      </Reveal>,
    );
    const root = container.querySelector('[data-slot="reveal"]') as HTMLElement;
    expect(root.style.getPropertyValue("--reveal-stagger")).toBe("50ms");
    expect(root.style.getPropertyValue("--reveal-duration")).toBe("600ms");
    expect(root.style.getPropertyValue("--reveal-blur")).toBe("10px");
  });

  it("renders nothing inside for an empty string", () => {
    const { container } = render(<Reveal>{""}</Reveal>);
    const root = container.querySelector('[data-slot="reveal"]');
    expect(root?.children).toHaveLength(0);
  });

  it("accepts Text props", () => {
    const { container } = render(
      <Reveal size={3} weight="bold" render={<p />}>
        hello world
      </Reveal>,
    );
    const root = container.querySelector('[data-slot="reveal"]');
    expect(root?.tagName).toBe("P");
  });

  it("merges className", () => {
    const { container } = render(<Reveal className="custom">hello</Reveal>);
    const root = container.querySelector('[data-slot="reveal"]');
    expect(root).toHaveClass("custom");
  });
});
