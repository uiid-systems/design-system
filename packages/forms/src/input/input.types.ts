import type { Input } from "@base-ui/react/input";

import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";

import { inputVariants } from "./input.variants";

export type InputVariants = VariantProps<typeof inputVariants>;

export type InputProps = Omit<Input.Props, "size"> & {
  FieldProps?: FieldProps;
} & Pick<FieldProps, "label" | "description"> &
  InputVariants &
  Pick<FieldProps, "label" | "description">;
