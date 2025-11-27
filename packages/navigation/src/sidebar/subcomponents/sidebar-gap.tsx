import type { SidebarProps } from "../sidebar.types";

import styles from "./sidebar-gap.module.css";

type SidebarGapProps = Pick<SidebarProps, "variant">;

export const SidebarGap = ({ variant }: SidebarGapProps) => {
  return (
    <div
      data-slot="sidebar-gap"
      data-variant={variant}
      className={styles["sidebar-gap"]}
    />
  );
};
