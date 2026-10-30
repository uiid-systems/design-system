import type { CollapsibleRootProps } from "@uiid/interactive";

import type { ToolState } from "../ai.types";

/**
 * The fields of an AI SDK tool part that Tool renders. Structurally satisfied
 * by both `ToolUIPart` and `DynamicToolUIPart`, so a part from `useChat` is
 * passed as it is.
 */
export type ToolPart = {
  /** `tool-<name>` for a static tool, `dynamic-tool` for a dynamic one. */
  type: string;
  /** The tool's name, on a dynamic part. A static part carries it in `type`. */
  toolName?: string;
  /** A display name, when the part carries one. */
  title?: string;
  state: ToolState;
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

/* `part` is omitted from the root props because HTML's own `part` attribute
   already types it as a string. */
export type ToolProps = Omit<CollapsibleRootProps, "part"> & {
  /** The tool call to show. */
  part: ToolPart;
};
