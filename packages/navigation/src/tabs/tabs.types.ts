import type { Tabs } from "@base-ui/react/tabs";
import type { GroupProps, LayerProps, StackProps } from "@uiid/layout";
import type {
  VariantProps,
  WithLayoutProps,
  WithStringClassName,
} from "@uiid/utils";

import type { tabsListVariants } from "./tabs.variants";

export type TabsListVariants = VariantProps<typeof tabsListVariants>;

/** One entry in `Tabs`' `items`: its tab's label and value, and its panel's content. */
export type TabsItemData = {
  label: string;
  value: string;
  content: React.ReactNode;
};

export type TabsRootProps = WithLayoutProps<Tabs.Root.Props, StackProps>;
export type TabsListProps = WithLayoutProps<
  WithStringClassName<Tabs.List.Props>,
  GroupProps
> & {
  /** Surface treatment — filled by default, `ghost` drops the list background and border. */
  variant?: "ghost";
} & TabsListVariants;
export type TabsTabProps = WithStringClassName<Tabs.Tab.Props>;
export type TabsIndicatorProps = WithStringClassName<Tabs.Indicator.Props>;
export type TabsPanelProps = WithLayoutProps<
  WithStringClassName<Tabs.Panel.Props>,
  StackProps
>;

export type TabsProps = {
  items: TabsItemData[];
  RootProps?: TabsRootProps;
  /** Reaches the list. `size` and `variant` are set on Tabs itself, and the tabs come from `items`. */
  ListProps?: Omit<TabsListProps, "size" | "variant" | "children">;
  /** Reaches every tab. Each item sets its tab's `value` and content. */
  TabProps?: Omit<TabsTabProps, "value" | "children">;
  IndicatorProps?: TabsIndicatorProps;
  /** Reaches every panel. Each item sets its panel's `value` and content; `keepMounted` is set on Tabs itself. */
  PanelProps?: Omit<TabsPanelProps, "value" | "keepMounted" | "children">;
  ContainerProps?: LayerProps;
} & Pick<TabsRootProps, "defaultValue" | "onValueChange" | "value"> &
  Pick<TabsPanelProps, "keepMounted"> &
  Pick<TabsListProps, "size" | "variant">;
