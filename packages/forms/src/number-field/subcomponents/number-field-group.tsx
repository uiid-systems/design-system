"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { NumberFieldGroupProps } from "../number-field.types";
import { numberFieldVariants } from "../number-field.variants";

import styles from "../number-field.module.css";

/**
 * The control cluster: decrement, input, increment. Base UI's `Root` groups all
 * parts and manages state; `Group` is the row the controls actually sit in, and
 * carries the shared surface, the focus ring, and the size class the stepper
 * buttons take their width from.
 */
export const NumberFieldGroup = ({
  size,
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
        className,
      )}
      {...props}
    />
  );
};
NumberFieldGroup.displayName = "NumberFieldGroup";
