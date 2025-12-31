import { Tabs as BaseTabs } from "@base-ui/react/tabs";

import { cx } from "@uiid/utils";

import type { TabsIndicatorProps } from "../tabs.types";
import styles from "../tabs.module.css";

export const TabsIndicator = ({ className, ...props }: TabsIndicatorProps) => {
  return (
    <BaseTabs.Indicator
      data-slot="tabs-indicator"
      className={cx(styles["tabs-indicator"], className)}
      {...props}
    />
  );
};
TabsIndicator.displayName = "TabsIndicator";
