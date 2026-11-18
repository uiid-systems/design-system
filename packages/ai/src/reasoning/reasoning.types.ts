import type { CollapsibleRootProps } from "@uiid/interactive";

/** What a `label` function is called with. */
export type ReasoningLabelState = {
  /** Whether the text is still arriving. */
  streaming: boolean;
  /**
   * How long the model thought, in whole seconds: `duration` when passed, else
   * the time measured for the last stream, else `undefined`.
   */
  duration?: number;
  /**
   * The trigger's text, in place of the English default ("Thinking…", then
   * "Thought for N seconds", or "Reasoning" with no duration). A function is
   * called with the streaming state and duration. A string shimmers while
   * streaming; any other node renders as itself.
   */
  label?: React.ReactNode | ((state: ReasoningLabelState) => React.ReactNode);
};

export type ReasoningProps = Omit<CollapsibleRootProps, "children"> & {
  /** The reasoning text, as markdown. It may be cut off while it streams. */
  children: string;
  /**
   * Whether the text is still arriving. While true the trigger shimmers
   * "Thinking…" and an uncontrolled block opens; when it turns false the block
   * reads how long it thought and closes a second later.
   */
  streaming?: boolean;
  /**
   * How long the model thought, in whole seconds. Overrides the time the
   * component measured between `streaming` turning on and off.
   */
  duration?: number;
  /**
   * The trigger's text, in place of the English default ("Thinking…", then
   * "Thought for N seconds", or "Reasoning" with no duration). A function is
   * called with the streaming state and duration. A string shimmers while
   * streaming; any other node renders as itself.
   */
  label?: React.ReactNode | ((state: ReasoningLabelState) => React.ReactNode);
};
