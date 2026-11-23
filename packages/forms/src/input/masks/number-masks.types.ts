type NumberMaskBounds = {
  /** BCP 47 locale for separators and symbols. Defaults to `"en-US"`. */
  locale?: string;
  /**
   * Lowest value the field accepts. A positive value below it can still be
   * typed, since it may be the start of a larger one, and is raised to `min`
   * when the field is left. A negative value below it clamps as you type.
   *
   * At 0 or more, a typed `-` is refused and the mask asks for the numeric
   * keypad. Unset or negative, the mask sets no `inputMode`, since the iOS
   * keypads have no minus key.
   */
  min?: number;
  /**
   * Highest value the field accepts. A positive value past it clamps as you
   * type. A negative value above a negative `max` is lowered to it when the
   * field is left.
   */
  max?: number;
};

export type CurrencyMaskOptions = NumberMaskBounds & {
  /**
   * ISO 4217 code. The symbol, the side it sits on and the decimal count all
   * come from `Intl.NumberFormat` for this currency in `locale`.
   */
  currency: string;
};

export type PercentMaskOptions = NumberMaskBounds & {
  /** Decimals the field accepts. Defaults to `0`. Never padded. */
  maximumFractionDigits?: number;
};

export type NumberMaskOptions = NumberMaskBounds & {
  /** Decimals the field accepts. Defaults to `0`. Never padded. */
  maximumFractionDigits?: number;
};
