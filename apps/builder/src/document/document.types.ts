import type { PropValue } from "../manifest/manifest.types";

export type NodeId = string;

export type BuilderNode = {
  id: NodeId;
  /** Key into the manifest, e.g. "Stack" */
  type: string;
  /** Only props the user has set. Text content lives here as `children: string`. */
  props: Record<string, PropValue>;
  /** Child node ids. Empty for leaves; present on every node so Grid can slot in later. */
  children: NodeId[];
};

export type BuilderDocument = {
  root: NodeId;
  nodes: Record<NodeId, BuilderNode>;
};
