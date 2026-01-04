import type { GroupProps } from "@uiid/layout";
import type { VariantProps } from "@uiid/utils";

import type { badgeVariants } from "./badge.variants";

export type BadgeVariants = VariantProps<typeof badgeVariants>;

export type BadgeProps = {
  hideIndicator?: boolean;
} & BadgeVariants &
  GroupProps;
