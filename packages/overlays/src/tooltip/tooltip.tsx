"use client";

import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";

import { Card } from "@uiid/cards";

import type { TooltipProps } from "./tooltip.types";

export const Tooltip = ({
  trigger,
  RootProps,
  TriggerProps,
  PositionerProps = {
    sideOffset: 8,
    collisionPadding: 16,
  },
  PopupProps,
  children,
}: TooltipProps) => {
  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root {...RootProps}>
        <BaseTooltip.Trigger {...TriggerProps} render={<div />}>
          {trigger}
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner {...PositionerProps}>
            <BaseTooltip.Popup
              data-is-popup="true"
              {...PopupProps}
              render={<Card size="sm">{children}</Card>}
            >
              {children}
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
};
Tooltip.displayName = "Tooltip";
