import { patternMask } from "../pattern-mask";
import { digitsOf } from "./patterns.utils";

/** A 16-digit card number in groups of four, `4111 1111 1111 1111`. */
export const creditCardMask = /* @__PURE__ */ patternMask(
  "#### #### #### ####",
);

/**
 * Whether a card number, masked or not, has 13 to 19 digits and passes the
 * Luhn checksum. It does not check the issuer.
 */
export const isValidCreditCard = (value: string) => {
  const digits = digitsOf(value);
  if (digits.length < 13 || digits.length > 19) return false;
  let sum = 0;
  for (let index = 0; index < digits.length; index++) {
    // Every second digit, counted from the right, is doubled.
    const doubled = (digits.length - index) % 2 === 0;
    const digit = Number(digits[index]) * (doubled ? 2 : 1);
    sum += digit > 9 ? digit - 9 : digit;
  }
  return sum % 10 === 0;
};
