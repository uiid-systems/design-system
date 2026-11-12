import { act, render, screen } from "@testing-library/react";
import type { ComponentPropsWithoutRef } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { Markdown } from "./markdown";
import * as Examples from "./markdown.examples";
import type { MarkdownOverrides } from "./markdown.types";

const overrides: MarkdownOverrides = {
  a: (props: ComponentPropsWithoutRef<"a">) => (
    <a data-override="a" {...props} />
  ),
  img: (props: ComponentPropsWithoutRef<"img">) => (
    <img data-override="img" {...props} />
  ),
};

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
    const animated = (root: HTMLElement) =>
      Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-offset]"));
    const words = (root: HTMLElement) =>
      animated(root).map((w) => w.textContent?.trim());
    // A word's release commits, and schedules the next, only when its act ends, so step through.
    const wait = (ms: number) => {
      for (let t = 0; t < ms; t += 10) act(() => vi.advanceTimersByTime(10));
    };

    beforeEach(() => {
      vi.useFakeTimers({
        toFake: ["setTimeout", "clearTimeout", "performance"],
      });
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it("paces a burst of words out one at a time, each in an animated span", () => {
      const { container } = render(
        <Markdown streaming reveal>
          {"one two - three four "}
        </Markdown>,
      );

      expect(container).toHaveTextContent("");
      // The first word goes out at once, the rest one interval apart.
      wait(10);
      expect(words(container)).toEqual(["one"]);
      wait(40);
      expect(words(container)).toEqual(["one"]);
      wait(50);
      expect(words(container)).toEqual(["one", "two"]);
      // The dash is a marker, so it waits and goes out with the word after it.
      wait(70);
      expect(words(container)).toEqual(["one", "two", "-", "three"]);
      wait(400);
      expect(container).toHaveTextContent("one two - three four");
    });

    it("holds back the unfinished last word, then animates it when streaming stops", () => {
      const { container, rerender } = render(
        <Markdown streaming reveal>
          {"Hello the"}
        </Markdown>,
      );
      wait(1000);

      expect(container.textContent).toContain("Hello");
      expect(container.textContent).not.toContain("the");

      rerender(<Markdown reveal>{"Hello there"}</Markdown>);
      wait(300);

      expect(words(container)).toContain("there");
    });

    it("does not replay words already shown when they move into bold", () => {
      const { container, rerender } = render(
        <Markdown streaming reveal>
          {"Hello **bold "}
        </Markdown>,
      );
      wait(1000);
      rerender(
        <Markdown streaming reveal>
          {"Hello **bold word** next "}
        </Markdown>,
      );
      // Nothing has gone out for a while, so the next word goes out as soon as it arrives.
      wait(10);

      expect(container.querySelector("strong")).toHaveTextContent("bold word");
      expect(words(container)).not.toContain("Hello");
      expect(words(container)).not.toContain("bold");
      expect(words(container)).toContain("word");
    });

    it("resumes a remounted word partway through its animation", () => {
      const { container, rerender } = render(
        <Markdown streaming reveal>
          {"Hello **bold "}
        </Markdown>,
      );
      wait(400);
      rerender(
        <Markdown streaming reveal>
          {"Hello **bold word** "}
        </Markdown>,
      );
      wait(300);

      const bold = animated(container).find((w) => w.textContent === "bold ");
      expect(bold?.closest("strong")).not.toBeNull();
      const delay = parseFloat(bold?.style.animationDelay ?? "");
      expect(delay).toBeLessThan(0);
      expect(delay).toBeGreaterThan(-400);
    });

    it("reveals inline code whole and leaves code blocks unwrapped", () => {
      const { container } = render(
        <Markdown streaming reveal>
          {"Run `pnpm build` now\n\n```ts\nconst a = 1;\n```\n\nafter "}
        </Markdown>,
      );
      wait(100);

      expect(container.querySelector("p > code")).toBeNull();
      expect(container.querySelector("p code")?.parentElement).toHaveAttribute(
        "data-reveal-offset",
      );

      wait(1000);
      expect(container.querySelector("pre span")).toBeNull();
      expect(container.querySelector("pre > code")).toHaveTextContent(
        "const a = 1;",
      );
    });

    it("animates a regenerated reply that replaces one without stopping", () => {
      const { container, rerender } = render(
        <Markdown streaming reveal>
          {"First answer here "}
        </Markdown>,
      );
      // Long enough that the first answer's words have settled, so offset 0 is taken.
      wait(1500);

      rerender(
        <Markdown streaming reveal>
          {"New reply "}
        </Markdown>,
      );
      wait(10);
      expect(words(container)).toEqual(["New"]);
    });

    it("renders link overrides while words reveal inside them", () => {
      const { container, rerender } = render(
        <Markdown streaming reveal overrides={overrides}>
          {"See [the docs](https://example.com) now "}
        </Markdown>,
      );
      wait(1000);

      const link = container.querySelector("a");
      expect(link).toHaveAttribute("data-override", "a");
      expect(link).toHaveAttribute("href", "https://example.com");
      expect(link?.querySelector("[data-reveal-offset]")).not.toBeNull();

      rerender(
        <Markdown reveal overrides={overrides}>
          {"See [the docs](https://example.com) now"}
        </Markdown>,
      );
      wait(1000);
      expect(container.querySelector("a")).toHaveAttribute(
        "data-override",
        "a",
      );
      expect(container.querySelector("p span")).toBeNull();
    });

    it("renders finished text without word spans, and starts over when a new stream replaces it", () => {
      const { container, rerender } = render(
        <Markdown reveal>{"Hello there"}</Markdown>,
      );

      expect(container.querySelector("p span")).toBeNull();
      expect(container).toHaveTextContent("Hello there");

      rerender(
        <Markdown streaming reveal>
          {""}
        </Markdown>,
      );
      rerender(
        <Markdown streaming reveal>
          {"Hello again "}
        </Markdown>,
      );
      wait(130);
      expect(words(container)).toEqual(["Hello"]);

      rerender(<Markdown reveal>{"Hello again"}</Markdown>);
      wait(1000);
      expect(container).toHaveTextContent("Hello again");
      expect(container.querySelector("p span")).toBeNull();

      rerender(
        <Markdown streaming reveal>
          {"New one "}
        </Markdown>,
      );
      wait(130);
      expect(words(container)).toEqual(["New"]);
    });
  });

  describe("overrides", () => {
    it("renders links and images with the given components", () => {
      const { container } = render(
        <Markdown overrides={overrides}>
          {
            "See [the docs](https://example.com) ![a cat](https://example.com/cat.png)"
          }
        </Markdown>,
      );

      const link = screen.getByRole("link", { name: "the docs" });
      expect(link).toHaveAttribute("data-override", "a");
      expect(link).toHaveAttribute("href", "https://example.com");
      const img = container.querySelector("img");
      expect(img).toHaveAttribute("data-override", "img");
      expect(img).toHaveAttribute("src", "https://example.com/cat.png");
      expect(img).toHaveAttribute("alt", "a cat");
    });

    it("applies to autolinks and reference links too", () => {
      const { container } = render(
        <Markdown overrides={overrides}>
          {"<https://a.example> and [ref][r]\n\n[r]: https://b.example"}
        </Markdown>,
      );

      const links = container.querySelectorAll("a");
      expect(links).toHaveLength(2);
      for (const link of links) {
        expect(link).toHaveAttribute("data-override", "a");
      }
    });

    it.each([
      ["javascript: link", "[x](javascript:alert(1))", "a", "href"],
      ["uppercase JAVASCRIPT: link", "[x](JAVASCRIPT:alert(1))", "a", "href"],
      ["entity-encoded link", "[x](&#106;avascript:alert(1))", "a", "href"],
      ["vbscript: link", "[x](vbscript:msgbox(1))", "a", "href"],
      ["data: link", "[x](data:text/html,hi)", "a", "href"],
      ["reference link", "[x][r]\n\n[r]: javascript:alert(1)", "a", "href"],
      ["javascript: image", "![x](javascript:alert(1))", "img", "src"],
      ["non-image data: image", "![x](data:text/html,hi)", "img", "src"],
    ])(
      "still sanitizes a %s before the override sees it",
      (_name, markdown, tag, attribute) => {
        const seen: (string | undefined)[] = [];
        const spy: MarkdownOverrides = {
          a: (props) => {
            seen.push(props.href);
            return <a {...props} />;
          },
          img: (props) => {
            seen.push(typeof props.src === "string" ? props.src : undefined);
            return <img {...props} />;
          },
        };
        const { container } = render(
          <Markdown overrides={spy}>{markdown}</Markdown>,
        );

        expect(seen).toEqual([undefined]);
        expect(container.querySelector(tag)).not.toHaveAttribute(attribute);
      },
    );

    it("leaves every other element to Prose", () => {
      const { container } = render(
        <Markdown overrides={overrides}>{"# Title\n\n**bold**"}</Markdown>,
      );

      expect(container.querySelector("[data-override]")).toBeNull();
      expect(container.querySelector("h1")).toHaveTextContent("Title");
      expect(container.querySelector("strong")).toHaveTextContent("bold");
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

    render(<Examples.ExternalLinks />);
    expect(screen.getByRole("link", { name: "the docs" })).toHaveAttribute(
      "target",
      "_blank",
    );
  });
});
