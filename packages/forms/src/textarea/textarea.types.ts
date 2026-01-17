import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";

import { textareaVariants } from "./textarea.variants";

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export type TextareaVariants = VariantProps<typeof textareaVariants>;

export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> & {
  FieldProps?: FieldProps;
  ref?: React.Ref<HTMLTextAreaElement>;
  resize?: TextareaResize;
} & Pick<FieldProps, "label" | "description"> &
  TextareaVariants;
