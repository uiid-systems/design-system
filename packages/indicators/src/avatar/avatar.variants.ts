import { cva } from "@uiid/utils";

import { badgeColorStyles } from "../badge/badge.variants";

export const avatarVariants = cva({
  variants: {
    color: badgeColorStyles,
  },
});
