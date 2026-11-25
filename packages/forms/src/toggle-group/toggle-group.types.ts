import type { Toggle } from "@base-ui/react/toggle";
import type { ToggleGroup } from "@base-ui/react/toggle-group";
import type {
  SizingProps,
  VariantProps,
  WithStringClassName,
} from "@uiid/utils";

import { toggleVariants } from "./toggle-group.variants";

export type ToggleGroupVariants = VariantProps<typeof toggleVariants>;

/**
 * Base UI's `Toggle.Props` with `className` narrowed to a string, since the
 * group merges its own class into each child's with `cx`. These three names
 * stand in for the `Toggle.Props`, `Toggle.State` and
 * `Toggle.ChangeEventDetails` namespace members Base UI declares.
 */
export type ToggleProps<Value extends string = string> = WithStringClassName<
  Toggle.Props<Value>
>;
/** The state Base UI hands a toggle's `render` function. */
export type ToggleState = Toggle.State;
/** The second argument of a toggle's `onPressedChange`. */
export type ToggleChangeEventDetails = Toggle.ChangeEventDetails;

export type ToggleGroupProps<Value extends string = string> =
  WithStringClassName<ToggleGroup.Props<Value>> & {
    /** Surface treatment — filled by default, `ghost` drops the container background and border. */
    variant?: "ghost";
    /**
     * Width of the panel, which otherwise fits its toggles. At `"full"` a
     * horizontal group shares the width evenly between them.
     */
    w?: SizingProps["w"];
  } & ToggleGroupVariants;
