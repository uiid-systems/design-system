import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cx } from "@uiid/utils";
import { Group } from "@uiid/layout";

import type { TabsListProps } from "../tabs.types";
import styles from "../tabs.module.css";

export const TabsList = ({
  size = "md",
  ghost,
  fullwidth,
  className,
  children,
  ...props
}: TabsListProps) => {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      data-size={size}
      data-ghost={ghost || undefined}
      render={<Group gap={4} ay="center" fullwidth={fullwidth} />}
      className={cx(styles["tabs-list"], className)}
      {...props}
    >
      {children}
    </BaseTabs.List>
  );
};
TabsList.displayName = "TabsList";
