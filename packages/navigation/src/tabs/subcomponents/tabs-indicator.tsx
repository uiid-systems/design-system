import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cxState } from "@uiid/utils";

import type { TabsIndicatorProps } from "../tabs.types";

import styles from "../tabs.module.css";

export const TabsIndicator = ({ className, ...props }: TabsIndicatorProps) => {
  return (
    <BaseTabs.Indicator
      data-slot="tabs-indicator"
      className={cxState(styles["tabs-indicator"], className)}
      {...props}
    />
  );
};
TabsIndicator.displayName = "TabsIndicator";
