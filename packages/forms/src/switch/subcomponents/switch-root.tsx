"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cx } from "@uiid/utils";

import { SWITCH_DEFAULT_SIZE } from "../switch.constants";
import type { SwitchRootProps } from "../switch.types";
import { switchVariants } from "../switch.variants";

import styles from "../switch.module.css";

export const SwitchRoot = ({
  size = SWITCH_DEFAULT_SIZE,
  className,
  children,
  ...props
}: SwitchRootProps) => {
  return (
    <BaseSwitch.Root
      data-slot="switch-root"
      className={cx(styles["switch-root"], switchVariants({ size }), className)}
      {...props}
    >
      {children}
    </BaseSwitch.Root>
  );
};
SwitchRoot.displayName = "SwitchRoot";
