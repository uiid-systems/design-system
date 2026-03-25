import type { ReactNode } from "react";
import { cx } from "@uiid/utils";
import { Group } from "@uiid/layout";

import { CodeBlockCopyButton } from "./code-block-copy-button";
import styles from "./code-block.module.css";

interface CodeBlockProps {
  children?: ReactNode;
  className?: string;
}

/**
 * MDX pre element wrapper.
 * When `pre` is replaced with this component, children is the code element from Shiki.
 * We wrap it in a styled container with copy functionality.
 */
export function CodeBlock({ children, className }: CodeBlockProps) {
  return (
    <div
      data-slot="mdx-code-block"
      className={cx(styles["code-block"], styles["shiki-theme"])}
    >
      <Group className={styles["code-block-header"]} ax="end">
        <CodeBlockCopyButton />
      </Group>
      <pre className={cx(styles["code-block-pre"], className)}>{children}</pre>
    </div>
  );
}
