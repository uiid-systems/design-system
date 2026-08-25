"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cx } from "@uiid/utils";

import type { TooltipPositionerProps } from "../tooltip.types";

import styles from "../tooltip.module.css";

export const TooltipPositioner = ({
  children,
  className,
  ...props
}: TooltipPositionerProps) => {
  return (
    <BaseTooltip.Positioner
      data-slot="tooltip-positioner"
      className={cx(styles["tooltip-positioner"], className)}
      {...props}
    >
      {children}
    </BaseTooltip.Positioner>
  );
};
TooltipPositioner.displayName = "TooltipPositioner";
