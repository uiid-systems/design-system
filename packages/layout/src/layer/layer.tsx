import { Children, isValidElement, cloneElement } from "react";

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

  // If an offset is provided, we map over the children and add inline transforms.
  const layeredChildren = offset
    ? Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        // Tell TypeScript that the child element's props include a style property.
        const validChild = child as React.ReactElement<{
          style?: React.CSSProperties;
        }>;

        // Extract any existing style from the child.
        const childStyle: React.CSSProperties = validChild.props.style || {};

        // Calculate the offsets for this child.
        const translateX = offset.x ? offset.x * index : 0;
        const translateY = offset.y ? offset.y * index : 0;
        const offsetTransform = `translate(${translateX}px, ${translateY}px)`;

        // Merge with any existing transform.
        const newTransform = childStyle.transform
          ? `${childStyle.transform} ${offsetTransform}`
          : offsetTransform;

        // Create a new style object including the updated transform.
        const newStyle: React.CSSProperties = {
          ...childStyle,
          transform: newTransform,
        };

        // Clone the child element, overriding its style.
        return cloneElement(validChild, { style: newStyle });
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
