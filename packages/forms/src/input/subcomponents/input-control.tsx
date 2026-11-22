"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { cxState, useComposedRefs } from "@uiid/utils";
import { useCallback } from "react";

import { useFieldRequired } from "../../field/field-required-context";
import { inputControlClassName } from "../input.styles";
import type { InputControlProps } from "../input.types";

/**
 * The input element on its own, without Field chrome or before/after slots.
 *
 * Pass `inner` when rendering inside an `InputWrapper`, which carries the
 * control surface itself.
 *
 * This is a `Field.Control`, so it registers itself with the surrounding field
 * and takes its `name` from it. It falls back to the field's `required` when it
 * sets none of its own. A composite whose Base UI root already registers and
 * names itself must not hand this to `render` — reach for `inputControlClassName` on a
 * plain `<input>` instead, or the value submits twice.
 */
export const InputControl = ({
  size,
  fullwidth,
  variant,
  color,
  inner,
  required,
  mask,
  inputMode,
  className,
  ref,
  ...props
}: InputControlProps) => {
  const fieldRequired = useFieldRequired();

  /* A new mask is a new callback, so React runs the old one's cleanup, which
     detaches it, before attaching the new one. StrictMode's double mount
     takes the same path. */
  const maskRef = useCallback(
    (element: HTMLInputElement | null) => {
      if (!element || !mask) return;
      return mask.attach(element);
    },
    [mask],
  );
  const composedRef = useComposedRefs(ref, maskRef);

  return (
    <BaseInput
      data-slot="input"
      ref={composedRef}
      inputMode={inputMode ?? mask?.inputMode}
      required={required ?? fieldRequired}
      className={cxState(
        inputControlClassName({ inner, size, fullwidth, variant, color }),
        className,
      )}
      {...props}
    />
  );
};
InputControl.displayName = "InputControl";
