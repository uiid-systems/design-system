import { Tooltip as BaseTooltip } from "@base-ui-components/react/tooltip";

import type { TooltipProps } from "./tooltip.types";
import { TooltipTrigger } from "./subcomponents/tooltip-trigger";
import styles from "./tooltip.module.css";

export const Tooltip = ({
  trigger,
  RootProps,
  TriggerProps,
  PortalProps,
  PositionerProps = {
    sideOffset: 4,
    collisionPadding: 16,
  },
  PopupProps,
  children,
}: TooltipProps) => {
  if (!trigger) {
    throw new Error("A trigger is required");
  }

  return (
    <BaseTooltip.Provider>
      <BaseTooltip.Root {...RootProps}>
        <TooltipTrigger trigger={trigger} TriggerProps={TriggerProps} />
        <BaseTooltip.Portal {...PortalProps}>
          <BaseTooltip.Positioner {...PositionerProps}>
            <BaseTooltip.Popup
              className={styles["tooltip-popup"]}
              {...PopupProps}
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
