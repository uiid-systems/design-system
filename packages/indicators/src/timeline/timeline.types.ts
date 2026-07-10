import type { GroupProps, StackProps } from "@uiid/layout";
import type { TextProps } from "@uiid/typography";
import type { VariantProps } from "@uiid/utils";

import type { timelineVariants } from "./timeline.variants";

export type Direction = "ltr" | "rtl";
export type TimelineStatus = "completed" | "active" | "pending";

export type TimelineColor = VariantProps<typeof timelineVariants>["color"];

/** Per-item state injected by the root onto each item. */
export interface TimelineItemContextValue {
  /** Zero-based position of the item within the timeline. */
  index: number;
  /** Status derived from the timeline's `activeIndex`. */
  status: TimelineStatus;
  /** Whether this is the final item (no trailing connector). */
  isLast: boolean;
  /** Whether the connector below this item reads as completed. */
  connectorActive: boolean;
}

/** The shape of a single event — shared by the `items` prop and `TimelineItem`. */
export interface TimelineItemContent {
  /** Primary label, aligned with the marker. */
  title?: React.ReactNode;
  /** Timestamp or short meta, shown beside the title. */
  time?: React.ReactNode;
  /** Secondary description below the title. */
  description?: React.ReactNode;
  /** Palette color for this item's marker and connector. */
  color?: TimelineColor;
  /**
   * A prominent visual (e.g. an `<Avatar />` or icon) shown in a dedicated
   * column to the left of the rail. Optional — items without it keep the
   * column empty so every marker stays aligned.
   */
  media?: React.ReactNode;
  /** Arbitrary content (e.g. a `<Card />`) rendered below the text block. */
  content?: React.ReactNode;
}

/** Data-driven item passed via the `items` prop. */
export type TimelineItemType = TimelineItemContent;

export type TimelineMediaProps = React.ComponentProps<"div">;
export type TimelineMarkerProps = React.ComponentProps<"div"> & {
  color?: TimelineColor;
};
export type TimelineConnectorProps = React.ComponentProps<"div"> & {
  /** Render even when this is the last item. */
  forceMount?: boolean;
};
export type TimelineContentProps = StackProps;
export type TimelineTitleProps = TextProps;
export type TimelineTimeProps = TextProps & React.ComponentProps<"time">;
export type TimelineDescriptionProps = TextProps;
export type TimelineHeadingProps = GroupProps;

/** Props forwarded to each item's subcomponents (override hooks). */
export interface TimelineSlotProps {
  MediaProps?: TimelineMediaProps;
  MarkerProps?: TimelineMarkerProps;
  ConnectorProps?: TimelineConnectorProps;
  ContentProps?: TimelineContentProps;
  TitleProps?: TimelineTitleProps;
  TimeProps?: TimelineTimeProps;
  DescriptionProps?: TimelineDescriptionProps;
  HeadingProps?: TimelineHeadingProps;
}

export type TimelineItemProps = Omit<
  React.ComponentProps<"li">,
  "content" | "title"
> &
  TimelineItemContent &
  TimelineSlotProps;

export type TimelineProps = Omit<
  React.ComponentProps<"ol">,
  "color" | "title"
> &
  VariantProps<typeof timelineVariants> & {
    /** Data-driven events. Omit to compose `TimelineItem`s as children. */
    items?: TimelineItemType[];
    /** Index of the current step; earlier items read as completed. */
    activeIndex?: number;
    /** Text direction; RTL flips the rail to the opposite edge. */
    dir?: Direction;
    /**
     * Props forwarded to every `TimelineItem` in data mode — including nested
     * `MarkerProps`, `ContentProps`, `TitleProps`, etc.
     */
    ItemProps?: Omit<TimelineItemProps, keyof TimelineItemContent>;
  };
