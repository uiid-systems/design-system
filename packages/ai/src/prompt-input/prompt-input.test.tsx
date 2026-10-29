import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
