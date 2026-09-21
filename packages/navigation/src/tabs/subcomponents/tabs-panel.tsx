import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { TabsPanelProps } from "../tabs.types";

import styles from "../tabs.module.css";

export const TabsPanel = ({
  ax = "center",
  ay = "center",
  fullwidth = true,
  className,
  children,
  ...props
}: TabsPanelProps) => {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      render={<Stack ax={ax} ay={ay} fullwidth={fullwidth} />}
      className={cx(styles["tabs-panel"], className)}
      tabIndex={-1}
      {...props}
    >
      {children}
    </BaseTabs.Panel>
  );
};
TabsPanel.displayName = "TabsPanel";
