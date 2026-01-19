import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { CodeInline } from "./code-inline";

// Mock the highlighter module
vi.mock("../highlighter/highlighter.hooks", () => ({
  useHighlight: vi.fn((code: string) => ({
    html: `<pre class="shiki"><code><span class="line">${code}</span></code></pre>`,
    loading: false,
    error: null,
  })),
}));

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
      document.querySelector('[data-slot="code-inline"]')
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CodeInline className="custom-class">npm install</CodeInline>);
    expect(document.querySelector('[data-slot="code-inline"]')).toHaveClass(
      "custom-class"
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

  it("renders highlighted code when language is provided", () => {
    render(<CodeInline language="typescript">const x = 1;</CodeInline>);
    // The mock returns the code wrapped in a span
    expect(
      document.querySelector('[data-slot="code-inline"]')
    ).toBeInTheDocument();
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
      </CodeInline>
    );
    expect(
      document.querySelector('[data-slot="code-inline"]')
    ).toBeInTheDocument();
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
      </p>
    );
    // CodeInline should be within the paragraph
    const paragraph = screen.getByText(/Run/);
    expect(paragraph.querySelector('[data-slot="code-inline"]')).toBeInTheDocument();
  });
});
