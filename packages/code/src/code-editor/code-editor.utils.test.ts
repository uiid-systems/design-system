import { describe, expect, it } from "vitest";

import {
  normalizeLineEndings,
  parseMarkup,
  reusableLines,
  type MarkupLine,
} from "./code-editor.utils";

const markupOf = (...texts: string[]): MarkupLine[] =>
  texts.map((text) => ({ className: "line", html: `<i>${text}</i>`, text }));

describe("normalizeLineEndings", () => {
  it("turns CRLF and lone CR into LF", () => {
    expect(normalizeLineEndings("a\r\nb\rc\nd")).toBe("a\nb\nc\nd");
  });
});

describe("parseMarkup", () => {
  it("returns null for no markup", () => {
    expect(parseMarkup("")).toBeNull();
  });

  it("reads the pre's class and theme declarations and each line's markup and text", () => {
    const parsed = parseMarkup(
      '<pre class="shiki a" style="--shiki-light:#111;background-color:#fff" tabindex="0"><code>' +
        '<span class="line"><span style="--shiki-light:#222">x &lt; 1</span></span>\n' +
        '<span class="line highlighted"></span></code></pre>',
    );

    expect(parsed).toEqual({
      className: "shiki a",
      style: { "--shiki-light": "#111", backgroundColor: "#fff" },
      lines: [
        {
          className: "line",
          html: '<span style="--shiki-light:#222">x &lt; 1</span>',
          text: "x < 1",
        },
        { className: "line highlighted", html: "", text: "" },
      ],
    });
  });
});

describe("reusableLines", () => {
  const markup = markupOf("a", "b", "c");

  it("reuses every line when the text is unchanged", () => {
    expect(reusableLines(markup, ["a", "b", "c"])).toEqual(markup);
  });

  it("leaves only an edited line without markup", () => {
    expect(reusableLines(markup, ["a", "bx", "c"])).toEqual([
      markup[0],
      undefined,
      markup[2],
    ]);
  });

  it("keeps the lines after an inserted line on their own markup", () => {
    expect(reusableLines(markup, ["a", "new", "b", "c"])).toEqual([
      markup[0],
      undefined,
      markup[1],
      markup[2],
    ]);
  });

  it("keeps the lines either side of a removed line", () => {
    expect(reusableLines(markup, ["a", "c"])).toEqual([markup[0], markup[2]]);
  });

  it("never reuses one markup line for two lines of text", () => {
    expect(reusableLines(markupOf("a", "a"), ["a", "a", "a"])).toEqual([
      expect.objectContaining({ text: "a" }),
      expect.objectContaining({ text: "a" }),
      undefined,
    ]);
  });
});
