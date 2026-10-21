"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cxState } from "@uiid/utils";

import {
  TOOLTIP_DEFAULT_COLLISION_PADDING,
  TOOLTIP_DEFAULT_SIDE_OFFSET,
} from "../tooltip.constants";
import type { TooltipPositionerProps } from "../tooltip.types";

import styles from "../tooltip.module.css";

export const TooltipPositioner = ({
  sideOffset = TOOLTIP_DEFAULT_SIDE_OFFSET,
  collisionPadding = TOOLTIP_DEFAULT_COLLISION_PADDING,
  children,
  className,
  ...props
}: TooltipPositionerProps) => {
  return (
    <BaseTooltip.Positioner
      data-slot="tooltip-positioner"
      sideOffset={sideOffset}
      collisionPadding={collisionPadding}
      className={cxState(styles["tooltip-positioner"], className)}
      {...props}
    >
      {children}
    </BaseTooltip.Positioner>
  );
};
TooltipPositioner.displayName = "TooltipPositioner";
