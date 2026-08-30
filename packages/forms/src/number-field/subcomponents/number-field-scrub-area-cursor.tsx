"use client";

import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { cx } from "@uiid/utils";

import type { NumberFieldScrubAreaCursorProps } from "../number-field.types";

import styles from "../number-field.module.css";

export const NumberFieldScrubAreaCursor = ({
  className,
  children,
  ...props
}: NumberFieldScrubAreaCursorProps) => {
  return (
    <BaseNumberField.ScrubAreaCursor
      data-slot="number-field-scrub-area-cursor"
      className={cx(styles["number-field-scrub-area-cursor"], className)}
      {...props}
    >
      {children}
    </BaseNumberField.ScrubAreaCursor>
  );
};
NumberFieldScrubAreaCursor.displayName = "NumberFieldScrubAreaCursor";
