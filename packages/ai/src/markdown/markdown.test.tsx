import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Markdown } from "./markdown";
import * as Examples from "./markdown.examples";

const document = `# Title

Some **bold** and *em* with \`code\` and a [link](https://example.com).

- one
- two

\`\`\`ts
const a = 1;
\`\`\`
`;

describe("Markdown", () => {
  it("renders a complete document inside a Prose root", () => {
    const { container } = render(<Markdown>{document}</Markdown>);

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
    const { container } = render(<Markdown>{document}</Markdown>);

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
      ["emphasis", "Hello **bold wor"],
      ["italic", "Hello *ital wor"],
      ["underscore italic", "Hello _ital wor"],
      ["code span", "Run `pnpm bui"],
      ["strikethrough", "Not ~~this wor"],
      ["link text", "See [the docs"],
      ["link url", "See [the docs](https://exa"],
      ["image", "Look ![alt text](https://exa"],
    ] as const;

    it.each(cut)(
      "renders a string cut mid-%s without raw delimiters",
      (_name, source) => {
        const error = vi.spyOn(console, "error").mockImplementation(() => {});

        const { container } = render(<Markdown streaming>{source}</Markdown>);

        const text = container.textContent ?? "";
        for (const delimiter of ["**", "*", "_", "`", "~~", "[", "]("]) {
          expect(text).not.toContain(delimiter);
        }
        expect(error).not.toHaveBeenCalled();
        error.mockRestore();
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

  it("drops javascript: hrefs", () => {
    render(<Markdown>{"[x](javascript:alert(1))"}</Markdown>);

    const link = screen.getByText("x");
    expect(link.getAttribute("href") ?? "").not.toMatch(/javascript:/i);
  });

  it("passes Prose props through", () => {
    const { container } = render(
      <Markdown p={4} className="custom" render={<article />}>
        Hello
      </Markdown>,
    );

    const root = container.firstElementChild!;
    expect(root.tagName).toBe("ARTICLE");
    expect(root).toHaveAttribute("data-ui-p", "4");
    expect(root).toHaveClass("custom");
  });
  it("renders the examples", () => {
    render(<Examples.Basic />);
    expect(
      screen.getByRole("heading", { level: 2, name: "Streaming markdown" }),
    ).toBeInTheDocument();

    expect(() => render(<Examples.Streaming />)).not.toThrow();
  });
});
