"use client";

import { Button } from "@uiid/design-system";
import { PanelLeftIcon } from "@uiid/icons/panel-left";

import { SIDEBAR_ID } from "../sidebar.constants";
import { toggleSidebar, useSidebarOpen } from "../sidebar.hooks";
import type { SidebarToggleProps } from "../sidebar.types";

/** Opens and closes the sidebar. */
export const SidebarToggle = (props: SidebarToggleProps) => {
  const open = useSidebarOpen();

  return (
    <Button
      data-slot="sidebar-toggle"
      aria-controls={SIDEBAR_ID}
      aria-expanded={open}
      onClick={toggleSidebar}
      tooltip="Toggle sidebar"
      variant="ghost"
      shape="square"
      size="xsmall"
      {...props}
    >
      <PanelLeftIcon />
    </Button>
  );
};
SidebarToggle.displayName = "SidebarToggle";
