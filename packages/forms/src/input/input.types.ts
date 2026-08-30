import type { Input } from "@base-ui/react/input";
import type { VariantProps } from "@uiid/utils";

import type { FieldProps } from "../field/field.types";
import { inputVariants } from "./input.variants";

export type InputVariants = VariantProps<typeof inputVariants>;

export type InputWrapperProps = {
  before?: React.ReactNode;
  after?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
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
  ref?: React.Ref<HTMLInputElement>;
} & InputVariants;

export type InputProps = Omit<InputControlProps, "inner"> & {
  before?: React.ReactNode;
  after?: React.ReactNode;
  FieldProps?: FieldProps;
} & Pick<FieldProps, "label" | "description">;
