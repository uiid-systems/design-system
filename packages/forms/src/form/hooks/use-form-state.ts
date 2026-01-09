"use client";

import { useState, useCallback } from "react";

export type FormErrors = Record<string, string | string[]>;

export type UseFormStateOptions<T = Record<string, unknown>> = {
  /**
   * Callback when form is successfully submitted
   */
  onSuccess?: (result: T) => void;
  /**
   * Callback when form submission fails
   */
  onError?: (errors: FormErrors) => void;
  /**
   * Simulated delay in ms for demo purposes (default: 500)
   */
  delay?: number;
};

export type FormState<T = Record<string, unknown>> = {
  errors: FormErrors;
  loading: boolean;
  success: boolean;
  result: T | null;
  setErrors: (errors: FormErrors) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

/**
 * Hook to manage common form state patterns (errors, loading, success).
 * Useful for stories and real-world form implementations.
 */
export function useFormState<T = Record<string, unknown>>(
  options: UseFormStateOptions<T> = {},
): FormState<T> {
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<T | null>(null);

  const reset = useCallback(() => {
    setErrors({});
    setLoading(false);
    setSuccess(false);
    setResult(null);
  }, []);

  const handleSetErrors = useCallback(
    (newErrors: FormErrors) => {
      setErrors(newErrors);
      setSuccess(false);
      options.onError?.(newErrors);
    },
    [options],
  );

  return {
    errors,
    loading,
    success,
    result,
    setErrors: handleSetErrors,
    setLoading,
    reset,
  };
}

export type SubmitHandler<T = Record<string, unknown>> = {
  /**
   * Wrap an async submit function with loading state management
   */
  handleSubmit: (
    submitFn: () => Promise<{ errors?: FormErrors; result?: T }>,
  ) => Promise<void>;
};

export type UseFormSubmitOptions<T = Record<string, unknown>> =
  UseFormStateOptions<T> & {
    /**
     * Simulated delay in ms for demo purposes (default: 500)
     */
    delay?: number;
  };

/**
 * Hook that combines form state with submit handling.
 * Automatically manages loading state and error/success transitions.
 */
export function useFormSubmit<T = Record<string, unknown>>(
  options: UseFormSubmitOptions<T> = {},
): FormState<T> & SubmitHandler<T> {
  const { delay = 500, ...stateOptions } = options;
  const state = useFormState<T>(stateOptions);

  const handleSubmit = useCallback(
    async (submitFn: () => Promise<{ errors?: FormErrors; result?: T }>) => {
      state.setLoading(true);
      state.setErrors({});

      // Optional delay for demos
      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      try {
        const response = await submitFn();

        if (response.errors && Object.keys(response.errors).length > 0) {
          state.setErrors(response.errors);
        } else if (response.result) {
          // We need to set success state directly
          state.setErrors({});
          stateOptions.onSuccess?.(response.result);
        }
      } finally {
        state.setLoading(false);
      }
    },
    [delay, state, stateOptions],
  );

  return {
    ...state,
    handleSubmit,
  };
}
