import { Stack, type StackProps } from "@uiid/layout";
import { cx } from "@uiid/utils";

import styles from "./sidebar-inset.module.css";

export const SidebarInset = ({ className, ...props }: StackProps) => {
  return (
    <Stack
      data-slot="sidebar-inset"
      render={<main />}
      fullwidth
      className={cx(styles["sidebar-inset"], className)}
      {...props}
    />
  );
};
SidebarInset.displayName = "SidebarInset";
