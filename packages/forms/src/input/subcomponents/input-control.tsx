"use client";

import { Input as BaseInput } from "@base-ui/react/input";

import { inputControlClassName } from "../input.styles";
import type { InputControlProps } from "../input.types";

/**
 * The input element on its own, without Field chrome or before/after slots.
 *
 * Pass `inner` when rendering inside an `InputWrapper`, which carries the
 * control surface itself.
 *
 * This is a `Field.Control`, so it registers itself with the surrounding field
 * and takes its `name` from it. A composite whose Base UI root already does
 * both must not hand this to `render` — reach for `inputControlClassName` on a
 * plain `<input>` instead, or the value submits twice.
 */
export const InputControl = ({
  size,
  fullwidth,
  variant,
  color,
  inner,
  className,
  ref,
  ...props
}: InputControlProps) => {
  return (
    <BaseInput
      data-slot="input"
      ref={ref}
      className={inputControlClassName({
        inner,
        size,
        fullwidth,
        variant,
        color,
        className,
      })}
      {...props}
    />
  );
};
InputControl.displayName = "InputControl";
