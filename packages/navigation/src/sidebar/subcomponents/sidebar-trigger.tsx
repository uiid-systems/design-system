"use client";

import { Button, type ButtonProps } from "@uiid/buttons";
import { PanelLeft } from "@uiid/icons";
import { Kbd } from "@uiid/indicators";
import { Group } from "@uiid/layout";

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
      data-slot="sidebar-trigger"
      aria-label="Toggle Sidebar"
      onClick={handleClick as ButtonProps["onClick"]}
      tooltip={
        <Group gap={1} ay="center">
          <span>Toggle Sidebar</span>
          <Kbd>⌘ + B</Kbd>
        </Group>
      }
      variant="subtle"
      size="sm"
      square
      {...props}
    >
      <PanelLeft />
    </Button>
  );
};
SidebarTrigger.displayName = "SidebarTrigger";
