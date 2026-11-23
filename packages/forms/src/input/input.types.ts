import type { Input } from "@base-ui/react/input";
import type { PaletteColor } from "@uiid/tokens";
import type { VariantProps, WithStringClassName } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import type { inputVariants, inputWrapperVariants } from "./input.variants";

export type InputVariants = VariantProps<typeof inputVariants>;

export type InputWrapperVariants = VariantProps<typeof inputWrapperVariants>;

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
} & InputWrapperVariants;

/**
 * A self-contained mask for `Input`. It carries its own engine and wires it to
 * the element through `attach`, so `Input` holds no mask code of its own.
 *
 * The value stays the masked string everywhere: `value`, `defaultValue`,
 * `onValueChange` and form submission all carry it. Call `format` going in and
 * `parse` coming out.
 *
 * The members are declared as methods on purpose. TypeScript checks method
 * parameters bivariantly, which is what lets an `InputMask<number>` pass where
 * the `mask` prop expects `InputMask<unknown>`; arrow-typed members would make
 * `T` invariant and reject it. `Input` never calls `format` or `parse`.
 */
export type InputMask<T> = {
  /** Wires the mask to the element and returns the cleanup that unwires it. */
  attach(element: HTMLInputElement): () => void;
  /** Turns a value into masked text, for `defaultValue` or a controlled `value`. */
  format(value: T): string;
  /** Turns masked text back into a value. */
  parse(masked: string): T;
  /**
   * The virtual keyboard to ask for, unless the caller sets `inputMode`. Any
   * input mode the element takes, such as `"tel"` for a phone number.
   */
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
};

/**
 * Omitting Base UI's `size` and re-adding it as a variant is the one sanctioned
 * deviation from the mirror rule. `size` is the system-wide control-scale axis
 * (`small | medium | large`) across every UIID component, and `inputVariants` is
 * shared by select, slider, number-field, mask-input, combobox and autocomplete.
 * Native `size` on an `<input>` is the rarely-used character-width attribute;
 * surfacing it here would desync Input from the rest of the system.
 */
export type InputControlProps = Omit<
  WithStringClassName<Input.Props>,
  "size"
> & {
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
  /**
   * Formats the text as it is typed. Attached to the input element on mount
   * and detached on unmount or when the mask changes. Its `inputMode` applies
   * unless `inputMode` is set here. Create the mask at module scope or memoize
   * it: a new mask on every render is detached and attached on every render.
   */
  mask?: InputMask<unknown>;
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
