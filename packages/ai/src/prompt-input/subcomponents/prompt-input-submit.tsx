"use client";

import { Button } from "@uiid/buttons";
import { ArrowUpIcon } from "@uiid/icons/arrow-up";
import { SquareIcon } from "@uiid/icons/square";
import { XIcon } from "@uiid/icons/x";

import type { PromptInputSubmitProps } from "../prompt-input.types";

/**
 * Submit while the request is `ready` or `error`, stop while it is
 * `submitted` or `streaming`. `submitted` shows `Button`'s own spinner over
 * the square, so the button never changes size between states.
 */
export const PromptInputSubmit = ({
  status = "ready",
  onStop,
  onClick,
  children,
  ...props
}: PromptInputSubmitProps) => {
  const isGenerating = status === "submitted" || status === "streaming";

  let icon = <ArrowUpIcon />;
  if (isGenerating) icon = <SquareIcon />;
  else if (status === "error") icon = <XIcon />;

  return (
    <Button
      data-slot="prompt-input-submit"
      type={isGenerating ? "button" : "submit"}
      aria-label={isGenerating ? "Stop" : "Send"}
      shape="circle"
      size="xsmall"
      loading={status === "submitted"}
      onClick={(event) => {
        onClick?.(event);
        if (isGenerating && !event.defaultPrevented) onStop?.();
      }}
      {...props}
    >
      {children ?? icon}
    </Button>
  );
};
PromptInputSubmit.displayName = "PromptInputSubmit";
