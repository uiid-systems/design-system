"use client";

import { Input as BaseInput } from "@base-ui/react/input";
import { cx } from "@uiid/utils";

import type { InputControlProps } from "./input.types";
import { inputVariants } from "./input.variants";

import styles from "./input.module.css";

/**
 * The input element on its own, without Field chrome or before/after slots.
 *
 * Base UI merges a `render` prop's props and ref onto the rendered tree's
 * outermost element. This component is always an `<input>`, which makes it the
 * only safe thing to hand to `render`; `Input` would merge onto its Field
 * wrapper and silently drop ARIA and keyboard behaviour.
 *
 * Pass `inner` when rendering inside an `InputWrapper`, which carries the
 * control surface itself.
 */
export const InputControl = ({
  size,
  fullwidth,
  ghost,
  inner,
  className,
  ref,
  ...props
}: InputControlProps) => {
  return (
    <BaseInput
      data-slot="input"
      ref={ref}
      className={cx(
        styles["input"],
        inner
          ? styles["input-inner"]
          : inputVariants({ size, fullwidth, ghost }),
        className,
      )}
      {...props}
    />
  );
};
InputControl.displayName = "InputControl";
