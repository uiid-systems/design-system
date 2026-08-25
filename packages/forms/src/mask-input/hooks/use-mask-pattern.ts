import * as React from "react";

import {
  MASK_INPUT_NUMERIC_PATTERNS,
  MASK_INPUT_CURRENCY_PERCENTAGE_SYMBOLS,
  MASK_INPUT_REGEX,
  MASK_INPUT_DEFAULT_CURRENCY,
  MASK_INPUT_DEFAULT_LOCALE,
} from "../mask-input.constants";
import type {
  MaskPattern,
  MaskPatternKey,
  TransformOptions,
} from "../mask-input.types";
import { MASK_PATTERNS } from "../patterns";

export interface UseMaskPatternOptions {
  /** Predefined mask pattern key or custom mask pattern */
  mask?: MaskPatternKey | MaskPattern;
  /** Currency code for currency mask (e.g., "USD", "EUR") */
  currency?: string;
  /** Locale for formatting (e.g., "en-US", "de-DE") */
  locale?: string;
  /** Override the calculated inputMode */
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** Override the calculated maxLength */
  maxLength?: number;
}

export interface UseMaskPatternReturn {
  /** The resolved mask pattern object */
  maskPattern: MaskPattern | undefined;
  /** Memoized transform options for currency/locale */
  transformOpts: TransformOptions;
  /** The calculated input mode based on mask type */
  calculatedInputMode: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  /** Number of value tokens in the pattern (# characters) */
  tokenCount: number | undefined;
  /** The calculated max length for the input */
  calculatedMaxLength: number | undefined;
}

/**
 * Resolves a mask key or pattern object and computes derived values
 * like inputMode, tokenCount, and maxLength.
 */
export function useMaskPattern(
  options: UseMaskPatternOptions,
): UseMaskPatternReturn {
  const {
    mask,
    currency = MASK_INPUT_DEFAULT_CURRENCY,
    locale = MASK_INPUT_DEFAULT_LOCALE,
    inputMode,
    maxLength,
  } = options;

  const maskPattern = React.useMemo(() => {
    if (typeof mask === "string") {
      return MASK_PATTERNS[mask];
    }
    return mask;
  }, [mask]);

  const transformOpts = React.useMemo<TransformOptions>(
    () => ({
      currency,
      locale,
    }),
    [currency, locale],
  );

  const tokenCount = React.useMemo(() => {
    if (
      !maskPattern ||
      MASK_INPUT_CURRENCY_PERCENTAGE_SYMBOLS.test(maskPattern.pattern)
    )
      return undefined;
    return maskPattern.pattern.match(MASK_INPUT_REGEX.hashPattern)?.length ?? 0;
  }, [maskPattern]);

  const calculatedMaxLength = tokenCount
    ? maskPattern?.pattern.length
    : maxLength;

  const calculatedInputMode = React.useMemo(() => {
    if (inputMode) return inputMode;
    if (!maskPattern) return undefined;

    if (mask === "currency" || mask === "percentage" || mask === "ipv4") {
      return "decimal";
    }

    if (typeof mask === "string" && MASK_INPUT_NUMERIC_PATTERNS.test(mask)) {
      return "numeric";
    }
    return undefined;
  }, [maskPattern, mask, inputMode]);

  return {
    maskPattern,
    transformOpts,
    calculatedInputMode,
    tokenCount,
    calculatedMaxLength,
  };
}
