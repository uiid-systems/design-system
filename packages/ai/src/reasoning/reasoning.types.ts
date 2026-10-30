import type { CollapsibleRootProps } from "@uiid/interactive";

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
};
