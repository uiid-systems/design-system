import type { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import type { FieldProps } from "../field/field.types";

export type NumberFieldRootProps = BaseNumberField.Root.Props;
export type NumberFieldDecrementProps = BaseNumberField.Decrement.Props;
export type NumberFieldIncrementProps = BaseNumberField.Increment.Props;
export type NumberFieldInputProps = BaseNumberField.Input.Props;

export type NumberFieldProps = {
  RootProps?: NumberFieldRootProps;
  DecrementProps?: NumberFieldDecrementProps;
  IncrementProps?: NumberFieldIncrementProps;
  FieldProps?: FieldProps;
  InputProps?: NumberFieldInputProps;
} & NumberFieldRootProps &
  Pick<FieldProps, "label" | "description"> &
  Pick<NumberFieldInputProps, "placeholder">;
