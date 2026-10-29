/** Who authored a message. Matches the AI SDK's `UIMessage["role"]`. */
export type ChatRole = "system" | "user" | "assistant";

/** Lifecycle of a chat request. Matches the AI SDK's `ChatStatus`. */
export type ChatStatus = "submitted" | "streaming" | "ready" | "error";

/** Lifecycle of a tool call. Matches the AI SDK's `ToolUIPart["state"]`. */
export type ToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied";
