"use client";

import { Progress as BaseProgress } from "@base-ui/react/progress";
import { Text } from "@uiid/typography";
import { cxState } from "@uiid/utils";

import type { ProgressLabelProps } from "../progress.types";

import styles from "../progress.module.css";

export const ProgressLabel = ({
  children,
  className,
  ...props
}: ProgressLabelProps) => {
  return (
    <BaseProgress.Label
      data-slot="progress-label"
      render={<Text weight="medium" />}
      className={cxState(styles["progress-label"], className)}
      {...props}
    >
      {children}
    </BaseProgress.Label>
  );
};
ProgressLabel.displayName = "ProgressLabel";
