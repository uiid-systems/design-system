import type { ToggleGroup } from "@base-ui/react/toggle-group";
import type { VariantProps, WithStringClassName } from "@uiid/utils";

import { toggleGroupVariants, toggleVariants } from "./toggle-group.variants";

export type ToggleGroupVariants = VariantProps<typeof toggleVariants> &
  VariantProps<typeof toggleGroupVariants>;

export type ToggleGroupProps<Value extends string = string> =
  WithStringClassName<ToggleGroup.Props<Value>> & {
    /** Surface treatment — filled by default, `ghost` drops the container background and border. */
    variant?: "ghost";
  } & ToggleGroupVariants;
