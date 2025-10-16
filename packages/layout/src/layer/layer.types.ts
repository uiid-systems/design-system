import type { BoxProps } from "../box/box.types";

export type LayerProps = {
  offset?: {
    x?: number;
    y?: number;
  };
} & BoxProps;
