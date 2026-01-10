import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const timePattern: MaskPattern = {
  pattern: "##:##",
  transform: (value) => value.replace(REGEX_CACHE.nonDigits, ""),
  validate: (value) => {
    const cleaned = value.replace(REGEX_CACHE.nonDigits, "");
    if (!REGEX_CACHE.time.test(cleaned)) return false;
    const hours = parseInt(cleaned.substring(0, 2), 10);
    const minutes = parseInt(cleaned.substring(2, 4), 10);
    return hours <= 23 && minutes <= 59;
  },
};
