import { Maskito, maskitoTransform, maskitoUpdateElement } from "@maskito/core";
import type { MaskitoOptions, MaskitoPostprocessor } from "@maskito/core";
import {
  maskitoCaretGuard,
  maskitoEventHandler,
  maskitoNumber,
  maskitoParseNumber,
  maskitoStringifyNumber,
} from "@maskito/kit";
import type { MaskitoNumberParams } from "@maskito/kit";

import type { InputMask } from "../input.types";
import type {
  CurrencyMaskOptions,
  NumberMaskOptions,
  PercentMaskOptions,
} from "./number-masks.types";
import { visibleToReact } from "./visible-to-react";

/* Every use of the Maskito engine lives in this file, so an engine upgrade
   touches nothing else. Nothing here is exported but the three factories. */

const hasDigit = (value: string) => /\d/.test(value);

/* The engine cuts extra decimals off, so `format(1234.6)` would read `1,234`.
   Rounding through `Intl` first matches what `Intl.NumberFormat` shows, half
   away from zero on the decimal digits, so `1.005` rounds up as written. */
const rounder = (digits: number) => {
  const plain = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: digits,
    useGrouping: false,
  });
  return (value: number) => Number(plain.format(value));
};

/** `padTo` is the decimal count shown once the field is left, never while typing. */
function buildNumberMask(
  params: MaskitoNumberParams,
  padTo = 0,
): InputMask<number | null> {
  const typed = {
    minusSign: "-",
    negativePattern: "minusFirst" as const,
    ...params,
  };
  const settled = { ...typed, minimumFractionDigits: padTo };
  const typing = maskitoNumber(typed);
  const settledOptions = maskitoNumber(settled);
  const postfix = typed.postfix ?? "";
  const round = rounder(typed.maximumFractionDigits ?? 0);
  /* The iOS numeric and decimal keypads have no minus key, so a field that
     takes a negative asks for no keyboard and gets the full one. */
  const takesNegative = (typed.min ?? -Infinity) < 0;

  /* With no digit left, drop the affixes so a cleared field is "". A lone minus
     survives so a negative can still be started; blur drops it. */
  const emptyWithoutDigits: MaskitoPostprocessor = ({ value, selection }) => {
    if (hasDigit(value)) return { value, selection };
    const bare = value.includes(typed.minusSign) ? typed.minusSign : "";
    return { value: bare, selection: [bare.length, bare.length] };
  };

  /* Padding while typing would put `.00` after the first digit and fight every
     Backspace, so the decimals are padded only when the field is left. */
  const settle = (value: string) =>
    hasDigit(value) ? maskitoTransform(value, settledOptions) : "";

  /* Keeps the caret out of a trailing symbol, so End, a click past the text or
     Backspace at the end land beside the digits. A value without the symbol,
     such as a lone minus, has nothing to guard. */
  const digitsEnd = (value: string) =>
    value.endsWith(postfix) ? value.length - postfix.length : value.length;

  const options: MaskitoOptions = {
    ...typing,
    postprocessors: [...(typing.postprocessors ?? []), emptyWithoutDigits],
    plugins: [
      ...(typing.plugins ?? []),
      ...(postfix ? [maskitoCaretGuard((value) => [0, digitsEnd(value)])] : []),
      maskitoEventHandler("blur", (element) =>
        maskitoUpdateElement(element, settle(element.value)),
      ),
    ],
  };

  return {
    inputMode: takesNegative
      ? undefined
      : typed.maximumFractionDigits
        ? "decimal"
        : "numeric",
    attach(element) {
      const maskito = new Maskito(visibleToReact(element), options);
      return () => maskito.destroy();
    },
    format: (value) =>
      maskitoStringifyNumber(value === null ? null : round(value), settled),
    /* No digits gives NaN, and more digits than a double holds gives
       Infinity; both read as no value. `+ 0` turns a typed `-0` into `0`. */
    parse(masked) {
      const parsed = maskitoParseNumber(masked, typed);
      return Number.isFinite(parsed) ? parsed + 0 : null;
    },
  };
}

/** Splits what Intl renders around the digits into a prefix and a postfix. */
function affixes(format: Intl.NumberFormat) {
  const parts = format.formatToParts(1);
  const isDigits = (part: Intl.NumberFormatPart) =>
    part.type === "integer" || part.type === "fraction";
  const first = parts.findIndex(isDigits);
  const last = parts.length - 1 - [...parts].reverse().findIndex(isDigits);
  const join = (slice: Intl.NumberFormatPart[]) =>
    slice.map((part) => part.value).join("");
  return {
    prefix: join(parts.slice(0, first)),
    postfix: join(parts.slice(last + 1)),
  };
}

/**
 * A mask for a money amount, for `Input`'s `mask` prop. The symbol, the side it
 * sits on and the decimal count come from `Intl.NumberFormat`, so
 * `{ currency: "EUR", locale: "de-DE" }` reads `1.234,50 €`. Decimals are
 * padded when the field is left, not while typing. A field with no digits is
 * empty, and the caret cannot move past the digits into a trailing symbol.
 *
 * The value stays the masked string. Use `format` for `defaultValue` or a
 * controlled `value`, and `parse` to read the number back; `parse` returns
 * `null` for an empty field.
 *
 * Two places differ from `Intl`. A negative always starts with an ASCII
 * hyphen-minus, ahead of any symbol, so CHF in de-CH reads `-CHF 5.00` where
 * `Intl` writes `CHF-5.00`. And digits are Latin only: in a locale whose
 * default numbering system is not Latin, such as `ar-EG`, the field shows
 * Latin digits with that locale's separators, and `parse` reads neither
 * native-script digits nor what `Intl` formats for that locale.
 *
 * Create the mask once, at module scope or in `useMemo`. `Input` attaches a
 * new mask whenever it receives a different object, so calling this during
 * render re-attaches the mask on every render.
 *
 * @example
 * const usd = currencyMask({ currency: "USD" });
 *
 * <Input mask={usd} defaultValue={usd.format(1234.5)} />
 */
export function currencyMask({
  currency,
  locale = "en-US",
  min,
  max,
}: CurrencyMaskOptions): InputMask<number | null> {
  const format = new Intl.NumberFormat(locale, { style: "currency", currency });
  const digits = format.resolvedOptions().maximumFractionDigits ?? 2;
  return buildNumberMask(
    { locale, min, max, ...affixes(format), maximumFractionDigits: digits },
    digits,
  );
}

/**
 * A mask for a percentage, for `Input`'s `mask` prop. The percent sign and its
 * spacing come from `Intl.NumberFormat` for `locale`. The value is the number
 * as shown: `parse("50%")` is `50`, not `0.5`, and `format(50)` is `50%`.
 *
 * A negative always starts with an ASCII hyphen-minus, whatever the locale.
 * Digits are Latin only: in a locale whose default numbering system is not
 * Latin, such as `ar-EG`, the field shows Latin digits with that locale's
 * separators, and `parse` reads no native-script digits.
 *
 * Create the mask once, at module scope or in `useMemo`. `Input` attaches a
 * new mask whenever it receives a different object, so calling this during
 * render re-attaches the mask on every render.
 *
 * @example
 * const rate = percentMask({ maximumFractionDigits: 1 });
 *
 * <Input mask={rate} onValueChange={(masked) => setRate(rate.parse(masked))} />
 */
export function percentMask({
  locale = "en-US",
  min,
  max,
  maximumFractionDigits = 0,
}: PercentMaskOptions = {}): InputMask<number | null> {
  const format = new Intl.NumberFormat(locale, { style: "percent" });
  return buildNumberMask({
    locale,
    min,
    max,
    ...affixes(format),
    maximumFractionDigits,
  });
}

/**
 * A mask for a plain number with the digit grouping of `locale`, for `Input`'s
 * `mask` prop. It takes no decimals unless `maximumFractionDigits` allows them,
 * and never pads them.
 *
 * A negative always starts with an ASCII hyphen-minus, whatever the locale.
 * Digits are Latin only: in a locale whose default numbering system is not
 * Latin, such as `ar-EG`, the field shows Latin digits with that locale's
 * separators, and `parse` reads no native-script digits.
 *
 * Create the mask once, at module scope or in `useMemo`. `Input` attaches a
 * new mask whenever it receives a different object, so calling this during
 * render re-attaches the mask on every render.
 *
 * @example
 * const quantity = numberMask({ min: 0 });
 *
 * <Input mask={quantity} defaultValue={quantity.format(1200)} />
 */
export function numberMask({
  locale = "en-US",
  min,
  max,
  maximumFractionDigits = 0,
}: NumberMaskOptions = {}): InputMask<number | null> {
  return buildNumberMask({ locale, min, max, maximumFractionDigits });
}
