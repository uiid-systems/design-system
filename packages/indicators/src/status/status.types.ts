import type { GroupProps } from "@uiid/layout";
import type { VariantProps } from "@uiid/utils";

import type { statusVariants } from "./status.variants";

export type StatusVariants = VariantProps<typeof statusVariants>;

export type StatusProps = GroupProps & StatusVariants;
