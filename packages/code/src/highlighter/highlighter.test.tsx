import { render, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import { CodeBlock } from "../code-block/code-block";
import {
  highlight,
  isSupportedLanguage,
  loadLanguage,
  resolveLanguage,
} from "./highlighter";

const TS_CODE = "const x: number = 1;";

/** Token spans carry the theme colors; the wrapping `pre` is not a span. */
const hasColoredTokens = (html: string) =>
  /<span style="[^"]*--shiki-light:/.test(html);

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
  it.each(["mermaid", "toString", "constructor"])(
    "resolves without loading anything for %s",
    async (language) => {
      await expect(loadLanguage(language)).resolves.toBeUndefined();
    },
  );
});

describe("highlight", () => {
  it("highlights an alias as its real language", async () => {
    const aliased = await highlight(TS_CODE, "ts");

    expect(hasColoredTokens(aliased)).toBe(true);
    expect(aliased).toBe(await highlight(TS_CODE, "typescript"));
  });

  it("renders an unknown language as plain, uncolored code", async () => {
    const html = await highlight("graph TD;\n  A --- B;", "mermaid");

    expect(html).toContain("graph TD;");
    expect(html).toContain("A --- B;");
    expect(html.match(/class="line"/g)).toHaveLength(2);
    expect(hasColoredTokens(html)).toBe(false);
  });

  it.each(["toString", "constructor"])(
    "renders the inherited key %s as plain code",
    async (language) => {
      const html = await highlight(TS_CODE, language);

      expect(html).toContain(TS_CODE);
      expect(hasColoredTokens(html)).toBe(false);
    },
  );

  it("still marks highlighted lines for an unknown language", async () => {
    const html = await highlight("one\ntwo", "mermaid", {
      highlightLines: [2],
    });

    expect(html.match(/class="line highlighted"/g)).toHaveLength(1);
  });
});

describe("CodeBlock with a fence language", () => {
  it("renders an unknown language's code with no error", async () => {
    render(<CodeBlock code="graph TD;" language="mermaid" />);

    await waitFor(() =>
      expect(document.querySelector("pre.shiki")).toBeInTheDocument(),
    );
    expect(document.querySelector("pre.shiki")).toHaveTextContent("graph TD;");
    expect(
      document.querySelector('[data-slot="code-block-error"]'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="language-icon"]'),
    ).not.toBeInTheDocument();
  });

  it("highlights an alias and shows its language icon", async () => {
    render(<CodeBlock code={TS_CODE} language="ts" />);

    await waitFor(() =>
      expect(
        document.querySelector("pre.shiki span[style*='--shiki-light']"),
      ).toBeInTheDocument(),
    );
    expect(
      document.querySelector('[data-slot="language-icon"]'),
    ).toHaveAttribute("data-language", "typescript");
    expect(
      document.querySelector('[data-slot="code-block-error"]'),
    ).not.toBeInTheDocument();
  });
});
