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
  const layerStyle = {
    ...style,
    ...(offset?.x !== undefined && { "--layer-offset-x": `${offset.x}px` }),
    ...(offset?.y !== undefined && { "--layer-offset-y": `${offset.y}px` }),
  } as React.CSSProperties;

  return (
    <Box
      data-slot="layer"
      className={cx(styles["layer"], className)}
      style={layerStyle}
      {...props}
    >
      {children}
    </Box>
  );
};
Layer.displayName = "Layer";
