import { render, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import { CodeBlock } from "../code-block/code-block";
import { LanguageIcon } from "../code-block/language-icons";
import { CodeEditor } from "../code-editor/code-editor";
import { CodeInline } from "../code-inline/code-inline";
import {
  getHighlighter,
  highlight,
  isSupportedLanguage,
  loadLanguage,
  resolveLanguage,
} from "./highlighter";
import { TOKENIZE_MAX_LINE_LENGTH } from "./highlighter.constants";
import type { CodeLanguage } from "./highlighter.types";

const TS_CODE = "const x: number = 1;";

/**
 * A grammar gives every token span a theme color; the plain language gives
 * none.
 */
const COLORED_TOKEN = "span[style*='--shiki-light']";
const hasColoredTokens = (html: string) =>
  /<span style="[^"]*--shiki-light:/.test(html);

const textOf = (html: string) => {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.textContent;
};

/** A language as an untyped caller could pass it. */
const untyped = (language: unknown) => language as CodeLanguage;

describe("resolveLanguage", () => {
  it("returns a bundled language unchanged", () => {
    expect(resolveLanguage("tsx")).toBe("tsx");
  });

  it.each([
    ["ts", "typescript"],
    ["js", "javascript"],
    ["sh", "bash"],
    ["shell", "bash"],
    ["zsh", "bash"],
    ["py", "python"],
    ["md", "markdown"],
  ])("resolves the alias %s to %s", (alias, language) => {
    expect(resolveLanguage(alias)).toBe(language);
  });

  it("ignores case", () => {
    expect(resolveLanguage("TS")).toBe("typescript");
    expect(resolveLanguage("Python")).toBe("python");
  });

  it.each(["mermaid", "text", "", "toString", "constructor", "__proto__"])(
    "returns undefined for %j",
    (language) => {
      expect(resolveLanguage(language)).toBeUndefined();
    },
  );

  it.each([undefined, null])("returns undefined for %s", (language) => {
    expect(resolveLanguage(language)).toBeUndefined();
  });
});

describe("isSupportedLanguage", () => {
  it("accepts a bundled language", () => {
    expect(isSupportedLanguage("typescript")).toBe(true);
  });

  it.each(["toString", "constructor", "hasOwnProperty", "__proto__"])(
    "rejects the inherited key %s",
    (key) => {
      expect(isSupportedLanguage(key)).toBe(false);
    },
  );

  it("rejects an alias, which is not itself a bundled language", () => {
    expect(isSupportedLanguage("ts")).toBe(false);
  });
});

describe("loadLanguage", () => {
  it.each(["mermaid", "toString", "constructor", null])(
    "resolves without loading anything for %s",
    async (language) => {
      await expect(loadLanguage(untyped(language))).resolves.toBeUndefined();
    },
  );
});

describe("highlight", () => {
  it("renders with the light and dark Vitesse themes", async () => {
    const html = await highlight(TS_CODE, "typescript");
    expect(html).toContain("shiki-themes vitesse-light vitesse-black");
    expect(html).toMatch(/--shiki-light:#[0-9a-f]+;--shiki-dark:#[0-9a-f]+/i);
  });

  it("highlights as TypeScript when no language is given, as CodeBlock does", async () => {
    const html = await highlight(TS_CODE, undefined);

    expect(hasColoredTokens(html)).toBe(true);
    expect(html).toBe(await highlight(TS_CODE, "typescript"));
  });

  it("highlights an alias with its real language's grammar", async () => {
    const html = await highlight(TS_CODE, "ts");

    expect(hasColoredTokens(html)).toBe(true);
    expect(textOf(html)).toBe(TS_CODE);
  });

  it("renders an unknown language as plain, uncolored code", async () => {
    // No `-->` here: happy-dom's parser duplicates text around it
    const code = "graph TD;\n  A --- B;";
    const html = await highlight(code, "mermaid");

    expect(textOf(html)).toBe(code);
    expect(html.match(/class="line"/g)).toHaveLength(2);
    expect(hasColoredTokens(html)).toBe(false);
  });

  it.each(["toString", "constructor"])(
    "renders the inherited key %s as plain code",
    async (language) => {
      const html = await highlight(TS_CODE, language);

      expect(textOf(html)).toBe(TS_CODE);
      expect(hasColoredTokens(html)).toBe(false);
    },
  );

  it("renders a null language as plain code", async () => {
    const html = await highlight(TS_CODE, untyped(null));

    expect(textOf(html)).toBe(TS_CODE);
    expect(hasColoredTokens(html)).toBe(false);
  });

  it("still marks highlighted lines for an unknown language", async () => {
    const html = await highlight("one\ntwo", "mermaid", {
      highlightLines: [2],
    });

    expect(html.match(/class="line highlighted"/g)).toHaveLength(1);
  });

  it("colors a line fully even when tokenizing it exceeds Shiki's time limit", async () => {
    const code = "const message: string = `hello ${name}`; // done";
    const fast = await highlight(code, "typescript");

    // Each clock read jumps a second, so every line looks slower than any
    // per-line tokenize time limit Shiki could apply
    let now = Date.now();
    const clock = vi.spyOn(Date, "now").mockImplementation(() => (now += 1000));
    try {
      const slow = await highlight(code, "typescript");
      expect(slow).toBe(fast);
    } finally {
      clock.mockRestore();
    }
  });

  it("renders a line past the length cap plain", async () => {
    const long = `const x = [${"1, ".repeat(TOKENIZE_MAX_LINE_LENGTH / 3)}];`;
    const html = await highlight(`${long}\n${TS_CODE}`, "typescript");
    const [longLine, shortLine] = html.split('<span class="line">').slice(1);

    expect(textOf(html)).toBe(`${long}\n${TS_CODE}`);
    expect(hasColoredTokens(longLine)).toBe(false);
    expect(hasColoredTokens(shortLine)).toBe(true);
  });
});

/** The class list of each `.line` span, in order. */
const lineClasses = (html: string) =>
  [...html.matchAll(/<span class="(line[^"]*)"/g)].map(([, name]) => name);

describe("highlight line markup", () => {
  it("marks each line in highlightLines", async () => {
    const html = await highlight("a\nb\nc\nd", "typescript", {
      highlightLines: [1, 3],
    });

    expect(lineClasses(html)).toEqual([
      "line highlighted",
      "line",
      "line highlighted",
      "line",
    ]);
  });

  it("marks no line for an empty highlightLines", async () => {
    const html = await highlight("a\nb", "typescript", { highlightLines: [] });

    expect(lineClasses(html)).toEqual(["line", "line"]);
  });

  it("marks added, removed and highlighted notation lines", async () => {
    const code = [
      "const a = 1; // [!code ++]",
      "const b = 2; // [!code --]",
      "const c = 3; // [!code highlight]",
      "const d = 4;",
    ].join("\n");
    const html = await highlight(code, "typescript");

    expect(lineClasses(html)).toEqual([
      "line diff add",
      "line diff remove",
      "line highlighted",
      "line",
    ]);
    expect(html).toMatch(/<pre class="[^"]*\bhas-diff\b/);
    expect(html).toMatch(/<pre class="[^"]*\bhas-highlighted\b/);
  });

  it("strips the notation comments from the output", async () => {
    const html = await highlight(
      "const a = 1; // [!code ++]\nconst b = 2; // [!code highlight]",
      "typescript",
    );

    expect(textOf(html)).toBe("const a = 1;\nconst b = 2;");
  });

  it("keeps notation comments as written with notations off, still marking meta lines", async () => {
    const code =
      "const a = 1; // [!code ++]\nconst b = 2; // [!code highlight]";
    const html = await highlight(code, "typescript", {
      notations: false,
      highlightLines: [2],
    });

    expect(textOf(html)).toBe(code);
    expect(lineClasses(html)).toEqual(["line", "line highlighted"]);
  });
});

describe("loadLanguage into the shared highlighter", () => {
  it("loads a language into the shared instance only once", async () => {
    const highlighter = await getHighlighter();
    const load = vi.spyOn(highlighter, "loadLanguage");
    try {
      // Python and its alias load nowhere else in this file
      await loadLanguage("python");
      await loadLanguage("py");
      await highlight("x = 1", "python");

      expect(load).toHaveBeenCalledTimes(1);
      expect(highlighter.getLoadedLanguages()).toContain("python");
    } finally {
      load.mockRestore();
    }
  });
});

describe("LanguageIcon", () => {
  it.each([undefined, null])("renders nothing for %s", (language) => {
    const { container } = render(<LanguageIcon language={untyped(language)} />);

    expect(container).toBeEmptyDOMElement();
  });
});

describe("CodeBlock with a fence language", () => {
  const error = () => document.querySelector('[data-slot="code-block-error"]');

  it("renders an unknown language's code with no error", async () => {
    render(<CodeBlock code="graph TD;" language="mermaid" />);

    await waitFor(() =>
      expect(document.querySelector("pre.shiki")).toBeInTheDocument(),
    );
    expect(document.querySelector("pre.shiki")).toHaveTextContent("graph TD;");
    expect(document.querySelector(COLORED_TOKEN)).not.toBeInTheDocument();
    expect(error()).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="language-icon"]'),
    ).not.toBeInTheDocument();
  });

  it("highlights an alias and shows its language icon", async () => {
    render(<CodeBlock code={TS_CODE} language="ts" />);

    await waitFor(() =>
      expect(document.querySelector(COLORED_TOKEN)).toBeInTheDocument(),
    );
    expect(
      document.querySelector('[data-slot="language-icon"]'),
    ).toHaveAttribute("data-language", "typescript");
    expect(error()).not.toBeInTheDocument();
  });

  describe("notations", () => {
    const CODE = "const a = 1; // [!code --]\nconst b = 2;";
    const lines = () => [...document.querySelectorAll("pre.shiki .line")];

    it("turns a notation comment into a diff line by default", async () => {
      render(<CodeBlock code={CODE} language="ts" />);

      await waitFor(() =>
        expect(document.querySelector(".line.diff.remove")).not.toBeNull(),
      );
      expect(lines()[0]).not.toHaveTextContent("[!code --]");
    });

    it("renders the comment as written with notations={false}", async () => {
      render(<CodeBlock code={CODE} language="ts" notations={false} />);

      await waitFor(() =>
        expect(document.querySelector(COLORED_TOKEN)).toBeInTheDocument(),
      );
      expect(lines()).toHaveLength(2);
      expect(lines()[0]).toHaveTextContent("const a = 1; // [!code --]");
      expect(lines()[1]).toHaveTextContent("const b = 2;");
      expect(document.querySelector(".line.diff")).toBeNull();
    });
  });

  it("shows no error when the language changes to an unknown one", async () => {
    const { rerender } = render(
      <CodeBlock code={TS_CODE} language="typescript" />,
    );
    await waitFor(() =>
      expect(document.querySelector(COLORED_TOKEN)).toBeInTheDocument(),
    );

    rerender(<CodeBlock code={TS_CODE} language="mermaid" />);

    await waitFor(() =>
      expect(document.querySelector(COLORED_TOKEN)).not.toBeInTheDocument(),
    );
    expect(document.querySelector("pre.shiki")).toHaveTextContent(TS_CODE);
    expect(error()).not.toBeInTheDocument();
  });
});

describe("CodeInline with an unknown language", () => {
  it("renders the code plain", async () => {
    render(<CodeInline language="mermaid">graph TD;</CodeInline>);
    const inline = document.querySelector('[data-slot="code-inline"]');

    // The highlighted markup replaces the loading fallback's bare text
    await waitFor(() =>
      expect(inline?.querySelector(".line")).toBeInTheDocument(),
    );
    expect(inline).toHaveTextContent("graph TD;");
    expect(inline?.querySelector(COLORED_TOKEN)).not.toBeInTheDocument();
  });
});

describe("CodeEditor with an unknown language", () => {
  it("renders the code plain", async () => {
    render(<CodeEditor defaultValue="graph TD;" language="mermaid" />);
    const backdrop = document.querySelector(
      '[data-slot="code-editor-highlight"]',
    );

    await waitFor(() =>
      expect(backdrop?.querySelector("pre.shiki")).toBeInTheDocument(),
    );
    expect(backdrop).toHaveTextContent("graph TD;");
    expect(backdrop?.querySelector(COLORED_TOKEN)).not.toBeInTheDocument();
  });
});
