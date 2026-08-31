import type { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import type { numberFieldVariants } from "./number-field.variants";

export type NumberFieldVariants = VariantProps<typeof numberFieldVariants>;

export type NumberFieldRootProps = BaseNumberField.Root.Props;
export type NumberFieldDecrementProps = BaseNumberField.Decrement.Props;
export type NumberFieldIncrementProps = BaseNumberField.Increment.Props;
/**
 * The group is where `size` lands — it sizes the cluster as a whole, and the
 * stepper buttons square themselves off the height it gives them.
 */
export type NumberFieldGroupProps = BaseNumberField.Group.Props &
  NumberFieldVariants;
/**
 * `size` is omitted and re-added as the design-system scale, the same sanctioned
 * deviation documented on `InputControlProps` — Base UI's native `size` here is
 * the character-width attribute.
 */
export type NumberFieldInputProps = Omit<BaseNumberField.Input.Props, "size"> &
  NumberFieldVariants;
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
  NumberFieldVariants;
