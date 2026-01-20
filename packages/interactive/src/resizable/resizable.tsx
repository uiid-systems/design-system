"use client";

import { PanelGroup } from "react-resizable-panels";
import { cx } from "@uiid/utils";

import type { ResizableProps } from "./resizable.types";
import styles from "./resizable.module.css";

export const Resizable = ({
  direction,
  className,
  children,
  ...props
}: ResizableProps) => {
  return (
    <PanelGroup
      data-slot="resizable"
      data-direction={direction}
      direction={direction}
      className={cx(styles["resizable"], className)}
      {...props}
    >
      {children}
    </PanelGroup>
  );
};
Resizable.displayName = "Resizable";
