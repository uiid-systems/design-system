import type { CardProps } from "@uiid/cards";
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
   * Explicit status for this item. Overrides whatever the timeline derives
   * from `activeIndex`/`defaultStatus`.
   */
  status?: TimelineStatus;
  /**
   * A node rendered inside the marker on the rail (e.g. a small icon).
   * Switches the marker from the plain dot to its content variant.
   */
  marker?: React.ReactNode;
  /**
   * A prominent visual (e.g. an `<Avatar />` or icon) shown in a dedicated
   * column to the left of the rail. Optional — items without it keep the
   * column empty so every marker stays aligned.
   */
  media?: React.ReactNode;
  /** Arbitrary content (e.g. a `<Card />`) rendered below the text block. */
  content?: React.ReactNode;
}

export type TimelineMediaProps = React.ComponentProps<"div">;
export type TimelineMarkerProps = React.ComponentProps<"div"> & {
  color?: TimelineColor;
};
export type TimelineConnectorProps = React.ComponentProps<"div"> & {
  /** Render even when this is the last item. */
  forceMount?: boolean;
};
export type TimelineContentProps = StackProps;
/** Forwarded to the item Card's `TitleProps`. */
export type TimelineTitleProps = TextProps;
export type TimelineTimeProps = TextProps & React.ComponentProps<"time">;
/** Forwarded to the item Card's `DescriptionProps`. */
export type TimelineDescriptionProps = TextProps;
/** Forwarded to the item Card's `HeaderProps`. */
export type TimelineHeadingProps = GroupProps;
/** The Card every item renders its content into. */
export type TimelineCardProps = CardProps;

/** Props forwarded to each item's subcomponents (override hooks). */
export interface TimelineSlotProps {
  MediaProps?: TimelineMediaProps;
  MarkerProps?: TimelineMarkerProps;
  ConnectorProps?: TimelineConnectorProps;
  ContentProps?: TimelineContentProps;
  /** Props for the item's Card — e.g. `{ variant: "ghost" }` for a flat row. */
  CardProps?: TimelineCardProps;
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

/**
 * Data-driven item passed via the `items` prop — full parity with
 * `TimelineItem`, including per-item slot props like `TitleProps`.
 */
export type TimelineItemType = TimelineItemProps;

export type TimelineProps = Omit<
  React.ComponentProps<"ol">,
  "color" | "title"
> &
  VariantProps<typeof timelineVariants> &
  // Slot props on the root apply to every item in data mode; per-item values
  // merge over them key-by-key.
  TimelineSlotProps & {
    /** Data-driven events. Omit to compose `TimelineItem`s as children. */
    items?: TimelineItemType[];
    /** Index of the current step; earlier items read as completed. */
    activeIndex?: number;
    /**
     * Status for items when `activeIndex` is absent (default `"pending"`).
     * Feeds of past events set `"completed"` so every marker reads as done.
     */
    defaultStatus?: TimelineStatus;
    /** Space between items as a spacing token (like `Stack`'s `gap`). */
    gap?: number;
    /** Text direction; RTL flips the rail to the opposite edge. */
    dir?: Direction;
    /** `<li>` props forwarded to every `TimelineItem` in data mode. */
    ItemProps?: Omit<React.ComponentProps<"li">, "color" | "content" | "title">;
  };
