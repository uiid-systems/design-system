import { pointerWithin, rectIntersection } from "@dnd-kit/core";
import type { CollisionDetection, DragEndEvent } from "@dnd-kit/core";

import { useDocumentStore } from "../document/document.store";
import type { NodeId } from "../document/document.types";
import type { ManifestKey } from "../manifest/manifest";

/** What a palette item carries while dragged. Task 10 adds a `node` kind. */
export type PaletteDragData = { kind: "palette"; type: ManifestKey };

/** What a container droppable carries. `depth` is 0 at the root. */
export type ContainerDropData = {
  kind: "container";
  nodeId: NodeId;
  depth: number;
};

export type DragData = PaletteDragData;

export const paletteDragId = (type: ManifestKey) => `palette-${type}`;

/**
 * Nested containers are all under the pointer at once, so the innermost one,
 * the deepest in the tree, is the only collision reported. Falls back to
 * rectangle intersection when there are no pointer coordinates.
 */
export const deepestContainer: CollisionDetection = (args) => {
  const within = args.pointerCoordinates
    ? pointerWithin(args)
    : rectIntersection(args);
  if (within.length === 0) return [];

  const depthOf = (id: (typeof within)[number]["id"]) =>
    (
      args.droppableContainers.find((c) => c.id === id)?.data.current as
        | ContainerDropData
        | undefined
    )?.depth ?? -1;

  const deepest = within.reduce((best, c) =>
    depthOf(c.id) > depthOf(best.id) ? c : best,
  );
  return [deepest];
};

/** Reads the store directly: dnd-kit calls this outside React's render. */
export function handleDragEnd({ active, over }: DragEndEvent) {
  const drag = active.data.current as DragData | undefined;
  const drop = over?.data.current as ContainerDropData | undefined;
  if (!drag || drop?.kind !== "container") return;

  if (drag.kind === "palette") {
    useDocumentStore.getState().insert(drag.type, drop.nodeId);
  }
}
