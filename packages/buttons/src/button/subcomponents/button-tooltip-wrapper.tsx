"use client";

import { Tooltip } from "@base-ui-components/react/tooltip";

import styles from "./button-tooltip-wrapper.module.css";
import { ButtonContentContainer } from "./button-content-container";

export const ButtonTooltipWrapper = ({
  children,
  shift,
  tooltip,
  delay,
}: {
  tooltip: React.ReactNode;
  children?: React.ReactNode;
  shift?: boolean;
  delay?: number;
}) => {
  return (
    <Tooltip.Provider delay={delay}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={<div style={{ all: "unset", marginInline: "auto" }} />}
        >
          <ButtonContentContainer shift={shift} asButton={false}>
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
