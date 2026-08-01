"use client";

import { cx } from "@uiid/utils";
import { Group } from "react-resizable-panels";

import type { ResizableProps } from "./resizable.types";

import styles from "./resizable.module.css";

export const Resizable = ({
  direction,
  className,
  children,
  ...props
}: ResizableProps) => {
  return (
    <Group
      data-slot="resizable"
      data-direction={direction}
      orientation={direction}
      className={cx(styles["resizable"], className)}
      {...props}
    >
      {children}
    </Group>
  );
};
Resizable.displayName = "Resizable";
