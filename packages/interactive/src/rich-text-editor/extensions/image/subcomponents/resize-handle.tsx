import * as React from "react";
import { cx } from "@uiid/utils";

import styles from "../image.module.css";

interface ResizeProps extends React.ComponentProps<"div"> {
  isResizing?: boolean;
}

export const ResizeHandle = ({
  ref,
  className,
  isResizing = false,
  ...props
}: ResizeProps) => {
  return (
    <div
      ref={ref}
      data-slot="resize-handle"
      className={cx(styles["resize-handle"], className)}
      data-resizing={isResizing}
      {...props}
    ></div>
  );
};
ResizeHandle.displayName = "ResizeHandle";
