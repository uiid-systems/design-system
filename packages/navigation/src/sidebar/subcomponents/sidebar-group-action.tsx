import { cx } from "@uiid/utils";

import styles from "./sidebar-group-action.module.css";

export const SidebarGroupAction = ({
  className,
  ...props
}: React.ComponentProps<"button">) => {
  return (
    <button
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cx(styles["sidebar-group-action"], className)}
      {...props}
    />
  );
};
SidebarGroupAction.displayName = "SidebarGroupAction";
