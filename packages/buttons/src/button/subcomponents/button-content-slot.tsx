import { Stack } from "@uiid/layout";
import styles from "./button-content-slot.module.css";

export const ButtonContentSlot = ({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) => {
  return (
    <Stack
      className={styles["button-content-slot"]}
      data-active={active ? "true" : undefined}
      ay="center"
      ax="center"
      fullwidth
    >
      {children}
    </Stack>
  );
};
ButtonContentSlot.displayName = "ButtonContentSlot";
