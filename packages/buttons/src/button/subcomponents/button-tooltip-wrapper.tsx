"use client";

import { Tooltip } from "@base-ui-components/react/tooltip";

import styles from "./button-tooltip-wrapper.module.css";
import { ButtonContentContainer } from "./button-content-container";

export const ButtonTooltipWrapper = ({
  children,
  shift,
  tooltip,
}: {
  children?: React.ReactNode;
  shift?: boolean;
  tooltip: string;
}) => {
  return (
    <Tooltip.Provider delay={0}>
      <Tooltip.Root>
        <Tooltip.Trigger style={{ all: "unset", marginInline: "auto" }}>
          <ButtonContentContainer shift={shift}>
            {children}
          </ButtonContentContainer>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={4} collisionPadding={16}>
            <Tooltip.Popup className={styles["button-tooltip"]}>
              {tooltip}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
ButtonTooltipWrapper.displayName = "ButtonTooltipWrapper";
