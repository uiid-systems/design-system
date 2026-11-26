import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { HighlightedCodeContext } from "./code-block.context";
import type { CodeBlockContentProps } from "./code-block.types";
import { CodeBlockContent } from "./subcomponents";

/* The highlighted markup can trail `code` while a stream outruns the
   highlighter. CodeBlock passes down the text the markup was made from; the
   rest of `code` after it is shown uncolored, laid out as Shiki lays out lines,
   and never written into the markup itself. */

/** Markup shaped like Shiki's for `text`, split on `\r\n` or `\n` as Shiki does. */
const shiki = (text: string) =>
  `<pre class="shiki"><code>${text
    .split(/\r?\n/)
    .map(
      (line) => `<span class="line"><span class="token">${line}</span></span>`,
    )
    .join("\n")}</code></pre>`;

/** Content for `code`, with markup highlighted from `highlighted`. */
const content = (
  highlighted: string,
  code: string,
  props: Partial<CodeBlockContentProps> = {},
  markup = shiki(highlighted),
) => (
  <HighlightedCodeContext value={highlighted}>
    <CodeBlockContent html={markup} code={code} {...props} />
  </HighlightedCodeContext>
);

const codeEl = (container: HTMLElement) =>
  container.querySelector('[data-slot="code-block-content"] code')!;

const lines = (container: HTMLElement) =>
  [...container.querySelectorAll(".line")].map((line) => line.textContent);

describe("CodeBlockContent behind a stream", () => {
  it("shows the text past the highlighted markup", () => {
    const { container } = render(content("const a", "const abc = 1;\nfoo\n"));
    expect(codeEl(container).textContent).toBe("const abc = 1;\nfoo\n");
    // The rest of the last line joins it; each new line is its own row.
    expect(lines(container)).toEqual(["const abc = 1;", "foo", ""]);
    expect(container.querySelector("pre.shiki")).not.toBeNull();
  });

  it("renders the remainder as text, not markup", () => {
    const { container } = render(content("a", "a<b>c</b>\n<img src=x>"));
    expect(codeEl(container).textContent).toBe("a<b>c</b>\n<img src=x>");
    expect(container.querySelector("b, img")).toBeNull();
  });

  it("continues after markup whose last line is empty", () => {
    const { container } = render(content("a\n", "a\nbc\nd"));
    expect(codeEl(container).textContent).toBe("a\nbc\nd");
    expect(lines(container)).toEqual(["a", "bc", "d"]);
  });

  it("splits the remainder on CRLF as Shiki does", () => {
    const { container } = render(content("a\r\nb", "a\r\nbc\r\nd\r\n"));
    expect(lines(container)).toEqual(["a", "bc", "d", ""]);
  });

  it("follows the source text, not the markup's, after a notation comment", () => {
    // Shiki strips `// [!code ++]` from the markup it makes.
    const highlighted = "const a = 1; // [!code ++]\nconst b";
    const { container } = render(
      content(
        highlighted,
        `${highlighted} = 2;\nc`,
        {},
        shiki("const a = 1; \nconst b"),
      ),
    );
    expect(lines(container)).toEqual(["const a = 1; ", "const b = 2;", "c"]);
  });

  it("drops the remainder when the markup catches up", () => {
    const { container, rerender } = render(content("a", "ab\nc"));
    rerender(content("ab\nc", "ab\nc"));
    expect(codeEl(container).innerHTML).toBe(
      new DOMParser()
        .parseFromString(shiki("ab\nc"), "text/html")
        .querySelector("code")!.innerHTML,
    );
  });

  it("follows the code as it grows under the same markup", () => {
    const { container, rerender } = render(content("a", "ab"));
    rerender(content("a", "abc\nd"));
    expect(codeEl(container).textContent).toBe("abc\nd");
    expect(lines(container)).toEqual(["abc", "d"]);
  });

  it("keeps the remainder through a render that changes neither", () => {
    const { container, rerender } = render(content("a", "ab\nc"));
    rerender(content("a", "ab\nc", { wrap: true }));
    expect(codeEl(container).textContent).toBe("ab\nc");
  });

  it("adds nothing when the code does not start with the highlighted text", () => {
    const { container } = render(content("old", "new"));
    expect(codeEl(container).textContent).toBe("old");
  });

  it("adds nothing outside CodeBlock, where no highlighted text is given", () => {
    const { container } = render(
      <CodeBlockContent html={shiki("a")} code="abc" />,
    );
    expect(codeEl(container).textContent).toBe("a");
  });
});
