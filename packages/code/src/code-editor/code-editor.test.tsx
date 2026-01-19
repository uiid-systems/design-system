import { useState } from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
    expect(screen.getByRole("textbox").closest("[data-slot='code-editor']")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    render(<CodeEditor defaultValue="const x = 1;" className="custom-class" />);
    expect(screen.getByRole("textbox").closest("[data-slot='code-editor']")).toHaveClass(
      "custom-class"
    );
  });

  it("renders with placeholder", () => {
    render(<CodeEditor placeholder="Enter code..." />);
    expect(screen.getByPlaceholderText("Enter code...")).toBeInTheDocument();
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

  it("can be disabled", () => {
    render(<CodeEditor defaultValue="test" disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("shows disabled state styling", () => {
    render(<CodeEditor defaultValue="test" disabled />);
    expect(
      screen.getByRole("textbox").closest("[data-slot='code-editor']")
    ).toHaveAttribute("data-disabled");
  });

  // ============================================
  // READ ONLY STATE
  // ============================================

  it("can be read only", () => {
    render(<CodeEditor defaultValue="test" readOnly />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("does not allow editing when read only", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CodeEditor defaultValue="original" readOnly onValueChange={handleChange} />
    );

    await user.type(screen.getByRole("textbox"), "new text");
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ============================================
  // COPY BUTTON
  // ============================================

  it("renders copy button when copyable is true", () => {
    render(<CodeEditor defaultValue="test" copyable filename="test.ts" />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("does not render copy button when copyable is false", () => {
    render(<CodeEditor defaultValue="test" copyable={false} filename="test.ts" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
