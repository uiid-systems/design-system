import type {
  DndContextProps,
  DraggableAttributes,
  DraggableSyntheticListeners,
  UniqueIdentifier,
} from "@dnd-kit/core";
import type { SortableContextProps } from "@dnd-kit/sortable";
import * as React from "react";

import { ROOT_NAME, ITEM_NAME } from "./sortable.constants";

/** What `Sortable` hands its parts: only the fields a part reads. */
export interface SortableRootContextValue {
  /** Read by SortableContent. */
  items: UniqueIdentifier[];
  /** Read by SortableContent. */
  strategy: SortableContextProps["strategy"];
  /** Read by SortableOverlay. */
  modifiers: DndContextProps["modifiers"];
  /** Read by SortableOverlay. */
  activeId: UniqueIdentifier | null;
  /** Read by SortableOverlay. */
  flatCursor: boolean;
}

export interface SortableItemContextValue {
  id: string;
  attributes: DraggableAttributes;
  listeners: DraggableSyntheticListeners | undefined;
  setActivatorNodeRef: (node: HTMLElement | null) => void;
  isDragging?: boolean;
  disabled?: boolean;
}

export const SortableRootContext =
  React.createContext<SortableRootContextValue | null>(null);

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
