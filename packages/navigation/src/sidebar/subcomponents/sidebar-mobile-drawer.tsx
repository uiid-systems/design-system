import { Stack } from "@uiid/layout";
import { Drawer, type DrawerProps } from "@uiid/overlays";

import { useSidebar } from "../sidebar.context";

import styles from "./sidebar-mobile-drawer.module.css";

export const SidebarMobileDrawer = ({ children, ...props }: DrawerProps) => {
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <Drawer
      data-slot="sidebar-mobile-drawer"
      title="Sidebar drawer"
      open={openMobile}
      onOpenChange={setOpenMobile}
      PopupProps={{
        className: styles["sidebar-mobile-drawer"],
      }}
      {...props}
    >
      <Stack fullheight fullwidth>
        {children}
      </Stack>
    </Drawer>
  );
};
SidebarMobileDrawer.displayName = "SidebarMobileDrawer";
