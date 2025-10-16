import type { BoxProps } from "../box/box.types";

export type Slot =
  | React.ReactElement<React.HTMLAttributes<HTMLElement>>
  | string
  | number;

export type SlotsProps = {
  before?: Slot;
  beforeOnClick?: () => void;
  after?: Slot;
  afterOnClick?: () => void;
} & BoxProps;
