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
  });
});
