import type { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";

import type { GroupProps } from "@uiid/layout";
import type { VariantProps } from "@uiid/utils";

import type {
  FieldProps,
  FieldLabelProps,
  FieldDescriptionProps,
  FieldErrorProps,
} from "../field/field.types";

import type { checkboxVariants } from "./checkbox.variants";

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;

export type CheckboxFieldProps = GroupProps &
  Pick<FieldProps, "name" | "label" | "description"> &
  React.PropsWithChildren<{
    reversed?: boolean;
    bordered?: boolean;
    LabelProps?: FieldLabelProps;
    DescriptionProps?: FieldDescriptionProps;
    ErrorProps?: FieldErrorProps;
  }>;

export type CheckboxRootProps = BaseCheckbox.Root.Props &
  CheckboxVariants & {
    hideIndicator?: boolean;
  };

export type CheckboxIndicatorProps = BaseCheckbox.Indicator.Props & {
  indeterminate?: boolean;
};

export type CheckboxProps = CheckboxRootProps &
  Pick<CheckboxFieldProps, "reversed" | "bordered" | "label" | "description"> &
  Pick<CheckboxIndicatorProps, "indeterminate"> & {
    ContainerProps?: CheckboxFieldProps;
    IndicatorProps?: CheckboxIndicatorProps;
  };
