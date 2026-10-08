import type { NodeId } from "../document/document.types";

export type CanvasNodeProps = {
  id: NodeId;
  /** Nesting depth, 0 at the root. Lets a drop pick the innermost container. */
  depth?: number;
};
