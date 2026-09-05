import type { ToggleGroup } from "@base-ui/react/toggle-group";
import type { VariantProps } from "@uiid/utils";

import { toggleVariants } from "./toggle-group.variants";

export type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

export type ToggleGroupProps = Omit<ToggleGroup.Props, "onValueChange"> & {
  /** Surface treatment — filled by default, `ghost` drops the container background and border. */
  variant?: "ghost";
  /** Callback when the selected values change. */
  onValueChange?: (value: string[]) => void;
} & ToggleGroupVariants;
