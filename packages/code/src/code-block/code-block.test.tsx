import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Dialog } from "@uiid/overlays";
import * as React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";

import { useHighlight } from "../highlighter/highlighter.hooks";
import { CodeBlock } from "./code-block";
import { Composed, Controlled } from "./code-block.examples";
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

  it("draws the header bar for children alone", () => {
    render(
      <CodeBlockHeader code="x" copyable={false}>
        <span>Preview</span>
      </CodeBlockHeader>,
    );
    expect(header()).not.toHaveAttribute("data-floating");
    expect(header()).toHaveAttribute("data-ui-bb", "1");
    expect(within(header()!).getByText("Preview")).toBeInTheDocument();
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

  it("floats the buttons for a known language with hideLanguageIcon, and still highlights it", () => {
    vi.mocked(useHighlight).mockClear();
    render(<CodeBlock code="x" language="ts" hideLanguageIcon />);

    expect(header()).toHaveAttribute("data-floating");
    expect(header()).not.toHaveAttribute("data-ui-bb");
    expect(within(header()!).queryByRole("img")).not.toBeInTheDocument();
    expect(within(header()!).getAllByRole("button")).toHaveLength(1);
    expect(useHighlight).toHaveBeenLastCalledWith(
      "x",
      "ts",
      expect.any(Object),
    );
  });

  it("keeps the filename bar with hideLanguageIcon, without the icon", () => {
    render(
      <CodeBlock code="x" language="ts" filename="a.ts" hideLanguageIcon />,
    );

    expect(header()).not.toHaveAttribute("data-floating");
    expect(within(header()!).getByText("a.ts")).toBeInTheDocument();
    expect(within(header()!).queryByRole("img")).not.toBeInTheDocument();
  });

  it("hides the icon in the fullscreen view too", async () => {
    const user = userEvent.setup();
    render(
      <CodeBlock code="x" language="ts" hideLanguageIcon fullscreenable />,
    );
    await user.click(screen.getByRole("button", { name: "Enter fullscreen" }));

    const dialog = await screen.findByRole("dialog");
    const popupHeader = dialog.querySelector('[data-slot="code-block-header"]');
    expect(popupHeader).toHaveAttribute("data-floating");
    expect(dialog.querySelector('[data-slot="language-icon"]')).toBeNull();
  });

  // ============================================
  // NOTATIONS
  // ============================================

  it("runs notations by default", () => {
    vi.mocked(useHighlight).mockClear();
    render(<CodeBlock code="x" />);
    expect(useHighlight).toHaveBeenLastCalledWith(
      "x",
      "typescript",
      expect.not.objectContaining({ notations: false }),
    );
  });

  it("forwards notations={false} to the highlighter", () => {
    vi.mocked(useHighlight).mockClear();
    render(<CodeBlock code="x" notations={false} />);
    expect(useHighlight).toHaveBeenLastCalledWith(
      "x",
      "typescript",
      expect.objectContaining({ notations: false }),
    );
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

  it("renders the fullscreen view in the UIID dialog viewport", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" fullscreenable />);

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    const dialog = await screen.findByRole("dialog");

    const viewport = dialog.parentElement!;
    expect(viewport).toHaveAttribute("data-slot", "dialog-viewport");
    expect(viewport.parentElement).toHaveAttribute(
      "data-slot",
      "code-block-fullscreen",
    );
    // The popup is the frame itself, with the block's parts as its children.
    expect(
      dialog.querySelector('[data-slot="card-container"]'),
    ).not.toBeInTheDocument();
    expect(dialog.firstElementChild).toHaveAttribute(
      "data-slot",
      "code-block-header",
    );
  });

  it("renders the backdrop when nested in another dialog", async () => {
    const user = userEvent.setup();
    render(
      <Dialog open title="Outer">
        <CodeBlock code="const x = 1;" fullscreenable />
      </Dialog>,
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

  it("takes focus inside another dialog and returns it to the toggle on close", async () => {
    const user = userEvent.setup();
    render(
      <Dialog open title="Outer">
        <CodeBlock code="const x = 1;" fullscreenable />
      </Dialog>,
    );
    const outer = await screen.findByRole("dialog", { name: "Outer" });
    const toggle = within(outer).getByRole("button", {
      name: /enter fullscreen/i,
    });

    await user.click(toggle);
    const fullscreen = await screen.findByRole("dialog", {
      name: "Code block",
    });
    // Focus has left the toggle, so the check below cannot pass by staying.
    await waitFor(() => expect(fullscreen).toHaveFocus());
    expect(toggle).not.toHaveFocus();

    await user.click(
      within(fullscreen).getByRole("button", { name: /exit fullscreen/i }),
    );
    await waitFor(() => {
      expect(
        screen.queryByRole("dialog", { name: "Code block" }),
      ).not.toBeInTheDocument();
    });
    expect(screen.getByRole("dialog", { name: "Outer" })).toBeInTheDocument();
    await waitFor(() => expect(toggle).toHaveFocus());
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

  it("shares wrap between the inline block and the fullscreen view", async () => {
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" wrappable fullscreenable />);
    const inline = document.querySelector('[data-slot="code-block-content"]');

    await user.click(screen.getByRole("button", { name: /toggle line wrap/i }));
    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));
    const dialog = await screen.findByRole("dialog");
    const content = dialog.querySelector('[data-slot="code-block-content"]');
    expect(content).toHaveAttribute("data-wrap", "true");

    await user.click(
      within(dialog).getByRole("button", { name: /toggle line wrap/i }),
    );
    await waitFor(() => expect(content).not.toHaveAttribute("data-wrap"));
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(inline).not.toHaveAttribute("data-wrap");
  });

  it("closes only the fullscreen dialog on Escape inside another dialog", async () => {
    const user = userEvent.setup();
    // Uncontrolled, so an Escape reaching the outer dialog would close it.
    render(
      <Dialog defaultOpen title="Outer">
        <CodeBlock code="const x = 1;" fullscreenable />
      </Dialog>,
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

  it("keeps the expand toggle part's aria-expanded over an untyped one", () => {
    const untyped = { "aria-expanded": true } as object;
    render(<CodeBlockExpandToggle {...untyped} />);

    expect(screen.getByRole("button", { name: "Show more" })).toHaveAttribute(
      "aria-expanded",
      "false",
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

  it("rejects the language CodeBlock owns in LanguageIconProps", () => {
    void (
      <CodeBlock
        code=""
        // @ts-expect-error -- `language` is set on CodeBlock itself
        LanguageIconProps={{ language: "ts" }}
      />
    );
  });

  it("rejects every key CodeBlock owns in ContentProps", () => {
    void (
      <>
        <CodeBlock
          code=""
          // @ts-expect-error -- the highlighted markup is CodeBlock's `html`
          ContentProps={{ html: "<pre></pre>" }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- the code is CodeBlock's `code`
          ContentProps={{ code: "other" }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `showLineNumbers` is set on CodeBlock itself
          ContentProps={{ showLineNumbers: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the wrap state
          ContentProps={{ wrap: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock renders the code as the content
          ContentProps={{ children: "other" }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock renders the code as the content
          ContentProps={{ dangerouslySetInnerHTML: { __html: "" } }}
        />
      </>
    );
  });

  it("rejects every key CodeBlock owns in ExpandToggleProps", () => {
    void (
      <>
        <CodeBlock
          code=""
          // @ts-expect-error -- CodeBlock owns the expanded state
          ExpandToggleProps={{ expanded: true }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `onExpandedChange` is set on CodeBlock itself
          ExpandToggleProps={{ onExpandedChange: () => {} }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `expandLabel` is set on CodeBlock itself
          ExpandToggleProps={{ expandLabel: "More" }}
        />
        <CodeBlock
          code=""
          // @ts-expect-error -- `collapseLabel` is set on CodeBlock itself
          ExpandToggleProps={{ collapseLabel: "Less" }}
        />
      </>
    );
    // A props object, since TypeScript accepts any hyphenated JSX attribute.
    const slot: CodeBlockProps["ExpandToggleProps"] = {
      // @ts-expect-error -- `aria-expanded` follows CodeBlock's `expanded`
      "aria-expanded": true,
    };
    void slot;
  });
});

describe("CodeBlock examples", () => {
  it("builds a block from the exported parts without CodeBlock", async () => {
    const user = userEvent.setup();
    render(<Composed />);

    expect(
      document.querySelector('[data-slot="code-block"]'),
    ).not.toBeInTheDocument();
    const header = document.querySelector<HTMLElement>(
      '[data-slot="code-block-header"]',
    )!;
    expect(within(header).getByText("counter.tsx")).toBeInTheDocument();
    expect(
      within(header).getByRole("button", { name: "Copy code" }),
    ).toBeInTheDocument();
    const content = document.querySelector('[data-slot="code-block-content"]');
    expect(content).toHaveTextContent("export function Counter()");
    expect(content).not.toHaveAttribute("data-wrap");

    await user.click(
      within(header).getByRole("button", { name: "Toggle line wrap" }),
    );
    expect(content).toHaveAttribute("data-wrap", "true");
  });

  it("drives a controlled block from outside", async () => {
    const user = userEvent.setup();
    render(<Controlled />);
    const content = () =>
      document.querySelector('[data-slot="code-block-content"]');
    expect(content()).not.toHaveAttribute("data-wrap");

    await user.click(screen.getByRole("button", { name: "Wrap lines" }));
    expect(content()).toHaveAttribute("data-wrap", "true");

    await user.click(screen.getByRole("button", { name: "Open fullscreen" }));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });
});

describe("CodeBlock ContentProps", () => {
  const contents = () =>
    document.querySelectorAll<HTMLElement>('[data-slot="code-block-content"]');

  it("passes ContentProps to the content part", () => {
    render(
      <CodeBlock
        code="const x = 1;"
        ContentProps={{ id: "code", className: "mine", p: 2 }}
      />,
    );

    const content = contents()[0]!;
    expect(content).toHaveAttribute("id", "code");
    expect(content).toHaveClass("mine");
    expect(content.className).not.toBe("mine");
  });

  it("passes ContentProps to the fullscreen content without its id", async () => {
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        fullscreen
        ContentProps={{ id: "code", className: "mine" }}
      />,
    );
    await screen.findByRole("dialog");

    const [inline, fullscreen] = contents();
    expect(inline).toHaveAttribute("id", "code");
    expect(fullscreen).toHaveClass("mine");
    expect(fullscreen).not.toHaveAttribute("id");
  });

  it("keeps CodeBlock's code, line numbers and wrap over an untyped ContentProps", () => {
    render(
      <CodeBlock
        code="const x = 1;"
        showLineNumbers
        wrap
        ContentProps={
          {
            html: "<pre><code>slot</code></pre>",
            code: "slot",
            showLineNumbers: false,
            wrap: false,
            // StackProps types `data-*`, so `object` alone is not assignable.
          } as CodeBlockProps["ContentProps"]
        }
      />,
    );

    const content = contents()[0]!;
    expect(content).toHaveTextContent("const x = 1;");
    expect(content).not.toHaveTextContent("slot");
    expect(content).toHaveAttribute("data-line-numbers", "true");
    expect(content).toHaveAttribute("data-wrap", "true");
  });

  it("keeps the highlighted code over an untyped ContentProps.dangerouslySetInnerHTML", () => {
    render(
      <CodeBlock
        code="const x = 1;"
        html={`<pre class="shiki"><code>const x = 1;</code></pre>`}
        ContentProps={
          {
            dangerouslySetInnerHTML: { __html: "<pre>slot</pre>" },
          } as CodeBlockProps["ContentProps"]
        }
      />,
    );

    const content = contents()[0]!;
    expect(content.querySelector("pre.shiki")).toHaveTextContent(
      "const x = 1;",
    );
    expect(content).not.toHaveTextContent("slot");
  });

  it("keeps the highlighted code over an untyped ContentProps.children", () => {
    render(
      <CodeBlock
        code="const x = 1;"
        html={`<pre class="shiki"><code>const x = 1;</code></pre>`}
        ContentProps={{ children: "slot" } as CodeBlockProps["ContentProps"]}
      />,
    );

    const content = contents()[0]!;
    expect(content.querySelector("pre.shiki")).toHaveTextContent(
      "const x = 1;",
    );
    expect(content).not.toHaveTextContent("slot");
  });
});

describe("CodeBlock controlled state", () => {
  const content = () =>
    document.querySelector('[data-slot="code-block-content"]');
  const wrapButton = () =>
    screen.getByRole("button", { name: /toggle line wrap/i });

  it("holds a controlled wrap when onWrapChange does nothing", async () => {
    const user = userEvent.setup();
    const onWrapChange = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        wrappable
        wrap={false}
        onWrapChange={onWrapChange}
      />,
    );

    await user.click(wrapButton());

    expect(onWrapChange).toHaveBeenCalledTimes(1);
    expect(onWrapChange).toHaveBeenCalledWith(true);
    expect(content()).not.toHaveAttribute("data-wrap");
    expect(wrapButton()).toHaveAttribute("aria-pressed", "false");
  });

  it("follows a controlled wrap switched from outside", () => {
    const onWrapChange = vi.fn();
    const { rerender } = render(
      <CodeBlock
        code="const x = 1;"
        wrappable
        wrap={false}
        onWrapChange={onWrapChange}
      />,
    );
    expect(content()).not.toHaveAttribute("data-wrap");

    rerender(
      <CodeBlock
        code="const x = 1;"
        wrappable
        wrap
        onWrapChange={onWrapChange}
      />,
    );

    expect(content()).toHaveAttribute("data-wrap", "true");
    expect(wrapButton()).toHaveAttribute("aria-pressed", "true");
    expect(onWrapChange).not.toHaveBeenCalled();
  });

  it("lets a controlled wrap win over defaultWrap", () => {
    render(<CodeBlock code="const x = 1;" wrap={false} defaultWrap />);
    expect(content()).not.toHaveAttribute("data-wrap");
  });

  it("fires onWrapChange once per press with the next value, uncontrolled", async () => {
    const user = userEvent.setup();
    const onWrapChange = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        wrappable
        defaultWrap
        onWrapChange={onWrapChange}
      />,
    );

    await user.click(wrapButton());
    expect(onWrapChange).toHaveBeenCalledTimes(1);
    expect(onWrapChange).toHaveBeenLastCalledWith(false);
    expect(content()).not.toHaveAttribute("data-wrap");

    await user.click(wrapButton());
    expect(onWrapChange).toHaveBeenCalledTimes(2);
    expect(onWrapChange).toHaveBeenLastCalledWith(true);
    expect(content()).toHaveAttribute("data-wrap", "true");
  });

  it("applies a controlled wrap to the fullscreen view too", async () => {
    render(<CodeBlock code="const x = 1;" fullscreenable fullscreen wrap />);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("data-wrap", "true");
    expect(
      dialog.querySelector('[data-slot="code-block-content"]'),
    ).toHaveAttribute("data-wrap", "true");
  });

  it("opens a controlled fullscreen view on mount", async () => {
    render(<CodeBlock code="const x = 1;" fullscreenable fullscreen />);

    expect(await screen.findByRole("dialog")).toHaveAttribute(
      "data-fullscreen",
    );
  });

  it("asks to enter fullscreen without opening a controlled view", async () => {
    const user = userEvent.setup();
    const onFullscreenChange = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        fullscreen={false}
        onFullscreenChange={onFullscreenChange}
      />,
    );

    await user.click(screen.getByRole("button", { name: /enter fullscreen/i }));

    await waitFor(() => expect(onFullscreenChange).toHaveBeenCalledWith(true));
    expect(onFullscreenChange).toHaveBeenCalledTimes(1);
    // Give a wrongly opening view the time an uncontrolled one takes to mount.
    await expect(
      screen.findByRole("dialog", {}, { timeout: 200 }),
    ).rejects.toThrow();
  });

  it("keeps a controlled fullscreen view open on Escape and asks to close", async () => {
    const user = userEvent.setup();
    const onFullscreenChange = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        fullscreen
        onFullscreenChange={onFullscreenChange}
      />,
    );
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    expect(onFullscreenChange).toHaveBeenCalledTimes(1);
    expect(onFullscreenChange).toHaveBeenCalledWith(false);
    // Base UI sets `data-closed` as soon as a close starts.
    expect(screen.getByRole("dialog")).not.toHaveAttribute("data-closed");
  });

  it("keeps a controlled fullscreen view open on a backdrop press and asks to close", async () => {
    const user = userEvent.setup();
    const onFullscreenChange = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        fullscreen
        onFullscreenChange={onFullscreenChange}
      />,
    );
    await screen.findByRole("dialog");

    await user.click(
      document.querySelector<HTMLElement>('[data-slot="code-block-backdrop"]')!,
    );

    expect(onFullscreenChange).toHaveBeenCalledTimes(1);
    expect(onFullscreenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("dialog")).not.toHaveAttribute("data-closed");
  });

  it("returns focus to an outside opener when a controlled view closes", async () => {
    const user = userEvent.setup();
    const Opener = () => {
      const [fullscreen, setFullscreen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setFullscreen(true)}>
            Open
          </button>
          <CodeBlock
            code="const x = 1;"
            fullscreenable
            fullscreen={fullscreen}
            onFullscreenChange={setFullscreen}
          />
        </>
      );
    };
    render(<Opener />);
    const opener = screen.getByRole("button", { name: "Open" });

    await user.click(opener);
    const dialog = await screen.findByRole("dialog");
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    );

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("keeps a controlled fullscreen view open on the exit button and asks to close", async () => {
    const user = userEvent.setup();
    const onFullscreenChange = vi.fn();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        fullscreen
        onFullscreenChange={onFullscreenChange}
      />,
    );
    const dialog = await screen.findByRole("dialog");

    await user.click(
      within(dialog).getByRole("button", { name: /exit fullscreen/i }),
    );

    expect(onFullscreenChange).toHaveBeenCalledTimes(1);
    expect(onFullscreenChange).toHaveBeenCalledWith(false);
    expect(screen.getByRole("dialog")).not.toHaveAttribute("data-closed");
  });

  it("opens and closes a controlled fullscreen view switched from outside", async () => {
    const onFullscreenChange = vi.fn();
    const block = (fullscreen: boolean) => (
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        fullscreen={fullscreen}
        onFullscreenChange={onFullscreenChange}
      />
    );
    const { rerender } = render(block(false));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    rerender(block(true));
    expect(await screen.findByRole("dialog")).toBeInTheDocument();

    rerender(block(false));
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onFullscreenChange).not.toHaveBeenCalled();
  });

  it("closes a controlled fullscreen view when the callback follows Escape", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [fullscreen, setFullscreen] = React.useState(true);
      return (
        <CodeBlock
          code="const x = 1;"
          fullscreenable
          fullscreen={fullscreen}
          onFullscreenChange={setFullscreen}
        />
      );
    };
    render(<Controlled />);
    await screen.findByRole("dialog");

    await user.keyboard("{Escape}");

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });

  it("fires onFullscreenChange once per action, uncontrolled", async () => {
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
    await screen.findByRole("dialog");
    expect(onFullscreenChange).toHaveBeenCalledTimes(1);
    expect(onFullscreenChange).toHaveBeenLastCalledWith(true);

    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(onFullscreenChange).toHaveBeenCalledTimes(2);
    expect(onFullscreenChange).toHaveBeenLastCalledWith(false);
  });

  it("mounts no fullscreen view for a controlled fullscreen without fullscreenable", () => {
    render(<CodeBlock code="const x = 1;" fullscreen />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      document.querySelector('[data-slot="code-block-fullscreen"]'),
    ).not.toBeInTheDocument();
  });
});

describe("CodeBlock fullscreen focus return", () => {
  /** The inline block's toggle, not the fullscreen copy's. */
  const inlineToggle = () =>
    document.querySelector<HTMLElement>(
      '[data-slot="code-block"]:not([data-fullscreen]) [data-slot="code-block-fullscreen-button"]',
    )!;

  const closeWithEscape = async (user: ReturnType<typeof userEvent.setup>) => {
    await user.keyboard("{Escape}");
    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  };

  it("returns focus to the toggle when the view opened on mount", async () => {
    const user = userEvent.setup();
    const Block = () => {
      const [fullscreen, setFullscreen] = React.useState(true);
      return (
        <CodeBlock
          code="const x = 1;"
          fullscreenable
          fullscreen={fullscreen}
          onFullscreenChange={setFullscreen}
        />
      );
    };
    expect(document.activeElement).toBe(document.body);
    render(<Block />);
    await screen.findByRole("dialog");

    await closeWithEscape(user);
    await waitFor(() => expect(inlineToggle()).toHaveFocus());
  });

  it("returns focus to the toggle when a click left focus on the body", async () => {
    // Safari does not focus a clicked button, so the body had focus at open.
    const user = userEvent.setup();
    render(<CodeBlock code="const x = 1;" fullscreenable />);
    const toggle = inlineToggle();
    expect(document.activeElement).toBe(document.body);

    fireEvent.click(toggle);
    await screen.findByRole("dialog");

    await closeWithEscape(user);
    await waitFor(() => expect(toggle).toHaveFocus());
  });

  it("returns focus to the toggle when an outside opener left focus on the body", async () => {
    const user = userEvent.setup();
    const Opener = () => {
      const [fullscreen, setFullscreen] = React.useState(false);
      return (
        <>
          <button type="button" onClick={() => setFullscreen(true)}>
            Open
          </button>
          <CodeBlock
            code="const x = 1;"
            fullscreenable
            fullscreen={fullscreen}
            onFullscreenChange={setFullscreen}
          />
        </>
      );
    };
    render(<Opener />);

    fireEvent.click(screen.getByRole("button", { name: "Open" }));
    // fireEvent does not focus the button, as Safari does not.
    expect(document.activeElement).toBe(document.body);
    await screen.findByRole("dialog");

    await closeWithEscape(user);
    await waitFor(() => expect(inlineToggle()).toHaveFocus());
  });

  it("returns focus to the toggle when the opener is removed while the view is open", async () => {
    const user = userEvent.setup();
    let focusedAtClick: Element | null = null;
    const Opener = ({ showOpener }: { showOpener: boolean }) => {
      const [fullscreen, setFullscreen] = React.useState(false);
      return (
        <>
          {showOpener && (
            <button
              type="button"
              onClick={() => {
                focusedAtClick = document.activeElement;
                setFullscreen(true);
              }}
            >
              Open
            </button>
          )}
          <CodeBlock
            code="const x = 1;"
            fullscreenable
            fullscreen={fullscreen}
            onFullscreenChange={setFullscreen}
          />
        </>
      );
    };
    const { rerender } = render(<Opener showOpener />);
    const opener = screen.getByRole("button", { name: "Open" });

    // user.click focuses the opener, so it is what had focus at open.
    await user.click(opener);
    expect(focusedAtClick).toBe(opener);
    await screen.findByRole("dialog");

    rerender(<Opener showOpener={false} />);
    expect(opener).not.toBeInTheDocument();

    await closeWithEscape(user);
    await waitFor(() => expect(inlineToggle()).toHaveFocus());
  });

  it("returns focus to a focused opener on a second open after a fallback", async () => {
    const user = userEvent.setup();
    let focusedAtClick: Element | null = null;
    const Opener = () => {
      const [fullscreen, setFullscreen] = React.useState(false);
      return (
        <>
          <button
            type="button"
            onClick={() => {
              focusedAtClick = document.activeElement;
              setFullscreen(true);
            }}
          >
            Open
          </button>
          <CodeBlock
            code="const x = 1;"
            fullscreenable
            fullscreen={fullscreen}
            onFullscreenChange={setFullscreen}
          />
        </>
      );
    };
    render(<Opener />);
    const opener = screen.getByRole("button", { name: "Open" });

    // First open with the body focused: the toggle takes focus back.
    fireEvent.click(opener);
    expect(focusedAtClick).toBe(document.body);
    await screen.findByRole("dialog");
    await closeWithEscape(user);
    await waitFor(() => expect(inlineToggle()).toHaveFocus());

    // Second open from the focused opener: focus returns to it, not the toggle.
    await user.click(opener);
    expect(focusedAtClick).toBe(opener);
    await screen.findByRole("dialog");
    await closeWithEscape(user);
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("returns focus to the caller's finalFocus target", async () => {
    const user = userEvent.setup();
    const Opener = () => {
      const [fullscreen, setFullscreen] = React.useState(false);
      const openerRef = React.useRef<HTMLButtonElement>(null);
      return (
        <>
          <button
            ref={openerRef}
            type="button"
            onClick={() => setFullscreen(true)}
          >
            Open
          </button>
          <CodeBlock
            code="const x = 1;"
            fullscreenable
            fullscreen={fullscreen}
            onFullscreenChange={setFullscreen}
            finalFocus={openerRef}
          />
        </>
      );
    };
    render(<Opener />);
    const opener = screen.getByRole("button", { name: "Open" });

    // A click that leaves focus on the body, as in Safari.
    fireEvent.click(opener);
    expect(document.activeElement).toBe(document.body);
    await screen.findByRole("dialog");

    await closeWithEscape(user);
    await waitFor(() => expect(opener).toHaveFocus());
  });

  it("passes a finalFocus function through, called with the close type", async () => {
    const user = userEvent.setup();
    const finalFocus = vi.fn(() => false as const);
    render(
      <CodeBlock code="const x = 1;" fullscreenable finalFocus={finalFocus} />,
    );
    const toggle = inlineToggle();

    await user.click(toggle);
    await screen.findByRole("dialog");
    await closeWithEscape(user);

    expect(finalFocus).toHaveBeenCalledWith("keyboard");
    // `false` moves no focus: it was inside the closed view, so the body has it.
    expect(document.activeElement).toBe(document.body);
    expect(toggle).not.toHaveFocus();
  });

  it("keeps a caller's ref on the inline fullscreen button", async () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(
      <CodeBlock
        code="const x = 1;"
        fullscreenable
        fullscreen
        FullscreenButtonProps={{ ref }}
      />,
    );
    await screen.findByRole("dialog");

    expect(ref.current).toBe(inlineToggle());
  });
});
