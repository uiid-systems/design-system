import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@uiid/buttons";
import { describe, expect, it, vi } from "vitest";

import { PromptInput } from "./prompt-input";
import type { PromptInputProps } from "./prompt-input.types";
import { PromptInputSubmit } from "./subcomponents";

const button = (name: "Send" | "Stop") => screen.getByRole("button", { name });

describe("PromptInputSubmit", () => {
  it("is a submit button named Send by default", () => {
    render(<PromptInputSubmit />);

    const send = button("Send");
    expect(send).toHaveAttribute("type", "submit");
    expect(send).toHaveAttribute("data-slot", "prompt-input-submit");
    expect(send.className).toContain("shape-circle");
    expect(send.className).toContain("size-xsmall");
    expect(send.querySelector("svg")).toBeInTheDocument();
  });

  it("stays a submit button named Send for ready and error, with different icons", () => {
    const { rerender } = render(<PromptInputSubmit status="ready" />);
    const readyIcon = button("Send").querySelector("svg")!.innerHTML;
    expect(button("Send")).toHaveAttribute("type", "submit");

    rerender(<PromptInputSubmit status="error" />);
    expect(button("Send")).toHaveAttribute("type", "submit");
    expect(button("Send").querySelector("svg")!.innerHTML).not.toBe(readyIcon);
  });

  it("is a plain button named Stop while submitted, with a spinner", () => {
    render(<PromptInputSubmit status="submitted" />);

    const stop = button("Stop");
    expect(stop).toHaveAttribute("type", "button");
    expect(
      stop.querySelector('[data-slot="button-content-container"]'),
    ).toHaveAttribute("data-loading", "true");
  });

  it("is a plain button named Stop while streaming, without a spinner", () => {
    render(<PromptInputSubmit status="streaming" />);

    const stop = button("Stop");
    expect(stop).toHaveAttribute("type", "button");
    expect(
      stop.querySelector('[data-slot="button-content-container"]'),
    ).not.toHaveAttribute("data-loading", "true");
  });

  it("calls onStop when pressed while generating", () => {
    const onStop = vi.fn();
    render(<PromptInputSubmit status="streaming" onStop={onStop} />);

    fireEvent.click(button("Stop"));

    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("does not call onStop when pressed while ready", () => {
    const onStop = vi.fn();
    render(<PromptInputSubmit status="ready" onStop={onStop} />);

    fireEvent.click(button("Send"));

    expect(onStop).not.toHaveBeenCalled();
  });

  it("lets a caller's onClick veto onStop with preventDefault", () => {
    const onStop = vi.fn();
    render(
      <PromptInputSubmit
        status="streaming"
        onStop={onStop}
        onClick={(event) => event.preventDefault()}
      />,
    );

    fireEvent.click(button("Stop"));

    expect(onStop).not.toHaveBeenCalled();
  });

  it("lets a caller replace the icon, label, variant and size", () => {
    render(
      <PromptInputSubmit aria-label="Go" variant="ghost" size="small">
        go
      </PromptInputSubmit>,
    );

    const go = screen.getByRole("button", { name: "Go" });
    expect(go).toHaveTextContent("go");
    expect(go.querySelector("svg")).not.toBeInTheDocument();
    expect(go.className).toContain("variant-ghost");
    expect(go.className).toContain("size-small");
  });
});

describe("PromptInput", () => {
  const renderPromptInput = (props: Partial<PromptInputProps> = {}) => {
    const onSubmit = vi.fn();
    const result = render(<PromptInput onSubmit={onSubmit} {...props} />);
    const form = result.container.querySelector("form") as HTMLFormElement;
    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    return { ...result, onSubmit, form, textarea };
  };

  describe("structure", () => {
    it("renders a form around one surface holding the header, textarea and footer in order", () => {
      const { form } = renderPromptInput({
        header: "chips",
        tools: <Button>tool</Button>,
      });

      expect(form).toHaveAttribute("data-slot", "prompt-input");
      expect(form).toHaveAttribute("data-status", "ready");
      expect(form.querySelectorAll('[data-slot="input-wrapper"]')).toHaveLength(
        1,
      );
      const slots = Array.from(
        form.querySelectorAll('[data-slot="input-wrapper"] > [data-slot]'),
      ).map((element) => element.getAttribute("data-slot"));
      expect(slots).toEqual(["input-before", "textarea", "input-after"]);
      expect(
        form.querySelector(
          '[data-slot="input-before"] > [data-slot="prompt-input-header"]',
        ),
      ).toHaveTextContent("chips");
      const footer = form.querySelector(
        '[data-slot="input-after"] > [data-slot="prompt-input-footer"]',
      )!;
      const parts = Array.from(footer.children).map((element) =>
        element.getAttribute("data-slot"),
      );
      expect(parts).toEqual(["prompt-input-tools", "prompt-input-submit"]);
      expect(footer.firstElementChild).toHaveTextContent("tool");
    });

    it("renders no header row without header", () => {
      const { form } = renderPromptInput();

      expect(form.querySelector('[data-slot="input-before"]')).toBeNull();
      expect(form.querySelector('[data-slot="input-after"]')).not.toBeNull();
    });

    it("applies the composer defaults to the textarea", () => {
      const { form, textarea } = renderPromptInput();

      expect(textarea).toHaveAttribute("aria-label", "Message");
      expect(textarea).toHaveAttribute("placeholder", "Ask anything");
      expect(textarea).toHaveAttribute("rows", "1");
      expect(textarea.className).toContain("resize-none");
      expect(
        form.querySelector('[data-slot="input-wrapper"]')!.className,
      ).toContain("fullwidth");
    });

    it("lets a caller override the label and placeholder", () => {
      renderPromptInput({ "aria-label": "Reply", placeholder: "Say more" });

      const textarea = screen.getByRole("textbox", { name: "Reply" });
      expect(textarea).toHaveAttribute("placeholder", "Say more");
    });

    it("drops the default aria-label when a visible label is given", () => {
      renderPromptInput({ label: "Your message" });

      const textarea = screen.getByRole("textbox", { name: "Your message" });
      expect(textarea).not.toHaveAttribute("aria-label");
    });

    it("puts className on the form and ref on the textarea", () => {
      const ref = { current: null as HTMLTextAreaElement | null };
      const { form, textarea } = renderPromptInput({
        className: "custom",
        ref,
      });

      expect(form).toHaveClass("custom");
      expect(ref.current).toBe(textarea);
    });

    it("stamps the status on the root", () => {
      const { form } = renderPromptInput({ status: "error" });

      expect(form).toHaveAttribute("data-status", "error");
    });
  });

  describe("submitting", () => {
    it("calls onSubmit with the text and a prevented event when Send is pressed, then clears", async () => {
      const user = userEvent.setup();
      const { onSubmit, textarea } = renderPromptInput();

      await user.type(textarea, "hello");
      await user.click(button("Send"));

      expect(onSubmit).toHaveBeenCalledTimes(1);
      const [message, event] = onSubmit.mock.calls[0];
      expect(message).toEqual({ text: "hello" });
      expect(event.defaultPrevented).toBe(true);
      expect(textarea).toHaveValue("");
    });

    it("submits on Enter", async () => {
      const user = userEvent.setup();
      const { onSubmit, textarea } = renderPromptInput();

      await user.type(textarea, "hello{Enter}");

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toEqual({ text: "hello" });
      expect(textarea).toHaveValue("");
    });

    it("inserts a newline on Shift+Enter", async () => {
      const user = userEvent.setup();
      const { onSubmit, textarea } = renderPromptInput();

      await user.type(textarea, "one{Shift>}{Enter}{/Shift}two");

      expect(onSubmit).not.toHaveBeenCalled();
      expect(textarea).toHaveValue("one\ntwo");
    });

    it("ignores Enter during an IME composition", () => {
      const { onSubmit, textarea } = renderPromptInput({
        defaultValue: "こんにちは",
      });

      fireEvent.keyDown(textarea, { key: "Enter", isComposing: true });
      expect(onSubmit).not.toHaveBeenCalled();

      fireEvent.keyDown(textarea, { key: "Enter" });
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    it("ignores Enter while streaming", () => {
      const { onSubmit, textarea } = renderPromptInput({
        status: "streaming",
        defaultValue: "hello",
      });

      fireEvent.keyDown(textarea, { key: "Enter" });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("does nothing on blank text, with Send still enabled", async () => {
      const user = userEvent.setup();
      const { onSubmit, textarea } = renderPromptInput();

      await user.type(textarea, "   ");
      expect(button("Send")).toBeEnabled();
      await user.click(button("Send"));
      fireEvent.keyDown(textarea, { key: "Enter" });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("lets a caller's onKeyDown veto Enter with preventDefault", () => {
      const { onSubmit, textarea } = renderPromptInput({
        defaultValue: "hello",
        onKeyDown: (event: React.KeyboardEvent<HTMLTextAreaElement>) =>
          event.preventDefault(),
      });

      fireEvent.keyDown(textarea, { key: "Enter" });

      expect(onSubmit).not.toHaveBeenCalled();
    });

    it("leaves a controlled value alone and forwards onValueChange", async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const { onSubmit, textarea } = renderPromptInput({
        value: "draft",
        onValueChange,
      });

      await user.type(textarea, "!");
      expect(onValueChange).toHaveBeenCalled();

      await user.click(button("Send"));
      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit.mock.calls[0][0]).toEqual({ text: "draft" });
      expect(textarea).toHaveValue("draft");
    });

    it("disables the textarea and the submit button together", () => {
      const { textarea } = renderPromptInput({ disabled: true });

      expect(textarea).toBeDisabled();
      expect(button("Send")).toBeDisabled();
    });

    it("does not submit when a plain Button in tools is pressed", async () => {
      const user = userEvent.setup();
      const onTool = vi.fn();
      const { onSubmit } = renderPromptInput({
        defaultValue: "hello",
        tools: <Button onClick={onTool}>tool</Button>,
      });

      await user.click(screen.getByRole("button", { name: "tool" }));

      expect(onTool).toHaveBeenCalledTimes(1);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  describe("stopping", () => {
    it("renders Stop while streaming and calls onStop, never onSubmit", async () => {
      const user = userEvent.setup();
      const onStop = vi.fn();
      const { onSubmit } = renderPromptInput({
        status: "streaming",
        onStop,
        defaultValue: "hello",
      });

      await user.click(button("Stop"));

      expect(onStop).toHaveBeenCalledTimes(1);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });
});
