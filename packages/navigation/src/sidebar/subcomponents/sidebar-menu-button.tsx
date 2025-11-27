import { cx } from "@uiid/utils";

import { useSidebar } from "../sidebar.context";
import styles from "./sidebar-menu-button.module.css";

type SidebarMenuButtonProps = React.ComponentProps<"button"> & {
  isActive?: boolean;
};

export const SidebarMenuButton = ({
  isActive = false,
  className,
  ...props
}: SidebarMenuButtonProps) => {
  const { isMobile, state } = useSidebar();

  return (
    <button
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-active={isActive}
      hidden={state !== "collapsed" || isMobile}
      className={cx(styles["sidebar-menu-button"], className)}
      {...props}
    />
  );
};
SidebarMenuButton.displayName = "SidebarMenuButton";
