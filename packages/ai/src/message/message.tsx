import { Stack } from "@uiid/layout";
import { cx } from "@uiid/utils";

import type { MessageProps } from "./message.types";

import styles from "./message.module.css";

export const Message = ({
  from,
  ax = from === "user" ? "end" : "start",
  gap = 2,
  fullwidth = true,
  className,
  ...props
}: MessageProps) => (
  <Stack
    data-slot="message"
    data-from={from}
    ax={ax}
    gap={gap}
    fullwidth={fullwidth}
    className={cx(styles["message"], className)}
    {...props}
  />
);
Message.displayName = "Message";
