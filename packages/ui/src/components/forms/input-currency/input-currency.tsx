"use client";

import { useState } from "react";
import { Input } from "../input/input";
import { useCurrencyHelpers } from "./input-currency.hooks";
import type { InputCurrencyProps } from "./input-currency.types";

/**
 * @see https://levelup.gitconnected.com/creating-a-localized-currency-input-in-react-without-libraries-or-bugs-2f186124aedc
 */
export const InputCurrency = ({
  locale,
  maximumFractionDigits,
  currency,
  ...props
}: InputCurrencyProps) => {
  const { parseToCleanString, format, sanitizeInput } = useCurrencyHelpers({
    locale,
    maximumFractionDigits,
    currency,
  });
  const [value, setValue] = useState(format(0));

  return (
    <Input
      {...props}
      value={value}
      onFocus={() => setValue(parseToCleanString(value))}
      onBlur={() => setValue(format(value))}
      onChange={(e) => setValue(sanitizeInput(e.currentTarget.value))}
    />
  );
};
InputCurrency.displayName = "InputCurrency";
