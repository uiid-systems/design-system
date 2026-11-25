import { describe, expect, it } from "vitest";

import { extractCodeContent } from "./code-inline.utils";

const LINE =
  '<span class="line"><span style="--shiki-light:#1E754F">x</span></span>';

describe("extractCodeContent", () => {
  it("returns the markup inside Shiki's pre and code wrappers", () => {
    const html = `<pre class="shiki shiki-themes vitesse-light vitesse-black" style="--shiki-light:#393a34;--shiki-dark:#dbd7caee" tabindex="0"><code>${LINE}</code></pre>`;
    expect(extractCodeContent(html)).toBe(LINE);
  });

  it("does not depend on a pre wrapper", () => {
    expect(extractCodeContent(`<code>${LINE}</code>`)).toBe(LINE);
  });

  it("accepts attributes, whitespace and any case on the code tag", () => {
    const html = `<pre>\n  <CODE class="language-ts" data-x='a>b'>${LINE}</CODE >\n</pre>`;
    expect(extractCodeContent(html)).toBe(LINE);
  });

  it("does not mistake a tag that starts with code for the code element", () => {
    const html = `<codex>no</codex><code>${LINE}</code>`;
    expect(extractCodeContent(html)).toBe(LINE);
  });

  it("keeps an empty code element as empty markup", () => {
    expect(extractCodeContent("<pre><code></code></pre>")).toBe("");
  });

  it("returns null when there is no code element", () => {
    expect(extractCodeContent(`<pre>${LINE}</pre>`)).toBeNull();
    expect(extractCodeContent(LINE)).toBeNull();
    expect(extractCodeContent("")).toBeNull();
  });

  it("returns null when the code element is not closed", () => {
    expect(extractCodeContent(`<pre><code>${LINE}`)).toBeNull();
    expect(extractCodeContent('<pre><code class="a')).toBeNull();
  });
});
