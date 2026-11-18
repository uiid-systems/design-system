"use client";

import { GripVerticalIcon } from "@uiid/icons/grip-vertical";
import { cx } from "@uiid/utils";
import { Separator } from "react-resizable-panels";

import type { ResizableHandleProps } from "../resizable.types";

import styles from "../resizable.module.css";

export const ResizableHandle = ({
  withHandle,
  className,
  children,
  ...props
}: ResizableHandleProps) => {
  return (
    <Separator
      data-slot="resizable-handle"
      className={cx(styles["resizable-handle"], className)}
      {...props}
    >
      {children ??
        (withHandle !== false && (
          <div className={styles["resizable-handle-grip"]}>
            <GripVerticalIcon size={10} />
          </div>
        ))}
    </Separator>
  );
};
ResizableHandle.displayName = "ResizableHandle";
