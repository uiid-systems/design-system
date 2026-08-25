import { MASK_INPUT_REGEX } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const ipv4Pattern: MaskPattern = {
  pattern: "###.###.###.###",
  transform: (value) => value.replace(MASK_INPUT_REGEX.nonNumericDot, ""),
  validate: (value) => {
    if (value.includes(".")) {
      const segments = value.split(".");
      if (segments.length > 4) return false;

      return segments.every((segment) => {
        if (segment === "") return true;
        if (!MASK_INPUT_REGEX.ipv4Segment.test(segment)) return false;
        const num = parseInt(segment, 10);
        return num <= 255;
      });
    } else {
      if (!MASK_INPUT_REGEX.digitsOnly.test(value)) return false;
      if (value.length > 12) return false;

      const chunks = [];
      for (let i = 0; i < value.length; i += 3) {
        chunks.push(value.substring(i, i + 3));
      }

      if (chunks.length > 4) return false;

      return chunks.every((chunk) => {
        const num = parseInt(chunk, 10);
        return num >= 0 && num <= 255;
      });
    }
  },
};
