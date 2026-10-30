import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Message } from "./message";
import * as Examples from "./message.examples";
import { MessageContent, MessageResponse } from "./subcomponents";

import styles from "./message.module.css";

/** The real compiler behind a spy, so `MessageResponse`'s memo is observable. */
const compiler = vi.hoisted(() => vi.fn());
vi.mock("markdown-to-jsx/react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("markdown-to-jsx/react")>();
  compiler.mockImplementation(actual.compiler);
  return { ...actual, compiler };
});

describe("Message", () => {
  it("renders a full-width Stack with the slot, the author and the default gap", () => {
    const { container } = render(<Message from="assistant">hello</Message>);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "message");
    expect(root).toHaveAttribute("data-from", "assistant");
    expect(root).toHaveAttribute("data-ui-gap", "2");
    expect(root).toHaveAttribute("data-ui-fullwidth");
    expect(root).toHaveClass(styles["message"]);
    expect(root).toHaveTextContent("hello");
  });

  it.each([
    ["user", "end"],
    ["assistant", "start"],
    ["system", "start"],
  ] as const)("aligns a %s turn to the %s", (from, alignment) => {
    const { container } = render(<Message from={from}>x</Message>);

    // A Stack's `ax` is the cross axis, which Box writes as `data-ui-ay`.
    expect(container.firstElementChild).toHaveAttribute(
      "data-ui-ay",
      alignment,
    );
  });

  it("lets a caller's ax, gap, className, ref and render win", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <Message
        from="user"
        ref={ref}
        ax="center"
        gap={0}
        className="custom"
        render={<article />}
      >
        x
      </Message>,
    );

    const root = container.firstElementChild!;
    expect(root.tagName).toBe("ARTICLE");
    expect(root).toHaveAttribute("data-ui-ay", "center");
    expect(root).toHaveAttribute("data-ui-gap", "0");
    expect(root).toHaveClass("custom");
    expect(ref.current).toBe(root);
  });
});

describe("MessageContent", () => {
  it("renders a Stack with the slot and the default gap", () => {
    const { container } = render(<MessageContent>body</MessageContent>);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "message-content");
    expect(root).toHaveAttribute("data-ui-gap", "2");
    expect(root).toHaveClass(styles["content"]);
    expect(root).toHaveTextContent("body");
  });

  it("passes gap, className, ref and render through", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <MessageContent ref={ref} gap={4} className="custom" render={<section />}>
        x
      </MessageContent>,
    );

    const root = container.firstElementChild!;
    expect(root.tagName).toBe("SECTION");
    expect(root).toHaveAttribute("data-ui-gap", "4");
    expect(root).toHaveClass("custom");
    expect(ref.current).toBe(root);
  });
});

describe("MessageResponse", () => {
  it("renders markdown as elements under its own slot", () => {
    const { container } = render(
      <MessageResponse>{"Some **bold** text"}</MessageResponse>,
    );

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "message-response");
    expect(root.querySelector("strong")).toHaveTextContent("bold");
  });

  it("forwards streaming to Markdown", () => {
    const { container: held } = render(
      <MessageResponse streaming>{"Hello **bold wor"}</MessageResponse>,
    );
    const { container: shown } = render(
      <MessageResponse>{"Hello **bold wor"}</MessageResponse>,
    );

    expect(held.textContent).toBe("Hello bold wor");
    expect(shown.textContent).toContain("**");
  });

  it("passes className, ref and render through", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <MessageResponse ref={ref} className="custom" render={<article />}>
        x
      </MessageResponse>,
    );

    const root = container.firstElementChild!;
    expect(root.tagName).toBe("ARTICLE");
    expect(root).toHaveClass("custom");
    expect(ref.current).toBe(root);
  });

  it("does not recompile when a parent re-renders with the same props", () => {
    const Parent = ({ text }: { text: string }) => {
      const [count, setCount] = useState(0);
      return (
        <>
          <button type="button" onClick={() => setCount(count + 1)}>
            tick {count}
          </button>
          <MessageResponse>{text}</MessageResponse>
        </>
      );
    };
    const { rerender } = render(<Parent text="first" />);
    const compiled = compiler.mock.calls.length;

    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("tick 1");
    expect(compiler).toHaveBeenCalledTimes(compiled);

    rerender(<Parent text="second" />);
    expect(compiler).toHaveBeenCalledTimes(compiled + 1);
  });
});

describe("examples", () => {
  it("renders a user and an assistant turn", () => {
    render(<Examples.UserAndAssistant />);

    expect(
      screen.getByText("What changes between a user and an assistant turn?"),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("strong").map((el) => el.textContent)).toEqual([
      "user",
      "assistant",
    ]);
  });

  it("renders an actions row of buttons named by their tooltips", () => {
    render(<Examples.WithActions />);

    for (const name of ["Copy", "Retry", "Good response"]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("renders the rest without throwing", () => {
    expect(() => render(<Examples.Basic />)).not.toThrow();
    expect(() => render(<Examples.Streaming />)).not.toThrow();
    expect(() => render(<Examples.WithConversation />)).not.toThrow();
  });
});
