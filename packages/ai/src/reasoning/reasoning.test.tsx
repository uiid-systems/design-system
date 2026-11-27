import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { MarkdownOverrides } from "@uiid/markdown";
import { flushSync } from "react-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Reasoning } from "./reasoning";
import * as Examples from "./reasoning.examples";

const getRoot = () =>
  document.querySelector<HTMLElement>("[data-slot='reasoning']");
const getPanel = () =>
  document.querySelector<HTMLElement>("[data-slot='reasoning-panel']");
const getTrigger = () => screen.getByRole("button");

const TEXT = "First **bold** step";

describe("Reasoning", () => {
  // ============================================
  // ROOT
  // ============================================

  it("renders a Stack with the slot and the default gap", () => {
    render(<Reasoning>{TEXT}</Reasoning>);

    const root = getRoot()!;
    expect(root).toHaveAttribute("data-ui-gap", "2");
    expect(root).not.toHaveAttribute("data-streaming");
    expect(root).toHaveAttribute("data-ui-ay", "start");
  });

  it("writes data-streaming while streaming", () => {
    render(<Reasoning streaming>{TEXT}</Reasoning>);
    expect(getRoot()).toHaveAttribute("data-streaming");
  });

  it("lets a caller's gap, className and ref reach the root", () => {
    const ref = { current: null as HTMLDivElement | null };
    render(
      <Reasoning gap={4} className="custom" ref={ref}>
        {TEXT}
      </Reasoning>,
    );

    const root = getRoot()!;
    expect(root).toHaveAttribute("data-ui-gap", "4");
    expect(root).toHaveClass("custom");
    expect(ref.current).toBe(root);
  });

  // ============================================
  // LABEL
  // ============================================

  it("shimmers Thinking… on a button trigger while streaming", () => {
    render(<Reasoning streaming>{TEXT}</Reasoning>);

    const trigger = screen.getByRole("button", { name: "Thinking…" });
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(trigger.querySelector("[data-slot='shimmer']")).toHaveTextContent(
      "Thinking…",
    );
  });

  // Pins the explicit aria-hidden: lucide already defaults it, so this passes either way.
  it("hides the trigger's icons from assistive tech", () => {
    render(<Reasoning>{TEXT}</Reasoning>);

    const icons = getTrigger().querySelectorAll("svg");
    for (const icon of icons)
      expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it.each([
    [4, "Thought for 4 seconds"],
    [1, "Thought for 1 second"],
  ])("reads the duration %s once finished", (duration, label) => {
    render(<Reasoning duration={duration}>{TEXT}</Reasoning>);

    expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    expect(document.querySelector("[data-slot='shimmer']")).toBeNull();
  });

  it("reads Reasoning when it finished with no duration", () => {
    render(<Reasoning>{TEXT}</Reasoning>);
    expect(
      screen.getByRole("button", { name: "Reasoning" }),
    ).toBeInTheDocument();
  });

  it("shows a string label in place of the English, shimmering while streaming", () => {
    const { rerender } = render(
      <Reasoning streaming label="Razonando">
        {TEXT}
      </Reasoning>,
    );
    expect(document.querySelector("[data-slot='shimmer']")).toHaveTextContent(
      "Razonando",
    );

    rerender(<Reasoning label="Razonando">{TEXT}</Reasoning>);
    expect(
      screen.getByRole("button", { name: "Razonando" }),
    ).toBeInTheDocument();
    expect(document.querySelector("[data-slot='shimmer']")).toBeNull();
  });

  it("calls a label function with the streaming state and duration", () => {
    const label = vi.fn(({ streaming, duration }) =>
      streaming ? "Pensando" : `Pensó ${duration ?? "?"} s`,
    );
    const { rerender } = render(
      <Reasoning streaming label={label}>
        {TEXT}
      </Reasoning>,
    );
    expect(label).toHaveBeenLastCalledWith({
      streaming: true,
      duration: undefined,
    });
    expect(document.querySelector("[data-slot='shimmer']")).toHaveTextContent(
      "Pensando",
    );

    rerender(
      <Reasoning duration={3} label={label}>
        {TEXT}
      </Reasoning>,
    );
    expect(label).toHaveBeenLastCalledWith({ streaming: false, duration: 3 });
    expect(
      screen.getByRole("button", { name: "Pensó 3 s" }),
    ).toBeInTheDocument();
  });

  it("falls back to the default name for a null label", () => {
    render(
      <Reasoning duration={2} label={null}>
        {TEXT}
      </Reasoning>,
    );
    expect(
      screen.getByRole("button", { name: "Thought for 2 seconds" }),
    ).toBeInTheDocument();
  });

  it("renders an element label as itself, without the shimmer", () => {
    render(
      <Reasoning streaming label={<span data-testid="custom">Busy</span>}>
        {TEXT}
      </Reasoning>,
    );
    expect(screen.getByTestId("custom")).toHaveTextContent("Busy");
    expect(document.querySelector("[data-slot='shimmer']")).toBeNull();
  });

  // ============================================
  // OPEN STATE
  // ============================================

  it("is open while streaming and renders the children as markdown", () => {
    render(<Reasoning streaming>{TEXT}</Reasoning>);

    expect(getPanel()!.querySelector("strong")).toHaveTextContent("bold");
    // Full width under a start-aligned root, so long lines wrap or scroll
    // inside the panel instead of widening it.
    expect(getPanel()).toHaveAttribute("data-ui-w", "full");
  });

  it("forwards streaming to Markdown", () => {
    const { rerender } = render(
      <Reasoning streaming defaultOpen>
        {"Hello **bold wor"}
      </Reasoning>,
    );
    expect(getPanel()!.textContent).not.toContain("**");

    rerender(<Reasoning defaultOpen>{"Hello **bold wor"}</Reasoning>);
    expect(getPanel()!.textContent).toContain("**");
  });

  describe("code blocks", () => {
    const FENCE = "Check the type:\n\n```ts\nconst a: number = 1;\n```";
    /** Stands in for a code component; `@uiid/ai` does not depend on one. */
    const overrides: MarkdownOverrides = {
      codeBlock: ({ code, language }) => (
        <figure data-language={language}>{code}</figure>
      ),
    };
    const getBlock = () => getPanel()!.querySelector("figure");

    it("renders a plain pre with no override", () => {
      render(<Reasoning defaultOpen>{FENCE}</Reasoning>);

      expect(getBlock()).toBeNull();
      expect(getPanel()!.querySelector("pre > code")).toHaveTextContent(
        "const a: number = 1;",
      );
    });

    it("renders a fenced block through the caller's codeBlock with its code and language", () => {
      render(
        <Reasoning defaultOpen overrides={overrides}>
          {FENCE}
        </Reasoning>,
      );

      expect(getBlock()).toHaveAttribute("data-language", "ts");
      expect(getBlock()).toHaveTextContent("const a: number = 1;");
      expect(getPanel()!.querySelector("pre")).toBeNull();
      // The overrides reach Markdown, not the root.
      expect(getRoot()).not.toHaveAttribute("overrides");
    });
  });

  it("is closed by default when idle and opens from its trigger", async () => {
    const user = userEvent.setup();
    render(<Reasoning>{TEXT}</Reasoning>);

    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
    expect(getPanel()).toBeNull();

    await user.click(getTrigger());

    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
    expect(getPanel()!.querySelector("strong")).toHaveTextContent("bold");
  });

  it("opens when streaming starts", () => {
    const { rerender } = render(<Reasoning>{TEXT}</Reasoning>);
    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");

    rerender(<Reasoning streaming>{TEXT}</Reasoning>);
    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
  });

  it("stays closed when defaultOpen is false", () => {
    const { rerender } = render(
      <Reasoning defaultOpen={false}>{TEXT}</Reasoning>,
    );
    rerender(
      <Reasoning streaming defaultOpen={false}>
        {TEXT}
      </Reasoning>,
    );

    expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("reports a trigger press through onOpenChange and leaves a controlled open alone", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <Reasoning open onOpenChange={onOpenChange}>
        {TEXT}
      </Reasoning>,
    );

    await user.click(getTrigger());

    expect(onOpenChange).toHaveBeenCalledWith(false, expect.anything());
    expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
  });

  it.each([
    ["opening", false],
    ["closing", true],
  ])(
    "keeps an uncontrolled block where it is when onOpenChange cancels its %s",
    async (_, defaultOpen) => {
      const user = userEvent.setup();
      render(
        <Reasoning
          defaultOpen={defaultOpen}
          onOpenChange={(_next, details) => details.cancel()}
        >
          {TEXT}
        </Reasoning>,
      );

      await user.click(getTrigger());

      expect(getTrigger()).toHaveAttribute(
        "aria-expanded",
        String(defaultOpen),
      );
      expect(getPanel() !== null).toBe(defaultOpen);
    },
  );

  // ============================================
  // TIMING
  // ============================================

  describe("timing", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("measures the stream and closes one second after it ends", () => {
      const { rerender } = render(<Reasoning streaming>{TEXT}</Reasoning>);

      act(() => vi.advanceTimersByTime(4000));
      rerender(<Reasoning>{TEXT}</Reasoning>);

      expect(getTrigger()).toHaveAccessibleName("Thought for 4 seconds");
      expect(getTrigger()).toHaveAttribute("aria-expanded", "true");

      act(() => vi.advanceTimersByTime(1000));
      expect(getTrigger()).toHaveAttribute("aria-expanded", "false");
    });

    // `flushSync` commits the end of the stream inside the outer `act`, which
    // holds back passive effects' re-renders until it exits. So the label
    // read in between is the one the browser would paint first.
    it("reads the measured duration in the same commit the stream ends", () => {
      const { rerender } = render(<Reasoning streaming>{TEXT}</Reasoning>);
      act(() => vi.advanceTimersByTime(4000));

      let painted: string | null = null;
      act(() => {
        flushSync(() => rerender(<Reasoning>{TEXT}</Reasoning>));
        painted = getTrigger().textContent;
      });

      expect(painted).toBe("Thought for 4 seconds");
    });

    it("prefers a duration prop over the measurement", () => {
      const { rerender } = render(<Reasoning streaming>{TEXT}</Reasoning>);

      act(() => vi.advanceTimersByTime(4000));
      rerender(<Reasoning duration={9}>{TEXT}</Reasoning>);

      expect(getTrigger()).toHaveAccessibleName("Thought for 9 seconds");
    });

    it("does not auto-close a controlled open", () => {
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <Reasoning open streaming onOpenChange={onOpenChange}>
          {TEXT}
        </Reasoning>,
      );

      act(() => vi.advanceTimersByTime(2000));
      rerender(
        <Reasoning open onOpenChange={onOpenChange}>
          {TEXT}
        </Reasoning>,
      );
      act(() => vi.advanceTimersByTime(1000));

      expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
      expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("never auto-closes a block that did not stream", () => {
      render(<Reasoning defaultOpen>{TEXT}</Reasoning>);

      act(() => vi.advanceTimersByTime(5000));

      expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
    });
  });
});

describe("examples", () => {
  it("renders a finished block that reads its duration", () => {
    render(<Examples.Basic />);

    expect(
      screen.getByRole("button", { name: "Thought for 4 seconds" }),
    ).toBeInTheDocument();
  });

  it("renders the reasoning above the reply inside a turn", () => {
    render(<Examples.InMessage />);

    const message = document.querySelector("[data-slot='message']")!;
    expect(message.querySelector("[data-slot='reasoning']")).not.toBeNull();
    expect(
      message.querySelector("[data-slot='message-response']"),
    ).not.toBeNull();
  });
});
