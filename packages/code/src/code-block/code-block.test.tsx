import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

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

/**
 * Focus lands on the exit button, which opens its tooltip in the test DOM.
 * Base UI dismisses layers one at a time, so the first Escape may close that
 * tooltip and the next one the dialog.
 */
const closeFullscreenWithEscape = async (
  user: ReturnType<typeof userEvent.setup>,
) => {
  const isOpen = () =>
    document.querySelector('[data-slot="code-block"][data-fullscreen]') !==
    null;
  await user.keyboard("{Escape}");
  if (isOpen()) await user.keyboard("{Escape}");
  await waitFor(() => expect(isOpen()).toBe(false));
};

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

  it("renders the copy button by default", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("renders the wrap toggle by default", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(
      document.querySelector('[data-slot="code-block-wrap-button"]'),
    ).toBeInTheDocument();
  });

  it("hides the copy button when copyable is false", () => {
    render(<CodeBlock code="const x = 1;" copyable={false} />);
    expect(
      document.querySelector('[data-slot="code-block-copy-button"]'),
    ).not.toBeInTheDocument();
  });

  it("hides the wrap toggle when wrappable is false", () => {
    render(<CodeBlock code="const x = 1;" wrappable={false} />);
    expect(
      document.querySelector('[data-slot="code-block-wrap-button"]'),
    ).not.toBeInTheDocument();
  });

  it("hides the fullscreen toggle when fullscreenable is false", () => {
    render(<CodeBlock code="const x = 1;" fullscreenable={false} />);
    expect(
      document.querySelector('[data-slot="code-block-fullscreen-button"]'),
    ).not.toBeInTheDocument();
  });

  it("keeps the filename when every header action is off", () => {
    render(
      <CodeBlock
        code="const x = 1;"
        filename="example.ts"
        copyable={false}
        wrappable={false}
        fullscreenable={false}
      />,
    );
    expect(screen.getByText("example.ts")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
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

  it("renders the fullscreen toggle by default", () => {
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
      expect(screen.getByRole("dialog")).toHaveAttribute(
        "data-fullscreen",
        "true",
      );
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

    await closeFullscreenWithEscape(user);
    expect(
      document.querySelector('[data-slot="code-block-fullscreen"]'),
    ).not.toBeInTheDocument();
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

  it("renders fullscreen as a modal dialog named by the filename", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" filename="example.ts" />);

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName("example.ts");
    expect(dialog).toHaveAttribute("data-slot", "code-block");
  });

  it("moves focus to the exit button and returns it to the toggle on Escape", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" />);
    const toggle = screen.getByRole("button", { name: /enter fullscreen/i });

    await user.click(toggle);
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => {
      expect(
        within(dialog).getByRole("button", { name: /exit fullscreen/i }),
      ).toHaveFocus();
    });

    await closeFullscreenWithEscape(user);
    // The same element, not a remounted copy, gets focus back.
    expect(toggle).toBeInTheDocument();
    await waitFor(() => expect(toggle).toHaveFocus());
  });

  it("closes from the exit button and returns focus to the toggle", async () => {
    const user = userEvent.setup();
    const onFullscreenChange = vi.fn();
    render(
      <CodeBlock code="const x = 1;" onFullscreenChange={onFullscreenChange} />,
    );
    const toggle = screen.getByRole("button", { name: /enter fullscreen/i });

    await user.click(toggle);
    const dialog = await screen.findByRole("dialog");
    await user.click(
      within(dialog).getByRole("button", { name: /exit fullscreen/i }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onFullscreenChange).toHaveBeenLastCalledWith(false);
    await waitFor(() => expect(toggle).toHaveFocus());
  });

  it("keeps the inline block mounted, so copy state survives fullscreen", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" />);
    const copy = screen.getByRole("button", { name: /copy code/i });

    await user.click(copy);
    await waitFor(() => expect(copy).toHaveAttribute("data-copied", "true"));

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    await screen.findByRole("dialog");
    await closeFullscreenWithEscape(user);

    expect(copy).toBeInTheDocument();
    expect(copy).toHaveAttribute("data-copied", "true");
  });

  it("closes only the fullscreen dialog on Escape inside another dialog", async () => {
    const user = userEvent.setup();
    render(
      <BaseDialog.Root open>
        <BaseDialog.Portal>
          <BaseDialog.Popup aria-label="Outer">
            <CodeBlock code="const x = 1;" />
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>,
    );
    const outer = await screen.findByRole("dialog", { name: "Outer" });

    await user.click(
      within(outer).getByRole("button", { name: /enter fullscreen/i }),
    );
    await screen.findByRole("dialog", { name: "Code block" });

    await closeFullscreenWithEscape(user);
    expect(screen.getByRole("dialog", { name: "Outer" })).toBeInTheDocument();
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
