import { cx } from "@uiid/utils";
import styles from "./sidebar-menu-sub-button.module.css";

export const SidebarMenuSubButton = ({
  isActive = false,
  className,
  ...props
}: React.ComponentProps<"a"> & {
  isActive?: boolean;
}) => {
  return (
    <a
      data-slot="sidebar-menu-sub-button"
      data-active={isActive}
      className={cx(styles["sidebar-menu-sub-button"], className)}
      {...props}
    />
  );
};
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
