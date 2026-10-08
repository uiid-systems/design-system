import type {
  ClientRect,
  CollisionDetection,
  DroppableContainer,
} from "@dnd-kit/core";

import { useDocumentStore } from "../../document/document.store";
import { deepestContainer, handleDragEnd } from "../canvas-dnd";

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): ClientRect => ({
  left,
  top,
  width,
  height,
  right: left + width,
  bottom: top + height,
});

const droppable = (id: string, depth: number, r: ClientRect) =>
  ({
    id,
    key: id,
    disabled: false,
    node: { current: null },
    rect: { current: r },
    data: { current: { kind: "container", nodeId: id, depth } },
  }) as unknown as DroppableContainer;

/** root (0,0 400x400) > stack (50,50 200x200) > group (75,75 50x50) */
const containers = [
  droppable("root", 0, rect(0, 0, 400, 400)),
  droppable("stack", 1, rect(50, 50, 200, 200)),
  droppable("group", 2, rect(75, 75, 50, 50)),
];

const collide = (x: number, y: number) =>
  deepestContainer({
    active: { id: "palette-Text" },
    collisionRect: rect(x, y, 1, 1),
    droppableContainers: containers,
    droppableRects: new Map(containers.map((c) => [c.id, c.rect.current!])),
    pointerCoordinates: { x, y },
  } as unknown as Parameters<CollisionDetection>[0]);

describe("deepestContainer", () => {
  it("returns only the innermost container under the pointer", () => {
    expect(collide(100, 100).map((c) => c.id)).toEqual(["group"]);
    expect(collide(200, 200).map((c) => c.id)).toEqual(["stack"]);
    expect(collide(300, 300).map((c) => c.id)).toEqual(["root"]);
  });

  it("returns nothing when the pointer is outside every container", () => {
    expect(collide(500, 500)).toEqual([]);
  });
});

describe("handleDragEnd", () => {
  const store = useDocumentStore;

  beforeEach(() => {
    store.setState(store.getInitialState(), true);
  });

  const end = (over: { id: string; nodeId: string } | null) =>
    handleDragEnd({
      active: {
        id: "palette-Text",
        data: { current: { kind: "palette", type: "Text" } },
      },
      over: over && {
        id: over.id,
        data: { current: { kind: "container", nodeId: over.nodeId, depth: 0 } },
      },
    } as unknown as Parameters<typeof handleDragEnd>[0]);

  it("inserts a palette item into the container it was dropped on", () => {
    const root = store.getState().document.root;
    const stack = store.getState().insert("Stack", root);

    end({ id: stack, nodeId: stack });

    const { document, selectedId } = store.getState();
    expect(document.nodes[stack].children).toHaveLength(1);
    expect(document.nodes[root].children).toEqual([stack]);
    expect(document.nodes[selectedId!].type).toBe("Text");
  });

  it("does nothing when dropped outside every container", () => {
    const before = store.getState().document;

    end(null);

    expect(store.getState().document).toBe(before);
  });
});
