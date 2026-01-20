"use client";

import { PanelResizeHandle } from "react-resizable-panels";
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
    <PanelResizeHandle
      data-slot="resizable-handle"
      data-disabled={disabled ? "" : undefined}
      disabled={disabled}
      className={cx(styles["resizable-handle"], className)}
      {...props}
    >
      {children ?? (withHandle && (
        <div className={styles["resizable-handle-grip"]}>
          <GripVertical size={10} />
        </div>
      ))}
    </PanelResizeHandle>
  );
};
ResizableHandle.displayName = "ResizableHandle";
