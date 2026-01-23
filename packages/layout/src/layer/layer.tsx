import { Children, isValidElement } from "react";

import { cx } from "@uiid/utils";

import { Box } from "../box/box";

import type { LayerProps } from "./layer.types";
import styles from "./layer.module.css";

export const Layer = ({
  offset,
  className,
  style,
  children,
  ...props
}: LayerProps) => {
  const childCount = Children.count(children);

  // Set extra padding on the parent so that shifted children remain visible.
  const parentStyle: React.CSSProperties = {
    ...style,
    ...(offset && {
      paddingInlineEnd: offset.x ? offset.x * (childCount - 1) : undefined,
      paddingBlockEnd: offset.y ? offset.y * (childCount - 1) : undefined,
    }),
  };

  // If an offset is provided, wrap each child in a positioned element with the transform.
  const layeredChildren = offset
    ? Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const translateX = offset.x ? offset.x * index : 0;
        const translateY = offset.y ? offset.y * index : 0;

        return (
          <div
            style={{ transform: `translate(${translateX}px, ${translateY}px)` }}
          >
            {child}
          </div>
        );
      })
    : children;

  return (
    <Box
      data-slot="layer"
      className={cx(styles["layer"], className)}
      style={parentStyle}
      {...props}
    >
      {layeredChildren}
    </Box>
  );
};
Layer.displayName = "Layer";
