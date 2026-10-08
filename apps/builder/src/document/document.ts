import type { PropValue } from "../manifest/manifest.types";
import type { BuilderDocument, BuilderNode, NodeId } from "./document.types";

export const ROOT_ID: NodeId = "root";

/** A document holding only the root Stack. */
export function createDocument(): BuilderDocument {
  return {
    root: ROOT_ID,
    nodes: {
      [ROOT_ID]: {
        id: ROOT_ID,
        type: "Stack",
        props: { gap: 4, p: 6 },
        children: [],
      },
    },
  };
}

/** Ids of `id` and everything below it. */
function subtreeIds(doc: BuilderDocument, id: NodeId): NodeId[] {
  const ids: NodeId[] = [];
  const stack = [id];
  while (stack.length > 0) {
    const current = stack.pop()!;
    ids.push(current);
    stack.push(...(doc.nodes[current]?.children ?? []));
  }
  return ids;
}

function parentOf(doc: BuilderDocument, id: NodeId): BuilderNode | undefined {
  return Object.values(doc.nodes).find((node) => node.children.includes(id));
}

/** The id of the node holding `id`, or `undefined` for the root and unknown ids. */
export function parentIdOf(
  doc: BuilderDocument,
  id: NodeId,
): NodeId | undefined {
  return parentOf(doc, id)?.id;
}

function withChildren(
  doc: BuilderDocument,
  id: NodeId,
  children: NodeId[],
): BuilderDocument {
  return {
    ...doc,
    nodes: { ...doc.nodes, [id]: { ...doc.nodes[id], children } },
  };
}

const insertAt = <T>(list: T[], item: T, index?: number): T[] => {
  const at = index === undefined ? list.length : index;
  return [...list.slice(0, at), item, ...list.slice(at)];
};

/**
 * Adds `node` under `parentId`, appending when `index` is omitted. A node whose
 * id already exists is rejected as a no-op: overwriting it would leave the id
 * listed under two parents.
 */
export function insertNode(
  doc: BuilderDocument,
  parentId: NodeId,
  node: BuilderNode,
  index?: number,
): BuilderDocument {
  const parent = doc.nodes[parentId];
  if (!parent || doc.nodes[node.id]) return doc;

  return {
    ...doc,
    nodes: {
      ...doc.nodes,
      [node.id]: node,
      [parentId]: {
        ...parent,
        children: insertAt(parent.children, node.id, index),
      },
    },
  };
}

/**
 * Moves `id` under `parentId` at `index`, where `index` is the position in the
 * target's children after `id` has been removed from wherever it was. Moving
 * the root, or moving a node into itself or its own subtree, is a no-op.
 */
export function moveNode(
  doc: BuilderDocument,
  id: NodeId,
  parentId: NodeId,
  index: number,
): BuilderDocument {
  if (id === doc.root) return doc;
  if (!doc.nodes[id] || !doc.nodes[parentId]) return doc;
  if (subtreeIds(doc, id).includes(parentId)) return doc;

  const oldParent = parentOf(doc, id);
  if (!oldParent) return doc;

  const detached = withChildren(
    doc,
    oldParent.id,
    oldParent.children.filter((childId) => childId !== id),
  );
  const target = detached.nodes[parentId];

  return withChildren(detached, parentId, insertAt(target.children, id, index));
}

/** Removes `id` and its whole subtree. Removing the root is a no-op. */
export function removeNode(doc: BuilderDocument, id: NodeId): BuilderDocument {
  if (id === doc.root || !doc.nodes[id]) return doc;

  const parent = parentOf(doc, id);
  if (!parent) return doc;

  const nodes = { ...doc.nodes };
  for (const removedId of subtreeIds(doc, id)) delete nodes[removedId];

  return withChildren(
    { ...doc, nodes },
    parent.id,
    parent.children.filter((childId) => childId !== id),
  );
}

/** Sets one prop on `id`; `undefined` deletes the key. */
export function setProp(
  doc: BuilderDocument,
  id: NodeId,
  name: string,
  value: PropValue | undefined,
): BuilderDocument {
  const node = doc.nodes[id];
  if (!node) return doc;

  const props = { ...node.props };
  if (value === undefined) delete props[name];
  else props[name] = value;

  return { ...doc, nodes: { ...doc.nodes, [id]: { ...node, props } } };
}
