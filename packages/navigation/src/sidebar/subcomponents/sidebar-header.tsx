import { Stack, type StackProps } from "@uiid/layout";

export const SidebarHeader = ({ ...props }: StackProps) => {
  return <Stack data-slot="sidebar-header" gap={2} p={2} {...props} />;
};
SidebarHeader.displayName = "SidebarHeader";
