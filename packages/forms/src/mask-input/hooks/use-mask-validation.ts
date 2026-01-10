import * as React from "react";

import type { MaskPattern, ValidateOptions } from "../mask-input.types";

export type ValidationMode =
  | "onChange"
  | "onBlur"
  | "onSubmit"
  | "onTouched"
  | "all";

export interface UseMaskValidationOptions {
  /** The resolved mask pattern */
  maskPattern: MaskPattern | undefined;
  /** Callback fired when validation occurs */
  onValidate?: (isValid: boolean, unmaskedValue: string) => void;
  /** When validation should trigger */
  validationMode?: ValidationMode;
  /** Minimum value for percentage validation */
  min?: number | string;
  /** Maximum value for percentage validation */
  max?: number | string;
}

export interface UseMaskValidationReturn {
  /** Whether the input has been touched (blurred at least once) */
  touched: boolean;
  /** Set the touched state */
  setTouched: React.Dispatch<React.SetStateAction<boolean>>;
  /** Memoized validation options */
  validationOpts: ValidateOptions;
  /** Determines if validation should run for a given trigger */
  shouldValidate: (trigger: "change" | "blur") => boolean;
  /** Runs validation and calls onValidate callback */
  onInputValidate: (unmaskedValue: string) => void;
}

/**
 * Manages validation state and logic for a masked input,
 * including touched state and validation mode handling.
 */
export function useMaskValidation(
  options: UseMaskValidationOptions,
): UseMaskValidationReturn {
  const {
    maskPattern,
    onValidate,
    validationMode = "onChange",
    min,
    max,
  } = options;

  const [touched, setTouched] = React.useState(false);

  const validationOpts = React.useMemo<ValidateOptions>(
    () => ({
      min: typeof min === "string" ? parseFloat(min) : min,
      max: typeof max === "string" ? parseFloat(max) : max,
    }),
    [min, max],
  );

  const shouldValidate = React.useCallback(
    (trigger: "change" | "blur") => {
      if (!onValidate || !maskPattern?.validate) return false;

      switch (validationMode) {
        case "onChange":
          return trigger === "change";
        case "onBlur":
          return trigger === "blur";
        case "onSubmit":
          return false;
        case "onTouched":
          return touched ? trigger === "change" : trigger === "blur";
        case "all":
          return true;
        default:
          return trigger === "change";
      }
    },
    [onValidate, maskPattern, validationMode, touched],
  );

  const onInputValidate = React.useCallback(
    (unmaskedValue: string) => {
      if (onValidate && maskPattern?.validate) {
        const isValid = maskPattern.validate(unmaskedValue, validationOpts);
        onValidate(isValid, unmaskedValue);
      }
    },
    [onValidate, maskPattern?.validate, validationOpts],
  );

  return {
    touched,
    setTouched,
    validationOpts,
    shouldValidate,
    onInputValidate,
  };
}
