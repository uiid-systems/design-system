import { cx } from "@uiid/utils";

import { Text } from "../text/text";
import {
  SHIMMER_DEFAULT_DURATION,
  SHIMMER_DEFAULT_SPREAD,
} from "./shimmer.constants";
import type { ShimmerProps } from "./shimmer.types";

import styles from "./shimmer.module.css";

export const Shimmer = ({
  duration = SHIMMER_DEFAULT_DURATION,
  spread = SHIMMER_DEFAULT_SPREAD,
  className,
  style,
  children,
  ...props
}: ShimmerProps) => {
  return (
    <Text
      data-slot="shimmer"
      className={cx(styles["shimmer"], className)}
      style={
        {
          "--shimmer-duration": `${duration}ms`,
          "--shimmer-spread": `${children.length * spread}px`,
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </Text>
  );
};
Shimmer.displayName = "Shimmer";
