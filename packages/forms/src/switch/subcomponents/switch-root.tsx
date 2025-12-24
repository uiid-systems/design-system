import { Switch as BaseSwitch } from "@base-ui-components/react/switch";

import { cx } from "@uiid/utils";

import type { SwitchRootProps } from "../switch.types";
import styles from "../switch.module.css";

export const SwitchRoot = ({
  className,
  children,
  ...props
}: SwitchRootProps) => {
  return (
    <BaseSwitch.Root
      data-slot="switch-root"
      className={cx(styles["switch-root"], className)}
      {...props}
    >
      {children}
    </BaseSwitch.Root>
  );
};
SwitchRoot.displayName = "SwitchRoot";
