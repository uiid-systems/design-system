import type { Tabs } from "@base-ui/react/tabs";

import type { TabsAlign } from "./tabs.variants";

export type TabProps = {
  label: string;
  value: string;
  render: React.ReactNode;
};

export type TabsRootProps = Tabs.Root.Props;
export type TabsListProps = Tabs.List.Props & {
  /** Alignment of tabs within the list */
  align?: TabsAlign;
};
export type TabsTabProps = Tabs.Tab.Props;
export type TabsIndicatorProps = Tabs.Indicator.Props;
export type TabsPanelProps = Tabs.Panel.Props;

export type TabsProps = {
  items: TabProps[];
  /** Alignment of tabs within the list */
  align?: TabsAlign;
  RootProps?: TabsRootProps;
  ListProps?: TabsListProps;
  TabProps?: TabsTabProps;
  IndicatorProps?: TabsIndicatorProps;
  PanelProps?: TabsPanelProps;
} & Pick<TabsRootProps, "defaultValue" | "onValueChange" | "value"> &
  Pick<TabsPanelProps, "keepMounted">;
