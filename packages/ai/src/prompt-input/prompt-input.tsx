"use client";

import { Textarea } from "@uiid/forms";
import { Group } from "@uiid/layout";
import { cx, useComposedRefs } from "@uiid/utils";
import { useRef } from "react";

import {
  PROMPT_INPUT_LABEL,
  PROMPT_INPUT_PLACEHOLDER,
} from "./prompt-input.constants";
import type { PromptInputProps } from "./prompt-input.types";
import { PromptInputSubmit } from "./subcomponents";

import styles from "./prompt-input.module.css";

/**
 * Safari reports the Enter that commits an IME composition with
 * `isComposing` already false, but still with the legacy composition keyCode.
 */
const isComposing = (event: React.KeyboardEvent) =>
  event.nativeEvent.isComposing || event.keyCode === 229;

export const PromptInput = ({
  status = "ready",
  onSubmit,
  onStop,
  header,
  tools,
  label,
  disabled,
  value,
  onKeyDown,
  className,
  ref,
  ...props
}: PromptInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const composedRef = useComposedRefs(ref, textareaRef);
  const isGenerating = status === "submitted" || status === "streaming";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const textarea = textareaRef.current;
    if (!textarea || isGenerating) return;

    const text = textarea.value;
    if (text.trim() === "") return;

    onSubmit({ text }, event);
    /* Uncontrolled text is the composer's to clear. Controlled text is the
       caller's, and they clear it when their send has gone through. */
    if (value === undefined) textarea.value = "";
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key !== "Enter" || event.shiftKey || isComposing(event)) return;

    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  return (
    <form
      data-slot="prompt-input"
      data-status={status}
      className={cx(styles["prompt-input"], className)}
      onSubmit={handleSubmit}
    >
      <Textarea
        ref={composedRef}
        aria-label={label ? undefined : PROMPT_INPUT_LABEL}
        placeholder={PROMPT_INPUT_PLACEHOLDER}
        rows={1}
        resize="none"
        fullwidth
        label={label}
        disabled={disabled}
        value={value}
        className={styles["textarea"]}
        onKeyDown={handleKeyDown}
        before={
          header && (
            <Group data-slot="prompt-input-header" gap={1} wrap fullwidth>
              {header}
            </Group>
          )
        }
        after={
          <Group
            data-slot="prompt-input-footer"
            ax="space-between"
            ay="center"
            gap={2}
            fullwidth
          >
            <Group data-slot="prompt-input-tools" gap={1} wrap>
              {tools}
            </Group>
            <PromptInputSubmit
              status={status}
              onStop={onStop}
              disabled={disabled}
            />
          </Group>
        }
        {...props}
      />
    </form>
  );
};
PromptInput.displayName = "PromptInput";
