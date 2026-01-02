import type { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import type { FieldProps } from "../field/field.types";

export type NumberFieldDecrementProps = BaseNumberField.Decrement.Props;
export type NumberFieldIncrementProps = BaseNumberField.Increment.Props;
export type NumberFieldInputProps = BaseNumberField.Input.Props;
export type NumberFieldRootProps = BaseNumberField.Root.Props;

export type NumberFieldProps = NumberFieldRootProps & {
  DecrementProps?: NumberFieldDecrementProps;
  IncrementProps?: NumberFieldIncrementProps;
  InputProps?: NumberFieldInputProps;
} & Pick<FieldProps, "label" | "description">;
