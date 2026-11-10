import type { Input } from "@base-ui/react/input";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import { inputVariants } from "./input.variants";

export type InputVariants = VariantProps<typeof inputVariants>;

/**
 * Palette hue for the field surface. One hue resolves the control's background,
 * foreground, border and hover together.
 */
export type InputColor = PaletteColor;

export type InputWrapperProps = {
  before?: React.ReactNode;
  after?: React.ReactNode;
  /** Slot placement: beside the control, or above and below it. */
  orientation?: "horizontal" | "vertical";
  className?: string;
  children: React.ReactNode;
  /** Palette hue applied as a tinted surface treatment. */
  color?: InputColor;
  /**
   * Whether the control is disabled. Makes the slots inert, so their content
   * leaves the tab order with the field while the dimmed surface blocks the
   * pointer.
   */
  disabled?: boolean;
} & InputVariants;

/**
 * Omitting Base UI's `size` and re-adding it as a variant is the one sanctioned
 * deviation from the mirror rule. `size` is the system-wide control-scale axis
 * (`small | medium | large`) across every UIID component, and `inputVariants` is
 * shared by select, slider, number-field, mask-input, combobox and autocomplete.
 * Native `size` on an `<input>` is the rarely-used character-width attribute;
 * surfacing it here would desync Input from the rest of the system. Recorded in
 * `docs/architecture/forms-alignment-audit.md` (finding B5).
 */
export type InputControlProps = Omit<Input.Props, "size"> & {
  /**
   * Rendered inside an `InputWrapper`, which carries the control surface, so
   * the input paints only its inner treatment.
   */
  inner?: boolean;
  /**
   * Palette hue applied as a tinted bg/fg/border/hover surface treatment.
   *
   * Declared additively, with no `Omit<…, "color">` of the kind Button and Card
   * carry. Those wrap a native element and inherit React's `color` attribute;
   * Base UI's props do not — `BaseUIComponentProps` drops `color` (alongside
   * `className` and `style`) before `Input.Props` ever extends it, so an `Omit`
   * here would be a no-op dressed up as a guard. Textarea is the opposite case
   * and does need one: it is typed on `React.TextareaHTMLAttributes`, which is
   * the native surface.
   */
  color?: InputColor;
  ref?: React.Ref<HTMLInputElement>;
} & InputVariants;

export type InputProps = Omit<InputControlProps, "inner"> & {
  before?: React.ReactNode;
  after?: React.ReactNode;
  /**
   * Reaches the Field around the control. Input owns `label`, `description`,
   * `action`, `name`, `required`, `disabled`, `size` and `children` and hands
   * them to Field itself, so they are not accepted here a second time.
   */
  FieldProps?: Omit<
    FieldProps,
    | "label"
    | "description"
    | "action"
    | "name"
    | "required"
    | "disabled"
    | "size"
    | "children"
  >;
} & Pick<FieldProps, "label" | "description" | "action">;
