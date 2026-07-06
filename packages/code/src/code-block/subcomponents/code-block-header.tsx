import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";

import { DEFAULT_COPYABLE, DEFAULT_CODE } from "../../code.constants";
import type { CodeBlockHeaderProps } from "../code-block.types";
import styles from "../code-block.module.css";
import { LanguageIcon } from "../language-icons";

import { CodeBlockCopyButton } from "./code-block-copy-button";
import { CodeBlockWrapButton } from "./code-block-wrap-button";

export const CodeBlockHeader = ({
  filename,
  language,
  copyable = DEFAULT_COPYABLE,
  code = DEFAULT_CODE,
  wrappable = false,
  wrap,
  defaultWrap,
  onWrapChange,
  className,
  LanguageIconProps,
  WrapButtonProps,
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
      gap={3}
      py={2}
      px={4}
      bb={1}
      fullwidth
      {...props}
    >
      <Group ay="center" gap={2}>
        {language && (
          <LanguageIcon
            language={language}
            className={styles["code-block-language-icon"]}
            {...LanguageIconProps}
          />
        )}
        {filename && (
          <Text size={-1} family="mono" shade="muted">
            {filename}
          </Text>
        )}
      </Group>
      {children}
      {(wrappable || copyable) && (
        <Group ay="center" gap={1}>
          {wrappable && (
            <CodeBlockWrapButton
              pressed={wrap}
              defaultPressed={defaultWrap}
              onPressedChange={onWrapChange}
              {...WrapButtonProps}
            />
          )}
          {copyable && (
            <CodeBlockCopyButton
              code={code}
              disabled={!code}
              {...CopyButtonProps}
            />
          )}
        </Group>
      )}
    </Group>
  );
};
CodeBlockHeader.displayName = "CodeBlockHeader";
