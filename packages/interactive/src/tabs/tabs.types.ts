import type { Tabs } from "@base-ui/react/tabs";

import type { LayerProps, StackProps } from "@uiid/layout";
import type { LayoutProps } from "@uiid/utils";

export type TabProps = {
  label: string;
  value: string;
  render: React.ReactNode;
};

export type TabsRootProps = Tabs.Root.Props & StackProps;
export type TabsListProps = Tabs.List.Props & {
  align?: LayoutProps["ax"];
  evenly?: boolean;
};
export type TabsTabProps = Tabs.Tab.Props;
export type TabsIndicatorProps = Tabs.Indicator.Props;
export type TabsPanelProps = Tabs.Panel.Props;

export type TabsProps = {
  items: TabProps[];
  RootProps?: TabsRootProps;
  ListProps?: TabsListProps;
  TabProps?: TabsTabProps;
  IndicatorProps?: TabsIndicatorProps;
  PanelProps?: TabsPanelProps;
  ContainerProps?: LayerProps;
} & Pick<TabsRootProps, "defaultValue" | "onValueChange" | "value"> &
  Pick<TabsPanelProps, "keepMounted"> &
  Pick<TabsListProps, "evenly" | "align">;
