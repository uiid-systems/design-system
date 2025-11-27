export const SidebarMenuItem = ({
  style,
  ...props
}: React.ComponentProps<"li">) => {
  return (
    <li
      data-slot="sidebar-menu-item"
      style={{ position: "relative", ...style }}
      {...props}
    />
  );
};
SidebarMenuItem.displayName = "SidebarMenuItem";
