import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const creditCardPattern: MaskPattern = {
  pattern: "#### #### #### ####",
  transform: (value) => value.replace(REGEX_CACHE.nonDigits, ""),
  validate: (value) => {
    const cleaned = value.replace(REGEX_CACHE.nonDigits, "");
    if (!REGEX_CACHE.creditCard.test(cleaned)) return false;

    let sum = 0;
    let isEven = false;
    for (let i = cleaned.length - 1; i >= 0; i--) {
      const digitChar = cleaned[i];
      if (!digitChar) continue;
      let digit = parseInt(digitChar, 10);
      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  },
};
