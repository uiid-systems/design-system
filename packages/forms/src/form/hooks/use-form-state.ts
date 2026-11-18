"use client";

import { useState, useCallback, useLayoutEffect, useRef } from "react";

export type FormErrors = Record<string, string | string[]>;

export type UseFormStateOptions<T = Record<string, unknown>> = {
  /**
   * Callback when form is successfully submitted
   */
  onSuccess?: (result: T) => void;
  /**
   * Callback when form submission returns errors. Not called when errors are cleared.
   */
  onError?: (errors: FormErrors) => void;
  /**
   * Delay in ms before `useFormSubmit` calls the submit function. Ignored by `useFormState`.
   * @default 0
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

const hasErrors = (errors: FormErrors) => Object.keys(errors).length > 0;

/** Keeps the latest options without making the callbacks that read them unstable. */
const useLatest = <V>(value: V) => {
  const ref = useRef(value);
  useLayoutEffect(() => {
    ref.current = value;
  });
  return ref;
};

const useFormStateInternal = <T>(options: UseFormStateOptions<T>) => {
  const optionsRef = useLatest(options);
  const [errors, setErrorsState] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<T | null>(null);

  const reset = useCallback(() => {
    setErrorsState({});
    setLoading(false);
    setSuccess(false);
    setResult(null);
  }, []);

  const setErrors = useCallback(
    (newErrors: FormErrors) => {
      setErrorsState(newErrors);
      setSuccess(false);
      if (hasErrors(newErrors)) optionsRef.current.onError?.(newErrors);
    },
    [optionsRef],
  );

  const succeed = useCallback(
    (newResult: T | undefined) => {
      setErrorsState({});
      setSuccess(true);
      setResult(newResult === undefined ? null : newResult);
      if (newResult !== undefined) optionsRef.current.onSuccess?.(newResult);
    },
    [optionsRef],
  );

  const state: FormState<T> = {
    errors,
    loading,
    success,
    result,
    setErrors,
    setLoading,
    reset,
  };

  return { state, optionsRef, succeed, setResult };
};

/**
 * Hook to manage common form state patterns (errors, loading, success).
 * Useful for stories and real-world form implementations.
 */
export function useFormState<T = Record<string, unknown>>(
  options: UseFormStateOptions<T> = {},
): FormState<T> {
  return useFormStateInternal(options).state;
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
     * Delay in ms before the submit function is called, e.g. to show the loading state in a demo.
     * @default 0
     */
    delay?: number;
  };

/**
 * Hook that combines form state with submit handling.
 * Automatically manages loading state and error/success transitions: a response
 * with errors sets `errors` and calls `onError`; any other response sets
 * `success`, stores `result`, and calls `onSuccess` when a result was returned.
 */
export function useFormSubmit<T = Record<string, unknown>>(
  options: UseFormSubmitOptions<T> = {},
): FormState<T> & SubmitHandler<T> {
  const { state, optionsRef, succeed, setResult } =
    useFormStateInternal<T>(options);
  const { setErrors, setLoading } = state;

  const handleSubmit = useCallback(
    async (submitFn: () => Promise<{ errors?: FormErrors; result?: T }>) => {
      const { delay = 0 } = optionsRef.current;
      setLoading(true);
      setResult(null);
      setErrors({});

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      try {
        const response = await submitFn();

        if (response.errors && hasErrors(response.errors)) {
          setErrors(response.errors);
        } else {
          succeed(response.result);
        }
      } finally {
        setLoading(false);
      }
    },
    [optionsRef, setErrors, setLoading, setResult, succeed],
  );

  return {
    ...state,
    handleSubmit,
  };
}
