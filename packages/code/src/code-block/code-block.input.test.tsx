import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { highlight } from "../highlighter/highlighter";
import { TOKENIZE_MAX_LINE_LENGTH } from "../highlighter/highlighter.constants";
import { CodeBlock } from "./code-block";

// Nothing is highlighted on the client: the block shows its plain fallback, as
// it does before Shiki answers. Highlighted cases pass Shiki's own `html`.
vi.mock("../highlighter/highlighter.hooks", () => ({
  useHighlight: () => ({ html: "", loading: true, error: null }),
}));

const lines = () => [
  ...document.querySelectorAll<HTMLElement>(
    '[data-slot="code-block-content"] .line',
  ),
];

const LONG_LINE = "x".repeat(TOKENIZE_MAX_LINE_LENGTH + 1);

/** Each input, and the lines it should render: no extra blank line. */
const CASES: [name: string, code: string, rendered: string[]][] = [
  ["empty code", "", [""]],
  ["a single line", "const a = 1;", ["const a = 1;"]],
  ["a trailing newline", "const a = 1;\n", ["const a = 1;"]],
  ["a trailing CRLF", "const a = 1;\r\n", ["const a = 1;"]],
  ["a blank last line before the newline", "a\n\n", ["a", ""]],
  [
    "tab characters",
    "\tif (a) {\n\t\tb();\n\t}",
    ["\tif (a) {", "\t\tb();", "\t}"],
  ],
  ["a line past the tokenizer cap", LONG_LINE, [LONG_LINE]],
];

describe("CodeBlock edge input", () => {
  describe("in the plain fallback", () => {
    for (const [name, code, rendered] of CASES) {
      it(`renders ${name}`, () => {
        render(<CodeBlock code={code} />);
        expect(lines().map((line) => line.textContent)).toEqual(rendered);
      });
    }
  });

  describe("highlighted by Shiki", () => {
    for (const [name, code, rendered] of CASES) {
      it(`renders ${name}`, async () => {
        render(<CodeBlock code={code} html={await highlight(code)} />);
        expect(document.querySelector("pre.shiki")).toBeInTheDocument();
        expect(lines().map((line) => line.textContent)).toEqual(rendered);
      });
    }

    it("renders a line past the tokenizer cap as plain text", async () => {
      const html = await highlight(`const a = 1;\n${LONG_LINE}`);
      render(<CodeBlock code={`const a = 1;\n${LONG_LINE}`} html={html} />);
      const [first, long] = lines();
      expect(first.querySelectorAll("span").length).toBeGreaterThan(1);
      expect(long.querySelectorAll("span")).toHaveLength(1);
    });
  });

  it("copies the code as given, trailing newline included", async () => {
    const user = userEvent.setup();
    const writeText = vi.spyOn(navigator.clipboard, "writeText");
    try {
      render(<CodeBlock code={"const a = 1;\n"} />);
      await user.click(screen.getByRole("button", { name: /copy/i }));
      await waitFor(() =>
        expect(writeText).toHaveBeenCalledWith("const a = 1;\n"),
      );
    } finally {
      writeText.mockRestore();
    }
  });
});
