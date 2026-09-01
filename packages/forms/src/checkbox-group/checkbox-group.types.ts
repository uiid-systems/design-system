import type { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import type { StackProps } from "@uiid/layout";

import type {
  CheckboxProps,
  CheckboxIndicatorProps,
} from "../checkbox/checkbox.types";
import type { FieldProps } from "../field/field.types";
import type { FormItemProps } from "../types";

export type CheckboxGroupRootProps = BaseCheckboxGroup.Props & {
  direction?: "horizontal" | "vertical";
};

export type CheckboxGroupProps = {
  /**
   * Convenience list for the common case. Omit it and pass `children` to
   * compose `Checkbox` (or `CheckboxGroupRoot`) directly instead.
   */
  items?: FormItemProps[];
  direction?: "horizontal" | "vertical";
  hideIndicators?: CheckboxProps["hideIndicator"];
  CheckboxProps?: Partial<CheckboxProps>;
  IndicatorProps?: CheckboxIndicatorProps;
  FieldProps?: Partial<FieldProps>;
} & BaseCheckboxGroup.Props &
  Pick<
    CheckboxProps,
    "bordered" | "reversed" | "required" | "disabled" | "color"
  > &
  Pick<FieldProps, "label" | "description" | "name"> &
  /* `color` is omitted alongside the layout axes because `StackProps` carries
     React's native `color` attribute, which would otherwise intersect with the
     palette hue picked up from `CheckboxProps`. */
  Omit<StackProps, "ax" | "ay" | "direction" | "color">;
