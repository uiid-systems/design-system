import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const einPattern: MaskPattern = {
  pattern: "##-#######",
  transform: (value) => value.replace(REGEX_CACHE.nonDigits, ""),
  validate: (value) =>
    REGEX_CACHE.ein.test(value.replace(REGEX_CACHE.nonDigits, "")),
};
