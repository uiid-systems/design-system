import { cx } from "@uiid/utils";

import { Box } from "../box/box";
import { ConditionalRender } from "../conditional-render/conditional-render";

import type { DisabledProps } from "./disabled-wrapper.types";
import styles from "./disabled-wrapper.module.css";

export const DisabledWrapper = ({
  disabled,
  className,
  children,
}: DisabledProps) => {
  return (
    <ConditionalRender
      aria-disabled={disabled}
      data-disabled={disabled}
      condition={disabled}
      render={
        <Box
          uiid="disabled-wrapper"
          className={cx(styles["disabled-wrapper"], className)}
        />
      }
    >
      {children}
    </ConditionalRender>
  );
};
DisabledWrapper.displayName = "DisabledWrapper";
