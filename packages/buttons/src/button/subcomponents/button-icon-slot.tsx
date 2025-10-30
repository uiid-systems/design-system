import styles from "./button-icon-slot.module.css";

export type ButtonIconSlotProps = {
  icon: React.ReactNode;
  position?: "before" | "after";
};

export const ButtonIconSlot = ({ icon, position }: ButtonIconSlotProps) => {
  return (
    <span
      data-slot="button-icon-slot"
      aria-hidden
      className={styles["button-icon-slot"]}
      data-position={position}
    >
      {icon}
    </span>
  );
};
ButtonIconSlot.displayName = "ButtonIconSlot";
