"use client";

import { isRenderable, useComposedRefs } from "@uiid/utils";
import { useState } from "react";

import type { FieldErrorProps } from "./field.types";

/**
 * The error and the description share one slot: spread `errorProps` on the
 * `FieldError` and render the description only while `hasError` is false.
 *
 * It tracks the error element itself, so it follows Base UI's own rule for
 * when the error shows (`match`, `disabled`, form errors) rather than
 * re-deriving it. The description unmounts rather than hides because each part
 * adds its id to the control's `aria-describedby` on mount and removes it on
 * unmount, so the control is described by what is on screen.
 *
 * `match: true` forces the error to render, so with no message — the
 * `children: errors.email` pattern while there is no error — it would paint an
 * empty error over the description. It is dropped then, leaving Base UI's own
 * validity to decide.
 *
 * While the error plays its exit transition, Base UI has already removed its
 * id but keeps the element mounted, so the description returns only once the
 * exit completes and the control has no `aria-describedby` in between.
 */
export const useFieldErrorSlot = (ErrorProps?: FieldErrorProps) => {
  const [errorNode, setErrorNode] = useState<HTMLDivElement | null>(null);
  const errorRef = useComposedRefs(ErrorProps?.ref, setErrorNode);

  const forcedEmpty =
    ErrorProps?.match === true && !isRenderable(ErrorProps.children);

  return {
    hasError: errorNode !== null,
    errorProps: {
      ...ErrorProps,
      match: forcedEmpty ? undefined : ErrorProps?.match,
      ref: errorRef,
    },
  };
};
