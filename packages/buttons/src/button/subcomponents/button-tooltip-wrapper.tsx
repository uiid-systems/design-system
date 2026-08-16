"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { Text } from "@uiid/typography";

import styles from "../button.module.css";

export type ButtonTooltipWrapperProps = React.PropsWithChildren<{
  tooltip: React.ReactNode;
}>;

/**
 * Composed from Base UI directly rather than the Tooltip in @uiid/overlays.
 * Overlays renders its popups through Card, and Card's examples use Button, so
 * reaching for it here would close a cycle (buttons → overlays → cards →
 * buttons) that the build graph rejects. Button is a primitive and owns the few
 * lines of tooltip chrome it needs instead.
 */
export const ButtonTooltipWrapper = ({
  tooltip,
  children,
}: ButtonTooltipWrapperProps) => {
  return (
    <BaseTooltip.Provider delay={300}>
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
            sideOffset={8}
            collisionPadding={16}
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
