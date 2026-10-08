import { pointerWithin, rectIntersection } from "@dnd-kit/core";
import type {
  ClientRect,
  Collision,
  CollisionDetection,
  DragEndEvent,
} from "@dnd-kit/core";

import { parentIdOf } from "../document/document";
import { useDocumentStore } from "../document/document.store";
import type { BuilderDocument, NodeId } from "../document/document.types";
import type { ManifestKey } from "../manifest/manifest";

/** What a palette item carries while dragged. */
export type PaletteDragData = { kind: "palette"; type: ManifestKey };
/** What a canvas node carries while dragged. */
export type NodeDragData = { kind: "node"; nodeId: NodeId };
export type DragData = PaletteDragData | NodeDragData;

/** What every canvas node exposes as a drop target. `depth` is 0 at the root. */
export type NodeDropData = {
  kind: "node";
  nodeId: NodeId;
  depth: number;
  container: boolean;
};

/** Where a drop lands relative to the node under the pointer. */
export type Placement = "before" | "after" | "inside";

type Point = { x: number; y: number };

export const paletteDragId = (type: ManifestKey) => `palette-${type}`;
export const nodeDragId = (id: NodeId) => `node:${id}`;

/** Containers lay children out on one axis; Group is the horizontal one. */
const axisOf = (doc: BuilderDocument, parentId: NodeId | undefined) =>
  parentId && doc.nodes[parentId]?.type === "Group" ? "x" : "y";

/** A container keeps its middle half for drops inside; a leaf splits at the middle. */
const INSIDE_BAND = 0.25;

export function placementFor(
  rect: ClientRect,
  pointer: Point,
  axis: "x" | "y",
  container: boolean,
): Placement {
  const t =
    axis === "x"
      ? (pointer.x - rect.left) / rect.width
      : (pointer.y - rect.top) / rect.height;

  if (container) {
    if (t < INSIDE_BAND) return "before";
    if (t > 1 - INSIDE_BAND) return "after";
    return "inside";
  }
  return t < 0.5 ? "before" : "after";
}

/** Ids of `id` and everything below it. */
function subtreeIds(doc: BuilderDocument, id: NodeId): Set<NodeId> {
  const ids = new Set<NodeId>();
  const stack = [id];
  while (stack.length > 0) {
    const current = stack.pop()!;
    ids.add(current);
    stack.push(...(doc.nodes[current]?.children ?? []));
  }
  return ids;
}

/**
 * Nested nodes are all under the pointer at once, so the innermost one, the
 * deepest in the tree, is the only collision reported, carrying the placement
 * the pointer position implies. A dragged node never targets itself or its own
 * subtree. Falls back to rectangle intersection without pointer coordinates.
 */
export const deepestTarget: CollisionDetection = (args) => {
  const doc = useDocumentStore.getState().document;
  const drag = args.active.data.current as DragData | undefined;
  const excluded =
    drag?.kind === "node" ? subtreeIds(doc, drag.nodeId) : new Set<NodeId>();

  const within = (
    args.pointerCoordinates ? pointerWithin(args) : rectIntersection(args)
  ).filter((c) => !excluded.has(dropDataOf(args, c)?.nodeId ?? ""));
  if (within.length === 0) return [];

  const deepest = within.reduce((best, c) =>
    (dropDataOf(args, c)?.depth ?? -1) > (dropDataOf(args, best)?.depth ?? -1)
      ? c
      : best,
  );
  const data = dropDataOf(args, deepest)!;
  const rect = args.droppableRects.get(deepest.id);
  const isRoot = data.nodeId === doc.root;

  const placement: Placement =
    isRoot || !rect || !args.pointerCoordinates
      ? "inside"
      : placementFor(
          rect,
          args.pointerCoordinates,
          axisOf(doc, parentIdOf(doc, data.nodeId)),
          data.container,
        );

  return [{ id: deepest.id, data: { placement } }];
};

function dropDataOf(
  args: Parameters<CollisionDetection>[0],
  collision: Collision,
): NodeDropData | undefined {
  return args.droppableContainers.find((c) => c.id === collision.id)?.data
    .current as NodeDropData | undefined;
}

/**
 * The container and slot a drop lands in. `index` is a position in that
 * container's current children. Edges of the root fold into the root.
 */
export function resolveDrop(
  doc: BuilderDocument,
  overId: NodeId,
  placement: Placement,
): { parentId: NodeId; index: number } | undefined {
  const over = doc.nodes[overId];
  if (!over) return undefined;

  const parentId = parentIdOf(doc, overId);
  if (placement === "inside" || !parentId) {
    return { parentId: overId, index: over.children.length };
  }

  const index = doc.nodes[parentId].children.indexOf(overId);
  return { parentId, index: placement === "after" ? index + 1 : index };
}

/** Reads the store directly: dnd-kit calls this outside React's render. */
export function handleDragEnd({ active, over, collisions }: DragEndEvent) {
  const drag = active.data.current as DragData | undefined;
  const drop = over?.data.current as NodeDropData | undefined;
  if (!drag || !drop) return;

  const store = useDocumentStore.getState();
  const placement =
    (collisions?.find((c) => c.id === over?.id)?.data?.placement as
      | Placement
      | undefined) ?? "inside";
  const target = resolveDrop(store.document, drop.nodeId, placement);
  if (!target) return;

  if (drag.kind === "palette") {
    store.insert(drag.type, target.parentId, target.index);
    return;
  }

  if (subtreeIds(store.document, drag.nodeId).has(target.parentId)) return;

  // moveNode indexes into the children after the node has been detached.
  const siblings = store.document.nodes[target.parentId].children;
  const from = siblings.indexOf(drag.nodeId);
  const index =
    from !== -1 && from < target.index ? target.index - 1 : target.index;
  store.move(drag.nodeId, target.parentId, index);
}
