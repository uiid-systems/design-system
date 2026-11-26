import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { CodeEditor } from "./code-editor";

import "@uiid/tokens/globals.css";

const header = () => document.querySelector('[data-slot="code-block-header"]');

/* Runs in a real browser, which lays out the header and textarea. */
describe("CodeEditor header", () => {
  it("keeps the textarea in place as the floating copy button comes and goes", async () => {
    render(<CodeEditor />);
    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toBeInTheDocument();
    const el = textarea.element() as HTMLElement;
    expect(header()).toBeNull();

    const top = el.getBoundingClientRect().top;
    await userEvent.type(el, "x");
    await expect
      .element(page.getByRole("button", { name: "Copy code" }))
      .toBeInTheDocument();
    expect(header()).toHaveAttribute("data-floating");
    expect(el.getBoundingClientRect().top).toBe(top);

    await userEvent.clear(el);
    await expect
      .poll(() => page.getByRole("button", { name: "Copy code" }).query())
      .toBeNull();
    expect(el.getBoundingClientRect().top).toBe(top);
  });

  it("keeps the textarea in place under a filename bar as the copy button comes and goes", async () => {
    render(<CodeEditor filename="a.ts" />);
    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toBeInTheDocument();
    const el = textarea.element() as HTMLElement;
    const bar = header();
    expect(bar).toBeInTheDocument();

    const top = el.getBoundingClientRect().top;
    await userEvent.type(el, "x");
    await expect
      .element(page.getByRole("button", { name: "Copy code" }))
      .toBeInTheDocument();
    expect(header()).toBe(bar);
    expect(el.getBoundingClientRect().top).toBe(top);

    await userEvent.clear(el);
    await expect
      .poll(() => page.getByRole("button", { name: "Copy code" }).query())
      .toBeNull();
    expect(el.getBoundingClientRect().top).toBe(top);
  });
});
