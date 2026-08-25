import { MASK_INPUT_REGEX } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const timePattern: MaskPattern = {
  pattern: "##:##",
  transform: (value) => value.replace(MASK_INPUT_REGEX.nonDigits, ""),
  validate: (value) => {
    const cleaned = value.replace(MASK_INPUT_REGEX.nonDigits, "");
    if (!MASK_INPUT_REGEX.time.test(cleaned)) return false;
    const hours = parseInt(cleaned.substring(0, 2), 10);
    const minutes = parseInt(cleaned.substring(2, 4), 10);
    return hours <= 23 && minutes <= 59;
  },
};
