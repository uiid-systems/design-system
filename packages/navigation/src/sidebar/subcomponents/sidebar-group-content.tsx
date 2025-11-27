import { Box } from "@uiid/layout";

export const SidebarGroupContent = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return <Box data-slot="sidebar-group-content" fullwidth {...props} />;
};
SidebarGroupContent.displayName = "SidebarGroupContent";
