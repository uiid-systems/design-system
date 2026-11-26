import { Group } from "@uiid/layout";
import { Text } from "@uiid/typography";
import { cx } from "@uiid/utils";
import * as React from "react";

import { DEFAULT_COPYABLE, DEFAULT_CODE } from "../../code.constants";
import type { CodeBlockHeaderProps } from "../code-block.types";
import { LanguageIcon } from "../language-icons";
import { getLanguageIcon } from "../language-icons/language-icon.utils";
import { CodeBlockCopyButton } from "./code-block-copy-button";
import { CodeBlockFullscreenButton } from "./code-block-fullscreen-button";
import { CodeBlockWrapButton } from "./code-block-wrap-button";

import styles from "../code-block.module.css";

/** The bar's own layout; a floating header has none, the CSS module places it. */
const BAR_PROPS = {
  ax: "space-between",
  gap: 3,
  py: 2,
  px: 4,
  bb: 1,
  w: "full",
} as const;

/**
 * The bar above the code: language icon, filename and buttons. It renders from
 * its content, and with no filename, icon or children its buttons float over
 * the code instead. Floating, it is `position: absolute` against its nearest
 * positioned ancestor, and only inside `CodeBlock` and `CodeEditor` do the
 * lines beside it keep clear of the buttons.
 */
export const CodeBlockHeader = ({
  filename,
  language,
  copyable = DEFAULT_COPYABLE,
  code = DEFAULT_CODE,
  wrappable = false,
  wrap,
  defaultWrap,
  onWrapChange,
  fullscreenable = false,
  fullscreen,
  onFullscreenChange,
  className,
  LanguageIconProps,
  WrapButtonProps,
  CopyButtonProps,
  FullscreenButtonProps,
  children,
  ...props
}: CodeBlockHeaderProps) => {
  // Nothing to copy means no copy button at all.
  const showCopy = copyable && !!code;
  // The resolved name, set only when LanguageIcon would draw something.
  const iconLanguage = getLanguageIcon(language)?.language;
  const hasActions = wrappable || showCopy || fullscreenable;

  // The bar renders from its content: a filename, an icon or children. With
  // none, the buttons float over the code; with no buttons either, nothing.
  const hasContent =
    !!iconLanguage || !!filename || React.Children.toArray(children).length > 0;
  if (!hasContent && !hasActions) return null;
  const floating = !hasContent;

  return (
    <Group
      data-slot="code-block-header"
      data-floating={floating || undefined}
      className={cx(styles["code-block-header"], className)}
      ay="center"
      {...(floating ? undefined : BAR_PROPS)}
      {...props}
    >
      {!floating && (
        <Group
          data-slot="code-block-title"
          className={styles["code-block-title"]}
          ay="center"
          gap={2}
          grow
        >
          {iconLanguage && (
            <LanguageIcon
              language={iconLanguage}
              className={styles["code-block-language-icon"]}
              {...LanguageIconProps}
            />
          )}
          {filename && (
            <Text size={-1} family="mono" emphasis="muted" truncate>
              {filename}
            </Text>
          )}
        </Group>
      )}
      {children}
      {hasActions && (
        <Group
          data-slot="code-block-actions"
          className={styles["code-block-actions"]}
          ay="center"
          flex="none"
        >
          {wrappable && (
            <CodeBlockWrapButton
              {...WrapButtonProps}
              pressed={wrap}
              defaultPressed={defaultWrap}
              onPressedChange={onWrapChange}
            />
          )}
          {showCopy && <CodeBlockCopyButton {...CopyButtonProps} code={code} />}
          {fullscreenable && (
            <CodeBlockFullscreenButton
              {...FullscreenButtonProps}
              pressed={fullscreen}
              onPressedChange={onFullscreenChange}
            />
          )}
        </Group>
      )}
    </Group>
  );
};
CodeBlockHeader.displayName = "CodeBlockHeader";
