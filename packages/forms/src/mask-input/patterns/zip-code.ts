import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const zipCodePattern: MaskPattern = {
  pattern: "#####",
  transform: (value) => value.replace(REGEX_CACHE.nonDigits, ""),
  validate: (value) =>
    REGEX_CACHE.zipCode.test(value.replace(REGEX_CACHE.nonDigits, "")),
};
