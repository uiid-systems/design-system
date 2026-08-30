import type { Input } from "@base-ui/react/input";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import { inputVariants } from "./input.variants";

export type InputVariants = VariantProps<typeof inputVariants>;

export type InputControlProps = Omit<Input.Props, "size"> & {
  /**
   * Rendered inside an `InputWrapper`, which carries the control surface, so
   * the input paints only its inner treatment.
   */
  inner?: boolean;
  ref?: React.Ref<HTMLInputElement>;
} & InputVariants;

export type InputProps = Omit<InputControlProps, "inner"> & {
  before?: React.ReactNode;
  after?: React.ReactNode;
  FieldProps?: FieldProps;
} & Pick<FieldProps, "label" | "description">;
