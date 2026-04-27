import type { StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { VariantProps } from "@uiid/utils";

import type { timelineVariants } from "./timeline.variants";

export type Direction = "ltr" | "rtl";
export type Orientation = "vertical" | "horizontal";
export type TimelineStatus = "completed" | "active" | "pending";

export type ItemElement = HTMLDivElement;

export interface StoreState {
  items: Map<string, React.RefObject<ItemElement | null>>;
}

export interface Store {
  subscribe: (callback: () => void) => () => void;
  getState: () => StoreState;
  notify: () => void;
  onItemRegister: (
    id: string,
    ref: React.RefObject<ItemElement | null>,
  ) => void;
  onItemUnregister: (id: string) => void;
  getNextItemStatus: (
    id: string,
    activeIndex?: number,
  ) => TimelineStatus | undefined;
  getItemIndex: (id: string) => number;
}

export type TimelineContextValue = {
  dir: Direction;
  orientation: Orientation;
  activeIndex?: number;
};

export interface TimelineItemContextValue {
  id: string;
  status: TimelineStatus;
}

export type TimelineItemType = {
  title: string;
  description?: string;
  time?: string;
  color?: VariantProps<typeof timelineVariants>["color"];
  content?: React.ReactNode;
};

export type TimelineItemProps = React.ComponentProps<"div"> &
  VariantProps<typeof timelineVariants>;
export type TimelineDotProps = React.ComponentProps<"div">;
export type TimelineConnectorProps = React.ComponentProps<"div"> & {
  /** Force mount even if last item */
  forceMount?: boolean;
};
export type TimelineContentProps = StackProps & {
  variant?: "card";
};
export type TimelineHeaderProps = React.ComponentProps<"div">;
export type TimelineTitleProps = TextProps;
export type TimelineDescriptionProps = TextProps;
export type TimelineTimeProps = TextProps & React.ComponentProps<"time">;

export type TimelineProps = React.ComponentProps<"div"> &
  Partial<TimelineContextValue> &
  VariantProps<typeof timelineVariants> & {
    items?: TimelineItemType[];
    ItemProps?: TimelineItemProps;
    DotProps?: TimelineDotProps;
    ConnectorProps?: TimelineConnectorProps;
    ContentProps?: TimelineContentProps;
    HeaderProps?: TimelineHeaderProps;
    TitleProps?: TimelineTitleProps;
    DescriptionProps?: TimelineDescriptionProps;
    TimeProps?: TimelineTimeProps;
  };
