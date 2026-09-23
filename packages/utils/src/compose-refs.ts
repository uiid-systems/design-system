/**
 * @see https://github.com/radix-ui/primitives/blob/main/packages/react/compose-refs/src/compose-refs.tsx
 */

import { useCallback, type Ref, type RefCallback } from "react";

type PossibleRef<T> = Ref<T> | undefined;

/**
 * Set a given ref to a given value
 * This utility takes care of different types of refs: callback refs and RefObject(s)
 */
function setRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === "function") {
    return ref(value);
  }

  if (ref !== null && ref !== undefined) {
    ref.current = value;
  }
}

/**
 * A utility to compose multiple refs together
 * Accepts callback refs and RefObject(s)
 *
 * Always returns a cleanup, so React 19 detaches through it rather than calling
 * the composed ref with `null`. A ref that returned its own cleanup has that
 * called; every other ref is explicitly set to `null`.
 */
function composeRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => setRef(ref, node));

    return () => {
      for (let i = 0; i < cleanups.length; i++) {
        const cleanup = cleanups[i];
        if (typeof cleanup === "function") {
          cleanup();
        } else {
          setRef(refs[i], null);
        }
      }
    };
  };
}

/**
 * A custom hook that composes multiple refs
 * Accepts callback refs and RefObject(s)
 */
function useComposedRefs<T>(...refs: PossibleRef<T>[]): RefCallback<T> {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback((node: T | null) => composeRefs(...refs)(node), refs);
}

export { composeRefs, useComposedRefs };
