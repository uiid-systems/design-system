import * as React from "react";

import {
  NUMERIC_MASK_PATTERNS,
  CURRENCY_PERCENTAGE_SYMBOLS,
  REGEX_CACHE,
  DEFAULT_CURRENCY,
  DEFAULT_LOCALE,
} from "../mask-input.constants";
import { MASK_PATTERNS } from "../patterns";
import type {
  MaskPattern,
  MaskPatternKey,
  TransformOptions,
} from "../mask-input.types";

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
    currency = DEFAULT_CURRENCY,
    locale = DEFAULT_LOCALE,
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
    if (!maskPattern || CURRENCY_PERCENTAGE_SYMBOLS.test(maskPattern.pattern))
      return undefined;
    return maskPattern.pattern.match(REGEX_CACHE.hashPattern)?.length ?? 0;
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

    if (typeof mask === "string" && NUMERIC_MASK_PATTERNS.test(mask)) {
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
