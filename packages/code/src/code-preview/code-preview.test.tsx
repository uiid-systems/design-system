import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CollapsibleRoot } from "@uiid/interactive";
import { useState } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useHighlight } from "../highlighter/highlighter.hooks";
import { CodePreview } from "./code-preview";
import * as Examples from "./code-preview.examples";
import type { CodePreviewProps } from "./code-preview.types";
import {
  CodePreviewBar,
  CodePreviewCanvas,
  CodePreviewPanel,
  CodePreviewResetButton,
  CodePreviewTrigger,
} from "./subcomponents";

vi.mock("../highlighter/highlighter.hooks", () => ({
  useHighlight: vi.fn(
    (code: string, _language?: string, options?: { enabled?: boolean }) => ({
      html:
        options?.enabled === false
          ? ""
          : `<pre><code><span class="line">hl:${code}</span></code></pre>`,
      loading: false,
      error: null,
    }),
  ),
}));

const mockUseHighlight = vi.mocked(useHighlight);

const CODE = "const answer = 42;";

const lastEnabled = () =>
  mockUseHighlight.mock.calls.at(-1)?.[2]?.enabled ?? true;

const trigger = () =>
  screen.getByRole("button", { name: /^(show|hide) code$/i });

describe("CodePreview", () => {
  beforeEach(() => {
    mockUseHighlight.mockClear();
  });

  describe("structure", () => {
    it("renders one frame with a canvas, a bar and a closed panel", () => {
      const { container } = render(
        <CodePreview code={CODE}>
          <span>Example</span>
        </CodePreview>,
      );
      const root = container.querySelector('[data-slot="code-preview"]');
      expect(root).toBeInTheDocument();

      const canvas = root!.querySelector('[data-slot="code-preview-canvas"]');
      expect(canvas).toHaveTextContent("Example");

      const bar = root!.querySelector('[data-slot="code-preview-bar"]');
      expect(bar).toBeInTheDocument();
      expect(bar).toContainElement(trigger());
      expect(bar).toContainElement(
        screen.getByRole("button", { name: "Copy code" }),
      );

      // Closed by default, so the code is not in the DOM.
      expect(trigger()).toHaveAttribute("aria-expanded", "false");
      expect(screen.queryByText(CODE)).not.toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="code-block-content"]'),
      ).not.toBeInTheDocument();
    });

    it("puts the trigger before the copy button in the bar", () => {
      render(<CodePreview code={CODE}>x</CodePreview>);
      const copy = screen.getByRole("button", { name: "Copy code" });
      expect(
        trigger().compareDocumentPosition(copy) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    });

    it("keeps the canvas and the panel as siblings under the root", async () => {
      const user = userEvent.setup();
      const { container } = render(<CodePreview code={CODE}>x</CodePreview>);
      await user.click(trigger());
      const root = container.querySelector('[data-slot="code-preview"]')!;
      const canvas = root.querySelector('[data-slot="code-preview-canvas"]')!;
      const panel = root.querySelector('[data-slot="code-preview-panel"]')!;
      expect(canvas.parentElement).toBe(root);
      expect(panel.parentElement).toBe(root);
    });

    it("renders the code through CodeBlockContent with no CodeBlock frame or header", async () => {
      const user = userEvent.setup();
      const { container } = render(<CodePreview code={CODE}>x</CodePreview>);
      await user.click(trigger());
      const panel = container.querySelector(
        '[data-slot="code-preview-panel"]',
      )!;
      expect(
        panel.querySelector('[data-slot="code-block-content"]'),
      ).toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="code-block"]'),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="code-block-header"]'),
      ).not.toBeInTheDocument();
    });

    it("renders only the canvas when there is no code", () => {
      const { container } = render(
        <CodePreview>
          <span>Example</span>
        </CodePreview>,
      );
      expect(
        container.querySelector('[data-slot="code-preview-canvas"]'),
      ).toHaveTextContent("Example");
      expect(
        container.querySelector('[data-slot="code-preview-bar"]'),
      ).not.toBeInTheDocument();
      expect(
        container.querySelector('[data-slot="code-preview-panel"]'),
      ).not.toBeInTheDocument();
      expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("treats empty code as no code", () => {
      const { container } = render(<CodePreview code="">x</CodePreview>);
      expect(
        container.querySelector('[data-slot="code-preview-bar"]'),
      ).not.toBeInTheDocument();
    });

    it("spreads root props and merges className", () => {
      const { container } = render(
        <CodePreview code={CODE} id="preview" className="custom">
          x
        </CodePreview>,
      );
      const root = container.querySelector('[data-slot="code-preview"]');
      expect(root).toHaveAttribute("id", "preview");
      expect(root).toHaveClass("custom");
    });
  });

  describe("trigger", () => {
    it("says Show code, then Hide code once open", async () => {
      const user = userEvent.setup();
      render(<CodePreview code={CODE}>x</CodePreview>);
      expect(trigger()).toHaveTextContent("Show code");
      await user.click(trigger());
      expect(trigger()).toHaveTextContent("Hide code");
      expect(trigger()).toHaveAttribute("aria-expanded", "true");
      expect(trigger()).toHaveAttribute(
        "aria-controls",
        document.querySelector('[data-slot="code-preview-panel"]')!.id,
      );
    });

    it("takes custom labels", async () => {
      const user = userEvent.setup();
      render(
        <CodePreview code={CODE} showLabel="Source" hideLabel="Hide source">
          x
        </CodePreview>,
      );
      expect(screen.getByRole("button", { name: "Source" })).toBeVisible();
      await user.click(screen.getByRole("button", { name: "Source" }));
      expect(
        screen.getByRole("button", { name: "Hide source" }),
      ).toBeInTheDocument();
    });

    it("is a native button", () => {
      render(<CodePreview code={CODE}>x</CodePreview>);
      expect(trigger().tagName).toBe("BUTTON");
    });
  });

  describe("open state", () => {
    it("opens by default with defaultOpen", () => {
      render(
        <CodePreview code={CODE} defaultOpen>
          x
        </CodePreview>,
      );
      expect(trigger()).toHaveAttribute("aria-expanded", "true");
      expect(screen.getByText(`hl:${CODE}`)).toBeInTheDocument();
    });

    it("is controlled by open and asks through onOpenChange", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      const { rerender } = render(
        <CodePreview code={CODE} open={false} onOpenChange={onOpenChange}>
          x
        </CodePreview>,
      );
      await user.click(trigger());
      expect(onOpenChange).toHaveBeenCalledTimes(1);
      expect(onOpenChange.mock.calls[0]![0]).toBe(true);
      // Still closed until the caller passes the new value.
      expect(trigger()).toHaveAttribute("aria-expanded", "false");

      rerender(
        <CodePreview code={CODE} open onOpenChange={onOpenChange}>
          x
        </CodePreview>,
      );
      expect(trigger()).toHaveAttribute("aria-expanded", "true");
    });

    it("fires onOpenChange when uncontrolled", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <CodePreview code={CODE} onOpenChange={onOpenChange}>
          x
        </CodePreview>,
      );
      await user.click(trigger());
      await user.click(trigger());
      expect(onOpenChange.mock.calls.map((call) => call[0])).toEqual([
        true,
        false,
      ]);
    });
  });

  describe("highlighting", () => {
    it("does not highlight while the panel has never opened", () => {
      render(<CodePreview code={CODE}>x</CodePreview>);
      expect(mockUseHighlight).toHaveBeenCalled();
      expect(
        mockUseHighlight.mock.calls.every((call) => call[2]?.enabled === false),
      ).toBe(true);
    });

    it("highlights the first time the panel opens, and stays enabled after closing", async () => {
      const user = userEvent.setup();
      render(<CodePreview code={CODE}>x</CodePreview>);
      await user.click(trigger());
      expect(lastEnabled()).toBe(true);
      expect(screen.getByText(`hl:${CODE}`)).toBeInTheDocument();

      await user.click(trigger());
      expect(lastEnabled()).toBe(true);
    });

    it("highlights when opened through a controlled open", () => {
      const { rerender } = render(
        <CodePreview code={CODE} open={false}>
          x
        </CodePreview>,
      );
      expect(lastEnabled()).toBe(false);
      rerender(
        <CodePreview code={CODE} open>
          x
        </CodePreview>,
      );
      expect(lastEnabled()).toBe(true);
    });

    it("never highlights with html, and renders the html", async () => {
      const user = userEvent.setup();
      render(
        <CodePreview
          code={CODE}
          html='<pre><code><span class="line">pre-rendered</span></code></pre>'
        >
          x
        </CodePreview>,
      );
      await user.click(trigger());
      expect(screen.getByText("pre-rendered")).toBeInTheDocument();
      expect(
        mockUseHighlight.mock.calls.every((call) => call[2]?.enabled === false),
      ).toBe(true);
    });

    it("passes language and highlightLines to the highlighter", async () => {
      const user = userEvent.setup();
      render(
        <CodePreview code={CODE} language="tsx" highlightLines={[1]}>
          x
        </CodePreview>,
      );
      await user.click(trigger());
      const call = mockUseHighlight.mock.calls.at(-1)!;
      expect(call[1]).toBe("tsx");
      expect(call[2]?.highlightLines).toEqual([1]);
    });

    it("passes showLineNumbers to the code", () => {
      const { container } = render(
        <CodePreview code={CODE} defaultOpen showLineNumbers>
          x
        </CodePreview>,
      );
      expect(
        container.querySelector('[data-slot="code-block-content"]'),
      ).toHaveAttribute("data-line-numbers");
    });
  });

  describe("copy", () => {
    it("copies while the code is closed and fires onCopy", async () => {
      const user = userEvent.setup();
      const onCopy = vi.fn();
      render(
        <CodePreview code={CODE} onCopy={onCopy}>
          x
        </CodePreview>,
      );
      // user-event installs its own clipboard on setup, so stub it after.
      const writeText = vi
        .spyOn(navigator.clipboard, "writeText")
        .mockResolvedValue(undefined);
      await user.click(screen.getByRole("button", { name: "Copy code" }));
      expect(writeText).toHaveBeenCalledWith(CODE);
      await waitFor(() => expect(onCopy).toHaveBeenCalledWith(CODE));
    });

    it("leaves the copy button out with copyable={false}", () => {
      render(
        <CodePreview code={CODE} copyable={false}>
          x
        </CodePreview>,
      );
      expect(
        screen.queryByRole("button", { name: "Copy code" }),
      ).not.toBeInTheDocument();
      expect(trigger()).toBeInTheDocument();
    });
  });

  describe("slots", () => {
    it("reaches each part through its slot", () => {
      const { container } = render(
        <CodePreview
          code={CODE}
          defaultOpen
          CanvasProps={{ className: "canvas", p: 2 }}
          BarProps={{ className: "bar" }}
          TriggerProps={{ className: "trigger" }}
          PanelProps={{ className: "panel" }}
          CopyButtonProps={{ className: "copy" }}
          ContentProps={{ className: "content" }}
        >
          x
        </CodePreview>,
      );
      const slot = (name: string) =>
        container.querySelector(`[data-slot="${name}"]`);
      expect(slot("code-preview-canvas")).toHaveClass("canvas");
      expect(slot("code-preview-canvas")).toHaveAttribute("data-ui-p", "2");
      expect(slot("code-preview-bar")).toHaveClass("bar");
      expect(slot("code-preview-trigger")).toHaveClass("trigger");
      expect(slot("code-preview-panel")).toHaveClass("panel");
      expect(slot("code-block-copy-button")).toHaveClass("copy");
      expect(slot("code-block-content")).toHaveClass("content");
    });

    it("omits owned keys from the slot types", () => {
      const props: CodePreviewProps[] = [
        // @ts-expect-error The canvas content is `children`.
        { CanvasProps: { children: "x" } },
        // @ts-expect-error The bar content is set by CodePreview.
        { BarProps: { children: "x" } },
        // @ts-expect-error Trigger labels are set on CodePreview.
        { TriggerProps: { showLabel: "x" } },
        // @ts-expect-error Trigger labels are set on CodePreview.
        { TriggerProps: { hideLabel: "x" } },
        // @ts-expect-error The trigger is always the preview's own button.
        { TriggerProps: { render: <a /> } },
        // @ts-expect-error The panel content is the code.
        { PanelProps: { children: "x" } },
        // @ts-expect-error The code to copy is `code`.
        { CopyButtonProps: { code: "x" } },
        // @ts-expect-error `onCopy` is set on CodePreview.
        { CopyButtonProps: { onCopy: () => {} } },
        // @ts-expect-error The code is `code`.
        { ContentProps: { code: "x" } },
        // @ts-expect-error The highlighted markup is `html`.
        { ContentProps: { html: "x" } },
        // @ts-expect-error Line numbers are set on CodePreview.
        { ContentProps: { showLineNumbers: true } },
        // @ts-expect-error Pressing reset is CodePreview's own handler; use `onReset`.
        { ResetButtonProps: { onClick: () => {} } },
        // @ts-expect-error The reset button's content is its icon.
        { ResetButtonProps: { children: "x" } },
      ];
      expect(props).toHaveLength(13);
    });
  });

  describe("reset", () => {
    const resetButton = () =>
      screen.getByRole("button", { name: "Reset preview" });

    // Reports how many times it has mounted: the initializer runs once per mount.
    let mounts = 0;
    const MountCounter = () => {
      const [mount] = useState(() => ++mounts);
      return <span>Mount {mount}</span>;
    };

    beforeEach(() => {
      mounts = 0;
    });

    it("renders no reset button by default", () => {
      render(<CodePreview code={CODE}>x</CodePreview>);
      expect(
        screen.queryByRole("button", { name: "Reset preview" }),
      ).not.toBeInTheDocument();
      expect(
        document.querySelector('[data-slot="code-preview-reset-button"]'),
      ).not.toBeInTheDocument();
    });

    it("renders the reset button in the canvas with resettable", () => {
      const { container } = render(
        <CodePreview code={CODE} resettable>
          x
        </CodePreview>,
      );
      const canvas = container.querySelector(
        '[data-slot="code-preview-canvas"]',
      );
      expect(canvas).toContainElement(resetButton());
      expect(resetButton().tagName).toBe("BUTTON");
    });

    it("renders the reset button with no code", () => {
      render(<CodePreview resettable>x</CodePreview>);
      expect(resetButton()).toBeInTheDocument();
    });

    it("remounts children on each reset", async () => {
      const user = userEvent.setup();
      render(
        <CodePreview code={CODE} resettable>
          <MountCounter />
        </CodePreview>,
      );
      expect(screen.getByText("Mount 1")).toBeInTheDocument();
      await user.click(resetButton());
      expect(screen.getByText("Mount 2")).toBeInTheDocument();
      await user.click(resetButton());
      expect(screen.getByText("Mount 3")).toBeInTheDocument();
    });

    it("returns state inside the example to its start", async () => {
      const user = userEvent.setup();
      const Counter = () => {
        const [count, setCount] = useState(0);
        return (
          <button type="button" onClick={() => setCount(count + 1)}>
            Count {count}
          </button>
        );
      };
      render(
        <CodePreview resettable>
          <Counter />
        </CodePreview>,
      );
      await user.click(screen.getByRole("button", { name: "Count 0" }));
      await user.click(screen.getByRole("button", { name: "Count 1" }));
      await user.click(resetButton());
      expect(screen.getByRole("button", { name: "Count 0" })).toBeVisible();
    });

    // A server component reaches a client component as already-rendered
    // nodes: host elements and client-component elements, never a function.
    // Reset must remount those nodes as they are, by key.
    it("remounts already-rendered host elements without calling into children", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <CodePreview resettable>
          <label>
            Name
            <input defaultValue="start" />
          </label>
        </CodePreview>,
      );
      const before = screen.getByRole("textbox", { name: "Name" });
      await user.clear(before);
      await user.type(before, "edited");
      expect(before).toHaveValue("edited");

      await user.click(resetButton());
      const after = screen.getByRole("textbox", { name: "Name" });
      expect(after).not.toBe(before);
      expect(after).toHaveValue("start");
      expect(container).toContainElement(after);
    });

    it("remounts an element created once outside the preview", async () => {
      const user = userEvent.setup();
      const example = <MountCounter />;
      const { rerender } = render(
        <CodePreview resettable>{example}</CodePreview>,
      );
      await user.click(resetButton());
      expect(screen.getByText("Mount 2")).toBeInTheDocument();
      // Re-rendering the parent with the same element does not remount it.
      rerender(<CodePreview resettable>{example}</CodePreview>);
      expect(screen.getByText("Mount 2")).toBeInTheDocument();
    });

    it("leaves the code panel's open state alone", async () => {
      const user = userEvent.setup();
      const onOpenChange = vi.fn();
      render(
        <CodePreview
          code={CODE}
          resettable
          defaultOpen
          onOpenChange={onOpenChange}
        >
          <MountCounter />
        </CodePreview>,
      );
      await user.click(resetButton());
      expect(trigger()).toHaveAttribute("aria-expanded", "true");
      expect(onOpenChange).not.toHaveBeenCalled();

      await user.click(trigger());
      await user.click(resetButton());
      expect(trigger()).toHaveAttribute("aria-expanded", "false");
      expect(onOpenChange).toHaveBeenCalledTimes(1);
    });

    it("keeps focus on the reset button", async () => {
      const user = userEvent.setup();
      render(
        <CodePreview code={CODE} resettable>
          <MountCounter />
        </CodePreview>,
      );
      const button = resetButton();
      await user.click(button);
      expect(screen.getByText("Mount 2")).toBeInTheDocument();
      expect(resetButton()).toBe(button);
      expect(button).toHaveFocus();

      // And from the keyboard.
      await user.keyboard("{Enter}");
      expect(screen.getByText("Mount 3")).toBeInTheDocument();
      expect(button).toHaveFocus();
    });

    it("fires onReset once per reset", async () => {
      const user = userEvent.setup();
      const onReset = vi.fn();
      render(
        <CodePreview resettable onReset={onReset}>
          x
        </CodePreview>,
      );
      await user.click(resetButton());
      expect(onReset).toHaveBeenCalledTimes(1);
      await user.click(resetButton());
      expect(onReset).toHaveBeenCalledTimes(2);
    });

    it("reaches the reset button through ResetButtonProps", () => {
      render(
        <CodePreview resettable ResetButtonProps={{ className: "reset" }}>
          x
        </CodePreview>,
      );
      expect(resetButton()).toHaveClass("reset");
    });
  });

  describe("error boundary", () => {
    let broken = true;
    const Fragile = () => {
      if (broken) throw new Error("<b>Example exploded</b>");
      return <span>Recovered</span>;
    };

    beforeEach(() => {
      broken = true;
    });

    // React reports a caught render error to console.error in development.
    const expectReportedError = () => {
      const consoleError = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      return () => {
        expect(consoleError).toHaveBeenCalled();
        consoleError.mockRestore();
      };
    };

    it("shows a short message in the canvas and keeps the frame, bar and code", () => {
      const done = expectReportedError();
      const { container } = render(
        <CodePreview code={CODE} defaultOpen>
          <Fragile />
        </CodePreview>,
      );
      const canvas = container.querySelector(
        '[data-slot="code-preview-canvas"]',
      )!;
      expect(canvas).toHaveTextContent("This example failed to render.");
      expect(
        container.querySelector('[data-slot="code-preview-bar"]'),
      ).toBeInTheDocument();
      expect(trigger()).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: "Copy code" }),
      ).toBeInTheDocument();
      expect(screen.getByText(`hl:${CODE}`)).toBeInTheDocument();
      done();
    });

    it("never renders the thrown value as markup", () => {
      const done = expectReportedError();
      const { container } = render(
        <CodePreview code={CODE}>
          <Fragile />
        </CodePreview>,
      );
      expect(container.querySelector("b")).not.toBeInTheDocument();
      expect(container).not.toHaveTextContent("Example exploded");
      done();
    });

    it("retries on reset", async () => {
      const user = userEvent.setup();
      const done = expectReportedError();
      render(
        <CodePreview code={CODE} resettable>
          <Fragile />
        </CodePreview>,
      );
      expect(
        screen.getByText("This example failed to render."),
      ).toBeInTheDocument();
      broken = false;
      await user.click(screen.getByRole("button", { name: "Reset preview" }));
      expect(screen.getByText("Recovered")).toBeInTheDocument();
      expect(
        screen.queryByText("This example failed to render."),
      ).not.toBeInTheDocument();
      done();
    });
  });

  describe("parts", () => {
    it("renders a standalone reset button named Reset preview", async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      const { container } = render(
        <CodePreviewResetButton onClick={onClick} />,
      );
      const button = screen.getByRole("button", { name: "Reset preview" });
      expect(button).toHaveAttribute("data-slot", "code-preview-reset-button");
      expect(container.querySelector("svg")).toBeInTheDocument();
      await user.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("composes from the exported parts", async () => {
      const user = userEvent.setup();
      const { container } = render(
        <CollapsibleRoot>
          <CodePreviewCanvas>Example</CodePreviewCanvas>
          <CodePreviewBar>
            <CodePreviewTrigger showLabel="Open" hideLabel="Close" />
          </CodePreviewBar>
          <CodePreviewPanel>Panel content</CodePreviewPanel>
        </CollapsibleRoot>,
      );
      expect(
        container.querySelector('[data-slot="code-preview-canvas"]'),
      ).toHaveTextContent("Example");
      expect(screen.queryByText("Panel content")).not.toBeInTheDocument();
      await user.click(screen.getByRole("button", { name: "Open" }));
      expect(screen.getByText("Panel content")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });

    it("keeps a caller's layout props on the canvas and bar", () => {
      const { container } = render(
        <CollapsibleRoot>
          <CodePreviewCanvas ax="start" p={1} />
          <CodePreviewBar px={8} />
        </CollapsibleRoot>,
      );
      expect(
        container.querySelector('[data-slot="code-preview-canvas"]'),
      ).toHaveAttribute("data-ui-p", "1");
      expect(
        container.querySelector('[data-slot="code-preview-bar"]'),
      ).toHaveAttribute("data-ui-px", "8");
    });
  });
});

describe("CodePreview examples", () => {
  const { Throws, ...rendering } = Examples;

  it.each(Object.entries(rendering))("renders %s", (_name, Example) => {
    const { container } = render(<Example />);
    expect(
      container.querySelector('[data-slot="code-preview-canvas"]'),
    ).toBeInTheDocument();
  });

  it("catches the Throws example inside the canvas", () => {
    // React reports the caught error to console.error in development.
    const consoleError = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});
    const { container } = render(<Throws />);
    expect(
      container.querySelector('[data-slot="code-preview-canvas"]'),
    ).toHaveTextContent("This example failed to render.");
    expect(trigger()).toBeInTheDocument();
    expect(consoleError).toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it("resets the Resettable example's state", async () => {
    const user = userEvent.setup();
    render(<Examples.Resettable />);
    await user.click(screen.getByRole("button", { name: "Clicked 0 times" }));
    expect(
      screen.getByRole("button", { name: "Clicked 1 times" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reset preview" }));
    expect(
      screen.getByRole("button", { name: "Clicked 0 times" }),
    ).toBeInTheDocument();
  });

  it("drives a controlled preview from outside", async () => {
    const user = userEvent.setup();
    render(<Examples.Controlled />);
    expect(screen.getByText("Code hidden")).toBeInTheDocument();
    await user.click(trigger());
    expect(screen.getByText("Code shown")).toBeInTheDocument();
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
  });
});
