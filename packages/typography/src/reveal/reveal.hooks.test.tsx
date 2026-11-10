import { act, render, renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

import { useStreamPace, useStreamReveal } from "./reveal.hooks";

import styles from "./reveal.module.css";

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

/**
 * Each released word schedules the next timer from an effect, which only runs once `act`
 * flushes, so time moves in small steps rather than one jump.
 */
const advance = (ms: number, step = 25) => {
  for (let elapsed = 0; elapsed < ms; elapsed += step) {
    act(() => {
      vi.advanceTimersByTime(Math.min(step, ms - elapsed));
    });
  }
};

describe("useStreamPace", () => {
  const usePace = (props: { text: string; streaming: boolean }) =>
    useStreamPace(props.text, props.streaming);

  it("shows finished text straight away", () => {
    const { result } = renderHook(usePace, {
      initialProps: { text: "Hello world", streaming: false },
    });
    expect(result.current).toEqual({
      text: "Hello world",
      streaming: false,
      streamId: 0,
    });
  });

  it("releases streamed words one at a time", () => {
    const { result } = renderHook(usePace, {
      initialProps: { text: "one two three ", streaming: true },
    });
    expect(result.current.text).toBe("");

    advance(1000);
    expect(result.current.text).toBe("one two three ");
    expect(result.current.streaming).toBe(true);
  });

  it("holds back the unfinished last word while streaming", () => {
    const { result } = renderHook(usePace, {
      initialProps: { text: "Hello wor", streaming: true },
    });

    advance(1000);
    expect(result.current.text).toBe("Hello ");
  });

  it("drains the rest after streaming stops, then reports it finished", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "Hello wor", streaming: true },
    });
    advance(1000);

    rerender({ text: "Hello world", streaming: false });
    expect(result.current).toEqual({
      text: "Hello ",
      streaming: true,
      streamId: 0,
    });

    advance(1000);
    expect(result.current).toEqual({
      text: "Hello world",
      streaming: false,
      streamId: 0,
    });
  });

  it("starts over when the text gets shorter", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "first answer ", streaming: true },
    });
    advance(1000);
    expect(result.current.text).toBe("first answer ");

    rerender({ text: "new ", streaming: true });
    expect(result.current.text).toBe("");

    advance(1000);
    expect(result.current.text).toBe("new ");
  });

  it("counts a new stream each time the text starts over", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "first answer ", streaming: true },
    });
    expect(result.current.streamId).toBe(0);
    advance(1000);

    rerender({ text: "first answer more ", streaming: true });
    expect(result.current.streamId).toBe(0);

    rerender({ text: "", streaming: true });
    expect(result.current.streamId).toBe(1);
  });

  it("shows the first word straight away while chunks keep arriving", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "Hello ", streaming: true },
    });

    // Chunks of one long unfinished word, faster than the pace for a backlog of one.
    let text = "Hello ";
    for (let chunk = 0; chunk < 10; chunk++) {
      advance(40, 40);
      text += "a";
      rerender({ text, streaming: true });
    }
    expect(result.current.text).toBe("Hello ");
  });

  it("starts over when the text no longer continues what was shown", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "Hello world again ", streaming: true },
    });
    advance(25);
    expect(result.current.text).toBe("Hello ");

    rerender({ text: "New response ", streaming: true });
    expect(result.current).toEqual({ text: "", streaming: true, streamId: 1 });

    advance(1000);
    expect(result.current.text).toBe("New response ");
  });

  it("sends a list marker out with the word after it", () => {
    const { result } = renderHook(usePace, {
      initialProps: { text: "- item next ", streaming: true },
    });

    advance(25);
    expect(result.current.text).toBe("- item ");
  });

  it("sends an ordered-list number out with the word after it", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "Intro\n\n", streaming: true },
    });
    advance(1000);

    rerender({ text: "Intro\n\n1. ", streaming: true });
    advance(1000);
    expect(result.current.text).toBe("Intro\n\n");

    rerender({ text: "Intro\n\n1. first ", streaming: true });
    advance(1000);
    expect(result.current.text).toBe("Intro\n\n1. first ");
  });

  it("holds back a marker that arrives after shown text until its word does", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "Intro\n\n", streaming: true },
    });
    advance(1000);
    expect(result.current.text).toBe("Intro\n\n");

    const seen: string[] = [];
    for (const text of ["Intro\n\n- ", "Intro\n\n- fir", "Intro\n\n- first "]) {
      rerender({ text, streaming: true });
      seen.push(result.current.text);
    }
    advance(1000);
    seen.push(result.current.text);

    // Never longer and then shorter again: an empty list item would mount and unmount.
    seen.forEach((text, index) =>
      expect(text.length).toBeGreaterThanOrEqual(seen[index - 1]?.length ?? 0),
    );
    expect(seen.at(-1)).toBe("Intro\n\n- first ");
  });

  it("shows a trailing marker once streaming stops", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "Intro\n\n- ", streaming: true },
    });
    advance(1000);
    expect(result.current.text).toBe("Intro\n\n");

    rerender({ text: "Intro\n\n- ", streaming: false });
    expect(result.current).toEqual({
      text: "Intro\n\n- ",
      streaming: false,
      streamId: 0,
    });
  });

  it.each(["# ", "## ", "* ", "+ ", "> ", "  - ", "- 1. "])(
    "holds back a trailing %j marker until its word arrives",
    (marker) => {
      const { result, rerender } = renderHook(usePace, {
        initialProps: { text: "Intro\n\n", streaming: true },
      });
      advance(1000);

      rerender({ text: `Intro\n\n${marker}`, streaming: true });
      advance(1000);
      expect(result.current.text).toBe("Intro\n\n");

      rerender({ text: `Intro\n\n${marker}word `, streaming: true });
      advance(1000);
      expect(result.current.text).toBe(`Intro\n\n${marker}word `);
    },
  );

  it.each(["🎉 ", "— ", "} "])(
    "shows a trailing %j while streaming, without waiting for another word",
    (token) => {
      const { result } = renderHook(usePace, {
        initialProps: { text: `Done ${token}`, streaming: true },
      });
      advance(1000);
      expect(result.current.text).toBe(`Done ${token}`);
    },
  );

  it("shows the first word of a new stream straight away", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: {
        text: "Hello world again more words here ",
        streaming: true,
      },
    });
    advance(25);

    rerender({ text: "New response ", streaming: true });
    advance(10, 10);
    expect(result.current.text).toBe("New ");
  });

  it("counts every new stream, not just the first", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "a b ", streaming: true },
    });
    advance(1000);
    rerender({ text: "c d ", streaming: true });
    advance(1000);
    rerender({ text: "e f ", streaming: true });
    expect(result.current.streamId).toBe(2);
  });

  it("shows finished text that replaces finished text straight away", () => {
    const { result, rerender } = renderHook(usePace, {
      initialProps: { text: "a b", streaming: false },
    });

    rerender({ text: "c d", streaming: false });
    expect(result.current).toEqual({
      text: "c d",
      streaming: false,
      streamId: 1,
    });
  });

  it("renders once per streamed chunk", () => {
    let renders = 0;
    const { rerender } = renderHook(
      (props: { text: string; streaming: boolean }) => {
        renders++;
        return usePace(props);
      },
      { initialProps: { text: "Hello ", streaming: true } },
    );
    advance(1000);

    renders = 0;
    rerender({ text: "Hello world", streaming: true });
    expect(renders).toBe(1);
  });
});

describe("useStreamReveal", () => {
  /** Calls the pass unconditionally, as the README shows. */
  const Harness = ({
    streaming,
    bold = false,
    streamId,
  }: {
    streaming: boolean;
    bold?: boolean;
    streamId?: number;
  }) => {
    const words = useStreamReveal({ streaming, streamId });
    const pass = words.pass();
    const Wrap = bold ? "strong" : "em";
    const hello = pass.text("Hello ");
    pass.skip(4);
    const world = pass.unit("world", 5);
    return (
      <div data-testid="root" style={words.style}>
        <Wrap>{hello}</Wrap>
        <strong>{world}</strong>
      </div>
    );
  };

  const animated = (root: HTMLElement) =>
    Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-offset]"));

  it("wraps words and sets the timing properties while streaming", () => {
    const { getByTestId } = render(<Harness streaming />);
    const root = getByTestId("root");

    const words = animated(root);
    expect(words).toHaveLength(2);
    words.forEach((word) => expect(word).toHaveClass(styles["reveal-stream"]));
    expect(root.style.getPropertyValue("--reveal-duration")).toBe("400ms");
    expect(root.style.getPropertyValue("--reveal-blur")).toBe("6px");
  });

  it("renders plain text and no style when inactive", () => {
    const { getByTestId } = render(<Harness streaming={false} />);
    const root = getByTestId("root");

    expect(root.querySelector("span")).toBeNull();
    expect(root).not.toHaveAttribute("style");
    expect(root).toHaveTextContent("Hello world");
  });

  it("offsets each word by the visible text before it, including skipped text", () => {
    const { getByTestId } = render(<Harness streaming />);
    expect(
      animated(getByTestId("root")).map((word) => word.dataset.revealOffset),
    ).toEqual(["0", "10"]);
  });

  it("resumes a remounted word where its first node had got to", () => {
    const { getByTestId, rerender } = render(<Harness streaming />);
    expect(animated(getByTestId("root"))[0].style.animationDelay).toBe("0ms");

    advance(100);
    rerender(<Harness streaming bold />);
    expect(animated(getByTestId("root"))[0].style.animationDelay).toBe(
      "-100ms",
    );
  });

  it("renders a word plain once its animation is over", () => {
    const { getByTestId, rerender } = render(<Harness streaming />);

    advance(400);
    rerender(<Harness streaming />);
    expect(animated(getByTestId("root"))).toHaveLength(0);
    expect(getByTestId("root")).toHaveTextContent("Hello world");
  });

  it("keeps animating for one duration after streaming stops", () => {
    const { getByTestId, rerender } = render(<Harness streaming />);

    rerender(<Harness streaming={false} />);
    expect(animated(getByTestId("root"))).toHaveLength(2);

    advance(400);
    expect(getByTestId("root").querySelector("span")).toBeNull();
  });

  it("animates from scratch when text streams again into the same instance", () => {
    const { getByTestId, rerender } = render(<Harness streaming />);
    rerender(<Harness streaming={false} />);
    advance(400);

    rerender(<Harness streaming />);
    const words = animated(getByTestId("root"));
    expect(words).toHaveLength(2);
    expect(words[0].style.animationDelay).toBe("0ms");
  });

  it("animates from scratch when a new stream replaces one without stopping", () => {
    const { getByTestId, rerender } = render(
      <Harness streaming streamId={0} />,
    );
    advance(400);
    rerender(<Harness streaming streamId={0} />);
    expect(animated(getByTestId("root"))).toHaveLength(0);

    rerender(<Harness streaming streamId={1} />);
    const words = animated(getByTestId("root"));
    expect(words).toHaveLength(2);
    expect(words[0].style.animationDelay).toBe("0ms");
  });
});
