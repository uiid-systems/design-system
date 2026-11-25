"use client";

import { Layer } from "@uiid/layout";
import { definedProps } from "@uiid/utils";
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
   * active", so only `undefined` falls back, to `RootProps` and then to the
   * first item. Top-level props win over the same key in `RootProps`.
   */
  const [initialValue] = useState(() =>
    [defaultValue, RootProps?.defaultValue, items[0]?.value].find(
      (candidate) => candidate !== undefined,
    ),
  );
  const resolvedValue = value !== undefined ? value : RootProps?.value;

  return (
    <TabsRoot
      {...RootProps}
      {...definedProps({
        defaultValue: resolvedValue === undefined ? initialValue : undefined,
        value: resolvedValue,
        onValueChange,
      })}
    >
      <TabsList {...ListProps} size={size} variant={variant}>
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
            {item.content}
          </TabsPanel>
        ))}
      </Layer>
    </TabsRoot>
  );
};
Tabs.displayName = "Tabs";
