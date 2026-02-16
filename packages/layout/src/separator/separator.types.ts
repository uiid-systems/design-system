import type { SeparatorProps as BaseSeparatorProps } from "@base-ui/react/separator";

import type { VariantProps } from "@uiid/utils";

import type { BoxProps } from "../box/box.types";

import type { separatorVariants } from "./separator.variants";

export type SeparatorVariants = VariantProps<typeof separatorVariants>;

export type SeparatorProps = BaseSeparatorProps &
  SeparatorVariants &
  BoxProps & {
    children?: React.ReactNode;
  };
