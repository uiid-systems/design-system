"use client";

import { Layer } from "@uiid/layout";

import {
  TabsRoot,
  TabsList,
  TabsTab,
  TabsIndicator,
  TabsPanel,
} from "./subcomponents";
import type { TabsProps } from "./tabs.types";

export const Tabs = ({
  items,
  defaultValue,
  value,
  onValueChange,
  keepMounted,
  size,
  variant,
  fullwidth,
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
      <TabsList
        size={size}
        variant={variant}
        fullwidth={fullwidth}
        {...ListProps}
      >
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
