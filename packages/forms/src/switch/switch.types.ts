import type { Switch } from "@base-ui/react/switch";
import type { GroupProps } from "@uiid/layout";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps } from "@uiid/utils";

import type { CheckboxVariants } from "../checkbox/checkbox.types";
import type {
  FieldDescriptionProps,
  FieldLabelProps,
  FieldProps,
} from "../field/field.types";
import type { switchVariants } from "./switch.variants";

/**
 * `reversed` and `bordered` are the shared field-row treatments, so they come
 * from Checkbox — the component that owns those styles. `size` is Switch's own
 * axis: a track scales differently from a box.
 */
export type SwitchVariants = Pick<CheckboxVariants, "reversed" | "bordered"> &
  VariantProps<typeof switchVariants>;

/**
 * Palette hue for the checked track. One hue resolves the filled surface and
 * the thumb that rides on it together.
 */
export type SwitchColor = PaletteColor;

/**
 * No `Omit<…, "color">` here, unlike Button and Card. Those wrap a native
 * element and inherit React's `color` attribute; Base UI's props do not —
 * `BaseUIComponentProps` already omits `color` (alongside `className` and
 * `style`) before a component ever extends it. So the hue is declared
 * additively, and an `Omit` would be a no-op dressed up as a guard.
 */
export type SwitchRootProps = Switch.Root.Props &
  Pick<SwitchVariants, "size"> & {
    /**
     * Palette hue applied as a solid fill on the checked track, with the thumb
     * taking the paired foreground. Unchecked stays on the shade scale.
     */
    color?: SwitchColor;
  };
export type SwitchThumbProps = Switch.Thumb.Props;

export type SwitchFieldProps = GroupProps &
  Pick<SwitchVariants, "reversed" | "bordered" | "size"> &
  Pick<FieldProps, "label" | "description"> & {
    LabelProps?: FieldLabelProps;
    DescriptionProps?: FieldDescriptionProps;
  };

export type SwitchProps = SwitchRootProps & {
  RootProps?: SwitchRootProps;
  ThumbProps?: Switch.Thumb.Props;
  FieldProps?: SwitchFieldProps;
} & Pick<FieldProps, "label" | "description" | "disabled"> &
  Pick<SwitchFieldProps, "reversed" | "bordered" | "size">;
