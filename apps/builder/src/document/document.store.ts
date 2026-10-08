import { create } from "zustand";

import { builderMeta } from "../manifest/manifest";
import type { ManifestKey } from "../manifest/manifest";
import type { PropValue } from "../manifest/manifest.types";
import {
  createDocument,
  insertNode,
  moveNode,
  removeNode,
  setProp,
} from "./document";
import type { BuilderDocument, NodeId } from "./document.types";

export type DocumentState = {
  document: BuilderDocument;
  selectedId: NodeId | null;
  /** Creates a node of `type` from the manifest defaults, inserts it, selects it, and returns its id. */
  insert: (type: ManifestKey, parentId: NodeId, index?: number) => NodeId;
  move: (id: NodeId, parentId: NodeId, index: number) => void;
  /** Removes the subtree. Clears the selection if it pointed inside it. */
  remove: (id: NodeId) => void;
  setProp: (id: NodeId, name: string, value: PropValue | undefined) => void;
  select: (id: NodeId | null) => void;
};

let nextId = 1;
const createId = (type: ManifestKey): NodeId =>
  `${type.toLowerCase()}-${nextId++}`;

export const useDocumentStore = create<DocumentState>()((set, get) => ({
  document: createDocument(),
  selectedId: null,

  insert: (type, parentId, index) => {
    const id = createId(type);
    const node = {
      id,
      type,
      props: { ...builderMeta[type].defaults },
      children: [],
    };
    set((state) => ({
      document: insertNode(state.document, parentId, node, index),
      selectedId: id,
    }));
    return id;
  },

  move: (id, parentId, index) =>
    set((state) => ({
      document: moveNode(state.document, id, parentId, index),
    })),

  remove: (id) => {
    const before = get().document;
    const document = removeNode(before, id);
    if (document === before) return;

    set((state) => ({
      document,
      selectedId:
        state.selectedId && !document.nodes[state.selectedId]
          ? null
          : state.selectedId,
    }));
  },

  setProp: (id, name, value) =>
    set((state) => ({ document: setProp(state.document, id, name, value) })),

  select: (id) => set({ selectedId: id }),
}));
