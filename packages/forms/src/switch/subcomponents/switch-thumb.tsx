"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cxState } from "@uiid/utils";

import type { SwitchThumbProps } from "../switch.types";

import styles from "../switch.module.css";

export const SwitchThumb = ({ className, ...props }: SwitchThumbProps) => {
  return (
    <BaseSwitch.Thumb
      data-slot="switch-thumb"
      className={cxState(styles["switch-thumb"], className)}
      {...props}
    />
  );
};
SwitchThumb.displayName = "SwitchThumb";
