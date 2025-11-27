import {
  SIDEBAR_DEFAULT_SIDE,
  SIDEBAR_DEFAULT_VARIANT,
  SIDEBAR_DEFAULT_COLLAPSIBLE,
} from "../sidebar.constants";
import { useSidebar } from "../sidebar.context";
import type { SidebarProps } from "../sidebar.types";

import styles from "./sidebar-outer.module.css";

export const SidebarOuter = ({
  side = SIDEBAR_DEFAULT_SIDE,
  variant = SIDEBAR_DEFAULT_VARIANT,
  collapsible = SIDEBAR_DEFAULT_COLLAPSIBLE,
  children,
  ...props
}: SidebarProps) => {
  const { state } = useSidebar();
  return (
    <div
      data-slot="sidebar"
      className={styles["sidebar-outer"]}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      {...props}
    >
      {children}
    </div>
  );
};
SidebarOuter.displayName = "SidebarOuter";
