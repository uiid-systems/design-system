"use client";

import { Tooltip } from "@uiid/overlays";

export type ButtonTooltipWrapperProps = React.PropsWithChildren<{
  tooltip: React.ReactNode;
}>;

export const ButtonTooltipWrapper = ({
  tooltip,
  children,
}: ButtonTooltipWrapperProps) => {
  return (
    <Tooltip
      data-slot="button-tooltip-wrapper"
      trigger={children}
      TriggerProps={{ render: <div /> }}
      delay={300}
    >
      {tooltip}
    </Tooltip>
  );
};
ButtonTooltipWrapper.displayName = "ButtonTooltipWrapper";
