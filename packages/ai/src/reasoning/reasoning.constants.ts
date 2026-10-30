export const REASONING_LABELS = {
  thinking: "Thinking…",
  idle: "Reasoning",
} as const;

/** How long a finished block stays open before it closes itself, in ms. */
export const REASONING_AUTO_CLOSE_DELAY = 1000;

export const reasoningLabel = (seconds?: number) => {
  if (!seconds) return REASONING_LABELS.idle;
  return `Thought for ${seconds} ${seconds === 1 ? "second" : "seconds"}`;
};
