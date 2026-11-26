import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { highlight } from "../highlighter/highlighter";
import { TOKENIZE_MAX_LINE_LENGTH } from "../highlighter/highlighter.constants";
import { useHighlight } from "../highlighter/highlighter.hooks";
import { CodeBlock } from "./code-block";

// Nothing is highlighted on the client unless a test says so: the block shows
// its plain fallback, as it does before Shiki answers.
vi.mock("../highlighter/highlighter.hooks", () => ({
  useHighlight: vi.fn(() => ({ html: "", loading: true, error: null })),
}));

const mockHighlight = vi.mocked(useHighlight);

afterEach(() => {
  mockHighlight.mockClear();
  mockHighlight.mockImplementation(() => ({
    html: "",
    loading: true,
    error: null,
  }));
});

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

    it("highlights the code without its trailing newline", () => {
      render(<CodeBlock code={"const a = 1;\n"} />);
      expect(mockHighlight).toHaveBeenLastCalledWith(
        "const a = 1;",
        "typescript",
        expect.anything(),
      );
    });
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
    render(<CodeBlock code={"const a = 1;\n"} />);
    await user.click(screen.getByRole("button", { name: /copy/i }));
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("const a = 1;\n"),
    );
    writeText.mockRestore();
  });
});

describe("CodeBlock when highlighting fails", () => {
  const error = new Error("grammar failed to load");

  it("shows the plain code, not an empty frame", () => {
    mockHighlight.mockImplementation(() => ({
      html: "",
      loading: false,
      error,
    }));
    render(<CodeBlock code={"const a = 1;\nconst b = 2;"} />);
    expect(lines().map((line) => line.textContent)).toEqual([
      "const a = 1;",
      "const b = 2;",
    ]);
  });

  it("shows the plain current code, not the last highlight of older code", () => {
    mockHighlight.mockImplementation(() => ({
      html: '<pre class="shiki"><code><span class="line">old</span></code></pre>',
      loading: false,
      error,
    }));
    render(<CodeBlock code="const a = 1;" />);
    expect(document.querySelector("pre.shiki")).not.toBeInTheDocument();
    expect(lines().map((line) => line.textContent)).toEqual(["const a = 1;"]);
  });

  it("puts the error after the code, so the code does not move", () => {
    mockHighlight.mockImplementation(() => ({
      html: "",
      loading: false,
      error,
    }));
    render(<CodeBlock code="const a = 1;" />);
    const block = document.querySelector('[data-slot="code-block"]')!;
    const scroll = block.querySelector('[data-slot="code-block-scroll"]')!;
    const message = block.querySelector('[data-slot="code-block-error"]')!;
    expect(message).toHaveTextContent("grammar failed to load");
    expect(scroll.nextElementSibling).toBe(message);
    expect(block.lastElementChild).toBe(message);
  });
});
