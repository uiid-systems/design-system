import * as React from "react";

import { ITEM_NAME } from "./timeline.constants";
import type { TimelineItemContextValue } from "./timeline.types";

export const TimelineItemContext =
  React.createContext<TimelineItemContextValue | null>(null);

export function useTimelineItemContext(consumerName: string) {
  const context = React.useContext(TimelineItemContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``);
  }
  return context;
}
