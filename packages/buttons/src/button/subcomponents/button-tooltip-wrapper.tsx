import { Tooltip } from "@base-ui-components/react/tooltip";

import { Stack } from "@uiid/layout";

import styles from "./button-tooltip-wrapper.module.css";

export const ButtonTooltipWrapper = ({
  children,
  loading,
  tooltip,
}: {
  children?: React.ReactNode;
  loading?: boolean;
  tooltip: string;
}) => {
  return (
    <Tooltip.Provider delay={1000}>
      <Tooltip.Root>
        <Tooltip.Trigger
          render={
            <Stack
              className={styles["button-content-container"]}
              data-shift={loading ? "true" : undefined}
            />
          }
        >
          {children}
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
