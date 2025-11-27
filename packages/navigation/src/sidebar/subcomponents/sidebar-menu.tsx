import { Stack, type StackProps } from "@uiid/layout";

export const SidebarMenu = ({ style, ...props }: StackProps) => {
  return (
    <Stack
      render={<ul />}
      data-slot="sidebar-menu"
      fullwidth
      gap={1}
      style={{ minWidth: 0, ...style }}
      {...props}
    />
  );
};
SidebarMenu.displayName = "SidebarMenu";
