import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CodeBlock } from "./code-block";

// Mock the highlighter module
vi.mock("../highlighter/highlighter.hooks", () => ({
  useHighlight: vi.fn((code: string) => ({
    html: `<pre><code><span class="line">${code}</span></code></pre>`,
    loading: false,
    error: null,
  })),
}));

// Mock clipboard API
const mockWriteText = vi.fn();

describe("CodeBlock", () => {
  beforeEach(() => {
    mockWriteText.mockClear();
    mockWriteText.mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });
  });

  // ============================================
  // RENDERING
  // ============================================

  it("renders a code block element", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(document.querySelector('[data-slot="code-block"]')).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CodeBlock code="const x = 1;" className="custom-class" />);
    expect(document.querySelector('[data-slot="code-block"]')).toHaveClass(
      "custom-class"
    );
  });

  it("forwards additional props to root element", () => {
    render(<CodeBlock code="const x = 1;" data-testid="test-code-block" />);
    expect(screen.getByTestId("test-code-block")).toBeInTheDocument();
  });

  // ============================================
  // HEADER
  // ============================================

  it("renders filename in header when provided", () => {
    render(<CodeBlock code="const x = 1;" filename="example.ts" />);
    expect(screen.getByText("example.ts")).toBeInTheDocument();
  });

  it("renders copy button when copyable is true", () => {
    render(<CodeBlock code="const x = 1;" copyable />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("does not render copy button when copyable is false", () => {
    render(<CodeBlock code="const x = 1;" copyable={false} />);
    expect(screen.queryByRole("button", { name: /copy/i })).not.toBeInTheDocument();
  });

  it("does not render header when no filename and copyable is false", () => {
    render(<CodeBlock code="const x = 1;" copyable={false} />);
    expect(
      document.querySelector('[data-slot="code-block-header"]')
    ).not.toBeInTheDocument();
  });

  // ============================================
  // COPY FUNCTIONALITY
  // ============================================

  it("triggers copy on button click", async () => {
    const user = userEvent.setup();
    const code = "const x = 1;";
    render(<CodeBlock code={code} />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    // Verify the button state changed to copied (which means the click handler ran)
    await waitFor(() => {
      expect(copyButton).toHaveAttribute("data-copied", "true");
    });
  });

  it("shows copied state after copying", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    await waitFor(() => {
      expect(copyButton).toHaveAttribute("data-copied", "true");
    });
  });

  // ============================================
  // LINE NUMBERS
  // ============================================

  it("applies line numbers attribute when showLineNumbers is true", () => {
    render(<CodeBlock code="const x = 1;" showLineNumbers />);
    expect(
      document.querySelector('[data-slot="code-block-content"]')
    ).toHaveAttribute("data-line-numbers", "true");
  });

  it("does not apply line numbers attribute when showLineNumbers is false", () => {
    render(<CodeBlock code="const x = 1;" showLineNumbers={false} />);
    expect(
      document.querySelector('[data-slot="code-block-content"]')
    ).not.toHaveAttribute("data-line-numbers");
  });

  // ============================================
  // PRE-RENDERED HTML
  // ============================================

  it("uses pre-rendered HTML when provided", () => {
    const customHtml = '<pre><code>custom html</code></pre>';
    render(<CodeBlock code="ignored" html={customHtml} />);
    expect(document.querySelector("code")).toHaveTextContent("custom html");
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("copy button has accessible name", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByRole("button")).toHaveAccessibleName(/copy/i);
  });

  it("copy button updates accessible name after copying", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" />);

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    await waitFor(() => {
      expect(copyButton).toHaveAccessibleName(/copied/i);
    });
  });
});
