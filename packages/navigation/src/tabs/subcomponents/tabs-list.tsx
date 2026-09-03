import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Group } from "@uiid/layout";
import { cx } from "@uiid/utils";

import { TABS_DEFAULT_SIZE } from "../tabs.constants";
import type { TabsListProps } from "../tabs.types";
import { tabsListVariants } from "../tabs.variants";

import styles from "../tabs.module.css";

export const TabsList = ({
  size = TABS_DEFAULT_SIZE,
  variant,
  fullwidth,
  className,
  children,
  ...props
}: TabsListProps) => {
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      data-size={size}
      data-variant={variant}
      render={<Group gap={4} ay="center" fullwidth={fullwidth} />}
      className={cx(styles["tabs-list"], tabsListVariants({ size }), className)}
      {...props}
    >
      {children}
    </BaseTabs.List>
  );
};
TabsList.displayName = "TabsList";
