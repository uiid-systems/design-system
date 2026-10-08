import {
  createDocument,
  insertNode,
  moveNode,
  removeNode,
  setProp,
} from "../document";
import type { BuilderDocument, BuilderNode } from "../document.types";

const node = (id: string, type = "Text"): BuilderNode => ({
  id,
  type,
  props: {},
  children: [],
});

/** root > [a > [a1, a2], b] */
const fixture = (): BuilderDocument => {
  let doc = createDocument();
  doc = insertNode(doc, doc.root, node("a", "Stack"));
  doc = insertNode(doc, "a", node("a1"));
  doc = insertNode(doc, "a", node("a2"));
  doc = insertNode(doc, doc.root, node("b"));
  return doc;
};

describe("createDocument", () => {
  it("creates a root Stack with gap 4 and padding 6 and no children", () => {
    const doc = createDocument();
    const root = doc.nodes[doc.root];

    expect(root.type).toBe("Stack");
    expect(root.props).toEqual({ gap: 4, p: 6 });
    expect(root.children).toEqual([]);
    expect(Object.keys(doc.nodes)).toEqual([doc.root]);
  });
});

describe("insertNode", () => {
  it("appends to the parent's children when index is omitted", () => {
    const doc = fixture();
    const next = insertNode(doc, "a", node("a3"));

    expect(next.nodes.a.children).toEqual(["a1", "a2", "a3"]);
    expect(next.nodes.a3).toEqual(node("a3"));
  });

  it("inserts at the index when one is given", () => {
    const doc = fixture();
    const next = insertNode(doc, "a", node("a0"), 0);

    expect(next.nodes.a.children).toEqual(["a0", "a1", "a2"]);
  });

  it("is a no-op when the parent does not exist", () => {
    const doc = fixture();
    const next = insertNode(doc, "missing", node("x"));

    expect(next).toBe(doc);
  });

  it("returns a new document and leaves the input untouched", () => {
    const doc = fixture();
    const before = structuredClone(doc);
    const next = insertNode(doc, "a", node("a3"));

    expect(next).not.toBe(doc);
    expect(doc).toEqual(before);
  });
});

describe("moveNode", () => {
  it("reorders within the same container", () => {
    const doc = fixture();
    const next = moveNode(doc, "a2", "a", 0);

    expect(next.nodes.a.children).toEqual(["a2", "a1"]);
  });

  it("moves across containers, removing from the old parent", () => {
    const doc = fixture();
    const next = moveNode(doc, "a1", doc.root, 0);

    expect(next.nodes.a.children).toEqual(["a2"]);
    expect(next.nodes[next.root].children).toEqual(["a1", "a", "b"]);
    expect(next.nodes.a1).toEqual(node("a1"));
  });

  it("is a no-op when moving a node into itself or its own descendant", () => {
    const doc = fixture();

    expect(moveNode(doc, "a", "a", 0)).toBe(doc);
    expect(moveNode(doc, "a", "a1", 0)).toBe(doc);
  });

  it("is a no-op when moving the root", () => {
    const doc = fixture();

    expect(moveNode(doc, doc.root, "a", 0)).toBe(doc);
  });

  it("is a no-op when the node or target parent does not exist", () => {
    const doc = fixture();

    expect(moveNode(doc, "missing", "a", 0)).toBe(doc);
    expect(moveNode(doc, "a1", "missing", 0)).toBe(doc);
  });

  it("returns a new document and leaves the input untouched", () => {
    const doc = fixture();
    const before = structuredClone(doc);
    const next = moveNode(doc, "a1", doc.root, 0);

    expect(next).not.toBe(doc);
    expect(doc).toEqual(before);
  });
});

describe("removeNode", () => {
  it("removes the whole subtree from nodes and from the parent's children", () => {
    const doc = fixture();
    const next = removeNode(doc, "a");

    expect(next.nodes[next.root].children).toEqual(["b"]);
    expect(Object.keys(next.nodes).sort()).toEqual([next.root, "b"].sort());
  });

  it("is a no-op when removing the root", () => {
    const doc = fixture();

    expect(removeNode(doc, doc.root)).toBe(doc);
  });

  it("is a no-op when the node does not exist", () => {
    const doc = fixture();

    expect(removeNode(doc, "missing")).toBe(doc);
  });

  it("returns a new document and leaves the input untouched", () => {
    const doc = fixture();
    const before = structuredClone(doc);
    const next = removeNode(doc, "a");

    expect(next).not.toBe(doc);
    expect(doc).toEqual(before);
  });
});

describe("setProp", () => {
  it("sets a prop on the node", () => {
    const doc = fixture();
    const next = setProp(doc, "a1", "size", 3);

    expect(next.nodes.a1.props).toEqual({ size: 3 });
  });

  it("deletes the key when the value is undefined", () => {
    const doc = setProp(fixture(), "a1", "size", 3);
    const next = setProp(doc, "a1", "size", undefined);

    expect(next.nodes.a1.props).toEqual({});
    expect("size" in next.nodes.a1.props).toBe(false);
  });

  it("is a no-op when the node does not exist", () => {
    const doc = fixture();

    expect(setProp(doc, "missing", "size", 3)).toBe(doc);
  });

  it("returns a new document and leaves the input untouched", () => {
    const doc = fixture();
    const before = structuredClone(doc);
    const next = setProp(doc, "a1", "size", 3);

    expect(next).not.toBe(doc);
    expect(next.nodes.a1).not.toBe(doc.nodes.a1);
    expect(doc).toEqual(before);
  });
});
