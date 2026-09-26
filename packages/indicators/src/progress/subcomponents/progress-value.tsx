"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { Text } from "@uiid/typography";
import { cxState } from "@uiid/utils";

import type { ProgressValueProps } from "../progress.types";

import styles from "../progress.module.css";

/**
 * `render` takes an element rather than a function, so Base UI merges onto the
 * `Text` and its `children` contract survives: a render function receives the
 * formatted and raw values, and with none it prints the formatted value.
 */
export const ProgressValue = ({
  children,
  className,
  ...props
}: ProgressValueProps) => {
  return (
    <BaseProgress.Value
      data-slot="progress-value"
      render={<Text shade="muted" />}
      className={cxState(styles["progress-value"], className)}
      {...props}
    >
      {children}
    </BaseProgress.Value>
  );
};
ProgressValue.displayName = "ProgressValue";
