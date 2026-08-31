import type { NumberField as BaseNumberField } from "@base-ui/react/number-field";

import type { FieldProps } from "../field/field.types";
import type { InputVariants } from "../input/input.types";

export type NumberFieldRootProps = BaseNumberField.Root.Props;
export type NumberFieldDecrementProps = BaseNumberField.Decrement.Props;
export type NumberFieldIncrementProps = BaseNumberField.Increment.Props;
export type NumberFieldGroupProps = BaseNumberField.Group.Props;
/**
 * `size` is omitted and re-added as the design-system scale, the same sanctioned
 * deviation documented on `InputControlProps` — Base UI's native `size` here is
 * the character-width attribute.
 */
export type NumberFieldInputProps = Omit<BaseNumberField.Input.Props, "size"> &
  Pick<InputVariants, "size">;
export type NumberFieldScrubAreaProps = BaseNumberField.ScrubArea.Props;
export type NumberFieldScrubAreaCursorProps =
  BaseNumberField.ScrubAreaCursor.Props;

export type NumberFieldProps = {
  RootProps?: NumberFieldRootProps;
  DecrementProps?: NumberFieldDecrementProps;
  IncrementProps?: NumberFieldIncrementProps;
  GroupProps?: NumberFieldGroupProps;
  FieldProps?: FieldProps;
  InputProps?: NumberFieldInputProps;
} & NumberFieldRootProps &
  Pick<FieldProps, "label" | "description"> &
  Pick<NumberFieldInputProps, "placeholder"> &
  Pick<InputVariants, "size">;
