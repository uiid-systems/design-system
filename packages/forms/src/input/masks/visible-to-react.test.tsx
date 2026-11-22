import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { visibleToReact } from "./visible-to-react";

/* The masks rely on one React detail: a value written through the element's
   own `value` property is invisible to `onChange`. These tests pin both halves
   of that, so a React upgrade that changes it fails here by name rather than as
   a mask that silently stops reporting values. */
describe("visibleToReact", () => {
  it("premise: React skips onChange after a write through the element's own value", () => {
    const onChange = vi.fn();
    render(<input aria-label="field" onChange={onChange} />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    input.value = "$1";
    fireEvent.input(input);

    expect(onChange).not.toHaveBeenCalled();
  });

  it("makes a write through the wrapper reach onChange", () => {
    const onChange = vi.fn(
      (event: React.ChangeEvent<HTMLInputElement>) => event.target.value,
    );
    render(<input aria-label="field" onChange={onChange} />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    visibleToReact(input).value = "$1";
    fireEvent.input(input);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveLastReturnedWith("$1");
    expect(input.value).toBe("$1");
  });

  it("keeps a controlled input's state in step with a wrapper write", () => {
    const onChange = vi.fn();
    render(<input aria-label="field" value="" onChange={onChange} />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    visibleToReact(input).value = "$5";
    fireEvent.input(input);

    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("passes other reads, writes and methods through to the element", () => {
    render(<input aria-label="field" defaultValue="abc" />);
    const input = screen.getByRole<HTMLInputElement>("textbox");
    const wrapped = visibleToReact(input);
    const listener = vi.fn();

    wrapped.addEventListener("focus", listener);
    wrapped.focus();
    wrapped.setSelectionRange(1, 2);
    wrapped.placeholder = "Amount";

    expect(wrapped.value).toBe("abc");
    expect(wrapped.nodeName).toBe("INPUT");
    expect(document.activeElement).toBe(input);
    expect(listener).toHaveBeenCalledTimes(1);
    expect([input.selectionStart, input.selectionEnd]).toEqual([1, 2]);
    expect(input.placeholder).toBe("Amount");

    wrapped.removeEventListener("focus", listener);
    input.blur();
    wrapped.focus();
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
