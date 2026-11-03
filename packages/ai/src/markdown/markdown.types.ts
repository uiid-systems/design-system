import type { ProseProps } from "@uiid/typography";

export type MarkdownProps = Omit<ProseProps, "children"> & {
  /** Markdown source. It may be cut off anywhere while it streams. */
  children: string;
  /**
   * Hold back unfinished syntax while the text is still arriving, so a
   * half-typed `**` or `[link](` never shows. Turn it off once the message is
   * complete: on finished text it would also hide anything after a stray
   * delimiter the model never closed.
   */
  streaming?: boolean;
  /**
   * Fade each word in as it arrives, while `streaming` is on, a whole word at
   * a time at an even pace rather than in the bursts it streams in. Once
   * streaming stops, the rest goes out at the same pace and finishes fading,
   * and the text then renders without the per-word spans. Makes `Markdown` a
   * client component.
   */
  reveal?: boolean;
};
