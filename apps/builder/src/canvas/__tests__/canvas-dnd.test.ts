import type {
  ClientRect,
  CollisionDetection,
  DroppableContainer,
} from "@dnd-kit/core";

import { useDocumentStore } from "../../document/document.store";
import {
  deepestTarget,
  handleDragEnd,
  placementFor,
  resolveDrop,
} from "../canvas-dnd";
import type { NodeDropData, Placement } from "../canvas-dnd";

const store = useDocumentStore;

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

/** root > [stack > [textA, textB], group > [button]] */
const seed = () => {
  const s = store.getState();
  const root = s.document.root;
  const stack = s.insert("Stack", root);
  const textA = s.insert("Text", stack);
  const textB = s.insert("Text", stack);
  const group = s.insert("Group", root);
  const button = s.insert("Button", group);
  s.select(null);
  return { root, stack, textA, textB, group, button };
};

const doc = () => store.getState().document;
const childrenOf = (id: string) => doc().nodes[id].children;

beforeEach(() => {
  store.setState(store.getInitialState(), true);
});

describe("placementFor", () => {
  const r = rect(0, 0, 100, 100);

  it("drops before or after a leaf by the midpoint on the given axis", () => {
    expect(placementFor(r, { x: 50, y: 10 }, "y", false)).toBe("before");
    expect(placementFor(r, { x: 50, y: 90 }, "y", false)).toBe("after");
    expect(placementFor(r, { x: 10, y: 50 }, "x", false)).toBe("before");
    expect(placementFor(r, { x: 90, y: 50 }, "x", false)).toBe("after");
  });

  it("drops inside a container in its middle band and beside it at the edges", () => {
    expect(placementFor(r, { x: 50, y: 10 }, "y", true)).toBe("before");
    expect(placementFor(r, { x: 50, y: 50 }, "y", true)).toBe("inside");
    expect(placementFor(r, { x: 50, y: 90 }, "y", true)).toBe("after");
  });
});

describe("resolveDrop", () => {
  it("appends inside a container", () => {
    const ids = seed();
    expect(resolveDrop(doc(), ids.stack, "inside")).toEqual({
      parentId: ids.stack,
      index: 2,
    });
  });

  it("targets the sibling slot before or after a node", () => {
    const ids = seed();
    expect(resolveDrop(doc(), ids.textB, "before")).toEqual({
      parentId: ids.stack,
      index: 1,
    });
    expect(resolveDrop(doc(), ids.textB, "after")).toEqual({
      parentId: ids.stack,
      index: 2,
    });
  });

  it("treats the root's edges as inside the root", () => {
    const ids = seed();
    expect(resolveDrop(doc(), ids.root, "before")).toEqual({
      parentId: ids.root,
      index: 2,
    });
  });
});

describe("deepestTarget", () => {
  const droppable = (
    nodeId: string,
    depth: number,
    container: boolean,
    r: ClientRect,
  ) =>
    ({
      id: nodeId,
      key: nodeId,
      disabled: false,
      node: { current: null },
      rect: { current: r },
      data: {
        current: { kind: "node", nodeId, depth, container } as NodeDropData,
      },
    }) as unknown as DroppableContainer;

  /** root (0,0 400x400) > stack (0,0 200x200) > textA (0,0 200x50), textB (0,50 200x50) */
  const collide = (
    active:
      | { kind: "palette"; type: "Text" }
      | { kind: "node"; nodeId: string },
    x: number,
    y: number,
    ids: ReturnType<typeof seed>,
  ) => {
    const containers = [
      droppable(ids.root, 0, true, rect(0, 0, 400, 400)),
      droppable(ids.stack, 1, true, rect(0, 0, 200, 200)),
      droppable(ids.textA, 2, false, rect(0, 0, 200, 50)),
      droppable(ids.textB, 2, false, rect(0, 50, 200, 50)),
    ];
    return deepestTarget({
      active: { id: "x", data: { current: active } },
      collisionRect: rect(x, y, 1, 1),
      droppableContainers: containers,
      droppableRects: new Map(containers.map((c) => [c.id, c.rect.current!])),
      pointerCoordinates: { x, y },
    } as unknown as Parameters<CollisionDetection>[0]);
  };

  it("reports only the deepest node under the pointer, with its placement", () => {
    const ids = seed();
    const palette = { kind: "palette", type: "Text" } as const;

    expect(collide(palette, 100, 10, ids)).toEqual([
      { id: ids.textA, data: { placement: "before" } },
    ]);
    expect(collide(palette, 100, 90, ids)).toEqual([
      { id: ids.textB, data: { placement: "after" } },
    ]);
    expect(collide(palette, 100, 150, ids)).toEqual([
      { id: ids.stack, data: { placement: "inside" } },
    ]);
    expect(collide(palette, 300, 300, ids)).toEqual([
      { id: ids.root, data: { placement: "inside" } },
    ]);
  });

  it("never targets the dragged node or anything inside it", () => {
    const ids = seed();

    expect(collide({ kind: "node", nodeId: ids.stack }, 100, 10, ids)).toEqual([
      { id: ids.root, data: { placement: "inside" } },
    ]);
    expect(collide({ kind: "node", nodeId: ids.textA }, 100, 10, ids)).toEqual([
      { id: ids.stack, data: { placement: "before" } },
    ]);
  });

  it("returns nothing outside every node", () => {
    const ids = seed();
    expect(collide({ kind: "palette", type: "Text" }, 500, 500, ids)).toEqual(
      [],
    );
  });
});

describe("handleDragEnd", () => {
  type Drag =
    | { kind: "palette"; type: "Text" }
    | { kind: "node"; nodeId: string };

  const end = (drag: Drag, overId: string | null, placement: Placement) =>
    handleDragEnd({
      active: { id: "x", data: { current: drag } },
      over: overId && {
        id: overId,
        data: {
          current: { kind: "node", nodeId: overId, depth: 0, container: true },
        },
      },
      collisions: overId ? [{ id: overId, data: { placement } }] : null,
    } as unknown as Parameters<typeof handleDragEnd>[0]);

  it("inserts a palette item at the resolved slot", () => {
    const ids = seed();
    end({ kind: "palette", type: "Text" }, ids.textB, "before");

    const kids = childrenOf(ids.stack);
    expect(kids).toHaveLength(3);
    expect(kids[1]).toBe(store.getState().selectedId);
    expect(kids[2]).toBe(ids.textB);
  });

  it("reorders a node after a later sibling", () => {
    const ids = seed();
    end({ kind: "node", nodeId: ids.textA }, ids.textB, "after");

    expect(childrenOf(ids.stack)).toEqual([ids.textB, ids.textA]);
  });

  it("reorders a node before an earlier sibling", () => {
    const ids = seed();
    end({ kind: "node", nodeId: ids.textB }, ids.textA, "before");

    expect(childrenOf(ids.stack)).toEqual([ids.textB, ids.textA]);
  });

  it("moves a node into another container, keeping its subtree", () => {
    const ids = seed();
    end({ kind: "node", nodeId: ids.stack }, ids.group, "inside");

    expect(childrenOf(ids.root)).toEqual([ids.group]);
    expect(childrenOf(ids.group)).toEqual([ids.button, ids.stack]);
    expect(childrenOf(ids.stack)).toEqual([ids.textA, ids.textB]);
  });

  it("moves a node before a node in another container", () => {
    const ids = seed();
    end({ kind: "node", nodeId: ids.textA }, ids.button, "before");

    expect(childrenOf(ids.group)).toEqual([ids.textA, ids.button]);
    expect(childrenOf(ids.stack)).toEqual([ids.textB]);
  });

  it("leaves the document alone when dropped on its own subtree or nowhere", () => {
    const ids = seed();
    const before = doc();

    end({ kind: "node", nodeId: ids.stack }, ids.textA, "after");
    end({ kind: "node", nodeId: ids.stack }, ids.stack, "inside");
    end({ kind: "node", nodeId: ids.textA }, null, "inside");

    expect(doc()).toBe(before);
  });
});
