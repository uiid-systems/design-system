import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { Input } from "../input";
import { phoneMask } from "./patterns/phone";

/* A fixed-pattern mask in a real browser: typing past a literal, deleting
   across one and a real clipboard paste, as `number-masks.browser.test.tsx`
   does for the number masks. Every check waits for the state it expects,
   since the engine's rewrites land after the key press resolves. */

/* Testing Library marks the page as an act() environment, which suits
   happy-dom. Here the events come from outside React, so act() never wraps
   them and React would warn on every keystroke. */
beforeEach(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = false;
});

const field = () => page.getByRole("textbox", { name: "phone" });
const element = () => field().element() as HTMLInputElement;
const selection = () => [element().selectionStart, element().selectionEnd];

const select = async (start: number, end = start) => {
  element().focus();
  element().setSelectionRange(start, end);
  await expect.poll(selection).toEqual([start, end]);
};

/* Puts `text` on the system clipboard with a real copy keystroke from a plain
   textarea, so the paste that follows is the browser's own. */
const copy = async (text: string) => {
  const source = page.getByRole("textbox", { name: "clipboard" });
  const textarea = source.element() as HTMLTextAreaElement;
  textarea.value = text;
  textarea.focus();
  textarea.select();
  await userEvent.copy();
};

const renderField = (defaultValue?: string) =>
  render(
    <>
      <Input aria-label="phone" mask={phoneMask} defaultValue={defaultValue} />
      <textarea aria-label="clipboard" />
    </>,
  );

describe("phoneMask", () => {
  it("writes the literals as digits are typed past them", async () => {
    renderField();
    await userEvent.click(field());

    await userEvent.keyboard("1234");
    await expect.element(field()).toHaveValue("(123) 4");
    expect(selection()).toEqual([7, 7]);

    await userEvent.keyboard("567890");
    await expect.element(field()).toHaveValue("(123) 456-7890");
    expect(selection()).toEqual([14, 14]);
  });

  it("steps Backspace over a literal, then deletes the digit before it", async () => {
    renderField("(123) 456-7890");
    // Between the hyphen and the 7.
    await select(10);

    await userEvent.keyboard("{Backspace}");
    await expect.poll(selection).toEqual([9, 9]);
    expect(element().value).toBe("(123) 456-7890");

    await userEvent.keyboard("{Backspace}");
    await expect.element(field()).toHaveValue("(123) 457-890");
    await expect.poll(selection).toEqual([8, 8]);
  });

  it("formats a paste of bare digits and puts the caret after it", async () => {
    renderField();
    await copy("5551234567");
    element().focus();

    await userEvent.paste();

    await expect.element(field()).toHaveValue("(555) 123-4567");
    await expect.poll(selection).toEqual([14, 14]);
  });

  it("drops what no slot takes from a paste and cuts it at the template's end", async () => {
    renderField();
    await copy("+1 (555) 123-4567 ext. 9");
    element().focus();

    await userEvent.paste();

    await expect.element(field()).toHaveValue("(155) 512-3456");
  });
});
