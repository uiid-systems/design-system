import {
  render,
  screen,
  act,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef, useState } from "react";
import { describe, it, expect, vi } from "vitest";

import { CodeEditor } from "./code-editor";

describe("CodeEditor", () => {
  // ============================================
  // RENDERING
  // ============================================

  it("renders the component", () => {
    render(<CodeEditor defaultValue="const x = 1;" />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with data-slot attribute", () => {
    render(<CodeEditor defaultValue="const x = 1;" />);
    expect(
      screen.getByRole("textbox").closest("[data-slot='code-editor']"),
    ).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CodeEditor defaultValue="const x = 1;" className="custom-class" />);
    expect(
      screen.getByRole("textbox").closest("[data-slot='code-editor']"),
    ).toHaveClass("custom-class");
  });

  it("renders with placeholder", () => {
    render(<CodeEditor placeholder="Enter code..." />);
    expect(screen.getByPlaceholderText("Enter code...")).toBeInTheDocument();
  });

  it("renders no loading text while the highlighter starts", () => {
    render(<CodeEditor defaultValue="" />);
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
  });

  it("renders header with filename", () => {
    render(<CodeEditor defaultValue="test" filename="test.ts" />);
    expect(screen.getByText("test.ts")).toBeInTheDocument();
  });

  // ============================================
  // CONTROLLED/UNCONTROLLED STATE
  // ============================================

  it("supports uncontrolled state with defaultValue", () => {
    render(<CodeEditor defaultValue="initial code" />);
    expect(screen.getByRole("textbox")).toHaveValue("initial code");
  });

  it("supports controlled state", async () => {
    const handleChange = vi.fn();

    const ControlledEditor = () => {
      const [value, setValue] = useState("initial");
      return (
        <CodeEditor
          value={value}
          onValueChange={(newValue) => {
            setValue(newValue);
            handleChange(newValue);
          }}
        />
      );
    };

    const user = userEvent.setup();
    render(<ControlledEditor />);

    const textarea = screen.getByRole("textbox");
    await user.clear(textarea);
    await user.type(textarea, "new code");

    expect(handleChange).toHaveBeenCalled();
    expect(textarea).toHaveValue("new code");
  });

  it("calls onValueChange when text is entered", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<CodeEditor defaultValue="" onValueChange={handleChange} />);

    await user.type(screen.getByRole("textbox"), "hello");
    expect(handleChange).toHaveBeenCalled();
  });

  // ============================================
  // DISABLED STATE
  // ============================================

  it("can be disabled", async () => {
    render(<CodeEditor defaultValue="test" disabled />);
    await act(async () => {});
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows disabled state styling", async () => {
    render(<CodeEditor defaultValue="test" disabled />);
    await act(async () => {});
    expect(
      screen.getByRole("textbox").closest("[data-slot='code-editor']"),
    ).toHaveAttribute("data-disabled");
  });

  // ============================================
  // READ ONLY STATE
  // ============================================

  it("can be read only", async () => {
    render(<CodeEditor defaultValue="test" readOnly />);
    await act(async () => {});
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("does not allow editing when read only", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CodeEditor
        defaultValue="original"
        readOnly
        onValueChange={handleChange}
      />,
    );

    await user.type(screen.getByRole("textbox"), "new text");
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ============================================
  // COPY BUTTON
  // ============================================

  it("renders copy button when copyable is true", async () => {
    render(<CodeEditor defaultValue="test" copyable filename="test.ts" />);
    await act(async () => {});
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not render copy button when copyable is false", async () => {
    render(
      <CodeEditor defaultValue="test" copyable={false} filename="test.ts" />,
    );
    await act(async () => {});
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  // ============================================
  // HIGHLIGHT BACKDROP
  // ============================================

  it("keeps the highlight backdrop inert so its pre can't take focus", async () => {
    render(<CodeEditor defaultValue="const x = 1;" />);

    const highlight = screen
      .getByRole("textbox")
      .closest("[data-slot='code-editor']")!
      .querySelector<HTMLElement>("[data-slot='code-editor-highlight']")!;

    // Shiki renders a focusable `<pre tabindex="0">`; wait for the real output
    const pre = await waitFor(
      () => {
        const element = highlight.querySelector("pre");
        expect(element).not.toBeNull();
        return element!;
      },
      { timeout: 5000 },
    );

    expect(pre.closest("[inert]")).toBe(highlight);

    act(() => pre.focus());
    expect(pre).not.toHaveFocus();
  });

  // The CSS keys the shared gutter off this attribute; check alignment by eye in the LongLines story
  it("marks the layer holding both the highlight and the textarea for line numbers", () => {
    const { rerender } = render(<CodeEditor defaultValue="const x = 1;" />);
    const layer = screen.getByRole("textbox").parentElement!;

    expect(layer).not.toHaveAttribute("data-line-numbers");
    expect(
      layer.querySelector("[data-slot='code-editor-highlight']"),
    ).toBeInTheDocument();

    rerender(<CodeEditor defaultValue="const x = 1;" showLineNumbers />);
    expect(layer).toHaveAttribute("data-line-numbers");
  });

  it("writes rows as one custom property, leaving the height to the CSS module", () => {
    const { rerender } = render(<CodeEditor defaultValue="const x = 1;" />);
    const layer = screen.getByRole("textbox").parentElement!;

    expect(layer).not.toHaveAttribute("data-rows");
    expect(layer.style.getPropertyValue("--code-rows")).toBe("");

    rerender(<CodeEditor defaultValue="const x = 1;" rows={4} />);
    expect(layer).toHaveAttribute("data-rows");
    expect(layer.style.getPropertyValue("--code-rows")).toBe("4");
    expect(layer.style.maxHeight).toBe("");
    expect(layer.style.overflow).toBe("");

    rerender(<CodeEditor defaultValue="const x = 1;" rows={0} />);
    expect(layer).not.toHaveAttribute("data-rows");
    expect(layer.getAttribute("style")).toBeFalsy();
  });

  // ============================================
  // TEXTAREA PROPS
  // ============================================

  it("names the textbox generically when there is no filename", () => {
    render(<CodeEditor defaultValue="test" />);
    expect(
      screen.getByRole("textbox", { name: "Code editor" }),
    ).toBeInTheDocument();
  });

  it("names the textbox after the filename", () => {
    render(<CodeEditor defaultValue="test" filename="app.tsx" />);
    expect(
      screen.getByRole("textbox", { name: "app.tsx code editor" }),
    ).toBeInTheDocument();
  });

  it("lets a caller's aria-label win over the default", () => {
    render(
      <CodeEditor
        defaultValue="test"
        filename="app.tsx"
        TextareaProps={{ "aria-label": "Snippet" }}
      />,
    );
    expect(screen.getByRole("textbox", { name: "Snippet" })).toHaveAttribute(
      "aria-label",
      "Snippet",
    );
  });

  it("emits no default aria-label when the caller supplies aria-labelledby", () => {
    render(
      <>
        <span id="editor-label">Request body</span>
        <CodeEditor
          defaultValue="test"
          filename="app.tsx"
          TextareaProps={{ "aria-labelledby": "editor-label" }}
        />
      </>,
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).not.toHaveAttribute("aria-label");
    expect(textarea).toHaveAttribute("aria-labelledby", "editor-label");
  });

  it("is named by a visible label through aria-labelledby", () => {
    render(
      <>
        <label id="editor-label">Request body</label>
        <CodeEditor
          defaultValue="test"
          filename="app.tsx"
          TextareaProps={{ "aria-labelledby": "editor-label" }}
        />
      </>,
    );
    expect(
      screen.getByRole("textbox", { name: "Request body" }),
    ).toBeInTheDocument();
  });

  it("keeps the default name over a label element unless the caller opts out", () => {
    render(
      <>
        <label htmlFor="source-id">Request body</label>
        <CodeEditor defaultValue="test" TextareaProps={{ id: "source-id" }} />
      </>,
    );
    expect(
      screen.getByRole("textbox", { name: "Code editor" }),
    ).toBeInTheDocument();
  });

  it("drops the default aria-label so a label element can name the textbox", () => {
    render(
      <>
        <label htmlFor="source-id">Request body</label>
        <CodeEditor
          defaultValue="test"
          TextareaProps={{ id: "source-id", "aria-label": undefined }}
        />
      </>,
    );
    const textarea = screen.getByRole("textbox", { name: "Request body" });
    expect(textarea).not.toHaveAttribute("aria-label");
  });

  it("keeps a wrapper aria-label on the wrapper", () => {
    render(<CodeEditor defaultValue="test" aria-label="Wrapper" />);
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("aria-label", "Code editor");
    expect(textarea.closest("[data-slot='code-editor']")).toHaveAttribute(
      "aria-label",
      "Wrapper",
    );
  });

  it("passes name, id and onBlur to the textarea", async () => {
    const handleBlur = vi.fn();
    const user = userEvent.setup();

    render(
      <CodeEditor
        defaultValue="test"
        TextareaProps={{ name: "source", id: "source-id", onBlur: handleBlur }}
      />,
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveAttribute("name", "source");
    expect(textarea).toHaveAttribute("id", "source-id");

    await user.click(textarea);
    await user.tab();
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it("merges a TextareaProps className and keeps the textarea data-slot", () => {
    render(
      <CodeEditor
        defaultValue="test"
        TextareaProps={{ className: "custom-textarea" }}
      />,
    );
    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveClass("custom-textarea");
    expect(textarea).toHaveAttribute("data-slot", "code-editor-textarea");
  });

  it("forwards TextareaProps.ref to the textarea element", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<CodeEditor defaultValue="test" TextareaProps={{ ref }} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(screen.getByRole("textbox"));
  });

  it("keeps the top-level ref on the wrapper", () => {
    const ref = createRef<HTMLDivElement>();
    render(<CodeEditor defaultValue="test" ref={ref} />);
    expect(ref.current).toHaveAttribute("data-slot", "code-editor");
  });

  it("chains TextareaProps.onChange with the editor's own change handling", async () => {
    const handleChange = vi.fn();
    const handleValueChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CodeEditor
        defaultValue=""
        onValueChange={handleValueChange}
        TextareaProps={{ onChange: handleChange }}
      />,
    );

    const textarea = screen.getByRole("textbox");
    await user.type(textarea, "hi");

    expect(textarea).toHaveValue("hi");
    expect(handleValueChange).toHaveBeenLastCalledWith("hi");
    expect(handleChange).toHaveBeenCalledTimes(2);
  });

  it("chains TextareaProps.onScroll with the highlight scroll sync", () => {
    const handleScroll = vi.fn();
    render(
      <CodeEditor
        defaultValue="test"
        TextareaProps={{ onScroll: handleScroll }}
      />,
    );

    const textarea = screen.getByRole("textbox");
    const highlight = textarea
      .closest("[data-slot='code-editor']")!
      .querySelector<HTMLElement>("[data-slot='code-editor-highlight']")!;

    textarea.scrollTop = 40;
    fireEvent.scroll(textarea);

    expect(highlight.scrollTop).toBe(40);
    expect(handleScroll).toHaveBeenCalledTimes(1);
  });

  it("does not let TextareaProps override the editor's own textarea props", () => {
    const unsafe = {
      value: "hijacked",
      readOnly: true,
      disabled: true,
      placeholder: "hijacked",
    } as React.ComponentProps<"textarea">;

    render(
      <CodeEditor
        value="real"
        placeholder="Enter code..."
        TextareaProps={unsafe}
      />,
    );

    const textarea = screen.getByRole("textbox");
    expect(textarea).toHaveValue("real");
    expect(textarea).toHaveAttribute("placeholder", "Enter code...");
    expect(textarea).not.toHaveAttribute("readonly");
    expect(textarea).not.toBeDisabled();
  });
});
