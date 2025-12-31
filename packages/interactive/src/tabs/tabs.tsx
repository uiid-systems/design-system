"use client";

import type { TabsProps } from "./tabs.types";

import { Layer } from "@uiid/layout";

import {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsIndicator,
  TabsPanel,
} from "./subcomponents";

export const Tabs = ({
  /** data */
  items,
  /** shortcuts */
  defaultValue,
  value,
  onValueChange,
  keepMounted,
  /** component props */
  RootProps,
  ListProps,
  TabProps,
  IndicatorProps,
  PanelProps,
}: TabsProps) => {
  return (
    <TabsRoot
      defaultValue={defaultValue || items[0].value}
      value={value}
      onValueChange={onValueChange}
      {...RootProps}
    >
      <TabsList {...ListProps}>
        {items.map((item) => (
          <TabsTab value={item.value} {...TabProps}>
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator {...IndicatorProps} />
      </TabsList>

      <Layer>
        {items.map((item) => (
          <TabsPanel
            value={item.value}
            aria-hidden={item.value !== defaultValue}
            keepMounted={keepMounted}
            {...PanelProps}
          >
            {item.label}
          </TabsPanel>
        ))}
      </Layer>
    </TabsRoot>
  );
};
Tabs.displayName = "Tabs";
