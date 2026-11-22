import { patternMask } from "../pattern-mask";
import { digitsOf, hasDigits } from "./patterns.utils";

/** A 24-hour time, `14:30`. */
export const timeMask = /* @__PURE__ */ patternMask("##:##");

/** Whether a time, masked or not, is a real one, from `00:00` to `23:59`. */
export const isValidTime = (value: string) => {
  if (!hasDigits(value, 4)) return false;
  const digits = digitsOf(value);
  return Number(digits.slice(0, 2)) <= 23 && Number(digits.slice(2)) <= 59;
};
