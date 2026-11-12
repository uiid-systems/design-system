import { Prose } from "@uiid/typography";
import { memo } from "react";

import type { MarkdownProps } from "./markdown.types";
import { compileMarkdown } from "./markdown.utils";
import { MarkdownReveal } from "./subcomponents/markdown-reveal";

/**
 * Memoized on its props: during a stream the transcript re-renders on every
 * token, and only the message whose text is changing should recompile.
 *
 * Has no hooks of its own so it renders in a server component. `reveal` hands
 * off to a client component, chosen on `reveal` alone so it stays mounted
 * when streaming ends and the last words can finish animating.
 */
export const Markdown = memo(
  ({
    children,
    streaming = false,
    reveal = false,
    overrides,
    ...props
  }: MarkdownProps) =>
    reveal ? (
      <MarkdownReveal streaming={streaming} overrides={overrides} {...props}>
        {children}
      </MarkdownReveal>
    ) : (
      <Prose data-slot="markdown" {...props}>
        {compileMarkdown(children, { streaming, overrides })}
      </Prose>
    ),
);
Markdown.displayName = "Markdown";
