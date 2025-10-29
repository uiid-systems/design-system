import styles from "../button.module.css";

export const ButtonIconSlot = ({
  icon,
  position,
}: {
  icon: React.ReactNode;
  position: "before" | "after";
}) => {
  return (
    <span
      data-slot="button-icon"
      aria-hidden
      className={styles["icon-slot"]}
      data-position={position}
    >
      {icon}
    </span>
  );
};
ButtonIconSlot.displayName = "IconSlot";
