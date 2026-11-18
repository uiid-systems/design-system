"use client";

import { useComposedRefs } from "@uiid/utils";
import { useState, type Ref } from "react";

/**
 * The error and the description share one slot: pass `errorRef` to the
 * `FieldError` and render the description only while `hasError` is false.
 *
 * It tracks the error element itself, so it follows Base UI's own rule for
 * when the error shows (`match`, `disabled`, form errors) rather than
 * re-deriving it. The description unmounts rather than hides because each part
 * adds its id to the control's `aria-describedby` on mount and removes it on
 * unmount, so the control is described by what is on screen.
 */
export const useFieldErrorSlot = (ref?: Ref<HTMLDivElement>) => {
  const [errorNode, setErrorNode] = useState<HTMLDivElement | null>(null);
  const errorRef = useComposedRefs(ref, setErrorNode);

  return { hasError: errorNode !== null, errorRef };
};
