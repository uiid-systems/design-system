"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { Text } from "@uiid/typography";

import {
  BUTTON_TOOLTIP_DELAY,
  BUTTON_TOOLTIP_SIDE_OFFSET,
  BUTTON_TOOLTIP_COLLISION_PADDING,
} from "../button.constants";

import styles from "../button.module.css";

export type ButtonTooltipWrapperProps = React.PropsWithChildren<{
  tooltip: React.ReactNode;
}>;

export const ButtonTooltipWrapper = ({
  tooltip,
  children,
}: ButtonTooltipWrapperProps) => {
  return (
    <BaseTooltip.Provider delay={BUTTON_TOOLTIP_DELAY}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger
          data-slot="button-tooltip-wrapper"
          className={styles["button-tooltip-wrapper"]}
          render={<div />}
        >
          {children}
        </BaseTooltip.Trigger>
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner
            sideOffset={BUTTON_TOOLTIP_SIDE_OFFSET}
            collisionPadding={BUTTON_TOOLTIP_COLLISION_PADDING}
            className={styles["button-tooltip-positioner"]}
          >
            <BaseTooltip.Popup className={styles["button-tooltip-popup"]}>
              <Text size={-1}>{tooltip}</Text>
            </BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
};
ButtonTooltipWrapper.displayName = "ButtonTooltipWrapper";
