import type { Icon } from "@uiid/icons";
import styles from "./button-icon-slot.module.css";

export type ButtonIconSlotProps = {
  icon: Icon | React.ReactNode;
  position?: "before" | "after";
};

export const ButtonIconSlot = ({
  icon: Icon,
  position,
}: ButtonIconSlotProps) => {
  const IconComponent = typeof Icon === "function" ? Icon : () => Icon;

  return (
    <span
      data-slot="button-icon-slot"
      aria-hidden
      className={styles["button-icon-slot"]}
      data-position={position}
    >
      <IconComponent size={18} />
    </span>
  );
};
ButtonIconSlot.displayName = "ButtonIconSlot";
