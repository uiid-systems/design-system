import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { Input } from "../input";
import { currencyMask, numberMask, percentMask } from "./number-masks";

/* Expected strings come from `Intl` on the machine running the tests, never a
   typed literal, so the ICU data behind Node decides the separators and spaces.
   Where a test names the character some locales put in place of a plain space,
   it names the code point, since the bare character reads as a plain space. */
const currency = (locale: string, code: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency: code });

const NO_BREAK_SPACE = 0xa0;
const NARROW_NO_BREAK_SPACE = 0x202f;
const SPACE = 0x20;
const codePoints = (text: string) =>
  [...text].map((char) => char.codePointAt(0));

const LOCALES = [
  { locale: "en-US", currency: "USD" },
  { locale: "de-DE", currency: "EUR" },
  { locale: "en-US", currency: "JPY" },
  { locale: "de-CH", currency: "CHF" },
  { locale: "fr-CA", currency: "CAD" },
] as const;

describe("currencyMask", () => {
  describe.each(LOCALES)(
    "$currency in $locale",
    ({ locale, currency: code }) => {
      const mask = currencyMask({ currency: code, locale });
      const intl = currency(locale, code);

      it("formats a positive value as Intl does", () => {
        expect(mask.format(1234.5)).toBe(intl.format(1234.5));
        expect(mask.format(1234567)).toBe(intl.format(1234567));
        expect(mask.format(0)).toBe(intl.format(0));
      });

      it("parses what it formats", () => {
        for (const value of [0, 5, 1234.5, 1234567, -42]) {
          const expected =
            intl.resolvedOptions().maximumFractionDigits === 0
              ? Math.round(value)
              : value;
          expect(mask.parse(mask.format(value))).toBe(expected);
        }
      });

      it("parses what Intl formats", () => {
        expect(mask.parse(intl.format(1234.5))).toBe(
          intl.resolvedOptions().maximumFractionDigits === 0 ? 1235 : 1234.5,
        );
      });

      it("parses an empty field to null", () => {
        expect(mask.parse("")).toBeNull();
      });

      it("formats null as an empty field", () => {
        expect(mask.format(null)).toBe("");
      });
    },
  );

  it("takes its symbol side from Intl", () => {
    expect(currencyMask({ currency: "USD" }).format(5).startsWith("$")).toBe(
      true,
    );
    expect(
      currencyMask({ currency: "EUR", locale: "de-DE" })
        .format(5)
        .endsWith("€"),
    ).toBe(true);
    expect(
      currencyMask({ currency: "CAD", locale: "fr-CA" })
        .format(5)
        .endsWith("$"),
    ).toBe(true);
    expect(
      currencyMask({ currency: "CHF", locale: "de-CH" })
        .format(5)
        .startsWith("CHF"),
    ).toBe(true);
  });

  it("takes its decimal count from Intl", () => {
    expect(currencyMask({ currency: "USD" }).format(5)).toBe("$5.00");
    expect(currencyMask({ currency: "JPY" }).format(5)).toBe("¥5");
    expect(currencyMask({ currency: "JPY" }).format(5.4)).toBe("¥5");
  });

  it("rounds extra decimals as Intl does rather than cutting them off", () => {
    const usd = currencyMask({ currency: "USD" });
    const intl = currency("en-US", "USD");
    for (const value of [1.005, 2.675, 1234.567, -0.125]) {
      expect(usd.format(value)).toBe(intl.format(value));
    }
    expect(currencyMask({ currency: "JPY" }).format(5.5)).toBe("¥6");
  });

  it("keeps the non-breaking space Intl puts before a trailing symbol", () => {
    const eur = currencyMask({ currency: "EUR", locale: "de-DE" }).format(5);
    const cad = currencyMask({ currency: "CAD", locale: "fr-CA" }).format(5);
    const spaces = [NO_BREAK_SPACE, NARROW_NO_BREAK_SPACE];

    expect(spaces).toContain(codePoints(eur).at(-2));
    expect(spaces).toContain(codePoints(cad).at(-2));
    expect(codePoints(eur)).not.toContain(SPACE);
    expect(codePoints(cad)).not.toContain(SPACE);
  });

  it("puts the minus sign first", () => {
    expect(currencyMask({ currency: "USD" }).format(-5)).toBe("-$5.00");
    expect(
      currencyMask({ currency: "CHF", locale: "de-CH" }).format(-5),
    ).toMatch(/^-CHF/);
  });

  it("clamps to min and max", () => {
    const mask = currencyMask({ currency: "USD", min: 0, max: 1000 });
    expect(mask.format(5000)).toBe("$1,000.00");
    expect(mask.format(-5)).toBe("$0.00");
  });

  it("parses more digits than a number can hold to null, not Infinity", () => {
    const digits = "9".repeat(400);
    expect(currencyMask({ currency: "USD" }).parse(`$${digits}`)).toBeNull();
    expect(numberMask().parse(digits)).toBeNull();
    expect(numberMask().parse(`-${digits}`)).toBeNull();
  });

  it("parses a negative zero to 0", () => {
    expect(Object.is(currencyMask({ currency: "USD" }).parse("-$0"), 0)).toBe(
      true,
    );
    expect(Object.is(numberMask().parse("-0"), 0)).toBe(true);
  });

  it("asks for the decimal keyboard, or numeric for a currency without decimals", () => {
    expect(currencyMask({ currency: "USD", min: 0 }).inputMode).toBe("decimal");
    expect(currencyMask({ currency: "JPY", min: 0 }).inputMode).toBe("numeric");
  });
});

describe("percentMask", () => {
  it.each(["en-US", "de-DE", "fr-CA", "de-CH"])(
    "formats the shown number with the percent sign Intl uses in %s",
    (locale) => {
      const mask = percentMask({ locale });
      const intl = new Intl.NumberFormat(locale, { style: "percent" });
      expect(mask.format(50)).toBe(intl.format(0.5));
      expect(mask.parse(mask.format(50))).toBe(50);
      expect(mask.parse("")).toBeNull();
    },
  );

  it("has no decimals unless asked for", () => {
    expect(percentMask().format(12.6)).toBe("13%");
    expect(percentMask({ maximumFractionDigits: 1 }).format(12.5)).toBe(
      "12.5%",
    );
  });

  it("asks for the numeric keyboard, or decimal once it takes decimals", () => {
    expect(percentMask({ min: 0 }).inputMode).toBe("numeric");
    expect(percentMask({ min: 0, maximumFractionDigits: 2 }).inputMode).toBe(
      "decimal",
    );
  });
});

describe("numberMask", () => {
  it.each(["en-US", "de-DE", "fr-CA", "de-CH"])(
    "groups digits as Intl does in %s",
    (locale) => {
      const mask = numberMask({ locale, maximumFractionDigits: 2 });
      const intl = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
      expect(mask.format(1234567.5)).toBe(intl.format(1234567.5));
      expect(mask.parse(mask.format(1234567.5))).toBe(1234567.5);
      expect(mask.parse("")).toBeNull();
    },
  );

  it("drops decimals by default", () => {
    expect(numberMask().format(1234.6)).toBe("1,235");
  });

  it("does not pad decimals", () => {
    expect(numberMask({ maximumFractionDigits: 2 }).format(5)).toBe("5");
  });

  it("asks for the numeric keyboard, or decimal once it takes decimals", () => {
    expect(numberMask({ min: 0 }).inputMode).toBe("numeric");
    expect(numberMask({ min: 0, maximumFractionDigits: 2 }).inputMode).toBe(
      "decimal",
    );
  });
});

/* The iOS numeric and decimal keypads have no minus key, so a mask that takes
   a negative asks for no keyboard and leaves the full one. */
const MASKS = [
  {
    name: "currencyMask",
    build: (min?: number) => currencyMask({ currency: "USD", min }),
    keypad: "decimal",
  },
  {
    name: "percentMask",
    build: (min?: number) => percentMask({ min }),
    keypad: "numeric",
  },
  {
    name: "numberMask",
    build: (min?: number) => numberMask({ min }),
    keypad: "numeric",
  },
] as const;

describe.each(MASKS)("$name keyboard", ({ build, keypad }) => {
  it.each([
    { min: undefined, expected: undefined },
    { min: -10, expected: undefined },
    { min: 0, expected: keypad },
    { min: 5, expected: keypad },
  ])("asks for $expected when min is $min", ({ min, expected }) => {
    expect(build(min).inputMode).toBe(expected);
  });

  it("renders no inputmode on Input when min is unset", () => {
    render(<Input mask={build()} />);

    expect(screen.getByRole("textbox")).not.toHaveAttribute("inputmode");
  });

  it("renders the keypad's inputmode on Input when min is 0", () => {
    render(<Input mask={build(0)} />);

    expect(screen.getByRole("textbox")).toHaveAttribute("inputmode", keypad);
  });

  it("lets the caller's inputMode win either way", () => {
    render(
      <>
        <Input aria-label="signed" mask={build()} inputMode="decimal" />
        <Input aria-label="unsigned" mask={build(0)} inputMode="text" />
      </>,
    );

    expect(screen.getByLabelText("signed")).toHaveAttribute(
      "inputmode",
      "decimal",
    );
    expect(screen.getByLabelText("unsigned")).toHaveAttribute(
      "inputmode",
      "text",
    );
  });
});

/* These run the real Maskito engine on a real `Input`. happy-dom has no
   editing of its own, so user-event plays the browser: it fires `beforeinput`,
   edits the value when that is not cancelled, then fires `input`. That is
   enough to show what the engine writes and what React reports. It is not
   enough to show caret movement from keys or the pointer (happy-dom fires no
   `selectionchange`), clipboard paste or IME composition; those are left to
   the real-browser tests.

   user-event also caches the value it last typed, and the engine's rewrite
   goes around the setter user-event watches, so after a rewrite that cache is
   stale (`5.` while the field reads `$5.00`). Tests here therefore type into a
   fresh field and do not lean on user-event's own caret handling (`{End}`,
   arrow keys, `user.clear`); those cases also belong to the real-browser
   tests. */
const usd = currencyMask({ currency: "USD" });
const eur = currencyMask({ currency: "EUR", locale: "de-DE" });
const percent = percentMask();

describe("number masks on Input", () => {
  it("reports every value the engine rewrites to onValueChange", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Input mask={usd} onValueChange={onValueChange} />);

    await user.type(screen.getByRole("textbox"), "1234.5");

    expect(onValueChange.mock.calls.map(([value]) => value)).toEqual([
      "$1",
      "$12",
      "$123",
      "$1,234",
      "$1,234.",
      "$1,234.5",
    ]);
  });

  it("keeps a controlled value in step with what the engine writes", async () => {
    const user = userEvent.setup();
    const Controlled = () => {
      const [value, setValue] = React.useState("");
      return (
        <>
          <Input mask={eur} value={value} onValueChange={setValue} />
          <output>{value}</output>
        </>
      );
    };
    render(<Controlled />);

    await user.type(screen.getByRole("textbox"), "1234,5");

    const typed = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      minimumFractionDigits: 1,
    }).format(1234.5);
    expect(screen.getByRole("textbox")).toHaveValue(typed);
    // textContent, not toHaveTextContent, which folds U+00A0 into a space.
    expect(screen.getByRole("status").textContent).toBe(typed);
  });

  it("rejects a letter and a decimal past the currency's count", async () => {
    const user = userEvent.setup();
    render(<Input mask={usd} />);

    await user.type(screen.getByRole("textbox"), "12a.345");

    expect(screen.getByRole("textbox")).toHaveValue("$12.34");
  });

  it("empties a currency field once its last digit is deleted", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Input mask={eur} onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "5");
    expect(input).toHaveValue(
      new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
      }).format(5),
    );

    await user.keyboard("{Backspace}");

    expect(input).toHaveValue("");
    expect(onValueChange).toHaveBeenLastCalledWith("", expect.anything());
  });

  it("empties a percent field when everything is selected and deleted", async () => {
    const user = userEvent.setup();
    render(<Input mask={percent} />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    await user.type(input, "50");
    expect(input).toHaveValue("50%");

    input.setSelectionRange(0, input.value.length);
    await user.keyboard("{Backspace}");

    expect(input).toHaveValue("");
  });

  it("keeps a lone minus while typing and drops it on blur", async () => {
    const user = userEvent.setup();
    render(<Input mask={usd} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "-");
    expect(input).toHaveValue("-");

    await user.tab();
    expect(input).toHaveValue("");
  });

  it("pads decimals on blur, not while typing", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Input mask={usd} onValueChange={onValueChange} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "5");
    expect(input).toHaveValue("$5");

    await user.tab();

    expect(input).toHaveValue("$5.00");
    expect(onValueChange).toHaveBeenLastCalledWith("$5.00", expect.anything());
  });

  it("pads a trailing separator on blur", async () => {
    const user = userEvent.setup();
    render(<Input mask={usd} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "5.");
    await user.tab();

    expect(input).toHaveValue("$5.00");
  });

  it("pads a leading separator on blur", async () => {
    const user = userEvent.setup();
    render(<Input mask={usd} />);
    const input = screen.getByRole("textbox");

    await user.type(input, ".5");
    await user.tab();

    expect(input).toHaveValue("$0.50");
  });

  it("leaves an empty field empty on blur", async () => {
    const user = userEvent.setup();
    render(<Input mask={usd} />);
    const input = screen.getByRole("textbox");

    await user.click(input);
    await user.tab();

    expect(input).toHaveValue("");
  });

  it("does not pad a percent or a plain number on blur", async () => {
    const user = userEvent.setup();
    const decimals = numberMask({ maximumFractionDigits: 2 });
    render(
      <>
        <Input aria-label="rate" mask={percent} />
        <Input aria-label="count" mask={decimals} />
      </>,
    );

    await user.type(screen.getByLabelText("rate"), "7");
    await user.type(screen.getByLabelText("count"), "1234.5");
    await user.tab();

    expect(screen.getByLabelText("rate")).toHaveValue("7%");
    expect(screen.getByLabelText("count")).toHaveValue("1,234.5");
  });

  it.each([
    {
      name: "currencyMask",
      mask: currencyMask({ currency: "USD", min: 0 }),
      typed: "$5",
    },
    { name: "percentMask", mask: percentMask({ min: 0 }), typed: "5%" },
    { name: "numberMask", mask: numberMask({ min: 0 }), typed: "5" },
  ])("refuses a minus sign in a $name with min 0", async ({ mask, typed }) => {
    const user = userEvent.setup();
    render(<Input mask={mask} />);

    await user.type(screen.getByRole("textbox"), "-5");

    expect(screen.getByRole("textbox")).toHaveValue(typed);
  });

  it("takes a minus sign when min is unset", async () => {
    const user = userEvent.setup();
    render(<Input mask={numberMask()} />);

    await user.type(screen.getByRole("textbox"), "-5");

    expect(screen.getByRole("textbox")).toHaveValue("-5");
  });

  it("lets a value below a positive min be typed and raises it on blur", async () => {
    const user = userEvent.setup();
    const atLeastFive = numberMask({ min: 5 });
    render(<Input mask={atLeastFive} />);
    const input = screen.getByRole("textbox");

    await user.type(input, "3");
    expect(input).toHaveValue("3");

    await user.tab();
    expect(input).toHaveValue("5");
  });

  it("takes a formatted defaultValue as it is", () => {
    render(<Input mask={eur} defaultValue={eur.format(1234.5)} />);

    expect(screen.getByRole("textbox")).toHaveValue(eur.format(1234.5));
  });

  it("pulls the caret back from a trailing symbol on focus", () => {
    render(<Input mask={eur} defaultValue={eur.format(1234.5)} />);
    const input = screen.getByRole<HTMLInputElement>("textbox");
    const end = input.value.length;
    // de-DE EUR ends in a no-break space and the euro sign.
    expect([NO_BREAK_SPACE, NARROW_NO_BREAK_SPACE]).toContain(
      codePoints(input.value).at(-2),
    );
    expect(input.value.at(-1)).toBe("€");
    const digitsEnd = end - 2;

    input.setSelectionRange(end, end);
    input.focus();

    expect([input.selectionStart, input.selectionEnd]).toEqual([
      digitsEnd,
      digitsEnd,
    ]);
  });

  it("leaves the caret after a lone minus, which has no symbol yet", () => {
    render(<Input mask={eur} defaultValue="-" />);
    const input = screen.getByRole<HTMLInputElement>("textbox");

    input.setSelectionRange(1, 1);
    input.focus();

    expect([input.selectionStart, input.selectionEnd]).toEqual([1, 1]);
  });

  it("stops responding once the mask is removed", async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Input mask={usd} />);

    rerender(<Input />);
    await user.type(screen.getByRole("textbox"), "12a");

    expect(screen.getByRole("textbox")).toHaveValue("12a");
  });
});
