import { REGEX_CACHE } from "../mask-input.constants";
import type { MaskPattern } from "../mask-input.types";

export const ipv4Pattern: MaskPattern = {
  pattern: "###.###.###.###",
  transform: (value) => value.replace(REGEX_CACHE.nonNumericDot, ""),
  validate: (value) => {
    if (value.includes(".")) {
      const segments = value.split(".");
      if (segments.length > 4) return false;

      return segments.every((segment) => {
        if (segment === "") return true;
        if (!REGEX_CACHE.ipv4Segment.test(segment)) return false;
        const num = parseInt(segment, 10);
        return num <= 255;
      });
    } else {
      if (!REGEX_CACHE.digitsOnly.test(value)) return false;
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
