import { MASK_INPUT_REGEX } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const einPattern: MaskPattern = {
  pattern: "##-#######",
  transform: (value) => value.replace(MASK_INPUT_REGEX.nonDigits, ""),
  validate: (value) =>
    MASK_INPUT_REGEX.ein.test(value.replace(MASK_INPUT_REGEX.nonDigits, "")),
};
