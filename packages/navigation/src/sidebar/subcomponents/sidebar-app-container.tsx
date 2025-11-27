import { Stack, type StackProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "./sidebar-app-container.module.css";

type SidebarAppContainerProps = StackProps;

export const SidebarAppContainer = ({
  className,
  ...props
}: SidebarAppContainerProps) => {
  return (
    <Stack
      data-slot="sidebar-app-container"
      className={cx(styles["sidebar-app-container"], className)}
      {...props}
    />
  );
};
SidebarAppContainer.displayName = "SidebarAppContainer";
