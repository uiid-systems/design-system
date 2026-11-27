import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { MarkdownOverrides } from "@uiid/markdown";
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

const TS_CODE = "const x: number = 1;";

/** A grammar gives every token span a theme color; plain code gives none. */
const COLORED_TOKEN = "span[style*='--shiki-light']";

describe("Message", () => {
  it("renders a full-width Stack with the slot, the author and the default gap", () => {
    const { container } = render(<Message from="assistant">hello</Message>);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "message");
    expect(root).toHaveAttribute("data-from", "assistant");
    expect(root).toHaveAttribute("data-ui-gap", "2");
    expect(root).toHaveAttribute("data-ui-w", "full");
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

  it.each([
    ["user", "auto"],
    ["assistant", null],
    ["system", null],
  ] as const)("gives a %s turn ml=%s", (from, ml) => {
    const { container } = render(<Message from={from}>x</Message>);

    const root = container.firstElementChild!;
    if (ml) expect(root).toHaveAttribute("data-ui-ml", ml);
    else expect(root).not.toHaveAttribute("data-ui-ml");
  });

  it.each([
    ["m", { m: 0 }],
    ["mx", { mx: 4 }],
  ] as const)("leaves ml unset when a caller passes %s", (_, margin) => {
    const { container } = render(
      <Message from="user" {...margin}>
        x
      </Message>,
    );

    expect(container.firstElementChild).not.toHaveAttribute("data-ui-ml");
  });

  it("lets a caller's ml win", () => {
    const { container } = render(
      <Message from="user" ml={4}>
        x
      </Message>,
    );

    expect(container.firstElementChild).toHaveAttribute("data-ui-ml", "4");
  });

  it.each(["user", "assistant", "system"] as const)(
    "names a %s turn as a group for assistive tech",
    (from) => {
      render(<Message from={from}>x</Message>);

      expect(
        screen.getByRole("group", { name: `Message from ${from}` }),
      ).toHaveAttribute("data-from", from);
    },
  );

  it("lets a caller's role and aria-label win", () => {
    const { container } = render(
      <Message from="assistant" role="listitem" aria-label="UIID said">
        x
      </Message>,
    );

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("role", "listitem");
    expect(root).toHaveAttribute("aria-label", "UIID said");
  });

  it("caps the turn only when no maxw is passed", () => {
    const { container: capped } = render(<Message from="user">x</Message>);
    expect(capped.firstElementChild).toHaveClass(styles["capped"]);
    expect(capped.firstElementChild).not.toHaveAttribute("data-ui-maxw");

    for (const maxw of [480, "full"] as const) {
      const { container } = render(
        <Message from="user" maxw={maxw}>
          x
        </Message>,
      );
      expect(container.firstElementChild).not.toHaveClass(styles["capped"]);
      expect(container.firstElementChild).toHaveAttribute(
        "data-ui-maxw",
        String(maxw),
      );
    }
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

  describe("code blocks", () => {
    const fence = (language: string, code = TS_CODE) =>
      `Before\n\n\`\`\`${language}\n${code}\n\`\`\`\n\nAfter`;
    const getBlock = () =>
      document.querySelector<HTMLElement>("[data-slot='code-block']");
    const waitForHighlight = () =>
      waitFor(() =>
        expect(getBlock()!.querySelector("pre.shiki")).toBeInTheDocument(),
      );

    it("renders a fenced block as a CodeBlock between the prose", async () => {
      const { container } = render(
        <MessageResponse>{fence("ts")}</MessageResponse>,
      );

      const block = getBlock()!;
      expect(block).toBeInTheDocument();
      expect(block.parentElement).toBe(container.firstElementChild);
      expect(container.firstElementChild).toHaveTextContent(
        /^Before.*const x: number = 1;.*After$/,
      );
      await waitFor(() =>
        expect(block.querySelector(COLORED_TOKEN)).toBeInTheDocument(),
      );
    });

    it("shows the copy button and nothing else, with no filename", () => {
      render(
        <MessageResponse>
          {"```ts title=counter.ts\nconst a = 1;\n```"}
        </MessageResponse>,
      );

      const block = getBlock()!;
      expect(within(block).getAllByRole("button")).toHaveLength(1);
      expect(
        within(block).getByRole("button", { name: "Copy code" }),
      ).toBeInTheDocument();
      expect(block).not.toHaveTextContent("counter.ts");
      expect(
        block.querySelector(
          "[data-slot='code-block-wrap-button'], [data-slot='code-block-fullscreen-button'], [data-slot='code-block-expand-toggle']",
        ),
      ).toBeNull();
    });

    it.each([
      ["a missing", ""],
      ["an unknown", "mermaid"],
    ])("renders %s language as plain code", async (_, language) => {
      render(<MessageResponse>{fence(language)}</MessageResponse>);

      await waitForHighlight();
      expect(getBlock()).toHaveTextContent(TS_CODE);
      expect(getBlock()!.querySelector(COLORED_TOKEN)).toBeNull();
      expect(
        getBlock()!.querySelector("[data-slot='code-block-error']"),
      ).toBeNull();
      // No icon for the language, so the copy button floats with no bar.
      expect(
        getBlock()!.querySelector("[data-slot='code-block-header']"),
      ).toHaveAttribute("data-floating");
    });

    it("replaces the code component with a caller's codeBlock override", () => {
      const overrides: MarkdownOverrides = {
        codeBlock: ({ code, language }) => (
          <figure data-language={language}>{code}</figure>
        ),
      };
      render(
        <MessageResponse overrides={overrides}>{fence("ts")}</MessageResponse>,
      );

      expect(getBlock()).toBeNull();
      expect(document.querySelector("figure")).toHaveAttribute(
        "data-language",
        "ts",
      );
      expect(document.querySelector("figure")).toHaveTextContent(TS_CODE);
    });

    it("renders the plain pre when a caller removes the codeBlock override", () => {
      const { container } = render(
        <MessageResponse overrides={{ codeBlock: undefined }}>
          {fence("ts")}
        </MessageResponse>,
      );

      expect(getBlock()).toBeNull();
      expect(container.querySelector("pre > code")).toHaveTextContent(TS_CODE);
    });

    it("keeps the CodeBlock when a caller overrides only links", () => {
      const overrides: MarkdownOverrides = {
        a: (props) => <a data-custom="" {...props} />,
      };
      render(
        <MessageResponse overrides={overrides}>
          {`[docs](https://uiid.dev)\n\n${fence("ts")}`}
        </MessageResponse>,
      );

      expect(getBlock()).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "docs" })).toHaveAttribute(
        "data-custom",
      );
    });

    it("keeps one CodeBlock instance while the fence streams in", () => {
      const source = fence("ts", "const a = 1;\nconst b = 2;");
      const { rerender } = render(
        <MessageResponse streaming>{source.slice(0, 20)}</MessageResponse>,
      );
      const first = getBlock();
      expect(first).toBeInTheDocument();

      for (let end = 21; end <= source.length; end++) {
        rerender(
          <MessageResponse streaming>{source.slice(0, end)}</MessageResponse>,
        );
      }
      rerender(<MessageResponse>{source}</MessageResponse>);

      expect(getBlock()).toBe(first);
      expect(first).toHaveTextContent("const b = 2;");
    });

    it("does not recompile when a parent re-renders a response with a caller's overrides", () => {
      const overrides: MarkdownOverrides = { a: (props) => <a {...props} /> };
      const Parent = () => {
        const [count, setCount] = useState(0);
        return (
          <>
            <button type="button" onClick={() => setCount(count + 1)}>
              tick {count}
            </button>
            <MessageResponse overrides={overrides}>
              {fence("ts")}
            </MessageResponse>
          </>
        );
      };
      render(<Parent />);
      const compiled = compiler.mock.calls.length;

      fireEvent.click(screen.getByRole("button", { name: /tick/ }));
      expect(compiler).toHaveBeenCalledTimes(compiled);
    });
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

  it("renders a finished reply whose fences are code blocks", () => {
    render(<Examples.WithCode />);

    const blocks = document.querySelectorAll("[data-slot='code-block']");
    expect(blocks).toHaveLength(2);
    expect(blocks[0]).toHaveTextContent("const [count, setCount]");
    expect(blocks[1]).toHaveTextContent("pnpm dev");
  });

  it("renders the rest without throwing", () => {
    expect(() => render(<Examples.Basic />)).not.toThrow();
    expect(() => render(<Examples.Streaming />)).not.toThrow();
    expect(() => render(<Examples.WithConversation />)).not.toThrow();
  });
});
