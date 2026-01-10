import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const ssnPattern: MaskPattern = {
  pattern: "###-##-####",
  transform: (value) => value.replace(REGEX_CACHE.nonDigits, ""),
  validate: (value) =>
    REGEX_CACHE.ssn.test(value.replace(REGEX_CACHE.nonDigits, "")),
};
