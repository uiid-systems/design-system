import { Stack, type StackProps } from "@uiid/layout";

export const SidebarFooter = ({ ...props }: StackProps) => {
  return <Stack data-slot="sidebar-footer" gap={2} p={2} {...props} />;
};
SidebarFooter.displayName = "SidebarFooter";
