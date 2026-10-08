import { builderMeta } from "../../manifest/manifest";
import { useDocumentStore } from "../document.store";

const store = useDocumentStore;
const root = () => store.getState().document.root;

beforeEach(() => {
  store.setState(store.getInitialState(), true);
});

describe("initial state", () => {
  it("starts with the root document and nothing selected", () => {
    const { document, selectedId } = store.getState();

    expect(Object.keys(document.nodes)).toEqual([document.root]);
    expect(selectedId).toBeNull();
  });
});

describe("insert", () => {
  it("adds a node with the manifest defaults and selects it", () => {
    const id = store.getState().insert("Text", root());
    const { document, selectedId } = store.getState();

    expect(document.nodes[id].type).toBe("Text");
    expect(document.nodes[id].props).toEqual(builderMeta.Text.defaults);
    expect(document.nodes[id].children).toEqual([]);
    expect(document.nodes[root()].children).toEqual([id]);
    expect(selectedId).toBe(id);
  });

  it("copies the defaults so editing one node never leaks into the manifest", () => {
    const id = store.getState().insert("Text", root());
    store.getState().setProp(id, "children", "Changed");

    expect(builderMeta.Text.defaults.children).toBe("Text");
  });

  it("inserts at the given index", () => {
    const first = store.getState().insert("Text", root());
    const second = store.getState().insert("Button", root(), 0);

    expect(store.getState().document.nodes[root()].children).toEqual([
      second,
      first,
    ]);
  });

  it("gives every node a unique id", () => {
    const a = store.getState().insert("Text", root());
    const b = store.getState().insert("Text", root());

    expect(a).not.toBe(b);
  });
});

describe("move", () => {
  it("moves a node into another container", () => {
    const stack = store.getState().insert("Stack", root());
    const text = store.getState().insert("Text", root());
    store.getState().move(text, stack, 0);

    const { nodes } = store.getState().document;
    expect(nodes[stack].children).toEqual([text]);
    expect(nodes[root()].children).toEqual([stack]);
  });
});

describe("remove", () => {
  it("removes the subtree and clears the selection when it held the node", () => {
    const stack = store.getState().insert("Stack", root());
    const text = store.getState().insert("Text", stack);
    store.getState().select(stack);
    store.getState().remove(stack);

    const { document, selectedId } = store.getState();
    expect(document.nodes[stack]).toBeUndefined();
    expect(document.nodes[text]).toBeUndefined();
    expect(selectedId).toBeNull();
  });

  it("clears the selection when the selected node was inside the subtree", () => {
    const stack = store.getState().insert("Stack", root());
    const text = store.getState().insert("Text", stack);
    expect(store.getState().selectedId).toBe(text);

    store.getState().remove(stack);

    expect(store.getState().selectedId).toBeNull();
  });

  it("keeps the selection when an unrelated node is removed", () => {
    const a = store.getState().insert("Text", root());
    const b = store.getState().insert("Text", root());
    store.getState().select(a);
    store.getState().remove(b);

    expect(store.getState().selectedId).toBe(a);
  });

  it("changes nothing when asked to remove the root", () => {
    const text = store.getState().insert("Text", root());
    const before = store.getState();
    store.getState().remove(root());

    expect(store.getState().document).toBe(before.document);
    expect(store.getState().selectedId).toBe(text);
  });
});

describe("setProp", () => {
  it("writes through to the document", () => {
    const id = store.getState().insert("Text", root());
    store.getState().setProp(id, "size", 3);

    expect(store.getState().document.nodes[id].props.size).toBe(3);
  });

  it("deletes the key when given undefined", () => {
    const id = store.getState().insert("Text", root());
    store.getState().setProp(id, "children", undefined);

    expect(store.getState().document.nodes[id].props).toEqual({});
  });
});

describe("select", () => {
  it("selects a node and can clear the selection with null", () => {
    const id = store.getState().insert("Text", root());
    store.getState().select(null);
    expect(store.getState().selectedId).toBeNull();

    store.getState().select(id);
    expect(store.getState().selectedId).toBe(id);
  });
});
