"use client";

import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import { DEFAULT_COPYABLE, DEFAULT_CODE } from "../code-block.constants";
import type { CodeBlockHeaderProps } from "../code-block.types";
import styles from "../code-block.module.css";

import { CodeBlockCopyButton } from "./code-block-copy-button";

export const CodeBlockHeader = ({
  filename,
  copyable = DEFAULT_COPYABLE,
  code = DEFAULT_CODE,
  className,
  CopyButtonProps,
  children,
  ...props
}: CodeBlockHeaderProps) => {
  return (
    <Group
      data-slot="code-block-header"
      className={cx(styles["code-block-header"], className)}
      ay="center"
      ax="space-between"
      gap={4}
      py={2}
      px={4}
      fullwidth
      {...props}
    >
      <Text size={-1} family="mono" shade="accent">
        {filename}
      </Text>
      {children}
      {copyable && code && (
        <CodeBlockCopyButton code={code} {...CopyButtonProps} />
      )}
    </Group>
  );
};
CodeBlockHeader.displayName = "CodeBlockHeader";
