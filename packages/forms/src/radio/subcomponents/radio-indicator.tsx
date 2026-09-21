"use client";

import { Radio as BaseRadio } from "@base-ui/react/radio";
import { Group } from "@uiid/layout";
import { cxState } from "@uiid/utils";

import type { RadioIndicatorProps } from "../radio.types";

import styles from "../radio.module.css";

export const RadioIndicator = ({
  className,
  ...props
}: RadioIndicatorProps) => {
  return (
    <BaseRadio.Indicator
      data-slot="radio-indicator"
      render={<Group ax="center" ay="center" />}
      className={cxState(styles["indicator"], className)}
      {...props}
    />
  );
};
RadioIndicator.displayName = "RadioIndicator";
