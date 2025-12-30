import { Stack, type StackProps } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import styles from "./sidebar-group.module.css";

type SidebarGroupProps = StackProps & {
  category?: string;
};

export const SidebarGroup = ({
  category,
  className,
  children,
  ...props
}: SidebarGroupProps) => {
  return (
    <Stack
      data-slot="sidebar-group"
      fullwidth
      className={cx(styles["sidebar-group"], className)}
      {...props}
    >
      {category && <SidebarGroupCategory>{category}</SidebarGroupCategory>}
      {children}
    </Stack>
  );
};
SidebarGroup.displayName = "SidebarGroup";

const SidebarGroupCategory = ({ children }: { children: React.ReactNode }) => {
  return (
    <Text
      data-slot="sidebar-group-category"
      data-hide-collapsed
      render={<h4 />}
      size={-1}
      pl={2}
      my={4}
      shade="accent"
      bold
    >
      {children}
    </Text>
  );
};
SidebarGroupCategory.displayName = "SidebarGroupCategory";
