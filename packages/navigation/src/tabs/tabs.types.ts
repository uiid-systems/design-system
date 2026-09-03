import type { Tabs } from "@base-ui/react/tabs";
import type { LayerProps, StackProps } from "@uiid/layout";
import type { VariantProps } from "@uiid/utils";

import { tabsListVariants } from "./tabs.variants";

export type TabsListVariants = VariantProps<typeof tabsListVariants>;

export type TabProps = {
  label: string;
  value: string;
  render: React.ReactNode;
};

export type TabsRootProps = Tabs.Root.Props & StackProps;
export type TabsListProps = Tabs.List.Props & {
  /** Surface treatment — filled by default, `ghost` drops the list background and border. */
  variant?: "ghost";
  fullwidth?: boolean;
} & TabsListVariants;
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
  Pick<TabsListProps, "size" | "variant" | "fullwidth">;
