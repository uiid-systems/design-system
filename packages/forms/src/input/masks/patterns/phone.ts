import { patternMask } from "../pattern-mask";
import { hasDigits } from "./patterns.utils";

/** A US phone number, `(123) 456-7890`, on the phone keypad. */
export const phoneMask = /* @__PURE__ */ patternMask("(###) ###-####", {
  inputMode: "tel",
});

/** Whether a phone number, masked or not, has all ten digits. */
export const isValidPhone = (value: string) => hasDigits(value, 10);
