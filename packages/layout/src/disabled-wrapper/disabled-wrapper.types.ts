import type { BoxProps } from "../box/box.types";
import type { ConditionalRenderProps } from "../conditional-render/conditional-render.types";

export type DisabledProps = BoxProps & {
  disabled: ConditionalRenderProps["condition"];
};
