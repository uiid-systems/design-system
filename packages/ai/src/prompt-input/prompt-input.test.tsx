import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@uiid/buttons";
import { describe, expect, expectTypeOf, it, vi } from "vitest";

import { PromptInput } from "./prompt-input";
import * as Examples from "./prompt-input.examples";
import type {
  PromptInputMessage,
  PromptInputProps,
} from "./prompt-input.types";
import { PromptInputSubmit } from "./subcomponents";

const button = (name: "Send" | "Stop") => screen.getByRole("button", { name });
const icon = (element: HTMLElement) =>
  element.querySelector("svg")?.getAttribute("class") ?? "";
const loading = (element: HTMLElement) =>
  element
    .querySelector('[data-slot="button-content-container"]')
    ?.getAttribute("data-loading") === "true";
const tooltipWrapper = () =>
  document.querySelector('[data-slot="button-tooltip-wrapper"]');
/* Disabled through aria-disabled, so the element stays focusable. */
const expectWaiting = (element: HTMLElement) => {
  expect(element).toHaveAttribute("aria-disabled", "true");
  expect(element).not.toHaveAttribute("disabled");
};

describe("PromptInputSubmit", () => {
  it("is a small circular submit button named Send, with an up arrow", () => {
    render(<PromptInputSubmit />);

    const send = button("Send");
    expect(send).toHaveAttribute("type", "submit");
    expect(send).toHaveAttribute("data-slot", "prompt-input-submit");
    expect(send.className).toContain("shape-circle");
    expect(send.className).toContain("size-xsmall");
    expect(icon(send)).toContain("lucide-arrow-up");
  });

  it("stays a submit button named Send on error, with an X", () => {
    render(<PromptInputSubmit status="error" />);

    expect(button("Send")).toHaveAttribute("type", "submit");
    expect(icon(button("Send"))).toContain("lucide-x");
  });

  it("is a plain button named Stop while submitted, loading over a square", () => {
    render(<PromptInputSubmit status="submitted" onStop={vi.fn()} />);

    const stop = button("Stop");
    expect(stop).toHaveAttribute("type", "button");
    expect(loading(stop)).toBe(true);
    expect(icon(stop)).toContain("lucide-square");
  });

  it("is a plain button named Stop while streaming, not loading", () => {
    render(<PromptInputSubmit status="streaming" onStop={vi.fn()} />);

    const stop = button("Stop");
    expect(stop).toHaveAttribute("type", "button");
    expect(loading(stop)).toBe(false);
    expect(icon(stop)).toContain("lucide-square");
  });

  it.each(["submitted", "streaming"] as const)(
    "is a disabled plain button named Send while %s without onStop, with an up arrow",
    (status) => {
      render(<PromptInputSubmit status={status} />);

      const send = button("Send");
      expect(send).toHaveAttribute("type", "button");
      expectWaiting(send);
      expect(icon(send)).toContain("lucide-arrow-up");
      expect(
        screen.queryByRole("button", { name: "Stop" }),
      ).not.toBeInTheDocument();
    },
  );

  it("keeps the spinner on the disabled Send while submitted without onStop", () => {
    render(<PromptInputSubmit status="submitted" />);

    expect(loading(button("Send"))).toBe(true);
  });

  it("stays disabled while generating without onStop even if a caller passes disabled={false}", () => {
    render(<PromptInputSubmit status="streaming" disabled={false} />);

    expectWaiting(button("Send"));
  });

  it("is natively disabled, not merely aria-disabled, when the caller disables it while ready", () => {
    render(<PromptInputSubmit disabled />);

    expect(button("Send")).toBeDisabled();
  });

  /* The waiting Send is disabled through aria-disabled rather than the native
     attribute: a natively disabled element loses focus to the body under the
     HTML focus fixup rule, which jsdom does not model, so the attribute is
     what this test can pin. */
  it("keeps Send focusable and focused as the status changes without onStop", () => {
    const { rerender } = render(<PromptInputSubmit status="ready" />);
    const send = button("Send");
    send.focus();
    expect(send).toHaveFocus();

    for (const status of ["submitted", "streaming"] as const) {
      rerender(<PromptInputSubmit status={status} />);
      expect(button("Send")).toBe(send);
      expectWaiting(send);
      expect(send).toHaveFocus();
    }

    rerender(<PromptInputSubmit status="ready" />);
    expect(button("Send")).toBe(send);
    expect(send).not.toHaveAttribute("aria-disabled");
    expect(send).toBeEnabled();
    expect(send).toHaveFocus();
  });

  it("does not activate while waiting, even though it is focusable", () => {
    const onClick = vi.fn();
    render(<PromptInputSubmit status="streaming" onClick={onClick} />);

    fireEvent.click(button("Send"));

    expect(onClick).not.toHaveBeenCalled();
  });

  it("always sits in a tooltip, showing its name unless the caller passes one", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<PromptInputSubmit />);
    expect(tooltipWrapper()).toContainElement(button("Send"));
    expect(button("Send")).not.toHaveAttribute("aria-description");

    rerender(<PromptInputSubmit tooltip="Send it (Enter)" />);
    expect(tooltipWrapper()).toContainElement(button("Send"));
    expect(button("Send")).toHaveAttribute("aria-label", "Send");
    expect(button("Send")).toHaveAttribute(
      "aria-description",
      "Send it (Enter)",
    );
    await user.hover(button("Send"));
    expect(await screen.findByText("Send it (Enter)")).toBeVisible();
  });

  it.each(["submitted", "streaming"] as const)(
    "says why Send is disabled while %s without onStop",
    async (status) => {
      const user = userEvent.setup();
      render(<PromptInputSubmit status={status} />);

      expect(button("Send")).toHaveAttribute(
        "aria-description",
        "Waiting for the reply",
      );
      await user.tab();
      expect(button("Send")).toHaveFocus();
      expect(await screen.findByText("Waiting for the reply")).toBeVisible();
    },
  );

  it("does not describe Stop, or Send while ready, with its own name", () => {
    const { rerender } = render(
      <PromptInputSubmit status="streaming" onStop={vi.fn()} />,
    );
    expect(button("Stop")).not.toHaveAttribute("aria-description");

    rerender(<PromptInputSubmit aria-label="Send message" />);
    expect(
      screen.getByRole("button", { name: "Send message" }),
    ).not.toHaveAttribute("aria-description");
  });

  it("lets a caller's tooltip replace the waiting reason", () => {
    render(<PromptInputSubmit status="streaming" tooltip="Thinking" />);

    expect(button("Send")).toHaveAttribute("aria-description", "Thinking");
  });

  it.each([
    ["ready", undefined, "Send"],
    ["error", undefined, "Send"],
    ["submitted", vi.fn(), "Stop"],
    ["streaming", vi.fn(), "Stop"],
  ] as const)(
    "names itself on aria-label while %s, in any shape",
    (status, onStop, name) => {
      render(
        <PromptInputSubmit shape="pill" status={status} onStop={onStop} />,
      );

      const live = button(name);
      expect(live).toHaveAttribute("aria-label", name);
      expect(live.className).toContain("shape-pill");
    },
  );

  it("stays a circle when a caller passes shape={undefined}", () => {
    render(<PromptInputSubmit shape={undefined} />);

    expect(button("Send").className).toContain("shape-circle");
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
      /* The submit button always sits in its tooltip's wrapper. */
      expect(parts).toEqual(["prompt-input-tools", "button-tooltip-wrapper"]);
      expect(footer.lastElementChild).toContainElement(button("Send"));
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

    it("hands a two-argument handler the form as the event's currentTarget", () => {
      let target: EventTarget | null = null;
      const { container } = render(
        <PromptInput
          defaultValue="hello"
          onSubmit={(_message, event) => {
            target = event.currentTarget;
          }}
        />,
      );

      fireEvent.click(button("Send"));

      expect(target).toBe(container.querySelector("form"));
    });

    /* Type-level, so tsc is what fails it: Textarea's native onSubmit must
       not intersect with PromptInput's own, or a handler that reads the form
       event is rejected. */
    it("types onSubmit as the message handler alone", () => {
      expectTypeOf<PromptInputProps["onSubmit"]>().toEqualTypeOf<
        (
          message: PromptInputMessage,
          event: React.FormEvent<HTMLFormElement>,
        ) => void | Promise<void>
      >();
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

      // Safari reports the committing Enter with the legacy composition keyCode
      fireEvent.keyDown(textarea, { key: "Enter", keyCode: 229 });
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

    it.each(["submitted", "streaming"] as const)(
      "renders a disabled Send while %s without onStop, and pressing it does nothing",
      (status) => {
        const { onSubmit } = renderPromptInput({
          status,
          defaultValue: "hello",
        });

        expect(
          screen.queryByRole("button", { name: "Stop" }),
        ).not.toBeInTheDocument();
        expectWaiting(button("Send"));

        fireEvent.click(button("Send"));

        expect(onSubmit).not.toHaveBeenCalled();
      },
    );
  });

  it("renders the examples", () => {
    render(<Examples.Basic />);
    expect(screen.getByText("Nothing sent yet")).toBeInTheDocument();

    render(<Examples.Statuses />);
    expect(screen.getAllByRole("button", { name: "Stop" })).toHaveLength(2);

    render(<Examples.WithoutStop />);
    const waitingSends = screen
      .getAllByRole("button", { name: "Send" })
      .filter((send) => send.getAttribute("aria-disabled") === "true");
    expect(waitingSends).toHaveLength(2);

    for (const Example of [
      Examples.WithHeader,
      Examples.WithTools,
      Examples.Controlled,
      Examples.Disabled,
      Examples.WithConversation,
    ]) {
      expect(() => render(<Example />)).not.toThrow();
    }
  });
});
