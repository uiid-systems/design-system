import type { ProseProps } from "@uiid/typography";
import type { ComponentPropsWithoutRef, ComponentType } from "react";

/** What the `codeBlock` override receives for each code block. */
export type MarkdownCodeBlockProps = {
  /** The block's text, as written. Raw HTML in it is never parsed. */
  code: string;
  /**
   * The first word of the fence's info string, such as `ts` for a block
   * opened with ```` ```ts ````. Absent when the fence has none.
   */
  language?: string;
};

/**
 * Components that render markdown's links, images and code blocks.
 *
 * `a` and `img` replace `<a>` and `<img>` and get the element's props.
 * `Markdown` drops `javascript:`, `vbscript:` and non-image `data:` URLs,
 * including forms split by tabs or newlines, but that is a blocklist: before
 * reusing a URL anywhere a browser navigates (an `href`, `window.open`),
 * allowlist its scheme, for example `new URL(url, location.href).protocol` in
 * `http:`/`https:` (plus `mailto:` for links).
 *
 * `codeBlock` replaces a whole code block, `<pre>` and all, and gets its text
 * and language instead of element props.
 */
export type MarkdownOverrides = {
  a?: ComponentType<ComponentPropsWithoutRef<"a">>;
  img?: ComponentType<
    Omit<ComponentPropsWithoutRef<"img">, "src"> & { src?: string }
  >;
  codeBlock?: ComponentType<MarkdownCodeBlockProps>;
};

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
  /**
   * Render links, images and code blocks with your own components, such as a
   * link policy for untrusted text or a highlighted code block. Define the
   * object and its components once, outside render: a new component each
   * render remounts every link, image and code block.
   */
  overrides?: MarkdownOverrides;
};
