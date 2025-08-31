import type { InputProps } from "../input/input.types";

export type InputCurrencyProps = InputProps & {
  locale?: string;
  maximumFractionDigits?: number;
  currency?: string;
};

export interface CurrencyHelpersConfig {
  locale?: string;
  maximumFractionDigits?: number;
  currency?: string;
}

export interface CurrencyHelpersReturn {
  parseToCleanString: (value: string | number | undefined) => string;
  format: (value: string | number | undefined) => string;
  formatter: Intl.NumberFormat;
  sanitizeInput: (input: string | number) => string;
  parseToNumberBeforeSubmit: (stringNumber: string | number) => number;
}
