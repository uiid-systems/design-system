import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Markdown } from "./markdown";
import * as Examples from "./markdown.examples";

const source = `# Title

Some **bold** and *em* with \`code\` and a [link](https://example.com).

- one
- two

\`\`\`ts
const a = 1;
\`\`\`
`;

describe("Markdown", () => {
  let error: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    error = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    expect(error).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it("renders a complete document inside a Prose root", () => {
    const { container } = render(<Markdown>{source}</Markdown>);

    const root = container.firstElementChild!;
    expect(root).toHaveAttribute("data-slot", "markdown");
    expect(
      screen.getByRole("heading", { level: 1, name: "Title" }),
    ).toBeInTheDocument();
    expect(root.querySelector("strong")).toHaveTextContent("bold");
    expect(root.querySelector("em")).toHaveTextContent("em");
    expect(root.querySelector("p > code")).toHaveTextContent("code");
    expect(screen.getByRole("link", { name: "link" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(root.querySelector("pre > code")).toHaveTextContent("const a = 1;");
  });

  it("renders blocks as direct children of the root", () => {
    const { container } = render(<Markdown>{source}</Markdown>);

    const tags = Array.from(container.firstElementChild!.children).map(
      (el) => el.tagName,
    );
    expect(tags).toEqual(["H1", "P", "UL", "PRE"]);
  });

  it("renders a one-line string as a paragraph", () => {
    const { container } = render(<Markdown>Hello</Markdown>);

    expect(container.firstElementChild?.firstElementChild?.tagName).toBe("P");
  });

  describe("streaming", () => {
    const cut = [
      ["emphasis", "Hello **bold wor", "Hello bold wor"],
      ["italic", "Hello *ital wor", "Hello ital wor"],
      ["underscore italic", "Hello _ital wor", "Hello ital wor"],
      ["code span", "Run `pnpm bui", "Run"],
      ["strikethrough", "Not ~~this wor", "Not this wor"],
      ["link text", "See [the docs", "See the docs"],
      ["link url", "See [the docs](https://exa", "See the docs"],
      ["image", "Look ![alt text](https://exa", "Look"],
    ] as const;

    it.each(cut)(
      "renders a string cut mid-%s as plain text without raw delimiters",
      (_name, markdown, visible) => {
        const { container } = render(<Markdown streaming>{markdown}</Markdown>);

        const text = container.textContent ?? "";
        expect(text).toContain(visible);
        for (const delimiter of ["**", "*", "_", "`", "~~", "[", "]("]) {
          expect(text).not.toContain(delimiter);
        }
      },
    );

    it("renders an open fence as a growing code block", () => {
      const { container } = render(
        <Markdown streaming>
          {"Code:\n\n```ts\nconst a = 1;\nconst b"}
        </Markdown>,
      );

      expect(container.querySelector("pre > code")).toHaveTextContent(
        "const b",
      );
    });

    it("keeps every word of finished text when off", () => {
      render(<Markdown>{"final text with a stray `backtick"}</Markdown>);

      expect(screen.getByText(/backtick/)).toBeInTheDocument();
    });
  });

  describe("reveal", () => {
    let clock = 0;
    const animated = (root: HTMLElement) =>
      Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-offset]"));

    beforeEach(() => {
      clock = 0;
      vi.spyOn(performance, "now").mockImplementation(() => clock);
    });

    it("wraps each arriving word in an animated span while streaming", () => {
      const { container } = render(
        <Markdown streaming reveal>
          {"Hello there "}
        </Markdown>,
      );

      expect(animated(container).map((w) => w.textContent)).toEqual([
        "Hello ",
        "there",
      ]);
    });

    it("holds back the unfinished last word", () => {
      const { container } = render(
        <Markdown streaming reveal>
          {"Hello the"}
        </Markdown>,
      );

      expect(container.textContent).toContain("Hello");
      expect(container.textContent).not.toContain("the");
    });

    it("does not replay words already shown when they move into bold", () => {
      const { container, rerender } = render(
        <Markdown streaming reveal>
          {"Hello **bold "}
        </Markdown>,
      );
      clock = 1000;
      rerender(
        <Markdown streaming reveal>
          {"Hello **bold word** next "}
        </Markdown>,
      );

      expect(container.querySelector("strong")).toHaveTextContent("bold word");
      const words = animated(container).map((w) => w.textContent);
      expect(words).not.toContain("Hello ");
      expect(words).not.toContain("bold ");
      expect(words).toContain("word");
    });

    it("resumes a remounted word partway through its animation", () => {
      const { container, rerender } = render(
        <Markdown streaming reveal>
          {"Hello **bold "}
        </Markdown>,
      );
      clock = 100;
      rerender(
        <Markdown streaming reveal>
          {"Hello **bold word** "}
        </Markdown>,
      );

      const bold = animated(container).find((w) => w.textContent === "bold ");
      expect(bold?.closest("strong")).not.toBeNull();
      expect(bold?.style.animationDelay).toBe("-100ms");
    });

    it("reveals inline code whole and leaves code blocks unwrapped", () => {
      const { container } = render(
        <Markdown streaming reveal>
          {"Run `pnpm build` now\n\n```ts\nconst a = 1;\n```\n\nafter "}
        </Markdown>,
      );

      expect(container.querySelector("p > code")).toBeNull();
      expect(container.querySelector("p code")?.parentElement).toHaveAttribute(
        "data-reveal-offset",
      );
      expect(container.querySelector("pre span")).toBeNull();
      expect(container.querySelector("pre > code")).toHaveTextContent(
        "const a = 1;",
      );
    });

    it("renders finished text without word spans", () => {
      const { container } = render(<Markdown reveal>{"Hello there"}</Markdown>);

      expect(container.querySelector("p span")).toBeNull();
      expect(container).toHaveTextContent("Hello there");
    });
  });

  it("renders a javascript: link as an anchor without the href", () => {
    render(<Markdown>{"[x](javascript:alert(1))"}</Markdown>);

    const link = screen.getByText("x");
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href") ?? "").not.toMatch(/javascript:/i);
  });

  it("renders raw HTML as text", () => {
    const { container } = render(
      <Markdown>
        {'Go <meta http-equiv="refresh" content="0;url=https://evil.example">'}
      </Markdown>,
    );

    expect(container.querySelector("meta")).toBeNull();
    expect(container.textContent).toContain('<meta http-equiv="refresh"');
  });

  it("drops inline event handlers", () => {
    const { container } = render(
      <Markdown>
        {
          '<img src="x" onerror="alert(1)"> and <a href="https://a" onclick="alert(1)">a</a>'
        }
      </Markdown>,
    );

    expect(container.querySelector("[onerror], [onclick]")).toBeNull();
  });

  it("passes Prose props through", () => {
    const ref = { current: null as HTMLDivElement | null };
    const { container } = render(
      <Markdown
        p={4}
        className="custom"
        style={{ color: "red" }}
        data-testid="md"
        ref={ref}
        render={<article />}
      >
        Hello
      </Markdown>,
    );

    const root = container.firstElementChild!;
    expect(root.tagName).toBe("ARTICLE");
    expect(root).toHaveAttribute("data-ui-p", "4");
    expect(root).toHaveClass("custom");
    expect(root).toHaveStyle({ color: "red" });
    expect(root).toHaveAttribute("data-testid", "md");
    expect(ref.current).toBe(root);
  });

  it("renders the examples", () => {
    render(<Examples.Basic />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Streaming markdown" }),
    ).toBeInTheDocument();

    expect(() => render(<Examples.Streaming />)).not.toThrow();
    expect(() => render(<Examples.StreamingReveal />)).not.toThrow();
  });
});
