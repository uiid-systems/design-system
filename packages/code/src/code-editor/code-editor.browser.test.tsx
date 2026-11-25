import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { CodeEditor } from "./code-editor";

import "@uiid/tokens/globals.css";

/* Runs in a real browser, which lays out the header and textarea. */
describe("CodeEditor header", () => {
  it("keeps the textarea in place as the first character is typed and cleared", async () => {
    render(<CodeEditor />);
    const textarea = page.getByRole("textbox");
    await expect.element(textarea).toBeInTheDocument();
    const el = textarea.element() as HTMLElement;
    const header = document.querySelector('[data-slot="code-block-header"]');
    expect(header).toBeInTheDocument();

    const top = el.getBoundingClientRect().top;
    await userEvent.type(el, "x");
    await expect
      .element(page.getByRole("button", { name: "Copy code" }))
      .toBeInTheDocument();
    expect(document.querySelector('[data-slot="code-block-header"]')).toBe(
      header,
    );
    expect(el.getBoundingClientRect().top).toBe(top);

    await userEvent.clear(el);
    await expect
      .poll(() => page.getByRole("button", { name: "Copy code" }).query())
      .toBeNull();
    expect(el.getBoundingClientRect().top).toBe(top);
  });
});
