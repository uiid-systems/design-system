import type { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import type { numberFieldVariants } from "./number-field.variants";

export type NumberFieldVariants = VariantProps<typeof numberFieldVariants>;

/**
 * Palette hue for the field surface. One hue resolves the cluster's background,
 * foreground, border and hover together.
 */
export type NumberFieldColor = PaletteColor;

export type NumberFieldRootProps = BaseNumberField.Root.Props;
export type NumberFieldDecrementProps = BaseNumberField.Decrement.Props;
export type NumberFieldIncrementProps = BaseNumberField.Increment.Props;
/**
 * The group is where `size` lands — it sizes the cluster as a whole, and the
 * stepper buttons square themselves off the height it gives them.
 */
export type NumberFieldGroupProps = BaseNumberField.Group.Props &
  NumberFieldVariants & {
    /**
     * Palette hue applied as a tinted bg/fg/border/hover surface treatment.
     *
     * Lands on the group for the same reason `size` does: it dresses the
     * cluster as a whole. The treatment only remaps custom properties, and
     * those inherit, so the steppers pick the hue up from here without a prop
     * of their own.
     */
    color?: NumberFieldColor;
  };
/**
 * `size` is omitted and re-added as the design-system scale, the same sanctioned
 * deviation documented on `InputControlProps` — Base UI's native `size` here is
 * the character-width attribute.
 */
export type NumberFieldInputProps = Omit<BaseNumberField.Input.Props, "size"> &
  NumberFieldVariants & {
    /**
     * Palette hue applied as a tinted bg/fg/border/hover surface treatment.
     *
     * Passed separately from the group's copy — again mirroring `size` —
     * because the hue's foreground pairing is a plain `color` declaration, and
     * the shared field surface sets `color` on this element directly, so an
     * inherited value would never reach it.
     */
    color?: NumberFieldColor;
  };
export type NumberFieldScrubAreaProps = BaseNumberField.ScrubArea.Props;
export type NumberFieldScrubAreaCursorProps =
  BaseNumberField.ScrubAreaCursor.Props;

export type NumberFieldProps = {
  /**
   * Palette hue applied as a tinted bg/fg/border/hover surface treatment.
   *
   * Declared additively, with no `Omit<…, "color">`. The root's props are
   * `BaseUIComponentProps`, which drops `color` (alongside `className` and
   * `style`) upstream, so an `Omit` here would be a no-op dressed up as a
   * guard. MaskInput is the opposite case and does need one: it is typed on
   * `React.ComponentProps<"input">`, which is the native surface.
   */
  color?: NumberFieldColor;
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
