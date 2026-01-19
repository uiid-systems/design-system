import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cx } from "@uiid/utils";
import { Group } from "@uiid/layout";

import type { TabsListProps } from "../tabs.types";
import { tabsListVariants } from "../tabs.variants";

export const TabsList = ({
  align,
  className,
  children,
  ...props
}: TabsListProps) => {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      render={<Group gap={2} ay="end" />}
      className={cx(tabsListVariants({ align }), className)}
      {...props}
    >
      {children}
    </BaseTabs.List>
  );
};
TabsList.displayName = "TabsList";
