"use client";

import { Layer } from "@uiid/layout";
import { useState } from "react";

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
  /*
   * Resolved once, on mount. Base UI warns when an uncontrolled root's
   * default changes, which a fallback read on every render would do as soon
   * as items arrive after an empty first render. `null` is Base UI's "no tab
   * active", so only `undefined` falls back to the first item.
   */
  const [initialValue] = useState(() =>
    defaultValue !== undefined ? defaultValue : items[0]?.value,
  );

  return (
    <TabsRoot
      defaultValue={value === undefined ? initialValue : undefined}
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
          <TabsTab {...TabProps} key={item.value} value={item.value}>
            {item.label}
          </TabsTab>
        ))}
        <TabsIndicator {...IndicatorProps} />
      </TabsList>

      <Layer data-slot="tabs-container" {...ContainerProps}>
        {items.map((item) => (
          <TabsPanel
            {...PanelProps}
            key={item.value}
            value={item.value}
            keepMounted={keepMounted}
          >
            {item.content ?? item.render}
          </TabsPanel>
        ))}
      </Layer>
    </TabsRoot>
  );
};
Tabs.displayName = "Tabs";
