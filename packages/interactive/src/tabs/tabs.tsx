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
  align,
  /** subcomponents */
  RootProps,
  ListProps,
  TabProps,
  IndicatorProps,
  PanelProps,
  ContainerProps,
}: TabsProps) => {
  return (
    <TabsRoot
      defaultValue={defaultValue || items[0].value}
      value={value}
      onValueChange={onValueChange}
      {...RootProps}
    >
      <TabsList align={align} {...ListProps}>
        {items.map((item) => (
          <TabsTab key={item.value} value={item.value} {...TabProps}>
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator {...IndicatorProps} />
      </TabsList>

      <Layer data-slot="tabs-container" {...ContainerProps}>
        {items.map((item) => (
          <TabsPanel
            key={item.value}
            value={item.value}
            keepMounted={keepMounted}
            {...PanelProps}
          >
            {item.render}
          </TabsPanel>
        ))}
      </Layer>
    </TabsRoot>
  );
};
Tabs.displayName = "Tabs";
