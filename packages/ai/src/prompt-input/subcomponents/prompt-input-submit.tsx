"use client";

import { Button } from "@uiid/buttons";
import { ArrowUpIcon } from "@uiid/icons/arrow-up";
import { SquareIcon } from "@uiid/icons/square";
import { XIcon } from "@uiid/icons/x";

import type { PromptInputSubmitProps } from "../prompt-input.types";

/**
 * Submit while the request is `ready` or `error`, stop while it is
 * `submitted` or `streaming`. Without `onStop` there is nothing to stop, so
 * a generating request shows Send disabled instead, with a tooltip saying
 * why. `submitted` shows `Button`'s own spinner over the icon, so the button
 * never changes size between states.
 */
export const PromptInputSubmit = ({
  status = "ready",
  onStop,
  onClick,
  disabled,
  children,
  tooltip,
  shape = "circle",
  "aria-label": ariaLabel,
  ...props
}: PromptInputSubmitProps) => {
  const isGenerating = status === "submitted" || status === "streaming";
  const canStop = isGenerating && onStop !== undefined;
  const isWaiting = isGenerating && !canStop;

  // Button wraps itself in the tooltip only while it has one, so a tooltip
  // that came and went with the status would remount the <button> and drop
  // its focus. It always has one: the name, or why Send is disabled, with an
  // empty or false prop falling back like an unset one. The name always goes
  // on aria-label too, so the button is named in every shape, not only the
  // icon-only ones Button names from a tooltip. With aria-labelledby, a
  // string tooltip is the label's text: it names Send, and gives way to the
  // reason while Send waits.
  const labelText =
    !ariaLabel && props["aria-labelledby"] && typeof tooltip === "string"
      ? tooltip
      : undefined;
  const name = ariaLabel || labelText || (canStop ? "Stop" : "Send");
  const fallback = isWaiting ? "Waiting for the reply" : name;
  const resolvedTooltip = labelText ? fallback : tooltip || fallback;

  let icon = <ArrowUpIcon />;
  if (canStop) icon = <SquareIcon />;
  else if (status === "error") icon = <XIcon />;

  return (
    <Button
      data-slot="prompt-input-submit"
      type={isGenerating ? "button" : "submit"}
      aria-label={name}
      shape={shape}
      size="xsmall"
      loading={status === "submitted"}
      tooltip={resolvedTooltip}
      onClick={(event) => {
        onClick?.(event);
        if (canStop && !event.defaultPrevented) onStop();
      }}
      {...props}
      disabled={disabled || isWaiting}
    >
      {children ?? icon}
    </Button>
  );
};
PromptInputSubmit.displayName = "PromptInputSubmit";
