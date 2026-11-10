import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { MessageProps } from "./message.types";

import styles from "./message.module.css";

/**
 * One turn of a chat. A user turn sits at the end of the column; any other
 * turn sits at the start. `ax` aligns what follows the content, such as an
 * actions row, with it.
 *
 * Alignment and the bubble show the author only visually, so the turn is a
 * named group that tells assistive tech who sent it.
 */
export const Message = ({
  from,
  role = "group",
  "aria-label": ariaLabel = `Message from ${from}`,
  ax = from === "user" ? "end" : "start",
  ml = from === "user" ? "auto" : undefined,
  gap = 2,
  fullwidth = true,
  maxw,
  className,
  ...props
}: MessageProps) => (
  <Stack
    data-slot="message"
    data-from={from}
    role={role}
    aria-label={ariaLabel}
    ax={ax}
    ml={ml}
    gap={gap}
    fullwidth={fullwidth}
    maxw={maxw}
    className={cx(
      styles["message"],
      maxw === undefined && styles["capped"],
      className,
    )}
    {...props}
  />
);
Message.displayName = "Message";
