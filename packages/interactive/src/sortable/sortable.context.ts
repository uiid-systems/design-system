import * as React from "react";

import { ROOT_NAME, ITEM_NAME } from "./sortable.constants";
import type {
  SortableRootContextValue,
  SortableItemContextValue,
} from "./sortable.types";

export const SortableRootContext =
  React.createContext<SortableRootContextValue<unknown> | null>(null);

export function useSortableContext(consumerName: string) {
  const context = React.useContext(SortableRootContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ROOT_NAME}\``);
  }
  return context;
}

export const SortableContentContext = React.createContext<boolean>(false);

export const SortableItemContext =
  React.createContext<SortableItemContextValue | null>(null);

export function useSortableItemContext(consumerName: string) {
  const context = React.useContext(SortableItemContext);
  if (!context) {
    throw new Error(`\`${consumerName}\` must be used within \`${ITEM_NAME}\``);
  }
  return context;
}

export const SortableOverlayContext = React.createContext<boolean>(false);
