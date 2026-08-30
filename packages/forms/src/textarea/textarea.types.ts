import type { Field as BaseField } from "@base-ui/react/field";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import { textareaVariants } from "./textarea.variants";

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export type TextareaVariants = VariantProps<typeof textareaVariants>;

/**
 * Base UI ships no Textarea primitive, so Textarea is adopted into Field
 * through `Field.Control` with a `<textarea>` render target.
 *
 * `Field.Control.Props` cannot be adopted wholesale: it is `BaseUIComponentProps
 * <'input'>`, so its DOM event handlers are typed against `HTMLInputElement` and
 * are structurally incompatible with a `<textarea>`. The DOM surface therefore
 * stays textarea-native, and what is taken from `Field.Control` is the part it
 * actually adds over the host element — `onValueChange`. `render` is excluded
 * because Textarea owns it: it is what retargets the control.
 */
export type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> &
  Pick<BaseField.Control.Props, "onValueChange"> & {
    FieldProps?: FieldProps;
    ref?: React.Ref<HTMLTextAreaElement>;
    resize?: TextareaResize;
  } & Pick<FieldProps, "label" | "description"> &
  TextareaVariants;
