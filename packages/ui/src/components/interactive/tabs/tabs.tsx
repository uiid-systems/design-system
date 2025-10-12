import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import type { TabsProps } from "./tabs.types";

import styles from "./tabs.module.css";

export const Tabs = ({
  items,
  defaultValue,
  RootProps,
  ListProps,
  TabProps,
  IndicatorProps,
  PanelProps,
}: TabsProps) => {
  return (
    <BaseTabs.Root
      className={styles.Tabs}
      defaultValue={defaultValue || items[0].value}
      {...RootProps}
    >
      <BaseTabs.List className={styles.List} {...ListProps}>
        {items.map((item) => (
          <BaseTabs.Tab className={styles.Tab} value={item.value} {...TabProps}>
            {item.label}
          </BaseTabs.Tab>
        ))}

        <BaseTabs.Indicator className={styles.Indicator} {...IndicatorProps} />
      </BaseTabs.List>

      {items.map((item) => (
        <BaseTabs.Panel
          className={styles.Panel}
          value={item.value}
          {...PanelProps}
        >
          {item.label}
        </BaseTabs.Panel>
      ))}
    </BaseTabs.Root>
  );
};
Tabs.displayName = "Tabs";
