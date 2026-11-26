import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useHighlight } from "../highlighter/highlighter.hooks";
import { CodeInline } from "./code-inline";

// Stands in for the highlighter: highlights at once, and like the real hook
// returns no markup when it is not enabled.
vi.mock("../highlighter/highlighter.hooks", () => ({
  useHighlight: vi.fn(
    (code: string, _language?: string, options?: { enabled?: boolean }) => ({
      html:
        options?.enabled === false
          ? ""
          : `<pre class="shiki"><code><span class="line"><span class="token">${code}</span></span></code></pre>`,
      loading: false,
      error: null,
    }),
  ),
}));

const root = () =>
  document.querySelector<HTMLElement>('[data-slot="code-inline"]');

beforeEach(() => {
  vi.mocked(useHighlight).mockClear();
});

describe("CodeInline", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders a code element", () => {
    render(<CodeInline>npm install</CodeInline>);
    expect(screen.getByText("npm install")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<CodeInline>npm install</CodeInline>);
    expect(
      document.querySelector('[data-slot="code-inline"]'),
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CodeInline className="custom-class">npm install</CodeInline>);
    expect(document.querySelector('[data-slot="code-inline"]')).toHaveClass(
      "custom-class",
    );
  });

  it("forwards additional props to root element", () => {
    render(<CodeInline data-testid="test-code-inline">npm install</CodeInline>);
    expect(screen.getByTestId("test-code-inline")).toBeInTheDocument();
  });

  // ============================================
  // PLAIN CODE (NO LANGUAGE)
  // ============================================

  it("renders plain text when no language is provided", () => {
    render(<CodeInline>npm install</CodeInline>);
    const codeElement = document.querySelector('[data-slot="code-inline"]');
    expect(codeElement?.textContent).toBe("npm install");
  });

  it("renders children directly without language", () => {
    render(<CodeInline>simple text</CodeInline>);
    expect(screen.getByText("simple text")).toBeInTheDocument();
  });

  // ============================================
  // HIGHLIGHTED CODE (WITH LANGUAGE)
  // ============================================

  it("renders the markup inside Shiki's code element when language is provided", () => {
    render(<CodeInline language="typescript">const x = 1;</CodeInline>);
    expect(root()?.innerHTML).toBe(
      '<span class="line"><span class="token">const x = 1;</span></span>',
    );
  });

  it("renders non-string children as given, unhighlighted", () => {
    render(
      <CodeInline language="ts">
        <b>x</b>
      </CodeInline>,
    );
    expect(root()?.querySelector("b")).toHaveTextContent("x");
    expect(root()?.querySelector(".line")).toBeNull();
    expect(useHighlight).toHaveBeenCalledWith(
      expect.anything(),
      "ts",
      expect.objectContaining({ enabled: false }),
    );
  });

  it("falls back to the children when the markup has no code element", () => {
    render(
      <CodeInline language="typescript" html="<pre>not shiki</pre>">
        const x = 1;
      </CodeInline>,
    );
    expect(root()?.innerHTML).toBe("const x = 1;");
  });

  it("renders the children while highlighting is pending", () => {
    vi.mocked(useHighlight).mockReturnValueOnce({
      html: "",
      loading: true,
      error: null,
    });
    render(<CodeInline language="typescript">const x = 1;</CodeInline>);
    expect(root()?.innerHTML).toBe("const x = 1;");
  });

  it("does not accept dangerouslySetInnerHTML", () => {
    render(
      // @ts-expect-error CodeInline owns its inner HTML; pass `html` instead.
      <CodeInline dangerouslySetInnerHTML={{ __html: "<i>x</i>" }} />,
    );
    expect(root()).toBeInTheDocument();
  });

  // ============================================
  // PRE-RENDERED HTML
  // ============================================

  it("uses pre-rendered HTML when provided with language", () => {
    const customHtml =
      '<pre class="shiki"><code><span class="line">custom content</span></code></pre>';
    render(
      <CodeInline language="typescript" html={customHtml}>
        ignored
      </CodeInline>,
    );
    expect(root()?.innerHTML).toBe('<span class="line">custom content</span>');
  });

  it("paints server html on the first render and never enables the highlighter", () => {
    const customHtml =
      '<pre class="shiki"><code><span class="line"><span style="--shiki-light:#1E754F;--shiki-dark:#4D9375">x</span></span></code></pre>';
    render(
      <CodeInline language="typescript" html={customHtml}>
        x
      </CodeInline>,
    );
    expect(root()?.querySelector("span[style]")).toHaveAttribute(
      "style",
      "--shiki-light:#1E754F;--shiki-dark:#4D9375",
    );
    for (const [, , options] of vi.mocked(useHighlight).mock.calls) {
      expect(options).toEqual(expect.objectContaining({ enabled: false }));
    }
  });

  // ============================================
  // SEMANTICS
  // ============================================

  it("renders as code element", () => {
    render(<CodeInline>npm install</CodeInline>);
    const element = document.querySelector('[data-slot="code-inline"]');
    expect(element?.tagName).toBe("CODE");
  });

  it("is inline by default", () => {
    render(
      <p>
        Run <CodeInline>npm install</CodeInline> to install
      </p>,
    );
    // CodeInline should be within the paragraph
    const paragraph = screen.getByText(/Run/);
    expect(
      paragraph.querySelector('[data-slot="code-inline"]'),
    ).toBeInTheDocument();
  });
});
