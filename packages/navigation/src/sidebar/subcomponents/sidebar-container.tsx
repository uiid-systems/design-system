import { cx } from "@uiid/utils";

import type { SidebarProps } from "../sidebar.types";

import styles from "./sidebar-container.module.css";

type SidebarContainerProps = SidebarProps;

export const SidebarContainer = ({
  variant,
  side,
  className,
  children,
  ...props
}: SidebarContainerProps) => {
  return (
    <div
      data-slot="sidebar-container"
      data-variant={variant}
      data-side={side}
      className={cx(styles["sidebar-container"], className)}
      {...props}
    >
      {children}
    </div>
  );
};
SidebarContainer.displayName = "SidebarContainer";
