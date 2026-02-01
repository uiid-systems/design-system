"use client";

import { Separator } from "react-resizable-panels";
import { GripVertical } from "@uiid/icons";
import { cx } from "@uiid/utils";

import type { ResizableHandleProps } from "../resizable.types";
import styles from "../resizable.module.css";

export const ResizableHandle = ({
  withHandle,
  className,
  children,
  disabled,
  ...props
}: ResizableHandleProps) => {
  return (
    <Separator
      data-slot="resizable-handle"
      data-disabled={disabled ? "" : undefined}
      className={cx(styles["resizable-handle"], className)}
      {...props}
    >
      {children ?? (withHandle && (
        <div className={styles["resizable-handle-grip"]}>
          <GripVertical size={10} />
        </div>
      ))}
    </Separator>
  );
};
ResizableHandle.displayName = "ResizableHandle";
