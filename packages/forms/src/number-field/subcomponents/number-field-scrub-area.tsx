"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { cx } from "@uiid/utils";

import type { NumberFieldScrubAreaProps } from "../number-field.types";

import styles from "../number-field.module.css";

export const NumberFieldScrubArea = ({
  className,
  children,
  ...props
}: NumberFieldScrubAreaProps) => {
  return (
    <BaseNumberField.ScrubArea
      data-slot="number-field-scrub-area"
      className={cx(styles["number-field-scrub-area"], className)}
      {...props}
    >
      {children}
    </BaseNumberField.ScrubArea>
  );
};
NumberFieldScrubArea.displayName = "NumberFieldScrubArea";
