import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Reasoning } from "./reasoning";

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

  // ============================================
  // OPEN STATE
  // ============================================

  it("is open while streaming and renders the children as markdown", () => {
    render(<Reasoning streaming>{TEXT}</Reasoning>);

    expect(getPanel()!.querySelector("strong")).toHaveTextContent("bold");
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

  // ============================================
  // TIMING
  // ============================================

  describe("timing", () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    it("measures the stream and closes one second after it ends, once", () => {
      const { rerender } = render(<Reasoning streaming>{TEXT}</Reasoning>);

      act(() => vi.advanceTimersByTime(4000));
      rerender(<Reasoning>{TEXT}</Reasoning>);

      expect(getTrigger()).toHaveAccessibleName("Thought for 4 seconds");
      expect(getTrigger()).toHaveAttribute("aria-expanded", "true");

      act(() => vi.advanceTimersByTime(1000));
      expect(getTrigger()).toHaveAttribute("aria-expanded", "false");

      // A second stream reopens it and does not close it again.
      rerender(<Reasoning streaming>{TEXT}</Reasoning>);
      expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
      rerender(<Reasoning>{TEXT}</Reasoning>);
      act(() => vi.advanceTimersByTime(1000));
      expect(getTrigger()).toHaveAttribute("aria-expanded", "true");
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
