"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { cx, prepareComponentProps, useComposedRefs } from "@uiid/utils";
import { useLayoutEffect, useRef } from "react";

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
 * names itself must not hand this to `render`, or the value submits twice.
 */
export const InputControl = ({
  size,
  w,
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

  /* The mask's lifetime is keyed on the mask alone, not on the composed ref.
     A caller's inline `ref` is new on every render, which rebuilds the
     composed ref; were the mask attached from that ref, it would be torn down
     and rebuilt on every keystroke of a controlled input. Layout effects run
     after refs are set, so the element is in place by the time this runs. A
     new mask runs the old one's cleanup before attaching, and StrictMode's
     double mount takes the same path. */
  const elementRef = useRef<HTMLInputElement>(null);
  const composedRef = useComposedRefs(ref, elementRef);

  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element || !mask) return;
    return mask.attach(element);
  }, [mask]);

  /* Inside a wrapper the wrapper takes the width and the input fills it, so
     `w` only reaches a bare input. */
  const preparedProps = prepareComponentProps({
    componentName: "input",
    styleProps: ["w"],
    props: { ...props, w: inner ? undefined : w },
  });

  return (
    <BaseInput
      ref={composedRef}
      inputMode={inputMode ?? mask?.inputMode}
      required={required ?? fieldRequired}
      className={cx(
        inputControlClassName({ inner, size, variant, color }),
        className,
      )}
      {...preparedProps}
    />
  );
};
InputControl.displayName = "InputControl";
