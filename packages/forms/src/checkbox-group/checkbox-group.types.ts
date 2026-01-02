import type { CheckboxGroup as BaseCheckboxGroup } from "@base-ui/react/checkbox-group";

import type { StackProps } from "@uiid/layout";

import type { FieldProps } from "../field/field.types";
import type {
  CheckboxProps,
  CheckboxIndicatorProps,
} from "../checkbox/checkbox.types";
import type { FormItemProps } from "../types";

export type CheckboxGroupProps = BaseCheckboxGroup.Props &
  Omit<StackProps, "ax" | "ay" | "direction"> & {
    items: FormItemProps[];
    direction?: "horizontal" | "vertical";
    CheckboxProps?: Partial<CheckboxProps>;
    IndicatorProps?: CheckboxIndicatorProps;
  } & Pick<CheckboxProps, "bordered" | "reversed" | "required"> &
  Pick<FieldProps, "label" | "description">;
