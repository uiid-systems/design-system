import type { BoxProps } from "../box/box";

export type Slot =
  | React.ReactElement<React.HTMLAttributes<HTMLElement>>
  | string
  | number;

export type SlotsProps = {
  before?: Slot;
  after?: Slot;
} & BoxProps;
