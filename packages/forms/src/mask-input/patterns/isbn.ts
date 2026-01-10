import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const isbnPattern: MaskPattern = {
  pattern: "###-#-###-#####-#",
  transform: (value) => value.replace(REGEX_CACHE.nonDigits, ""),
  validate: (value) =>
    REGEX_CACHE.isbn.test(value.replace(REGEX_CACHE.nonDigits, "")),
};
