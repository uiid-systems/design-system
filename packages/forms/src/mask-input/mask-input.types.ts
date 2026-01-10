import type { FieldProps } from "../field/field.types";
import type { InputVariants } from "../input/input.types";

export interface CurrencySymbols {
  currency: string;
  decimal: string;
  group: string;
}

export interface TransformOptions {
  currency?: string;
  locale?: string;
}

export interface ValidateOptions {
  min?: number;
  max?: number;
}

export interface MaskPattern {
  pattern: string;
  transform?: (value: string, opts?: TransformOptions) => string;
  validate?: (value: string, opts?: ValidateOptions) => boolean;
}

export type MaskPatternKey =
  | "phone"
  | "ssn"
  | "date"
  | "time"
  | "creditCard"
  | "creditCardExpiry"
  | "zipCode"
  | "zipCodeExtended"
  | "currency"
  | "percentage"
  | "licensePlate"
  | "ipv4"
  | "macAddress"
  | "isbn"
  | "ein";

export type InputElement = React.ComponentRef<"input">;

export interface MaskInputProps
  extends Omit<React.ComponentProps<"input">, "size">,
    InputVariants {
  /** Field wrapper props when using label/description */
  FieldProps?: FieldProps;
  /** Label text for the input field */
  label?: string;
  /** Description text shown below the input */
  description?: string;
  /** The controlled value of the input */
  value?: string;
  /** The default value for uncontrolled usage */
  defaultValue?: string;
  /** Callback fired when the value changes, providing both masked and unmasked values */
  onValueChange?: (maskedValue: string, unmaskedValue: string) => void;
  /** Callback fired when validation occurs */
  onValidate?: (isValid: boolean, unmaskedValue: string) => void;
  /** When validation should trigger */
  validationMode?: "onChange" | "onBlur" | "onSubmit" | "onTouched" | "all";
  /** Predefined mask pattern key or custom mask pattern */
  mask?: MaskPatternKey | MaskPattern;
  /** Placeholder shown when input is focused (shows mask format) */
  maskPlaceholder?: string;
  /** Currency code for currency mask (e.g., "USD", "EUR") */
  currency?: string;
  /** Locale for formatting (e.g., "en-US", "de-DE") */
  locale?: string;
  /** Whether the input is in an invalid state */
  invalid?: boolean;
  /** Whether to disable masking and use raw input */
  withoutMask?: boolean;
}
