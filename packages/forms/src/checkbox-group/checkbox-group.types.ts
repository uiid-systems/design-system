import type { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";
import type { StackProps } from "@uiid/layout";
import type { WithLayoutProps } from "@uiid/utils";

import type {
  CheckboxProps,
  CheckboxIndicatorProps,
} from "../checkbox/checkbox.types";
import type { FieldProps } from "../field/field.types";
import type { FormItemProps } from "../types";

/**
 * The root lays its rows out from `orientation` and `fullwidth`, so it takes
 * no alignment axes of its own.
 */
type CheckboxGroupLayoutProps = Omit<StackProps, "ax" | "ay">;

export type CheckboxGroupRootProps = WithLayoutProps<
  BaseCheckboxGroup.Props,
  CheckboxGroupLayoutProps
> & {
  orientation?: "horizontal" | "vertical";
  /** Stretch to fill the container width, sharing it evenly between the rows */
  fullwidth?: boolean;
};

export type CheckboxGroupProps = {
  /**
   * Convenience list for the common case. Omit it and pass `children` to
   * compose `Checkbox` (or `CheckboxGroupRoot`) directly instead.
   */
  items?: FormItemProps[];
  orientation?: "horizontal" | "vertical";
  hideIndicators?: CheckboxProps["hideIndicator"];
  CheckboxProps?: Partial<CheckboxProps>;
  IndicatorProps?: CheckboxIndicatorProps;
  FieldProps?: Partial<FieldProps>;
} & WithLayoutProps<BaseCheckboxGroup.Props, CheckboxGroupLayoutProps> &
  Pick<
    CheckboxProps,
    "size" | "bordered" | "reversed" | "required" | "disabled" | "color"
  > &
  Pick<FieldProps, "label" | "description" | "action" | "name">;
