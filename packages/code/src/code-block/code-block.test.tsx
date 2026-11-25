import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { CodeBlock } from "./code-block";
import type {
  CodeBlockExpandToggleProps,
  CodeBlockProps,
} from "./code-block.types";
import {
  CodeBlockContent,
  CodeBlockCopyButton,
  CodeBlockExpandToggle,
  CodeBlockFullscreenButton,
  CodeBlockHeader,
  CodeBlockWrapButton,
} from "./subcomponents";

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

  it("fills the width with its header and content", () => {
    render(<CodeBlock code="const x = 1;" filename="example.ts" />);
    expect(
      document.querySelector('[data-slot="code-block-header"]'),
    ).toHaveAttribute("data-ui-w", "full");
    expect(
      document.querySelector('[data-slot="code-block-content"]'),
    ).toHaveAttribute("data-ui-w", "full");
  });

  it("fills the width with the unhighlighted content fallback", () => {
    render(<CodeBlockContent code="const x = 1;" />);
    expect(
      document.querySelector('[data-slot="code-block-content"]'),
    ).toHaveAttribute("data-ui-w", "full");
  });

  it("renders filename in header when provided", () => {
    render(<CodeBlock code="const x = 1;" filename="example.ts" />);
    expect(screen.getByText("example.ts")).toBeInTheDocument();
  });

  it("renders the copy button by default", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(screen.getByRole("button", { name: /copy/i })).toBeInTheDocument();
  });

  it("renders exactly one button by default, the copy button", () => {
    render(<CodeBlock code="x" />);
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveAttribute("data-slot", "code-block-copy-button");
  });

  it("renders no button when the code is empty", () => {
    render(<CodeBlock code="" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("leaves the copy button out when the code is empty, even with every flag on", () => {
    render(<CodeBlock code="" copyable wrappable fullscreenable />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.map((b) => b.getAttribute("data-slot"))).toEqual([
      "code-block-wrap-button",
      "code-block-fullscreen-button",
    ]);
    for (const button of buttons) {
      expect(button).toBeEnabled();
      expect(button).not.toHaveAttribute("aria-disabled", "true");
    }
  });

  it("removes the copy button when the code becomes empty", () => {
    const { rerender } = render(<CodeBlock code="x" />);
    expect(screen.getByRole("button", { name: "Copy code" })).toBeEnabled();

    rerender(<CodeBlock code="" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("leaves the wrap toggle out by default", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(
      document.querySelector('[data-slot="code-block-wrap-button"]'),
    ).not.toBeInTheDocument();
  });

  it("renders the wrap toggle when wrappable is set", () => {
    render(<CodeBlock code="const x = 1;" wrappable />);
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
  // HEADER FROM ITS CONTENT
  // ============================================

  const header = () =>
    document.querySelector<HTMLElement>('[data-slot="code-block-header"]');

  it("draws the header bar when there is a filename", () => {
    render(<CodeBlock code="x" filename="example.ts" />);
    expect(header()).not.toHaveAttribute("data-floating");
    expect(header()).toHaveAttribute("data-ui-bb", "1");
  });

  it("draws the header bar for a language icon alone", () => {
    render(<CodeBlock code="x" language="ts" />);
    expect(header()).not.toHaveAttribute("data-floating");
    expect(
      within(header()!).getByRole("img", { name: "typescript" }),
    ).toBeInTheDocument();
  });

  it("floats the buttons with no filename and no language", () => {
    render(<CodeBlock code="x" wrappable fullscreenable />);
    expect(header()).toHaveAttribute("data-floating");
    expect(header()).not.toHaveAttribute("data-ui-bb");
    expect(header()).not.toHaveAttribute("data-ui-w");
    expect(within(header()!).getAllByRole("button")).toHaveLength(3);
  });

  it("floats the buttons for a language that has no icon", () => {
    render(<CodeBlock code="x" language="rust" />);
    expect(header()).toHaveAttribute("data-floating");
    expect(within(header()!).queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders no header at all with nothing to show", () => {
    render(<CodeBlock code="x" copyable={false} />);
    expect(header()).not.toBeInTheDocument();
  });

  it("renders no header for empty code without a filename", () => {
    render(<CodeBlock code="" />);
    expect(header()).not.toBeInTheDocument();
  });

  it("keeps the buttons floating in the fullscreen view", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="x" fullscreenable />);
    await user.click(screen.getByRole("button", { name: "Enter fullscreen" }));

    const dialog = await screen.findByRole("dialog");
    const popupHeader = dialog.querySelector('[data-slot="code-block-header"]');
    expect(popupHeader).toHaveAttribute("data-floating");
  });

  it("lets a long filename truncate while the buttons keep their size", () => {
    render(<CodeBlock code="x" filename="a-very-long-name.ts" wrappable />);
    const name = screen.getByText("a-very-long-name.ts");
    expect(name).toHaveAttribute("data-ui-truncate");
    expect(name).toHaveAttribute("title", "a-very-long-name.ts");
    expect(
      header()!.querySelector('[data-slot="code-block-title"]'),
    ).toHaveAttribute("data-ui-grow");
    expect(
      header()!.querySelector('[data-slot="code-block-actions"]'),
    ).toHaveAttribute("data-ui-flex", "none");
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

  it("calls a CopyButtonProps onClick and still copies", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onCopy = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        onCopy={onCopy}
        CopyButtonProps={{ onClick }}
      />,
    );

    await user.click(screen.getByRole("button", { name: /copy/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(onCopy).toHaveBeenCalledWith("const x = 1;"));
  });

  it("skips the copy when a CopyButtonProps onClick prevents default", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        onCopy={onCopy}
        CopyButtonProps={{ onClick: (event) => event.preventDefault() }}
      />,
    );

    const copyButton = screen.getByRole("button", { name: /copy/i });
    await user.click(copyButton);

    expect(onCopy).not.toHaveBeenCalled();
    expect(copyButton).toHaveAttribute("data-copied", "false");
  });

  it("sets no state or timer when it unmounts while the copy is pending", async () => {
    let resolveCopy = () => {};
    const user = userEvent.setup();
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    try {
      const { unmount } = render(<CodeBlock code="const x = 1;" />);
      // user-event installs its own clipboard on setup, so stub it after.
      const writeText = vi.spyOn(navigator.clipboard, "writeText");
      writeText.mockReturnValue(
        new Promise<void>((resolve) => {
          resolveCopy = resolve;
        }),
      );
      vi.useFakeTimers({ shouldAdvanceTime: true });
      await user.click(screen.getByRole("button", { name: /copy/i }));
      unmount();
      await React.act(async () => resolveCopy());
      expect(vi.getTimerCount()).toBe(0);
      expect(errors).not.toHaveBeenCalled();
    } finally {
      vi.useRealTimers();
      errors.mockRestore();
    }
  });

  it("restarts the copied timer on each copy and clears it on unmount", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      const { unmount } = render(<CodeBlock code="const x = 1;" />);
      const copyButton = screen.getByRole("button", { name: /copy/i });

      await user.click(copyButton);
      await waitFor(() =>
        expect(copyButton).toHaveAttribute("data-copied", "true"),
      );
      await React.act(() => vi.advanceTimersByTime(1500));
      await user.click(copyButton);
      await React.act(() => vi.advanceTimersByTime(1500));
      // The first copy's timer would have reset it by now.
      expect(copyButton).toHaveAttribute("data-copied", "true");

      await React.act(() => vi.advanceTimersByTime(600));
      expect(copyButton).toHaveAttribute("data-copied", "false");

      await user.click(copyButton);
      await waitFor(() =>
        expect(copyButton).toHaveAttribute("data-copied", "true"),
      );
      unmount();
      expect(vi.getTimerCount()).toBe(0);
    } finally {
      vi.useRealTimers();
    }
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
    render(<CodeBlock code="const x = 1;" wrappable />);
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
    render(
      <CodeBlock code="const x = 1;" wrappable onWrapChange={onWrapChange} />,
    );

    await user.click(screen.getByRole("button", { name: /toggle line wrap/i }));

    await waitFor(() => {
      expect(onWrapChange).toHaveBeenCalledWith(true);
    });
  });

  // ============================================
  // FULLSCREEN
  // ============================================

  it("leaves the fullscreen toggle and its dialog out by default", () => {
    render(<CodeBlock code="const x = 1;" />);
    expect(
      document.querySelector('[data-slot="code-block-fullscreen-button"]'),
    ).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="code-block-fullscreen"]'),
    ).not.toBeInTheDocument();
  });

  it("renders the fullscreen toggle when fullscreenable is set", () => {
    render(<CodeBlock code="const x = 1;" fullscreenable />);
    expect(
      document.querySelector('[data-slot="code-block-fullscreen-button"]'),
    ).toBeInTheDocument();
  });

  it("leaves the copy button out of the fullscreen dialog when the code is empty", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="" fullscreenable />);

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));

    const dialog = await screen.findByRole("dialog");
    expect(
      within(dialog).queryByRole("button", { name: /copy/i }),
    ).not.toBeInTheDocument();
    expect(
      within(dialog).getByRole("button", { name: /exit fullscreen/i }),
    ).toBeEnabled();
  });

  it("enters fullscreen when the toggle is pressed", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" fullscreenable />);

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
    render(<CodeBlock code="const x = 1;" fullscreenable />);

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="code-block-fullscreen"]'),
      ).toBeInTheDocument();
    });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="code-block"][data-fullscreen]'),
      ).not.toBeInTheDocument();
    });
    expect(
      document.querySelector('[data-slot="code-block-fullscreen"]'),
    ).not.toBeInTheDocument();
  });

  it("fires onFullscreenChange when toggled", async () => {
    const user = userEvent.setup();
    const onFullscreenChange = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        onFullscreenChange={onFullscreenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));

    await waitFor(() => {
      expect(onFullscreenChange).toHaveBeenCalledWith(true);
    });
  });

  it("renders fullscreen as a modal dialog named by the filename", async () => {
    const user = userEvent.setup();
    render(
      <>
        <button>Outside</button>
        <CodeBlock code="const x = 1;" fullscreenable filename="example.ts" />
      </>,
    );

    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));

    const dialog = await screen.findByRole("dialog");
    // Base UI makes the dialog modal by hiding the page with aria-hidden, as it
    // does for Dialog and Drawer, so no aria-modal is added here.
    const outside = screen.getByRole("button", {
      name: "Outside",
      hidden: true,
    });
    expect(outside.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(
      screen.queryByRole("button", { name: "Outside" }),
    ).not.toBeInTheDocument();
    expect(dialog).toHaveAccessibleName("example.ts");
    expect(dialog).toHaveAttribute("data-slot", "code-block");

    // Closing takes the aria-hidden back off the page.
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(screen.getByRole("button", { name: "Outside" })).toBeInTheDocument();
  });

  it("moves focus into the dialog and returns it to the toggle on Escape", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" fullscreenable />);
    const toggle = screen.getByRole("button", { name: /enter fullscreen/i });

    await user.click(toggle);
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toHaveFocus());

    // One Escape is enough: no focused control has opened a tooltip.
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    // The same element, not a remounted copy, gets focus back.
    expect(toggle).toBeInTheDocument();
    await waitFor(() => expect(toggle).toHaveFocus());
  });

  it("closes on one Escape after a keyboard open", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" fullscreenable />);
    const toggle = screen.getByRole("button", { name: /enter fullscreen/i });

    toggle.focus();
    await user.keyboard("{Enter}");
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toHaveFocus());

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => expect(toggle).toHaveFocus());
  });

  it("reaches the exit button with Tab", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" fullscreenable />);

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    const dialog = await screen.findByRole("dialog");
    await waitFor(() => expect(dialog).toHaveFocus());

    const exit = within(dialog).getByRole("button", {
      name: /exit fullscreen/i,
    });
    for (let i = 0; i < 4 && document.activeElement !== exit; i++) {
      await user.tab();
    }
    expect(exit).toHaveFocus();
  });

  it("leaves id and ref off the fullscreen copy's slot props", async () => {
    const user = userEvent.setup();
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        CopyButtonProps={{ id: "copy", ref }}
      />,
    );
    const inlineCopy = screen.getByRole("button", { name: /copy code/i });

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    const dialog = await screen.findByRole("dialog");

    expect(document.querySelectorAll("#copy")).toHaveLength(1);
    expect(
      within(dialog).getByRole("button", { name: /copy code/i }),
    ).not.toHaveAttribute("id");
    expect(ref.current).toBe(inlineCopy);
  });

  it("renders the backdrop when nested in another dialog", async () => {
    const user = userEvent.setup();
    render(
      <BaseDialog.Root open>
        <BaseDialog.Portal>
          <BaseDialog.Popup aria-label="Outer">
            <CodeBlock code="const x = 1;" fullscreenable />
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>,
    );
    const outer = await screen.findByRole("dialog", { name: "Outer" });

    await user.click(
      within(outer).getByRole("button", { name: /enter fullscreen/i }),
    );
    await screen.findByRole("dialog", { name: "Code block" });

    expect(
      document.querySelector('[data-slot="code-block-backdrop"]'),
    ).toBeInTheDocument();
  });

  it("closes from the exit button and returns focus to the toggle", async () => {
    const user = userEvent.setup();
    const onFullscreenChange = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        onFullscreenChange={onFullscreenChange}
      />,
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
    render(<CodeBlock code="const x = 1;" fullscreenable />);
    const copy = screen.getByRole("button", { name: /copy code/i });

    await user.click(copy);
    await waitFor(() => expect(copy).toHaveAttribute("data-copied", "true"));

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    await screen.findByRole("dialog");
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="code-block"][data-fullscreen]'),
      ).not.toBeInTheDocument();
    });

    expect(copy).toBeInTheDocument();
    expect(copy).toHaveAttribute("data-copied", "true");
  });

  it("closes only the fullscreen dialog on Escape inside another dialog", async () => {
    const user = userEvent.setup();
    render(
      <BaseDialog.Root open>
        <BaseDialog.Portal>
          <BaseDialog.Popup aria-label="Outer">
            <CodeBlock code="const x = 1;" fullscreenable />
          </BaseDialog.Popup>
        </BaseDialog.Portal>
      </BaseDialog.Root>,
    );
    const outer = await screen.findByRole("dialog", { name: "Outer" });

    await user.click(
      within(outer).getByRole("button", { name: /enter fullscreen/i }),
    );
    await screen.findByRole("dialog", { name: "Code block" });

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(
        document.querySelector('[data-slot="code-block"][data-fullscreen]'),
      ).not.toBeInTheDocument();
    });
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

  it("shows the copy and logs the error once when the top-level onCopy throws", async () => {
    const user = userEvent.setup();
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const topLevelError = new Error("top-level failed");
    try {
      render(
        <CodeBlock
          code="const x = 1;"
          onCopy={() => {
            throw topLevelError;
          }}
        />,
      );

      await user.click(screen.getByRole("button", { name: "Copy code" }));

      expect(
        await screen.findByRole("button", { name: "Copied" }),
      ).toHaveAttribute("data-copied", "true");
      await waitFor(() =>
        expect(errors).toHaveBeenCalledWith("onCopy threw:", topLevelError),
      );
      // Logged as a handler error, not as a failed copy.
      expect(errors).toHaveBeenCalledTimes(1);
    } finally {
      errors.mockRestore();
    }
  });

  it("runs no onCopy and shows no copy when the clipboard write fails", async () => {
    const user = userEvent.setup();
    const errors = vi.spyOn(console, "error").mockImplementation(() => {});
    const onCopy = vi.fn();
    try {
      render(<CodeBlock code="const x = 1;" onCopy={onCopy} />);
      // user-event installs its own clipboard on setup, so stub it after.
      const writeText = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockRejectedValue(new Error("denied"));

      const copyButton = screen.getByRole("button", { name: "Copy code" });
      await user.click(copyButton);

      await waitFor(() =>
        expect(errors).toHaveBeenCalledWith(
          "Failed to copy code:",
          expect.any(Error),
        ),
      );
      expect(writeText).toHaveBeenCalledWith("const x = 1;");
      expect(onCopy).not.toHaveBeenCalled();
      expect(copyButton).toHaveAttribute("data-copied", "false");
      expect(copyButton).toHaveAccessibleName("Copy code");
    } finally {
      errors.mockRestore();
    }
  });
});

describe("CodeBlock parts composed by hand", () => {
  it("names each button part rendered without CodeBlock", () => {
    render(
      <>
        <CodeBlockCopyButton code="const x = 1;" />
        <CodeBlockWrapButton />
        <CodeBlockFullscreenButton />
      </>,
    );

    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toggle line wrap" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enter fullscreen" }),
    ).toBeInTheDocument();
  });

  it("renames the copy button part to Copied after a copy", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(<CodeBlockCopyButton code="const x = 1;" onCopy={onCopy} />);

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(
      await screen.findByRole("button", { name: "Copied" }),
    ).toHaveAttribute("data-copied", "true");
    expect(onCopy).toHaveBeenCalledWith("const x = 1;");
  });

  it("names the fullscreen button part by its pressed state", () => {
    render(<CodeBlockFullscreenButton pressed />);

    expect(
      screen.getByRole("button", { name: "Exit fullscreen" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("names the expand toggle part by its expanded state", () => {
    const { rerender } = render(<CodeBlockExpandToggle />);

    const toggle = screen.getByRole("button", { name: "Show more" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(toggle).toHaveAttribute("data-slot", "code-block-expand-toggle");

    rerender(<CodeBlockExpandToggle expanded />);
    expect(screen.getByRole("button", { name: "Show less" })).toHaveAttribute(
      "aria-expanded",
      "true",
    );
  });

  it("labels the expand toggle part with expandLabel and collapseLabel", () => {
    const { rerender } = render(
      <CodeBlockExpandToggle expandLabel="More" collapseLabel="Less" />,
    );
    expect(screen.getByRole("button", { name: "More" })).toBeInTheDocument();

    rerender(
      <CodeBlockExpandToggle
        expanded
        expandLabel="More"
        collapseLabel="Less"
      />,
    );
    expect(screen.getByRole("button", { name: "Less" })).toBeInTheDocument();
  });

  it("asks for the opposite state when the expand toggle part is pressed", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    const { rerender } = render(
      <CodeBlockExpandToggle onExpandedChange={onExpandedChange} />,
    );

    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(onExpandedChange).toHaveBeenLastCalledWith(true);

    rerender(
      <CodeBlockExpandToggle expanded onExpandedChange={onExpandedChange} />,
    );
    await user.click(screen.getByRole("button", { name: "Show less" }));
    expect(onExpandedChange).toHaveBeenLastCalledWith(false);
  });

  it("runs the expand toggle part's onClick, and skips the change when prevented", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    const onClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    render(
      <CodeBlockExpandToggle
        onClick={onClick}
        onExpandedChange={onExpandedChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onExpandedChange).not.toHaveBeenCalled();
  });

  it("runs the expand toggle part's onClick and then asks for the change", async () => {
    const user = userEvent.setup();
    const onExpandedChange = vi.fn();
    const onClick = vi.fn();
    render(
      <CodeBlockExpandToggle
        onClick={onClick}
        onExpandedChange={onExpandedChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Show more" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onExpandedChange).toHaveBeenCalledWith(true);
  });

  it("renders a header part with its filename, language icon and buttons", () => {
    render(
      <CodeBlockHeader
        filename="example.ts"
        language="ts"
        code="const x = 1;"
        wrappable
        fullscreenable
      />,
    );

    const header = document.querySelector<HTMLElement>(
      '[data-slot="code-block-header"]',
    )!;
    expect(within(header).getByText("example.ts")).toBeInTheDocument();
    expect(
      within(header).getByRole("img", { name: "typescript" }),
    ).toBeInTheDocument();
    expect(
      within(header).getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
    expect(
      within(header).getByRole("button", { name: "Toggle line wrap" }),
    ).toBeInTheDocument();
    expect(
      within(header).getByRole("button", { name: "Enter fullscreen" }),
    ).toBeInTheDocument();
  });

  it("renders a content part's raw code, one line per line, without html", () => {
    render(<CodeBlockContent code={"const a = 1;\nconst b = 2;"} />);

    const content = document.querySelector('[data-slot="code-block-content"]')!;
    const lines = content.querySelectorAll(".line");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toHaveTextContent("const a = 1;");
    expect(lines[1]).toHaveTextContent("const b = 2;");
  });
});

describe("CodeBlock HeaderProps precedence", () => {
  beforeEach(() => {
    mockWriteText.mockClear();
    mockWriteText.mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: mockWriteText },
      writable: true,
      configurable: true,
    });
  });

  // Untyped on purpose: the types reject these keys, so this pins what a
  // caller without the types gets.
  const untyped = (slot: Record<string, unknown>) =>
    slot as CodeBlockProps["HeaderProps"];

  it("lets the props CodeBlock sets on its header win over HeaderProps", () => {
    render(
      <CodeBlock
        code="const x = 1;"
        filename="top-level.ts"
        wrappable
        fullscreenable
        HeaderProps={untyped({
          filename: "slot.ts",
          copyable: false,
          wrappable: false,
          fullscreenable: false,
        })}
      />,
    );

    expect(screen.getByText("top-level.ts")).toBeInTheDocument();
    expect(screen.queryByText("slot.ts")).not.toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Toggle line wrap" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enter fullscreen" }),
    ).toBeInTheDocument();
  });

  it("keeps the top-level onCopy when HeaderProps carries its own CopyButtonProps", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        onCopy={onCopy}
        HeaderProps={untyped({ CopyButtonProps: { "aria-label": "Slot" } })}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() => expect(onCopy).toHaveBeenCalledWith("const x = 1;"));
  });

  it("still applies the header props CodeBlock leaves to HeaderProps", () => {
    render(
      <CodeBlock
        code="const x = 1;"
        HeaderProps={{ gap: 6, className: "custom-header" }}
      />,
    );

    const header = document.querySelector('[data-slot="code-block-header"]');
    expect(header).toHaveAttribute("data-ui-gap", "6");
    expect(header).toHaveClass("custom-header");
  });

  it("copies CodeBlock's code over an untyped CopyButtonProps.code", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        onCopy={onCopy}
        CopyButtonProps={{ code: "hijacked" } as object}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() => expect(onCopy).toHaveBeenCalledWith("const x = 1;"));
  });

  it("runs only the top-level onCopy over an untyped CopyButtonProps.onCopy", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const slotOnCopy = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        onCopy={onCopy}
        CopyButtonProps={{ onCopy: slotOnCopy } as object}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    await waitFor(() =>
      expect(onCopy).toHaveBeenCalledExactlyOnceWith("const x = 1;"),
    );
    expect(slotOnCopy).not.toHaveBeenCalled();
  });

  it("runs no untyped CopyButtonProps.onCopy when no top-level onCopy is given", async () => {
    const user = userEvent.setup();
    const slotOnCopy = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        CopyButtonProps={{ onCopy: slotOnCopy } as object}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Copy code" }));

    expect(
      await screen.findByRole("button", { name: "Copied" }),
    ).toHaveAttribute("data-copied", "true");
    expect(slotOnCopy).not.toHaveBeenCalled();
  });

  it("still enters fullscreen over an untyped FullscreenButtonProps.onPressedChange", async () => {
    const user = userEvent.setup();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        FullscreenButtonProps={{ onPressedChange: () => {} } as object}
      />,
    );

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));

    await waitFor(() =>
      expect(
        document.querySelector('[data-slot="code-block"][data-fullscreen]'),
      ).toBeInTheDocument(),
    );
  });
});

/* Type-level only: `pnpm typecheck` fails if a directive goes unused. */
describe("CodeBlock slot props", () => {
  it("rejects aria-expanded on the expand toggle part, which derives it", () => {
    // A props object, since TypeScript accepts any hyphenated JSX attribute.
    const props: CodeBlockExpandToggleProps = {
      // @ts-expect-error -- `aria-expanded` follows the part's `expanded`
      "aria-expanded": true,
    };
    void props;
  });

  it("rejects every key CodeBlock owns in HeaderProps", () => {
    void (
      <>
        <CodeBlock
          code=""
          // @ts-expect-error -- `filename` is set on CodeBlock itself
          HeaderProps={{ filename: "a.ts" }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `language` is set on CodeBlock itself
          HeaderProps={{ language: "ts" }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `copyable` is set on CodeBlock itself
          HeaderProps={{ copyable: false }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- the copied text is CodeBlock's `code`
          HeaderProps={{ code: "other" }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `wrappable` is set on CodeBlock itself
          HeaderProps={{ wrappable: false }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the wrap state
          HeaderProps={{ wrap: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `defaultWrap` is set on CodeBlock itself
          HeaderProps={{ defaultWrap: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `onWrapChange` is set on CodeBlock itself
          HeaderProps={{ onWrapChange: () => {} }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `fullscreenable` is set on CodeBlock itself
          HeaderProps={{ fullscreenable: false }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the fullscreen state
          HeaderProps={{ fullscreen: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `onFullscreenChange` is set on CodeBlock itself
          HeaderProps={{ onFullscreenChange: () => {} }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `LanguageIconProps` is set on CodeBlock itself
          HeaderProps={{ LanguageIconProps: {} }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `WrapButtonProps` is set on CodeBlock itself
          HeaderProps={{ WrapButtonProps: {} }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `CopyButtonProps` is set on CodeBlock itself
          HeaderProps={{ CopyButtonProps: {} }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `FullscreenButtonProps` is set on CodeBlock itself
          HeaderProps={{ FullscreenButtonProps: {} }}
        />
      </>
    );
  });

  it("rejects the code and toggle state CodeBlock owns in the button slots", () => {
    void (
      <>
        <CodeBlock
          code=""
          // @ts-expect-error -- the copied text is CodeBlock's `code`
          CopyButtonProps={{ code: "other" }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `onCopy` is set on CodeBlock itself
          CopyButtonProps={{ onCopy: () => {} }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the wrap state
          WrapButtonProps={{ pressed: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the wrap state
          WrapButtonProps={{ defaultPressed: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the wrap state
          WrapButtonProps={{ onPressedChange: () => {} }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the fullscreen state
          FullscreenButtonProps={{ pressed: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the fullscreen state
          FullscreenButtonProps={{ defaultPressed: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the fullscreen state
          FullscreenButtonProps={{ onPressedChange: () => {} }}
        />
      </>
    );
  });
});
