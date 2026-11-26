import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeBlockContent } from "./subcomponents";

/* The highlighted markup can trail `code` while a stream outruns the
   highlighter. The text after it is shown uncolored, laid out as Shiki lays out
   lines, and never written into the markup itself. */

const shiki = (code: string) =>
  `<pre class="shiki"><code>${code
    .split("\n")
    .map(
      (line) => `<span class="line"><span class="token">${line}</span></span>`,
    )
    .join("\n")}</code></pre>`;

const codeEl = (container: HTMLElement) =>
  container.querySelector('[data-slot="code-block-content"] code')!;

const lines = (container: HTMLElement) =>
  [...container.querySelectorAll(".line")].map((line) => line.textContent);

describe("CodeBlockContent behind a stream", () => {
  it("shows the text past the highlighted markup", () => {
    const { container } = render(
      <CodeBlockContent
        html={shiki("const a")}
        code={"const abc = 1;\nfoo\n"}
      />,
    );
    expect(codeEl(container).textContent).toBe("const abc = 1;\nfoo\n");
    // The rest of the last line joins it; each new line is its own row.
    expect(lines(container)).toEqual(["const abc = 1;", "foo", ""]);
    expect(container.querySelector("pre.shiki")).not.toBeNull();
  });

  it("renders the remainder as text, not markup", () => {
    const { container } = render(
      <CodeBlockContent html={shiki("a")} code={"a<b>c</b>\n<img src=x>"} />,
    );
    expect(codeEl(container).textContent).toBe("a<b>c</b>\n<img src=x>");
    expect(container.querySelector("b, img")).toBeNull();
  });

  it("drops the remainder when the markup catches up", () => {
    const { container, rerender } = render(
      <CodeBlockContent html={shiki("a")} code={"ab\nc"} />,
    );
    rerender(<CodeBlockContent html={shiki("ab\nc")} code={"ab\nc"} />);
    expect(codeEl(container).innerHTML).toBe(
      new DOMParser()
        .parseFromString(shiki("ab\nc"), "text/html")
        .querySelector("code")!.innerHTML,
    );
  });

  it("follows the code as it grows under the same markup", () => {
    const { container, rerender } = render(
      <CodeBlockContent html={shiki("a")} code="ab" />,
    );
    rerender(<CodeBlockContent html={shiki("a")} code={"abc\nd"} />);
    expect(codeEl(container).textContent).toBe("abc\nd");
    expect(lines(container)).toEqual(["abc", "d"]);
  });

  it("keeps the remainder through a render that changes neither", () => {
    const { container, rerender } = render(
      <CodeBlockContent html={shiki("a")} code={"ab\nc"} />,
    );
    rerender(<CodeBlockContent html={shiki("a")} code={"ab\nc"} wrap />);
    expect(codeEl(container).textContent).toBe("ab\nc");
  });

  it("leaves markup alone that is not a start of the code", () => {
    const { container } = render(
      <CodeBlockContent html={shiki("old")} code="new" />,
    );
    expect(codeEl(container).textContent).toBe("old");
  });
});
