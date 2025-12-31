import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cx } from "@uiid/utils";
import { Group } from "@uiid/layout";

import type { TabsListProps } from "../tabs.types";
import styles from "../tabs.module.css";

export const TabsList = ({ className, children, ...props }: TabsListProps) => {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      render={<Group gap={2} ay="end" ax="center" />}
      className={cx(styles["tabs-list"], className)}
      {...props}
    >
      {children}
    </BaseTabs.List>
  );
};
TabsList.displayName = "TabsList";
