import type { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { GroupProps } from "@uiid/layout";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps, WithStringClassName } from "@uiid/utils";

import type { FieldProps, FieldRowProps } from "../field/field.types";
import type { checkboxVariants } from "./checkbox.variants";

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;

/**
 * Palette hue for the checked box. One hue resolves the fill and the checkmark
 * that reads against it.
 */
export type CheckboxColor = PaletteColor;

export type CheckboxFieldProps = GroupProps &
  Pick<CheckboxVariants, "size"> &
  Pick<FieldProps, "label" | "description"> &
  Pick<FieldRowProps, "LabelProps" | "DescriptionProps" | "ErrorProps"> &
  React.PropsWithChildren<{
    reversed?: boolean;
    bordered?: boolean;
  }>;

export type CheckboxRootProps = WithStringClassName<BaseCheckbox.Root.Props> &
  CheckboxVariants & {
    hideIndicator?: boolean;
    /**
     * Palette hue applied to the checked box only. Unchecked and resting
     * surfaces stay on shade tokens, so the hue marks the choice rather than
     * the widget.
     */
    color?: CheckboxColor;
  };

export type CheckboxIndicatorProps =
  WithStringClassName<BaseCheckbox.Indicator.Props> & {
    indeterminate?: boolean;
  };

export type CheckboxProps = CheckboxRootProps &
  Pick<CheckboxFieldProps, "reversed" | "bordered" | "label" | "description"> &
  Pick<CheckboxIndicatorProps, "indeterminate"> & {
    /** Reaches the row. The keys Checkbox hands to the row itself are left out. */
    FieldProps?: Omit<
      CheckboxFieldProps,
      "label" | "description" | "size" | "reversed" | "bordered"
    >;
    /** Reaches the indicator. `indeterminate` is set on Checkbox itself. */
    IndicatorProps?: Omit<CheckboxIndicatorProps, "indeterminate">;
  };
