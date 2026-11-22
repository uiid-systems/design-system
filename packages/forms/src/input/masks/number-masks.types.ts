type NumberMaskBounds = {
  /** BCP 47 locale for separators and symbols. Defaults to `"en-US"`. */
  locale?: string;
  /** Lowest value the field accepts. Typing below it clamps as you type. */
  min?: number;
  /** Highest value the field accepts. Typing past it clamps as you type. */
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
