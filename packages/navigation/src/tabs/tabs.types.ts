import type { Tabs } from "@base-ui/react/tabs";
import type { GroupProps, LayerProps, StackProps } from "@uiid/layout";
import type { VariantProps, WithLayoutProps } from "@uiid/utils";

import { tabsListVariants } from "./tabs.variants";

export type TabsListVariants = VariantProps<typeof tabsListVariants>;

export type TabProps = {
  label: string;
  value: string;
  render: React.ReactNode;
};

export type TabsRootProps = WithLayoutProps<Tabs.Root.Props, StackProps>;
export type TabsListProps = WithLayoutProps<Tabs.List.Props, GroupProps> & {
  /** Surface treatment — filled by default, `ghost` drops the list background and border. */
  variant?: "ghost";
} & TabsListVariants;
export type TabsTabProps = Tabs.Tab.Props;
export type TabsIndicatorProps = Tabs.Indicator.Props;
export type TabsPanelProps = WithLayoutProps<Tabs.Panel.Props, StackProps>;

export type TabsProps = {
  items: TabProps[];
  RootProps?: TabsRootProps;
  ListProps?: TabsListProps;
  TabProps?: Omit<TabsTabProps, "value">;
  IndicatorProps?: TabsIndicatorProps;
  PanelProps?: Omit<TabsPanelProps, "value">;
  ContainerProps?: LayerProps;
} & Pick<TabsRootProps, "defaultValue" | "onValueChange" | "value"> &
  Pick<TabsPanelProps, "keepMounted"> &
  Pick<TabsListProps, "size" | "variant" | "fullwidth">;
