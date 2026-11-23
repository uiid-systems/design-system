import { render } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { page, userEvent } from "vitest/browser";

import { Input } from "../input";
import { currencyMask, percentMask } from "./number-masks";

/* These run in a real browser, for what happy-dom cannot show: the browser's
   own editing, caret movement from keys and the pointer, `selectionchange`
   (which drives the caret guard) and a real clipboard paste. Keys are real
   key presses sent through Playwright, so the browser decides what each one
   edits before the engine sees it.

   The caret guard and the engine's rewrites land after the key press resolves,
   so every check waits for the state it expects (`expect.element`,
   `expect.poll`) rather than reading the field once. */

// Masks are built once, at module scope, as `Input` expects.
const usd = currencyMask({ currency: "USD" });
const eur = currencyMask({ currency: "EUR", locale: "de-DE" });
const percent = percentMask();

/* Testing Library marks the page as an act() environment, which suits
   happy-dom. Here the events come from outside React, so act() never wraps
   them and React would warn on every keystroke. */
beforeEach(() => {
  (
    globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = false;
});

const field = () => page.getByRole("textbox", { name: "amount" });
const element = () => field().element() as HTMLInputElement;
const selection = () => [element().selectionStart, element().selectionEnd];

/** Focuses the field and puts the caret or selection where asked. */
const select = async (start: number, end = start) => {
  element().focus();
  element().setSelectionRange(start, end);
  await expect.poll(selection).toEqual([start, end]);
};

/* Puts `text` on the system clipboard with a real copy keystroke from a plain
   textarea, so the paste that follows is the browser's own, from the
   clipboard, and not a synthetic event. */
const copy = async (text: string) => {
  const source = page.getByRole("textbox", { name: "clipboard" });
  const textarea = source.element() as HTMLTextAreaElement;
  textarea.value = text;
  textarea.focus();
  textarea.select();
  await userEvent.copy();
};

const renderField = (mask: typeof usd, defaultValue?: string) =>
  render(
    <>
      <Input aria-label="amount" mask={mask} defaultValue={defaultValue} />
      <textarea aria-label="clipboard" />
    </>,
  );

describe("typing", () => {
  it("groups digits as they are typed", async () => {
    renderField(usd);
    await userEvent.click(field());

    await userEvent.keyboard("1234567.8");

    await expect.element(field()).toHaveValue("$1,234,567.8");
    expect(selection()).toEqual([12, 12]);
  });

  it("groups digits with the locale's separators", async () => {
    renderField(eur);
    await userEvent.click(field());

    await userEvent.keyboard("1234567,8");

    await expect.element(field()).toHaveValue(
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 1,
      }).format(1234567.8),
    );
  });

  it("keeps the caret in place when a digit goes in mid-number", async () => {
    renderField(usd, usd.format(1234.5));
    await select(3);

    await userEvent.keyboard("9");

    await expect.element(field()).toHaveValue("$19,234.50");
    await expect.poll(selection).toEqual([3, 3]);
  });

  /* KNOWN DEFECT, recorded rather than fixed (found in UI-430). In a locale
     whose grouping separator is a period, a typed `.` is taken as grouping, not
     as the decimal separator. The keys `1 2 3 4 . 5` in a de-DE EUR field give
     `12.345 €`, which parses as 12345: ten times the amount typed, with nothing
     on screen to say so beyond the grouping. When the mask is fixed, this test
     should be rewritten to expect `1.234,5 €`. */
  it("KNOWN DEFECT: typing 1234.5 in de-DE EUR gives 12.345 €, ten times the amount", async () => {
    renderField(eur);
    await userEvent.click(field());

    await userEvent.keyboard("1234.5");

    const tenTimes = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 0,
    }).format(12345);
    await expect.element(field()).toHaveValue(tenTimes);
    expect(eur.parse(element().value)).toBe(12345);
  });
});

describe("deleting across a group separator", () => {
  it("steps Backspace over the separator, then deletes the digit before it", async () => {
    renderField(usd, "$1,234");
    // Between the comma and the 2.
    await select(3);

    await userEvent.keyboard("{Backspace}");
    await expect.poll(selection).toEqual([2, 2]);
    expect(element().value).toBe("$1,234");

    await userEvent.keyboard("{Backspace}");
    await expect.element(field()).toHaveValue("$234");
    await expect.poll(selection).toEqual([1, 1]);
  });

  it("steps Delete over the separator, then deletes the digit after it", async () => {
    renderField(usd, "$1,234");
    // Between the 1 and the comma.
    await select(2);

    await userEvent.keyboard("{Delete}");
    await expect.poll(selection).toEqual([3, 3]);
    expect(element().value).toBe("$1,234");

    await userEvent.keyboard("{Delete}");
    await expect.element(field()).toHaveValue("$134");
    await expect.poll(selection).toEqual([2, 2]);
  });
});

describe("select and replace", () => {
  it("replaces a selection that spans a group separator", async () => {
    renderField(usd, "$123,456.78");
    // `23,`
    await select(2, 5);

    await userEvent.keyboard("9");

    await expect.element(field()).toHaveValue("$19,456.78");
    await expect.poll(selection).toEqual([3, 3]);
  });

  it("replaces a selection that spans the decimal separator", async () => {
    renderField(usd, "$5,456.78");
    // `456.7`
    await select(3, 8);

    await userEvent.keyboard("0");

    await expect.element(field()).toHaveValue("$508");
  });

  it("replaces everything, symbol included, when all is selected", async () => {
    renderField(eur, eur.format(1234.5));
    element().focus();

    await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");
    await userEvent.keyboard("7");

    await expect.element(field()).toHaveValue(eur.format(7).replace(",00", ""));
    await expect.poll(selection).toEqual([1, 1]);
  });
});

describe("paste", () => {
  it("reaches a plain textarea, so the clipboard itself works", async () => {
    render(
      <>
        <textarea aria-label="clipboard" />
        <textarea aria-label="target" />
      </>,
    );
    await copy("clip-check");
    const target = page.getByRole("textbox", { name: "target" });
    (target.element() as HTMLTextAreaElement).focus();

    await userEvent.paste();

    await expect.element(target).toHaveValue("clip-check");
  });

  it.each([
    ["1234.56", "$1,234.56"],
    ["$1,234.56", "$1,234.56"],
    [" USD 1,234.567 ", "$1,234.56"],
    ["-1234.56", "-$1,234.56"],
  ])("formats pasted %j as %j", async (text, expected) => {
    renderField(usd);
    await copy(text);
    element().focus();

    await userEvent.paste();

    await expect.element(field()).toHaveValue(expected);
  });

  it("formats pasted de-DE text in a de-DE field", async () => {
    renderField(eur);
    await copy("1.234,56");
    element().focus();

    await userEvent.paste();

    await expect.element(field()).toHaveValue(eur.format(1234.56));
  });

  it("drops letters from the pasted text", async () => {
    renderField(usd);
    await copy("abc5");
    element().focus();

    await userEvent.paste();

    await expect.element(field()).toHaveValue("$5");
  });

  it("pastes over a partial selection", async () => {
    renderField(usd, "$1,234.56");
    await copy("77");
    // `,23`
    await select(2, 5);

    await userEvent.paste();

    await expect.element(field()).toHaveValue("$1,774.56");
    await expect.poll(selection).toEqual([5, 5]);
  });
});

describe("blur padding", () => {
  it("pads decimals when the field is left, not while typing", async () => {
    renderField(usd);
    await userEvent.click(field());

    await userEvent.keyboard("5");
    await expect.element(field()).toHaveValue("$5");
    await userEvent.tab();

    await expect.element(field()).toHaveValue("$5.00");
  });

  it("pads a de-DE amount before its trailing symbol", async () => {
    renderField(eur);
    await userEvent.click(field());

    await userEvent.keyboard("1234,5");
    await userEvent.tab();

    await expect.element(field()).toHaveValue(eur.format(1234.5));
  });

  it("lets Backspace remove the padding after the field is entered again", async () => {
    renderField(usd);
    await userEvent.click(field());
    await userEvent.keyboard("1234.5");
    await userEvent.tab();
    await expect.element(field()).toHaveValue("$1,234.50");

    await select(element().value.length);
    await userEvent.keyboard("{Backspace}{Backspace}{Backspace}");

    await expect.element(field()).toHaveValue("$1,234");
  });
});

describe("clearing", () => {
  it("empties a trailing-symbol field when everything is selected and deleted", async () => {
    renderField(eur, eur.format(1234.5));
    element().focus();

    await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");
    await userEvent.keyboard("{Backspace}");

    await expect.element(field()).toHaveValue("");
  });

  it("empties a leading-symbol field when everything is selected and deleted", async () => {
    renderField(usd, usd.format(1234.5));
    element().focus();

    await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");
    await userEvent.keyboard("{Backspace}");

    await expect.element(field()).toHaveValue("");
  });

  it("empties the field when the last digit is backspaced", async () => {
    renderField(eur);
    await userEvent.click(field());
    await userEvent.keyboard("12");

    await userEvent.keyboard("{Backspace}{Backspace}");

    await expect.element(field()).toHaveValue("");
  });

  it("empties a percent field when everything is selected and deleted", async () => {
    renderField(percent, "50%");
    element().focus();

    await userEvent.keyboard("{ControlOrMeta>}a{/ControlOrMeta}");
    await userEvent.keyboard("{Backspace}");

    await expect.element(field()).toHaveValue("");
  });
});

describe("caret beside a trailing symbol", () => {
  it("stops End beside the digits, before the symbol", async () => {
    renderField(eur, eur.format(1234.5));
    const digitsEnd = eur.format(1234.5).length - 2;
    await select(1);

    await userEvent.keyboard("{End}");

    await expect.poll(selection).toEqual([digitsEnd, digitsEnd]);
  });

  it("deletes the last digit on Backspace after End", async () => {
    renderField(eur, eur.format(1234.5));
    const digitsEnd = eur.format(1234.5).length - 2;
    await select(1);
    await userEvent.keyboard("{End}");
    await expect.poll(selection).toEqual([digitsEnd, digitsEnd]);

    await userEvent.keyboard("{Backspace}");

    await expect
      .element(field())
      .toHaveValue(eur.format(1234.5).replace("50", "5"));
    await expect.poll(selection).toEqual([digitsEnd - 1, digitsEnd - 1]);
  });

  it("types after the digits of a percent following End", async () => {
    renderField(percent, "50%");
    await select(0);
    await userEvent.keyboard("{End}");
    await expect.poll(selection).toEqual([2, 2]);

    await userEvent.keyboard("7");

    await expect.element(field()).toHaveValue("507%");
  });

  it("keeps ArrowRight from passing the digits", async () => {
    renderField(eur, eur.format(1234.5));
    const digitsEnd = eur.format(1234.5).length - 2;
    await select(digitsEnd - 1);

    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}");

    await expect.poll(selection).toEqual([digitsEnd, digitsEnd]);
  });

  it("stops Shift+End selection before the symbol", async () => {
    renderField(eur, eur.format(1234.5));
    const digitsEnd = eur.format(1234.5).length - 2;
    await select(0);

    await userEvent.keyboard("{Shift>}{End}{/Shift}");

    await expect.poll(selection).toEqual([0, digitsEnd]);
  });

  it("puts the caret beside the digits on a click past the text", async () => {
    renderField(eur, eur.format(1234.5));
    const digitsEnd = eur.format(1234.5).length - 2;
    const { width, height } = element().getBoundingClientRect();

    await userEvent.click(field(), {
      position: { x: width - 4, y: height / 2 },
    });

    await expect.poll(selection).toEqual([digitsEnd, digitsEnd]);
  });
});
