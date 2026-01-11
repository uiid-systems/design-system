import * as React from "react";

import { ROOT_NAME, ITEM_NAME } from "./timeline.constants";
import type {
  Store,
  TimelineContextValue,
  TimelineItemContextValue,
} from "./timeline.types";

export const StoreContext = React.createContext<Store | null>(null);

export function useStoreContext(consumerName: string) {
  const context = React.useContext(StoreContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

export const TimelineContext =
  React.createContext<TimelineContextValue | null>(null);

export function useTimelineContext(consumerName: string) {
  const context = React.useContext(TimelineContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

export const TimelineItemContext =
  React.createContext<TimelineItemContextValue | null>(null);

export function useTimelineItemContext(consumerName: string) {
  const context = React.useContext(TimelineItemContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``);
  }
  return context;
}
