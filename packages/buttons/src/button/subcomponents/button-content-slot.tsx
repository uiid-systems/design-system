import { Group, type GroupProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "./button-content-slot.module.css";

export type ButtonContentSlotProps = GroupProps & {
  active?: boolean;
};

export const ButtonContentSlot = ({
  active,
  className,
  children,
  ...props
}: ButtonContentSlotProps) => {
  return (
    <Group
      data-slot="button-content-slot"
      data-active={active ? "true" : undefined}
      ay="center"
      ax="center"
      fullwidth
      gap={2}
      className={cx(styles["button-content-slot"], className)}
      {...props}
    >
      {children}
    </Group>
  );
};
ButtonContentSlot.displayName = "ButtonContentSlot";
