import type {
  UniqueIdentifier,
  DndContextProps,
  DraggableAttributes,
  DraggableSyntheticListeners,
  DragOverlay,
  DragEndEvent,
} from "@dnd-kit/core";
import type { SortableContextProps } from "@dnd-kit/sortable";
import type { RenderProp } from "@uiid/utils";

export interface SortableRootContextValue<T> {
  id: string;
  items: UniqueIdentifier[];
  modifiers: DndContextProps["modifiers"];
  strategy: SortableContextProps["strategy"];
  activeId: UniqueIdentifier | null;
  setActiveId: (id: UniqueIdentifier | null) => void;
  getItemValue: (item: T) => UniqueIdentifier;
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

interface GetItemValue<T> {
  /**
   * Callback that returns a unique identifier for each sortable item.
   * Required when using array of objects.
   * @example getItemValue={(item) => item.id}
   */
  getItemValue: (item: T) => UniqueIdentifier;
}

export type SortableRootProps<T> = DndContextProps &
  (T extends object ? GetItemValue<T> : Partial<GetItemValue<T>>) & {
    /** Array of items to sort */
    value: T[];
    /** Callback when order changes */
    onValueChange?: (items: T[]) => void;
    /** Callback with move event including indices */
    onMove?: (
      event: DragEndEvent & { activeIndex: number; overIndex: number },
    ) => void;
    /** Sorting strategy override */
    strategy?: SortableContextProps["strategy"];
    /** Layout orientation */
    orientation?: "vertical" | "horizontal" | "mixed";
    /** Use flat cursor instead of grab cursor */
    flatCursor?: boolean;
  };

export interface SortableContentProps extends React.ComponentProps<"div"> {
  /** Sorting strategy override */
  strategy?: SortableContextProps["strategy"];
  /** Content children */
  children: React.ReactNode;
  /** Render as a different element */
  render?: RenderProp;
  /** Render without wrapper element */
  withoutSlot?: boolean;
}

export interface SortableItemProps extends React.ComponentProps<"div"> {
  /** Unique identifier for this item */
  value: UniqueIdentifier;
  /** Use the item itself as the drag handle */
  asHandle?: boolean;
  /** Render as a different element */
  render?: RenderProp;
  /** Disable dragging for this item */
  disabled?: boolean;
}

export interface SortableItemHandleProps
  extends React.ComponentProps<"button"> {
  /** Render as a different element */
  render?: RenderProp;
}

export interface SortableOverlayProps
  extends Omit<React.ComponentProps<typeof DragOverlay>, "children"> {
  /** Container element for the portal */
  container?: Element | DocumentFragment | null;
  /** Overlay content - can be a function receiving the active item value */
  children?:
    | ((params: { value: UniqueIdentifier }) => React.ReactNode)
    | React.ReactNode;
}
