import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cxState } from "@uiid/utils";

import type { TabsTabProps } from "../tabs.types";

import styles from "../tabs.module.css";

export const TabsTab = ({ className, children, ...props }: TabsTabProps) => {
  return (
    <BaseTabs.Tab
      data-slot="tabs-tab"
      className={cxState(styles["tab"], className)}
      {...props}
    >
      {children}
    </BaseTabs.Tab>
  );
};
TabsTab.displayName = "TabsTab";
