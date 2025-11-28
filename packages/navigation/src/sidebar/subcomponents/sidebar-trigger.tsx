import { Button, type ButtonProps } from "@uiid/buttons";
import { PanelLeft } from "@uiid/icons";

import { useSidebar } from "../sidebar.context";

export const SidebarTrigger = ({ onClick, ...props }: ButtonProps) => {
  const { toggleSidebar } = useSidebar();

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    onClick?.(event);
    toggleSidebar();
  };

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="subtle"
      size="icon"
      aria-label="Toggle Sidebar"
      onClick={handleClick as ButtonProps["onClick"]}
      {...props}
    >
      <PanelLeft />
    </Button>
  );
};
SidebarTrigger.displayName = "SidebarTrigger";
