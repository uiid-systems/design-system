import type { NodeId } from "../document/document.types";
import type { PropItem } from "../manifest/manifest.types";

export type PropFieldProps = {
  nodeId: NodeId;
  prop: PropItem;
};
