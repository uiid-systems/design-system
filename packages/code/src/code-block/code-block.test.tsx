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
    expect(
      document.querySelector('[data-slot="code-block"]'),
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CodeBlock code="const x = 1;" className="custom-class" />);
    expect(document.querySelector('[data-slot="code-block"]')).toHaveClass(
      "custom-class",
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

  it("always renders the copy button", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("always renders the wrap toggle", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(
      document.querySelector('[data-slot="code-block-wrap-button"]'),
    ).toBeInTheDocument();
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
      document.querySelector('[data-slot="code-block-content"]'),
    ).toHaveAttribute("data-line-numbers", "true");
  });

  it("does not apply line numbers attribute when showLineNumbers is false", () => {
    render(<CodeBlock code="const x = 1;" showLineNumbers={false} />);
    expect(
      document.querySelector('[data-slot="code-block-content"]'),
    ).not.toHaveAttribute("data-line-numbers");
  });

  // ============================================
  // PRE-RENDERED HTML
  // ============================================

  it("uses pre-rendered HTML when provided", () => {
    const customHtml = "<pre><code>custom html</code></pre>";
    render(<CodeBlock code="ignored" html={customHtml} />);
    expect(document.querySelector("code")).toHaveTextContent("custom html");
  });

  // ============================================
  // ACCESSIBILITY
  // ============================================

  it("copy button has accessible name", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByRole("button", { name: /copy/i })).toHaveAccessibleName(
      /copy/i,
    );
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

  // ============================================
  // WRAP
  // ============================================

  it("toggling the wrap button flips the content wrap attribute", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" />);
    const content = document.querySelector('[data-slot="code-block-content"]');
    expect(content).not.toHaveAttribute("data-wrap");

    await user.click(screen.getByRole("button", { name: /toggle line wrap/i }));
    await waitFor(() => {
      expect(content).toHaveAttribute("data-wrap", "true");
    });
  });

  it("respects defaultWrap=true on first render", () => {
    render(<CodeBlock code="const x = 1;" defaultWrap />);
    expect(
      document.querySelector('[data-slot="code-block-content"]'),
    ).toHaveAttribute("data-wrap", "true");
  });

  it("fires onWrapChange when the wrap toggle is pressed", async () => {
    const user = userEvent.setup();
    const onWrapChange = vi.fn();
    render(<CodeBlock code="const x = 1;" onWrapChange={onWrapChange} />);

    await user.click(screen.getByRole("button", { name: /toggle line wrap/i }));

    await waitFor(() => {
      expect(onWrapChange).toHaveBeenCalledWith(true);
    });
  });

  // ============================================
  // FULLSCREEN
  // ============================================

  it("always renders the fullscreen toggle", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(
      document.querySelector('[data-slot="code-block-fullscreen-button"]'),
    ).toBeInTheDocument();
  });

  it("enters fullscreen when the toggle is pressed", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" />);

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));

    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="code-block-fullscreen"]'),
      ).toBeInTheDocument();
      expect(
        document.querySelector('[data-slot="code-block"]'),
      ).toHaveAttribute("data-fullscreen", "true");
    });
  });

  it("exits fullscreen on Escape", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" />);

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="code-block-fullscreen"]'),
      ).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="code-block-fullscreen"]'),
      ).not.toBeInTheDocument();
    });
  });

  it("fires onFullscreenChange when toggled", async () => {
    const user = userEvent.setup();
    const onFullscreenChange = vi.fn();
    render(
      <CodeBlock code="const x = 1;" onFullscreenChange={onFullscreenChange} />,
    );

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));

    await waitFor(() => {
      expect(onFullscreenChange).toHaveBeenCalledWith(true);
    });
  });

  // ============================================
  // LANGUAGE ICON
  // ============================================

  it("renders a language icon when language is explicitly set", () => {
    render(<CodeBlock code="const x = 1;" language="typescript" />);
    const icon = document.querySelector('[data-slot="language-icon"]');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("data-language", "typescript");
  });

  it("does not render a language icon when language is not explicitly set", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(
      document.querySelector('[data-slot="language-icon"]'),
    ).not.toBeInTheDocument();
  });

  // ============================================
  // ONCOPY CALLBACK
  // ============================================

  it("fires onCopy with the code after copying", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const code = "const x = 1;";
    render(<CodeBlock code={code} onCopy={onCopy} />);

    await user.click(screen.getByRole("button", { name: /copy/i }));

    await waitFor(() => {
      expect(onCopy).toHaveBeenCalledWith(code);
    });
  });
});
