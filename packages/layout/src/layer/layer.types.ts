import type { BoxProps } from "../box/box.types";

export type LayerProps = {
  /** Offset applied to each successive layer, in px */
  offset?: {
    x?: number;
    y?: number;
  };
} & BoxProps;
