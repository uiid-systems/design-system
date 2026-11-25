import type { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import type { StackProps } from "@uiid/layout";
import type { WithLayoutProps } from "@uiid/utils";

import type { CheckboxProps } from "../checkbox/checkbox.types";
import type { FieldProps } from "../field/field.types";
import type { FieldSlotProps } from "../shared/field-slot.types";
import type { FormItemProps } from "../types";

/**
 * The root lays its rows out from `orientation` and `w`, so it takes
 * no alignment axes of its own.
 */
type CheckboxGroupLayoutProps = Omit<StackProps, "ax" | "ay">;

export type CheckboxGroupRootProps = WithLayoutProps<
  BaseCheckboxGroup.Props,
  CheckboxGroupLayoutProps
> & {
  orientation?: "horizontal" | "vertical";
};

export type CheckboxGroupProps = {
  /**
   * Convenience list for the common case. Omit it and pass `children` to
   * compose `Checkbox` (or `CheckboxGroupRoot`) directly instead.
   */
  items?: FormItemProps[];
  orientation?: "horizontal" | "vertical";
  hideIndicators?: CheckboxProps["hideIndicator"];
  /**
   * Reaches every box rendered from `items`. The keys CheckboxGroup sets on
   * each box itself, from its own props and from each item, are left out.
   */
  CheckboxProps?: Partial<
    Omit<
      CheckboxProps,
      | "name"
      | "hideIndicator"
      | "size"
      | "bordered"
      | "reversed"
      | "color"
      | "IndicatorProps"
      | "value"
      | "label"
      | "disabled"
    >
  >;
  /** Reaches every box's indicator, as the Checkbox slot of the same name. */
  IndicatorProps?: CheckboxProps["IndicatorProps"];
  /** Reaches the Field around the group. The keys CheckboxGroup hands to Field itself are left out. */
  FieldProps?: FieldSlotProps<"name" | "required" | "disabled" | "w" | "size">;
} & WithLayoutProps<BaseCheckboxGroup.Props, CheckboxGroupLayoutProps> &
  Pick<
    CheckboxProps,
    "size" | "bordered" | "reversed" | "required" | "disabled" | "color"
  > &
  Pick<FieldProps, "label" | "description" | "action" | "name">;
