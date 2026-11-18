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
  /**
   * Mark the form as submitted: clears errors, sets `success`, stores `result`, and calls `onSuccess`.
   */
  // Method syntax keeps `FormState<T>` assignable to `FormState<unknown>`.
  setResult(result: T): void;
  /**
   * Clear all state. A submit still pending in `useFormSubmit` is ignored when it settles.
   */
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
  const [result, setResultState] = useState<T | null>(null);
  /** Incremented per submit and by every manual update, so only the latest writes state. */
  const requestRef = useRef(0);
  const pendingRef = useRef(false);

  /** Invalidates a pending submit and ends its loading, since it will no longer do so itself. */
  const supersede = useCallback(() => {
    requestRef.current++;
    if (pendingRef.current) {
      pendingRef.current = false;
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    supersede();
    setErrorsState({});
    setLoading(false);
    setSuccess(false);
    setResultState(null);
  }, [supersede]);

  const applyErrors = useCallback(
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
      setResultState(newResult === undefined ? null : newResult);
      if (newResult !== undefined) optionsRef.current.onSuccess?.(newResult);
    },
    [optionsRef],
  );

  const setErrors = useCallback(
    (newErrors: FormErrors) => {
      supersede();
      applyErrors(newErrors);
    },
    [supersede, applyErrors],
  );

  const setResult = useCallback(
    (newResult: T) => {
      supersede();
      succeed(newResult);
    },
    [supersede, succeed],
  );

  const state: FormState<T> = {
    errors,
    loading,
    success,
    result,
    setErrors,
    setLoading,
    setResult,
    reset,
  };

  return {
    state,
    optionsRef,
    requestRef,
    pendingRef,
    applyErrors,
    succeed,
    setResultState,
  };
};

/**
 * Hook to manage common form state patterns (errors, loading, success).
 * Call `setErrors` or `setResult` with the outcome of your own submit; `useFormSubmit` does it for you.
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
 * When submits overlap, only the latest one updates state and calls callbacks; a manual
 * `setErrors`, `setResult` or `reset` also supersedes a pending submit.
 */
export function useFormSubmit<T = Record<string, unknown>>(
  options: UseFormSubmitOptions<T> = {},
): FormState<T> & SubmitHandler<T> {
  const {
    state,
    optionsRef,
    requestRef,
    pendingRef,
    applyErrors,
    succeed,
    setResultState,
  } = useFormStateInternal<T>(options);
  const { setLoading } = state;

  const handleSubmit = useCallback(
    async (submitFn: () => Promise<{ errors?: FormErrors; result?: T }>) => {
      const request = ++requestRef.current;
      const isLatest = () => request === requestRef.current;
      const { delay = 0 } = optionsRef.current;
      pendingRef.current = true;
      setLoading(true);
      setResultState(null);
      applyErrors({});

      if (delay > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      if (!isLatest()) return;

      try {
        const response = await submitFn();
        if (!isLatest()) return;

        if (response.errors && hasErrors(response.errors)) {
          applyErrors(response.errors);
        } else {
          succeed(response.result);
        }
      } finally {
        if (isLatest()) {
          pendingRef.current = false;
          setLoading(false);
        }
      }
    },
    [
      optionsRef,
      requestRef,
      pendingRef,
      applyErrors,
      setLoading,
      setResultState,
      succeed,
    ],
  );

  return {
    ...state,
    handleSubmit,
  };
}
