import { render } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, it, expect } from "vitest";

import { Reveal } from "./reveal";

const getWords = (container: HTMLElement) =>
  Array.from(
    container.querySelector('[data-slot="reveal"]')?.children ?? [],
  ) as HTMLElement[];

const delays = (container: HTMLElement) =>
  getWords(container).map((word) =>
    word.style.getPropertyValue("--reveal-delay"),
  );

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

  it("keeps a whitespace run on the word before it", () => {
    const { container } = render(<Reveal>{"Intro.\n\nNext  word"}</Reveal>);
    const words = Array.from(
      container.querySelector('[data-slot="reveal"]')?.children ?? [],
    );
    expect(words.map((word) => word.textContent)).toEqual([
      "Intro.\n\n",
      "Next  ",
      "word",
    ]);
    expect(container.textContent).toBe("Intro.\n\nNext  word");
  });

  it("staggers each word on mount", () => {
    const { container } = render(<Reveal>one two three</Reveal>);
    expect(delays(container)).toEqual(["0ms", "30ms", "60ms"]);
  });

  it("only appends spans for newly streamed words", () => {
    const { container, rerender } = render(<Reveal>one two</Reveal>);
    const [first, second] = getWords(container);

    rerender(<Reveal>one two three</Reveal>);
    const words = getWords(container);
    expect(words).toHaveLength(3);
    expect(words[0]).toBe(first);
    expect(words[1]).toBe(second);
  });

  it("staggers each streamed chunk from its own first word", () => {
    const { container, rerender } = render(<Reveal>one two</Reveal>);
    rerender(<Reveal>one two three four</Reveal>);
    rerender(<Reveal>one two three four five</Reveal>);
    expect(delays(container)).toEqual(["0ms", "30ms", "0ms", "30ms", "0ms"]);
  });

  it("staggers streamed chunks the same under StrictMode", () => {
    const { container, rerender } = render(
      <StrictMode>
        <Reveal>one two</Reveal>
      </StrictMode>,
    );
    rerender(
      <StrictMode>
        <Reveal>one two three four</Reveal>
      </StrictMode>,
    );
    expect(delays(container)).toEqual(["0ms", "30ms", "0ms", "30ms"]);
  });

  it("keeps mounted words' timing when timing props change", () => {
    const { container, rerender } = render(
      <Reveal stagger={30} duration={400}>
        one two
      </Reveal>,
    );
    rerender(
      <Reveal stagger={100} duration={800}>
        one two three four
      </Reveal>,
    );
    expect(delays(container)).toEqual(["0ms", "30ms", "0ms", "100ms"]);
    expect(
      getWords(container).map((word) =>
        word.style.getPropertyValue("--reveal-duration"),
      ),
    ).toEqual(["400ms", "400ms", "800ms", "800ms"]);
  });

  it("exposes timing props as custom properties", () => {
    const { container } = render(
      <Reveal stagger={50} duration={600} blur={10}>
        hello world
      </Reveal>,
    );
    const root = container.querySelector('[data-slot="reveal"]') as HTMLElement;
    const [, second] = getWords(container);
    expect(root.style.getPropertyValue("--reveal-blur")).toBe("10px");
    expect(second.style.getPropertyValue("--reveal-delay")).toBe("50ms");
    expect(second.style.getPropertyValue("--reveal-duration")).toBe("600ms");
  });

  it("wraps plainly so streamed words don't re-break shown lines", () => {
    const { container } = render(<Reveal>hello</Reveal>);
    const root = container.querySelector('[data-slot="reveal"]') as HTMLElement;
    expect(root.style.getPropertyValue("text-wrap")).toBe("wrap");
  });

  it("has no balance, nowrap or truncate prop", () => {
    // @ts-expect-error balance re-breaks lines as words arrive, so Reveal does not take it
    render(<Reveal balance>hello</Reveal>);
    // @ts-expect-error Reveal always wraps, so it does not take nowrap
    render(<Reveal nowrap>hello</Reveal>);
    // @ts-expect-error Reveal always wraps, so it does not take truncate
    render(<Reveal truncate>hello</Reveal>);
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
