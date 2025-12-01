"use client";

import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import type { TabsProps } from "./tabs.types";

import { Group, Stack, Layer } from "@uiid/layout";

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
    <BaseTabs.Root defaultValue={defaultValue || items[0].value} {...RootProps}>
      <BaseTabs.List
        render={<Group gap={2} ay="end" ax="center" />}
        className={styles["tabs-list"]}
        {...ListProps}
      >
        {items.map((item) => (
          <BaseTabs.Tab className={styles.Tab} value={item.value} {...TabProps}>
            {item.label}
          </BaseTabs.Tab>
        ))}

        <BaseTabs.Indicator
          className={styles["tabs-indicator"]}
          {...IndicatorProps}
        />
      </BaseTabs.List>

      <Layer>
        {items.map((item) => (
          <BaseTabs.Panel
            render={<Stack ay="center" ax="center" fullwidth />}
            className={styles["tabs-panel"]}
            value={item.value}
            aria-hidden={item.value !== defaultValue}
            keepMounted
            {...PanelProps}
          >
            {item.label}
          </BaseTabs.Panel>
        ))}
      </Layer>
    </BaseTabs.Root>
  );
};
Tabs.displayName = "Tabs";
