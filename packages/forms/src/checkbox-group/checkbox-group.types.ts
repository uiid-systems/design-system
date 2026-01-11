import type { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";

import type { StackProps } from "@uiid/layout";

import type { FieldProps } from "../field/field.types";
import type {
  CheckboxProps,
  CheckboxIndicatorProps,
} from "../checkbox/checkbox.types";
import type { FormItemProps } from "../types";

export type CheckboxGroupProps = {
  items: FormItemProps[];
  direction?: "horizontal" | "vertical";
  hideIndicators?: CheckboxProps["hideIndicator"];
  CheckboxProps?: Partial<CheckboxProps>;
  IndicatorProps?: CheckboxIndicatorProps;
  FieldProps?: Partial<FieldProps>;
} & BaseCheckboxGroup.Props &
  Pick<CheckboxProps, "bordered" | "reversed" | "required" | "disabled"> &
  Pick<FieldProps, "label" | "description" | "name"> &
  Omit<StackProps, "ax" | "ay" | "direction">;
