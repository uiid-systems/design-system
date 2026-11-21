import { Button, type ButtonProps } from "@uiid/design-system";
import { PanelLeftIcon } from "@uiid/icons/panel-left";

import { SIDEBAR_ID } from "./constants";

/** Opens and closes the sidebar. Pass `onClick`; it holds no state. */
export const SidebarToggle = (props: ButtonProps) => {
  return (
    <Button
      data-slot="sidebar-toggle"
      aria-controls={SIDEBAR_ID}
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
