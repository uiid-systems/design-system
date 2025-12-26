import type { Tabs } from "@base-ui/react/tabs";

export type TabProps = {
  label: string;
  value: string;
  render: React.ReactNode;
};

export type TabsProps = {
  items: TabProps[];
  defaultValue?: Tabs.Root.Props["defaultValue"];
  RootProps?: Omit<Tabs.Root.Props, "defaultValue">;
  ListProps?: Tabs.List.Props;
  TabProps?: Tabs.Tab.Props;
  IndicatorProps?: Tabs.Indicator.Props;
  PanelProps?: Tabs.Panel.Props;
};
