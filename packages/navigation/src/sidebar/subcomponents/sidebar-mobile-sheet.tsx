import { Stack } from "@uiid/layout";
import { Sheet, type SheetProps } from "@uiid/overlays";

import { useSidebar } from "../sidebar.context";

import styles from "./sidebar-mobile-sheet.module.css";

export const SidebarMobileSheet = ({ children, ...props }: SheetProps) => {
  const { openMobile, setOpenMobile } = useSidebar();
  return (
    <Sheet
      data-slot="sidebar-mobile-sheet"
      title="Sidebar sheet"
      open={openMobile}
      onOpenChange={setOpenMobile}
      PopupProps={{
        className: styles["sidebar-mobile-sheet"],
      }}
      {...props}
    >
      <Stack fullheight fullwidth>
        {children}
      </Stack>
    </Sheet>
  );
};
SidebarMobileSheet.displayName = "SidebarMobileSheet";
