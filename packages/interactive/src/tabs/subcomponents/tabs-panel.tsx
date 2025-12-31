import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cx } from "@uiid/utils";
import { Stack } from "@uiid/layout";

import type { TabsPanelProps } from "../tabs.types";
import styles from "../tabs.module.css";

export const TabsPanel = ({
  className,
  children,
  ...props
}: TabsPanelProps) => {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      render={<Stack ay="center" ax="center" fullwidth />}
      className={cx(styles["tabs-panel"], className)}
      {...props}
    >
      {children}
    </BaseTabs.Panel>
  );
};
TabsPanel.displayName = "TabsPanel";
