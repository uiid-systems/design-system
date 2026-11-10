"use client";

import { Button } from "@uiid/buttons";
import { ArrowUpIcon } from "@uiid/icons/arrow-up";
import { SquareIcon } from "@uiid/icons/square";
import { XIcon } from "@uiid/icons/x";

import type { PromptInputSubmitProps } from "../prompt-input.types";

/**
 * Submit while the request is `ready` or `error`, stop while it is
 * `submitted` or `streaming`. Without `onStop` there is nothing to stop, so
 * a generating request shows Send disabled instead. `submitted` shows
 * `Button`'s own spinner over the icon, so the button never changes size
 * between states.
 *
 * It always has a tooltip: its name, or the reason while that Send waits,
 * which `Button` also hands to screen readers as the description. A tooltip
 * that came and went with the status would wrap and unwrap the button,
 * remounting it and dropping its focus.
 */
export const PromptInputSubmit = ({
  status = "ready",
  onStop,
  onClick,
  disabled,
  focusableWhenDisabled,
  children,
  shape = "circle",
  tooltip,
  "aria-label": ariaLabel,
  ...props
}: PromptInputSubmitProps) => {
  const isGenerating = status === "submitted" || status === "streaming";
  const canStop = isGenerating && onStop !== undefined;
  const isWaiting = isGenerating && !canStop;
  const name = ariaLabel ?? (canStop ? "Stop" : "Send");

  let icon = <ArrowUpIcon />;
  if (canStop) icon = <SquareIcon />;
  else if (status === "error") icon = <XIcon />;

  return (
    <Button
      data-slot="prompt-input-submit"
      type={isGenerating ? "button" : "submit"}
      aria-label={name}
      tooltip={tooltip || (isWaiting ? "Waiting for the reply" : name)}
      shape={shape}
      size="xsmall"
      loading={status === "submitted"}
      disabled={disabled || isWaiting}
      /* The native disabled attribute drops a focused button's focus to the
         body (the HTML focus fixup rule), so a keyboard user who pressed Send
         would lose their place for the length of the reply. While waiting,
         the button is disabled through aria-disabled and stays focusable. */
      focusableWhenDisabled={focusableWhenDisabled || isWaiting}
      onClick={(event) => {
        onClick?.(event);
        if (canStop && !event.defaultPrevented) onStop();
      }}
      {...props}
    >
      {children ?? icon}
    </Button>
  );
};
PromptInputSubmit.displayName = "PromptInputSubmit";
