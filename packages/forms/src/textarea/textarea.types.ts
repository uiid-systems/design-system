import type { Field as BaseField } from "@base-ui/react/field";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import { textareaVariants } from "./textarea.variants";

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export type TextareaVariants = VariantProps<typeof textareaVariants>;

/**
 * Palette hue for the field surface. One hue resolves the control's background,
 * foreground, border and hover together.
 */
export type TextareaColor = PaletteColor;

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
  "children" | "color"
> &
  Pick<BaseField.Control.Props, "onValueChange"> & {
    FieldProps?: FieldProps;
    ref?: React.Ref<HTMLTextAreaElement>;
    resize?: TextareaResize;
    /**
     * Palette hue applied as a tinted bg/fg/border/hover surface treatment.
     * Shadows the native `color` attribute, which is not meaningful here.
     */
    color?: TextareaColor;
  } & Pick<FieldProps, "label" | "description"> &
  TextareaVariants;
