import type { CollapsibleRootProps } from "@uiid/interactive";
import type { WithStringClassName } from "@uiid/utils";

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

/** Text that replaces Tool's English. Anything left out keeps its default. */
export type ToolLabels = {
  /** The status badge's text, per state. */
  status?: Partial<Record<ToolState, React.ReactNode>>;
  /** The input section's heading. @default "Parameters" */
  parameters?: React.ReactNode;
  /** The output section's heading. @default "Result" */
  result?: React.ReactNode;
  /** The output section's heading when the part has `errorText`. @default "Error" */
  error?: React.ReactNode;
};

/* `part` is omitted from the root props because HTML's own `part` attribute
   already types it as a string. */
export type ToolProps = WithStringClassName<
  Omit<CollapsibleRootProps, "part">
> & {
  /** The tool call to show. */
  part: ToolPart;
  /** Text in place of the English status labels and section headings. */
  labels?: ToolLabels;
};
