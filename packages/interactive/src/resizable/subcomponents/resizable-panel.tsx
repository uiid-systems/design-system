"use client";

import { cx } from "@uiid/utils";
import { Panel } from "react-resizable-panels";

import type { ResizablePanelProps } from "../resizable.types";

import styles from "../resizable.module.css";

export const ResizablePanel = ({
  className,
  children,
  ...props
}: ResizablePanelProps) => {
  return (
    <Panel
      data-slot="resizable-panel"
      className={cx(styles["resizable-panel"], className)}
      {...props}
    >
      {children}
    </Panel>
  );
};
ResizablePanel.displayName = "ResizablePanel";
