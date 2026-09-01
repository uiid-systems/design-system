"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { Group } from "@uiid/layout";
import { paletteClassName } from "@uiid/tokens";
import { cx } from "@uiid/utils";

import type { NumberFieldGroupProps } from "../number-field.types";
import { numberFieldVariants } from "../number-field.variants";

import styles from "../number-field.module.css";

/**
 * The control cluster: decrement, input, increment. Base UI's `Root` groups all
 * parts and manages state; `Group` is the row the controls actually sit in, and
 * carries the shared surface, the focus ring, and the size class the stepper
 * buttons take their width from.
 *
 * The `color` hue lands here too. Both classes it needs are on this one
 * element: the hue class publishes the `--palette-*` names, and the treatment
 * class remaps the field surface onto them. Everything they set inherits, so
 * the steppers inside are tinted without taking a prop.
 */
export const NumberFieldGroup = ({
  size,
  color,
  className,
  ...props
}: NumberFieldGroupProps) => {
  return (
    <BaseNumberField.Group
      data-slot="number-field-group"
      render={<Group />}
      className={cx(
        styles["number-field"],
        numberFieldVariants({ size }),
        paletteClassName(color, styles["color"]),
        className,
      )}
      {...props}
    />
  );
};
NumberFieldGroup.displayName = "NumberFieldGroup";
