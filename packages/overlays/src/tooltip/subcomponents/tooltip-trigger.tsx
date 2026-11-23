"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cx, resolveTrigger } from "@uiid/utils";

import type { TooltipTriggerProps } from "../tooltip.types";

import styles from "../tooltip.module.css";

/**
 * Unlike Dialog's, Base UI's tooltip trigger takes no `nativeButton`, so only
 * the resolved `render` and children are passed on.
 */
export const TooltipTrigger = ({
  children,
  className,
  render,
  ...props
}: TooltipTriggerProps) => {
  const resolved = resolveTrigger(children, render);

  return (
    <BaseTooltip.Trigger
      data-slot="tooltip-trigger"
      className={cx(styles["tooltip-trigger"], className)}
      {...props}
      render={render ?? resolved.render}
    >
      {resolved.children}
    </BaseTooltip.Trigger>
  );
};
TooltipTrigger.displayName = "TooltipTrigger";
