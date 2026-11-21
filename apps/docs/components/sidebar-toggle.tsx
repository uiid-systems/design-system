"use client";

import { SidebarToggle } from "@/components/shell";
import { toggleSidebar, useSidebarOpen } from "@/components/shell/store";

export function HeaderSidebarToggle() {
  const open = useSidebarOpen();

  return <SidebarToggle aria-expanded={open} onClick={toggleSidebar} />;
}
