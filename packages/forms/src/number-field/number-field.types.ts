import type { NumberField as BaseNumberField } from "@base-ui-components/react/number-field";

export type NumberFieldDecrementProps = BaseNumberField.Decrement.Props;
export type NumberFieldIncrementProps = BaseNumberField.Increment.Props;
export type NumberFieldInputProps = BaseNumberField.Input.Props;
export type NumberFieldRootProps = BaseNumberField.Root.Props;

export type NumberFieldProps = NumberFieldRootProps & {
  DecrementProps?: NumberFieldDecrementProps;
  IncrementProps?: NumberFieldIncrementProps;
  InputProps?: NumberFieldInputProps;
};
