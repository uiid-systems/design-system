"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { NumberFieldGroupProps } from "../number-field.types";

import styles from "../number-field.module.css";

/**
 * The control cluster: decrement, input, increment. Base UI's `Root` groups all
 * parts and manages state; `Group` is the row the controls actually sit in, and
 * carries the shared surface and focus ring.
 */
export const NumberFieldGroup = ({
  className,
  ...props
}: NumberFieldGroupProps) => {
  return (
    <BaseNumberField.Group
      data-slot="number-field-group"
      render={<Group />}
      className={cx(styles["number-field"], className)}
      {...props}
    />
  );
};
NumberFieldGroup.displayName = "NumberFieldGroup";
